import Web3 from "web3";
import Web3Modal from "web3modal";
import ethers from "ethers";

const abi = new ethers.utils.AbiCoder();

export default class DFOCore {
    address = '0x0000000000000000000000000000000000000000';
    chainId;
    context;
    contracts = {};
    deployedLiquidityMiningContracts = [];
    eventEmitters = {};
    initialized = false;
    positions = [];
    provider;
    voidEthereumAddress = '0x0000000000000000000000000000000000000000';
    web3;

    /**
     * constructs the DFOCore object by passing the context json object.
     * @param {*} context app context.
     */
    constructor(context) { 
        this.context = context;
    }

    /**
     * initializes the DFOCore object.
     * the logic is not inside the constructor function since we need
     * to leverage async/await syntax.
     * @param {*} web3 
     * @param {*} providerOptions 
     */
    init = async (web3, providerOptions = {}) => {
        // return if already initialized
        if (this.initialized) return;
        // retrieve the web3 passed in the function
        this.web3 = web3;
        if (!this.web3) {
            // no web3 instance is passed, we create it by opening the modal
            const web3Modal = new Web3Modal({
                providerOptions,
            });
            // retrieve the provider
            const provider = await web3Modal.connect();
            // initialize the web3 instance
            this.web3 = new Web3(provider);
            // set the address
            const accounts = await this.web3.eth.getAccounts();
            this.address = accounts[0];
            // check for accounts changes
            provider.on('accountsChanged', (accounts) => {
                this.address = accounts[0] || this.voidEthereumAddress;
                console.log(`changed address to ${this.address}`);
            });
            // check for chain id changes
            provider.on('chainChanged', (chainId) => {
                this.chainId = this.context.ethereumNetwork[chainId] ? chainId : 0;
                console.log(`changed chainId to ${this.chainId}`);
            })
            // check for connection
            provider.on('connect', ({ chainId }) => {
                this.chainId = chainId;
            });
            // check for disconnect
            provider.on('disconnect', ({ code, message }) => {
                console.log({ code, message });
                this.address = this.voidEthereumAddress;
                this.chainId = 0;
            });
            this.provider = provider;
        }
        // set the core as initialized
        this.initialized = true;
    }

    /**
     * returns the contract with the given abi and address if it's already stored
     * in the state, otherwise it creates it and stores it inside a variable.
     * @param {*} abi contract ABI.
     * @param {*} address contract address.
     */
    getContract = async (abi, address) => {
        address = address || this.voidEthereumAddress;
        // create the key
        const key = address.toLowerCase();
        this.contracts[key] = this.contracts[key] || new this.web3.eth.Contract(abi, address);
        return this.contracts[key];
    }

    /**
     * returns the element with the given elementName from the context.
     * @param {*} elementName name of the element to retrieve from the context.
     */
    getContextElement = (elementName) => {
        return this.context[elementName];
    }

    /**
     * returns the element with the given elementName from the context for the current chain network.
     * @param {*} elementName name of the element to retrieve from the context.
     */
    getNetworkContextElement = (elementName) => {
        const network = this.context.ethereumNetwork[this.chainId];
        return this.context[`${elementName}${network}`];
    }

    /**
     * returns the sending options for the given method and value.
     * if no params are used, the {from: address, gas: '99999999'} object is returned.
     * @param {*} method contract method that will be called.
     * @param {*} value eventual amount of ETH that will be sent.
     */
    getSendingOptions = async (method, value) => {
        try {
            // if a method is provided we use it to estimate the gas
            if (method) {
                // retrieve the nonce
                const nonce = await this.web3.eth.getTransactionCount(this.address);
                // estimate the gase for the method
                const gas = await method.estimateGas({
                    nonce,
                    from: this.address,
                    gasPrice: this.web3.utils.toWei('13', 'gwei'),
                    value: value || 0,
                    gas: '7900000',
                    gasLimit: '7900000',  
                });
                // return the sending options
                return { nonce, from: this.address, gas: gas || '7900000', value: value || 0, }
            }
        } catch (error) {
            // catch any error and log it
            console.error(error);
        } finally {
            // return this after any error or if no method is provided
            return { from: this.address, gas: '99999999', };
        }
    }

    /**
     * returns the current block number.
     */
    getBlockNumber = async () => {
        return await this.web3.eth.getBlockNumber();
    }

    /**
     * retrieves all the deployed liquidity mining contracts from the given factory address.
     */
    loadDeployedLiquidityMiningContracts = async (factoryAddress) => {
        if (this.deployedLiquidityMiningContracts.length > 0) return;
        try {
            if (!factoryAddress) factoryAddress = this.getContextElement("liquidityMiningFactoryAddress");
            const factoryContract = await this.getContract(this.getContextElement("liquidityMiningFactoryABI"), factoryAddress);
            const events = await factoryContract.getPastEvents('LiquidityMiningDeployed');
            await Promise.all(events.map(async (event) => {
                this.deployedLiquidityMiningContracts.push({ address: event.returnValues.liquidityMiningAddress, sender: event.returnValues.sender });
            }));
        } catch (error) {
            console.error(error);
            this.deployedLiquidityMiningContracts = [];
        }
    }

