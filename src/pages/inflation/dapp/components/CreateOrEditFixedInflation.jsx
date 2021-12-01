import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from "react-router-dom";
import CreateOrEditFixedInflationEntry from './CreateOrEditFixedInflationEntry';
import Loading from '../../../../components/shared/Loading';
import ContractEditor from '../../../../components/editor/ContractEditor';
import FixedInflationExtensionTemplateLocation from '../../../../data/FixedInflationExtensionTemplate.sol';
import { Coin } from "../../../../components/shared";

function sleepSomeTime(millis) {
    return new Promise(function(ok) {
        setTimeout(ok, millis)
    })
}

const CreateOrEditFixedInflation = (props) => {

    var fixedInflationFactory = window.newContract(props.dfoCore.getContextElement("NewFactoryABI"), props.dfoCore.getContextElement("fixedInflationFactoryAddress"));

    var paths = useLocation().pathname.split('/');
    var fixedInflationContractAddress = props.fixedInflationContractAddress || paths[paths.length - 1];
    fixedInflationContractAddress = window.isEthereumAddress(fixedInflationContractAddress) ? fixedInflationContractAddress : undefined;

    const [step, setStep] = useState(NaN);
    const [entry, setEntry] = useState(null);
    const [deploying, setDeploying] = useState(false);
    const [extensionType, setExtensionType] = useState("address");
    const [walletAddress, setWalletAddress] = useState("");
    const [payload, setPayload] = useState("");
    const [extensionAddress, setExtensionAddress] = useState("");
    const [deployMessage, setDeployMessage] = useState("");
    const [fixedInflationAddress, setFixedInflationAddress] = useState("");
    const [recap, setRecap] = useState("");
    const [notFirstTime, setNotFirstTime] = useState(false);
    const [fixedInflationExtensionTemplateCode, setFixedInflationExtensionTemplateCode] = useState("");
    const [customExtensionData, setCustomExtensionData] = useState(null);

    useEffect(async function componentDidMount() {
        setFixedInflationExtensionTemplateCode(await (await fetch(FixedInflationExtensionTemplateLocation)).text());
        if (!entry && !fixedInflationContractAddress) {
            return setEntry({
                name: '',
                operations: []
            });
        }
        var fixedInflationContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('NewFixedInflationABI'), fixedInflationContractAddress);
        setExtensionAddress(await fixedInflationContract.methods.extension().call());
        var entry = await fixedInflationContract.methods.entry().call();
        var clonedEntry = {};
        Object.entries(entry[0]).forEach(it => clonedEntry[it[0]] = it[1]);
        (clonedEntry.callerRewardPercentage = window.numberToString(parseFloat(window.fromDecimals(clonedEntry.callerRewardPercentage, 18, true)) * 100));
        clonedEntry.operations = [];
        for (var operation of entry[1]) {
            var op = {};
            Object.entries(operation).forEach(it => op[it[0]] = it[1]);
            var inputTokenDecimals = '18';
            var inputTokenSymbol = 'ETH';
            try {
                var inputTokenContract = window.newContract(window.context.votingTokenAbi, op.inputTokenAddress);
                inputTokenDecimals = await window.blockchainCall(inputTokenContract.methods.decimals);
                inputTokenSymbol = await window.blockchainCall(inputTokenContract.methods.symbol);
            } catch (e) {
            }
            op.inputToken = { address: op.inputTokenAddress, symbol: inputTokenSymbol, decimals: inputTokenDecimals };
            op.actionType = op.ammPlugin === window.voidEthereumAddress ? 'transfer' : 'swap';
            op.inputTokenMethod = op.inputTokenAmountIsByMint ? 'mint' : 'reserve';
            op.transferType = op.inputTokenAmountIsPercentage ? 'percentage' : 'amount';
            !op.inputTokenAmountIsPercentage && (op.amount = window.fromDecimals(op.inputTokenAmount, inputTokenDecimals, true));
            op.inputTokenAmountIsPercentage && (op.percentage = window.numberToString(parseFloat(window.fromDecimals(op.inputTokenAmount, 18, true)) * 100));
            if (op.ammPlugin && op.ammPlugin !== window.voidEthereumAddress) {
                const ammAggregator = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
                const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), op.ammPlugin);
                const ammData = await ammContract.methods.data().call();
                const ethAddress = ammData[0];
                op.amm = { ammAggregator, ammContract, ammData, ethAddress };
                op.pathTokens = [];
                for (var i in op.liquidityPoolAddresses) {
                    var address = op.liquidityPoolAddresses[i];
                    op.amm.info = op.amm.info || await ammAggregator.methods.info(address).call();
                    const lpInfo = await ammContract.methods.byLiquidityPool(address).call();
                    const lpTokensAddresses = lpInfo[2];
                    const symbols = [];
                    let outputTokenAddress = op.swapPath[i];
                    for (let i = 0; i < lpTokensAddresses.length; i++) {
                        const currentTokenAddress = lpTokensAddresses[i];
                        if (currentTokenAddress !== window.voidEthereumAddress) {
                            const currentToken = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), currentTokenAddress);
                            const currentTokenSymbol = await currentToken.methods.symbol().call();
                            symbols.push(currentTokenSymbol);
                        }
                        ethAddress === currentTokenAddress && (symbols[symbols.length - 1] = `ETH (${symbols[symbols.length - 1]})`);
                    }
                    const pathTokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
                    const symbol = await pathTokenContract.methods.symbol().call();
                    const decimals = await pathTokenContract.methods.decimals().call();
                    op.pathTokens.push({ symbol, address, decimals, output: null, outputTokenAddress, lpTokensAddresses, symbols });
                }
            }
            op.oldReceivers = op.receivers;
            op.receivers = [];
            var lastPercentage = 100;
            for (i in op.oldReceivers) {
                var address = op.oldReceivers[i = parseInt(i)];
                var percentage = 0;
                i !== op.oldReceivers.length - 1 && (percentage = window.numberToString(parseFloat(window.fromDecimals(op.receiversPercentages[i], 18, true)) * 100));
                lastPercentage -= percentage;
                op.receivers.push({
                    address,
                    percentage: i !== op.oldReceivers.length - 1 ? percentage : lastPercentage
                });
            }
            clonedEntry.operations.push(op);
        }
        setEntry(clonedEntry);
    }, []);

    function onExtensionType(e) {
        setWalletAddress("");
        setCustomExtensionData(null);
        setExtensionType(e.currentTarget.value);
    }

    function creationComplete(newEntry) {
        setEntry(newEntry);
        setStep(0);
    }

    var deployMethodologies = {
        async address() {
            setDeployMessage("1/3 - Deploying Extension...");
            var sendingOptions = { from: props.dfoCore.address };
            var method = fixedInflationFactory.methods.cloneDefaultExtension();
            var gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gasLimit = gasLimit;
            sendingOptions.gas = gasLimit;
            var transaction = await method.send(sendingOptions);
            var fixedInflationExtensionAddress;
            var errors = 5;
            while(!fixedInflationExtensionAddress && errors > 0) {
                try {
                    await sleepSomeTime(5000)
                    fixedInflationExtensionAddress = await method.call(sendingOptions, transaction.blockNumber - 1);
                } catch(e) {
                    console.log(e)
                    errors--;
                }
            }
            console.log({fixedInflationExtensionAddress});
            setExtensionType("deployedContract");
            setExtensionAddress(fixedInflationExtensionAddress);

            var payload = window.web3.utils.sha3("init(address)").substring(0, 10);
            payload += window.web3.eth.abi.encodeParameter("address", walletAddress).substring(2);
            setPayload(payload);

            if(!fixedInflationExtensionAddress) {
                return setTimeout(() => alert('Error by the connected node while retrieving transaction info, please check your latest transaction on Etherscan and retrieve the deployed contract address located in the "Internal Txns" section (the one at the right side of the green arrow in the table)'));
            }

            await deployMethodologies.deployedContract(fixedInflationExtensionAddress, payload);
        },
        async fromSourceCode() {
            setDeployMessage("1/3 - Deploying Custom Extension...");
            var sendingOptions = { from: props.dfoCore.address };
            var method = new props.dfoCore.web3.eth.Contract(customExtensionData.abi).deploy({ data: customExtensionData.bytecode });
            sendingOptions.gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gas = sendingOptions.gasLimit;
            var customFixedInflationExtension = await method.send(sendingOptions);
            setExtensionAddress(customFixedInflationExtension.options.address);
            await deployMethodologies.deployedContract(customFixedInflationExtension.options.address);
        },
        async deployedContract(preDeployedContract, builtPayload) {
            setDeployMessage(`${preDeployedContract ? "2/3" : "1/2"} - Deploying Fixed Inflation Contract...`);
            var elaboratedEntry = elaborateEntry(entry);

            var data = "0x" + (window.newContract(props.dfoCore.getContextElement("FixedInflationABI")).methods.init(
                preDeployedContract || extensionAddress,
                builtPayload || payload || "0x",
                elaboratedEntry,
                elaboratedEntry.operations
            ).encodeABI()).substring(11);

            var sendingOptions = { from: props.dfoCore.address };
            var method = fixedInflationFactory.methods.deploy(data);
            var gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gasLimit = gasLimit;
            sendingOptions.gas = sendingOptions.gasLimit;
            var transaction = await method.send(sendingOptions);
            var receipt = await window.web3.eth.getTransactionReceipt(transaction.transactionHash);
            var fixedInflationAddress = window.web3.eth.abi.decodeParameter("address", receipt.logs.filter(it => it.topics[0] === window.web3.utils.sha3('Deployed(address,address,address,bytes)'))[0].topics[2]);
            console.log({fixedInflationAddress})

            setDeployMessage(`${preDeployedContract ? "3/3" : "2/2"} - Enabling Extension...`);

            var extension = await props.dfoCore.getContract(props.dfoCore.getContextElement("FixedInflationExtensionABI"), preDeployedContract || extensionAddress);

            sendingOptions = { from: props.dfoCore.address };
            method = extension.methods.setActive(true);
            gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gasLimit = gasLimit;
            sendingOptions.gas = gasLimit;
            transaction = await method.send(sendingOptions);

            elaborateRecap(elaboratedEntry.blockInterval, elaboratedEntry.operations);
            setFixedInflationAddress(fixedInflationAddress);
        }
    }

    async function elaborateRecap(blockInterval, operations) {
        var blockIntervalLabel;
        try {
            blockIntervalLabel = Object.entries(props.dfoCore.getContextElement("blockIntervals")).filter(it => window.formatNumber(it[1]) === window.formatNumber(blockInterval))[0][0];
        } catch (e) { }
        var finalRecap = {
            blockInterval: blockIntervalLabel || `${blockInterval} block${window.formatNumber(blockInterval) > 1 ? 's' : ''}`,
            transfers: 0,
            swaps: 0
        };
        for (var operation of operations) {
            var address = props.dfoCore.web3.utils.toChecksumAddress(operation.inputTokenAddress);
            var tokenData = finalRecap[address] = finalRecap[address] || {
                address,
                contract: await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), address)
            };
            finalRecap.transfers += operation.ammPlugin === window.voidEthereumAddress ? 1 : 0;
            finalRecap.swaps += operation.ammPlugin !== window.voidEthereumAddress ? 1 : 0;
            tokenData.name = tokenData.name || (address === window.voidEthereumAddress ? 'Ethereum' : await tokenData.contract.methods.name().call());
            tokenData.symbol = tokenData.symbol || (address === window.voidEthereumAddress ? 'ETH' : await tokenData.contract.methods.symbol().call());
            tokenData.decimals = tokenData.decimals || (address === window.voidEthereumAddress ? '18' : await tokenData.contract.methods.decimals().call());
            var key = operation.inputTokenAmountIsByMint ? 'mint' : 'transfer';
            key += operation.inputTokenAmountIsPercentage ? 'Percentage' : 'Amount';
            var value = tokenData[key] || '0';
            value = window.web3.utils.toBN(value).add(window.web3.utils.toBN(operation.inputTokenAmount)).toString();
            tokenData[key] = value;
        }
        for (var key of Object.keys(finalRecap)) {
            var value = finalRecap[key];
            if (!value.contract) {
                continue;
            }
            value.mintPercentage && (value.mintPercentage = window.formatNumber(window.fromDecimals(value.mintPercentage, 18, true)) * 100);
            value.transferPercentage && (value.transferPercentage = window.formatNumber(window.fromDecimals(value.transferPercentage, 18, true)) * 100);
            value.mintAmount && (value.mintAmount = window.fromDecimals(value.mintAmount, value.decimals, true));
            value.transferAmount && (value.transferAmount = window.fromDecimals(value.transferAmount, value.decimals, true));
        }
        setRecap(finalRecap);
    }



    function elaborateEntry(entry) {
        var elaboratedEntry = {
            id: window.web3.utils.sha3('0'),
            name: entry.name,
            lastBlock: entry.lastBlock,
            blockInterval: entry.blockInterval,
            callerRewardPercentage: window.toDecimals(window.numberToString((entry.callerRewardPercentage || 0) / 100), 18),
            operations: entry.operations.map(operation => {
                var receivers = operation.receivers.map(it => it.address);
                var receiversPercentages = operation.receivers.map(it => window.toDecimals(window.numberToString(it.percentage / 100), 18));
                receiversPercentages.pop();
                return {
                    inputTokenAddress: operation.enterInETH && operation.amm ? operation.amm.ethAddress : operation.inputToken.address,
                    inputTokenAmount: window.toDecimals(window.numberToString(operation.transferType === 'percentage' ? (parseFloat(operation.percentage) / 100) : operation.amount), operation.transferType === 'percentage' ? "18" : operation.inputToken.decimals),
                    inputTokenAmountIsPercentage: operation.transferType === 'percentage',
                    inputTokenAmountIsByMint: operation.inputTokenMethod === 'mint',
                    ammPlugin: operation.amm ? operation.amm.ammContract.options.address : window.voidEthereumAddress,
                    liquidityPoolAddresses: operation.pathTokens ? operation.pathTokens.map(it => it.address) : [],
                    swapPath: operation.pathTokens ? operation.pathTokens.map(it => it.outputTokenAddress) : [],
                    receivers: receivers,
                    receiversPercentages: receiversPercentages,
                    enterInETH: (operation.enterInETH && operation.amm !== undefined && operation.amm !== null) || false,
                    exitInETH: operation.exitInETH || false
                }
            })
        };
        console.log(JSON.stringify(elaboratedEntry));
        return elaboratedEntry;
    }

    var steps = [
        [
            function () {
                return <>
                    <h6><b>Receiver</b></h6>
                    <h6>Host</h6>
                    <p className="BreefRecapB">The host is the Contract, Wallet, DAO, or DFO with permissions to manage and add new operations in this contract. The host permissions are set into the extension contract. If you choose "Standard Extension (Address, wallet)," the extension must have all of the tokens needed to fill every operation. You can also program extension permissions by your Organization, DFO to mint or transfer directly from the treasury, using the DFOhub website or a custom contract (more info in the <a target="_blank" href="https://docs.ethos.wiki/covenants/">Documentation</a>.</p>
                    <select className="SelectRegular" value={extensionType} onChange={onExtensionType}>
                        <option value="address">Standard Extension (Address, wallet, Contract or Organization</option>
                        <option value="deployedContract">Custom Extension (Deployed Contract)</option>
                        {<option value="fromSourceCode">Custom Extension (Deploy Contract)</option>}
                    </select>
                    {(extensionType === 'address' || extensionType === 'deployedContract') &&
                        <div className="InputForm">
                            {extensionType === 'address' && <input className="imputCool" type="text" placeholder="Host address" defaultValue={walletAddress} onKeyUp={e => setWalletAddress(window.isEthereumAddress(e.currentTarget.value) ? e.currentTarget.value : "")} />}
                            {extensionType === 'deployedContract' && <input className="imputCool" type="text" placeholder="Insert extension address" defaultValue={extensionAddress} onKeyUp={e => setExtensionAddress(window.isEthereumAddress(e.currentTarget.value) ? e.currentTarget.value : "")} />}
                        </div>
                    }
                    {extensionType === 'fromSourceCode' && <ContractEditor filterDeployedContract={filterDeployedContract} dfoCore={props.dfoCore} onContract={setCustomExtensionData} templateCode={fixedInflationExtensionTemplateCode} />}
                    {extensionType !== 'address' && <div className="InputForm">
                        <input className="imputCool" placeholder="Optional init payload" type="text" defaultValue={payload} onKeyUp={e => setPayload(e.currentTarget.value)} />
                    </div>}
                </>
            },
            function () {
                return !(extensionType === 'address' ? walletAddress && walletAddress !== window.voidEthereumAddress : extensionType === 'deployedContract' ? extensionAddress : customExtensionData)
            }]
    ];

    function filterDeployedContract(contractData) {
        var abi = contractData.abi;
        if (abi.filter(abiEntry => abiEntry.type === 'constructor').length > 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability === 'view' && abiEntry.name === 'active' && abiEntry.outputs && abiEntry.outputs.length === 1 && abiEntry.outputs[0].type === 'bool').length === 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability !== 'view' && abiEntry.stateMutability !== 'pure' && abiEntry.name === 'deactivationByFailure' && (!abiEntry.outputs || abiEntry.outputs.length === 0) && (!abiEntry.inputs || abiEntry.inputs.length === 0)).length === 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability !== 'view' && abiEntry.stateMutability !== 'pure' && abiEntry.name === 'receiveTokens' && (!abiEntry.outputs || abiEntry.outputs.length === 0) && abiEntry.inputs && abiEntry.inputs.length === 3 && abiEntry.inputs[0].type === 'address[]' && abiEntry.inputs[1].type === 'uint256[]' && abiEntry.inputs[2].type === 'uint256[]').length === 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability !== 'view' && abiEntry.stateMutability !== 'pure' && abiEntry.name === 'setActive' && (!abiEntry.outputs || abiEntry.outputs.length === 0) && abiEntry.inputs && abiEntry.inputs.length === 1 && abiEntry.inputs[0].type === 'bool').length === 0) {
            return false;
        }
        return true;
    }

    async function deploy() {
        setDeploying(true);
        setDeployMessage("");
        var error;
        try {
            await deployMethodologies[extensionType]();
        } catch (e) {
            error = e;
        }
        setDeploying(false);
        setDeployMessage("");
        error && alert(`Error: ${error.message}`);
    }

    function back() {
        var newStep = step === 0 ? NaN : step - 1;
        setNotFirstTime(isNaN(newStep));
        setStep(newStep);
    }

    function copy(entry) {
        var copy = {
        };
        for (var key of Object.keys(entry)) {
            copy[key] = entry[key];
        }
        copy.operations = [];
        for (var operation of entry.operations) {
            var operationCopy = {};
            Object.entries(operation).forEach(it => operationCopy[it[0]] = it[1]);
            copy.operations.push(operationCopy);
        }
        return copy;
    }

    function saveEntry(entryName, lastBlock, blockInterval, callerRewardPercentage, operations) {
        setEntry({
            name: entryName,
            lastBlock,
            blockInterval,
            callerRewardPercentage,
            operations
        });
        setStep(0);
    }

    async function editEntry() {
        setDeploying(true);
        setDeployMessage("");
        var error;
        try {
            var elaboratedEntry = elaborateEntry(entry);
            var fixedInflationExtension = await props.dfoCore.getContract(props.dfoCore.getContextElement("FixedInflationExtensionABI"), extensionAddress);
            var sendingOptions = { from: props.dfoCore.address };
            var method = fixedInflationExtension.methods.setEntry(elaboratedEntry, elaboratedEntry.operations);
            var gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gasLimit = gasLimit;
            sendingOptions.gas = gasLimit;
            await method.send(sendingOptions);
            setFixedInflationAddress(fixedInflationContractAddress);
        } catch (e) {
            error = e;
        }
        setDeploying(false);
        setDeployMessage("");
        error && alert(`Error: ${error.message}`);
    };

    function renderEditEntry() {
        return <>
            <div className="row">
                <div className="col-12">
                    <h6>Edit Fixed Inflation Entry</h6>
                </div>
            </div>
            <div className="Web2ActionsBTNs">
                <a disabled={deploying} onClick={back} className="backActionBTN">Back</a>
                {deploying ? <Loading /> : <a onClick={editEntry} className="web2ActionBTN">Deploy</a>}
                {deployMessage && <span>{deployMessage}</span>}
            </div>
        </>
    }

    function render() {
        return <>
            <h6>Deploy</h6>
            {steps[step][0]()}

            <div className="Web2ActionsBTNs">
                <a disabled={deploying} onClick={back} className="backActionBTN">Back</a>
                {step !== steps.length - 1 && <a disabled={steps[step][1]()} onClick={() => setStep(step + 1)} className="web2ActionBTN">Next</a>}
                {step === steps.length - 1 && (deploying ? <Loading /> : <a disabled={steps[step][1]()} onClick={deploy} className="Web3ActionBTN">Deploy</a>)}
                {deployMessage && <span>{deployMessage}</span>}
            </div>
        </>
    }

    function success() {
        return <>
            <div className="youDIDit">
            <h3 className="SuccessText">Fixed Inflation Contract Deployed!</h3>
            <p className="SuccessTextNow">And Now?</p>
            {/*If choosen by wallet*/}
                {extensionType == 'address' ? <>
                <p><b>Before attempting to execute the FI remember to send the amount of token needed to the FI extension address: {extensionAddress}</b></p>
                <p className="SuccessTextLink"><a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}/address/${extensionAddress}`}>Etherscan</a></p>
                <p className="Disclamerfinish">The first time the FI will fail the execution due to insufficient funds in the extension address, this contract will be automatically deactivated until editing from the host and reactivation manually.<br></br>For more info about hosting a Fixed Inflation contract: <a className="SuccessTextLink" target="_blank" href="https://docs.ethos.wiki/covenants/protocols/inflation">Documentation</a></p>
                </> : <>
                {/*If not choosen by wallet (custom extension contract)*/}
                <p>Before attempting to execute the FI <b>you first need to do do all of the actions needed to send the amount of token needed to the FI extension address: {extensionAddress}</b></p>
                <p className="SuccessTextLink"><a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}/address/${extensionAddress}`}>Etherscan</a></p>
                <p>If you rule the extension via a DFO or a DAO, be sure to vote to grant permissions from its Treasury.</p>
                <p className="Disclamerfinish">The first time the FI will fail the execution due to insufficient funds in the extension address, this contract will be automatically deactivated until editing from the host and reactivation manually.<br></br>For more info about hosting a Fixed Inflation contract: <a className="SuccessTextLink" target="_blank" href="https://docs.ethos.wiki/covenants/protocols/inflation">Documentation</a></p>
                </>}
            <p>Fixed Inflation Contract Address: {fixedInflationAddress} <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}/address/${fixedInflationAddress}`}>(Etherscan)</a></p>
            <p className="SuccessTextLink"><a target="_blank" href={"https://covenants.eth.link/#/inflation/dapp/" + fixedInflationAddress}>Fixed Inflation Link</a></p>

            </div>
        </>
    }

    return (
        !entry ? <Loading /> :
            fixedInflationAddress ? success() :
                isNaN(step) ? <CreateOrEditFixedInflationEntry entry={copy(entry)} continue={creationComplete} saveEntry={saveEntry} notFirstTime={notFirstTime} /> :
                    fixedInflationContractAddress ? renderEditEntry() :
                        render()
    );
}

const mapStateToProps = (state) => {
    return { dfoCore: state.core.dfoCore };
}

export default connect(mapStateToProps)(CreateOrEditFixedInflation);