    getHostedLiquidityMiningContracts = () => {
        return this.deployedLiquidityMiningContracts.filter((item) => item.sender.toLowerCase() === this.address.toLowerCase());
    }

    loadPositions = async (force = false) => {
        if (this.positions > 0 && !force) return;
        try {
            await Promise.all(this.deployedLiquidityMiningContracts.map(async (c) => {
                const contract = new this.web3.eth.Contract(this.getContextElement("liquidityMiningABI"), c.address);
                const events = await contract.getPastEvents('Transfer', { filter: { to: this.address }});
            }));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * pushes the contract address inside the core array.
     * @param {*} contractAddress new liquidity mining contract address.
     */
    addDeployedLiquidityMiningContract = async (contractAddress) => {
        if (!this.deployedLiquidityMiningContracts.includes(contractAddress)) {
            this.deployedLiquidityMiningContracts.push(contractAddress);
        }
    }

    /**
     * starts listening for the provided event emitted by the contract with the given abi and address using
     * the input filter and fromBlock.
     * @param {*} abi contract abi.
     * @param {*} address contract address.
     * @param {*} eventName event name to start listening for.
     * @param {*} filter event filter.
     * @param {*} fromBlock event from block.
     */
    getEventEmitter = async (abi, address, eventName, filter, fromBlock) => {
        const contract = await this.getContract(abi, address);
        if (!this.eventEmitters[address]) {
            this.eventEmitters[address] = {};
        }
        this.eventEmitters[address] = {
            ...this.eventEmitters[address],
            eventName: contract.events[eventName]({ filter: filter || {}, fromBlock: fromBlock || await this.getBlockNumber() }),
        };
    }

    toDecimals = (amount, decimals = 18) => {
        return decimals === 18 ? this.web3.utils.fromWei(amount, 'ether') : 0;
    }

    deployLiquidityMiningContract = async (data) => {
        const factoryAddress = data.factoryAddress || this.getContextElement("liquidityMiningFactoryAddress");
        const liquidityMiningFactory = await this.getContract(this.getContextElement("liquidityMiningFactoryABI"), factoryAddress);
        const cloneExtensionTransaction = await liquidityMiningFactory.methods.cloneLiquidityMiningDefaultExtension().send({ from: this.account });
        const cloneExtensionReceipt = await this.web3.eth.getTransactionReceipt(cloneExtensionTransaction.transactionHash);
        const clonedDefaultLiquidityMiningExtensionAddress = this.web3.eth.abi.decodeParameter("address", cloneExtensionReceipt.logs.filter(it => it.topics[0] === this.web3.utils.sha3('ExtensionCloned(address)'))[0].topics[1])
        const { setups, rewardTokenAddress, byMint } = data;
        const types = ["address", "bytes", "address", "address", "bytes", "bool", "uint256"];
        const encodedSetups = abi.encode(["tuple(address,uint256,address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bool,uint256,uint256,bool)[]"], [setups]);
        const liquidityMiningExtension = new this.web3.eth.Contract(this.getContextElement("liquidityMiningExtensionABI"), clonedDefaultLiquidityMiningExtensionAddress);
        const extensionInitData = liquidityMiningExtension.methods.init(byMint, this.account).encodeABI()
        const params = [clonedDefaultLiquidityMiningExtensionAddress, extensionInitData, this.getContextElement("ethItemOrchestratorAddress"), rewardTokenAddress, encodedSetups, true, 0];
        const payload = this.web3.utils.sha3(`init(${types.join(',')})`).substring(0, 10) + (this.web3.eth.abi.encodeParameters(types, params).substring(2));
        const deployTransaction = await liquidityMiningFactory.methods.deploy(payload).send({ from: this.account });
        const liquidityMiningContractAddress = this.web3.eth.abi.decodeParameter("address", deployTransaction.logs.filter(it => it.topics[0] === this.web3.utils.sha3("LiquidityMiningDeployed(address,address,bytes)"))[0].topics[1]);
        console.log(liquidityMiningContractAddress);
    }

    /**
     * returns the dfo with the given dfoAddress (proxy or doubleProxy depending on the version we're in).
     * @param {*} dfoAddress proxy or double proxy address of the dfo to retrieve.
     * @param {*} dfoAddresses other dfo addresses.
     */
    async loadDFO(dfoAddress, dfoAddresses) {
        dfoAddresses = dfoAddresses ? dfoAddresses.concat(dfoAddress) : [dfoAddress];
        // TODO retrieve DFO
    }

    

}