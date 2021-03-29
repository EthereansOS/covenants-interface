import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Coin, Input, TokenInput } from '../../../../components/shared';
import { setFarmingContractStep, updateFarmingContract, addFarmingSetup, removeFarmingSetup } from '../../../../store/actions';
import { ethers } from "ethers";
import ContractEditor from '../../../../components/editor/ContractEditor';
import CreateOrEditFarmingSetups from './CreateOrEditFarmingSetups';
import FarmingExtensionTemplateLocation from '../../../../data/FarmingExtensionTemplate.sol';
import { useParams } from 'react-router';

const abi = new ethers.utils.AbiCoder();

const Create = (props) => {
    const { address } = useParams();
    const { inputRewardToken } = props;
    // utils
    const [loading, setLoading] = useState(false);
    const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
    // booleans
    const [isDeploy, setIsDeploy] = useState(false);
    // reward token
    const [selectedRewardToken, setSelectedRewardToken] = useState(inputRewardToken || null);
    const [byMint, setByMint] = useState(false);
    // setups
    const [farmingSetups, setFarmingSetups] = useState([]);
    // deploy data
    const [treasuryAddress, setTreasuryAddress] = useState(null);
    const [hostWalletAddress, setHostWalletAddress] = useState(null);
    const [hostDeployedContract, setHostDeployedContract] = useState(null);
    const [deployContract, setDeployContract] = useState(null);
    const [useDeployedContract, setUseDeployedContract] = useState(false);
    const [extensionPayload, setExtensionPayload] = useState("");
    const [selectedHost, setSelectedHost] = useState("");
    const [deployLoading, setDeployLoading] = useState(false);
    const [deployStep, setDeployStep] = useState(0);
    const [deployData, setDeployData] = useState(null);
    const [farmingExtensionTemplateCode, setFarmingExtensionTemplateCode] = useState("");

    const [hasTreasuryAddress, setHasTreasuryAddress] = useState(false);
    const [farmingContract, setFarmingContract] = useState("");
    const [totalRewardToSend, setTotalRewardToSend] = useState(0);

    useEffect(async () => {
        setFarmingExtensionTemplateCode(await (await fetch(FarmingExtensionTemplateLocation)).text());
        if (props.farmingContract?.rewardToken) {
            setSelectedRewardToken(props.farmingContract.rewardToken);
        } else if (address) {
            onSelectRewardToken(address);
        }
        if (currentBlockNumber === 0) {
            props.dfoCore.getBlockNumber().then((blockNumber) => {
                setCurrentBlockNumber(blockNumber);
            });
        }
    }, []);

    const addFarmingSetup = (setup) => {
        setFarmingSetups(farmingSetups.concat(setup));
    }

    const editFarmingSetup = (setup, index) => {
        const updatedSetups = farmingSetups.map((s, i) => {
            return i !== index ? s : setup;
        })
        setFarmingSetups(updatedSetups);
    }

    const removeFarmingSetup = (i) => {
        const updatedSetups = farmingSetups.filter((_, index) => index !== i);
        setFarmingSetups(updatedSetups);
    }

    const onSelectRewardToken = async (address) => {
        setLoading(true);
        try {
            const rewardToken = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
            const symbol = await rewardToken.methods.symbol().call();
            const decimals = await rewardToken.methods.decimals().call();
            setSelectedRewardToken({ symbol, address, decimals });
        } catch (error) {
            console.error(error);
            setSelectedRewardToken(null);
        } finally {
            setLoading(false);
        }
    }

    const initializeDeployData = async () => {
        setDeployLoading(true);
        try {
            const host = props.dfoCore.web3.utils.toChecksumAddress(selectedHost === 'wallet' ? hostWalletAddress : hostDeployedContract);
            const hasExtension = (selectedHost === "custom-extension" && hostDeployedContract && !deployContract);
            const data = { setups: [], rewardTokenAddress: selectedRewardToken.address, byMint, deployContract, host, hasExtension, extensionInitData: extensionPayload || '' };
            const ammAggregator = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
            console.log(farmingSetups);
            var calculatedTotalToSend = "0";
            for (let i = 0; i < farmingSetups.length; i++) {
                const setup = farmingSetups[i];
                calculatedTotalToSend = 
                    props.dfoCore.web3.utils.toBN(calculatedTotalToSend).add(
                        props.dfoCore.web3.utils.toBN(window.numberToString(props.dfoCore.fromDecimals(window.numberToString(setup.rewardPerBlock), selectedRewardToken.decimals)),
                        ).mul(props.dfoCore.web3.utils.toBN(window.numberToString(setup.blockDuration)))
                    ).toString();
                const isFree = setup.free;
                const result = await ammAggregator.methods.findByLiquidityPool(setup.liquidityPoolToken.address).call();
                const { amm } = result;
                var mainTokenAddress = isFree ? setup.liquidityPoolToken.tokens[0].address : setup.mainToken.address;
                const mainTokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), mainTokenAddress);
                const mainTokenDecimals = mainTokenAddress === window.voidEthereumAddress ? 18 : await mainTokenContract.methods.decimals().call();

                const parsedSetup =
                    [
                        isFree,
                        parseInt(setup.blockDuration),
                        window.numberToString(props.dfoCore.fromDecimals(window.numberToString(setup.rewardPerBlock), selectedRewardToken.decimals)),
                        window.numberToString(props.dfoCore.fromDecimals(window.numberToString(setup.minStakeable), mainTokenDecimals)),
                        !isFree ? window.numberToString(props.dfoCore.fromDecimals(window.numberToString(setup.maxStakeable)), mainTokenDecimals) : 0,
                        setup.renewTimes,
                        amm,
                        setup.liquidityPoolToken.address,
                        mainTokenAddress,
                        props.dfoCore.voidEthereumAddress,
                        setup.involvingEth,
                        isFree ? 0 : props.dfoCore.fromDecimals(window.numberToString(parseFloat(setup.penaltyFee) / 100)),
                        0,
                        0
                    ];
                data.setups.push(parsedSetup)
            }
            console.log(data);
            setDeployData(data);
            setTotalRewardToSend(calculatedTotalToSend);
        } catch (error) {
            console.error(error);
            setDeployData(null);
        } finally {
            setDeployLoading(false);
        }
    }

    const deploy = async () => {
        let error = false;
        let deployTransaction = null;
        setDeployLoading(true);
        try {
            const { setups, rewardTokenAddress, extensionAddress, extensionInitData } = deployData;
            const factoryAddress = props.dfoCore.getContextElement("farmFactoryAddress");
            const farmFactory = await props.dfoCore.getContract(props.dfoCore.getContextElement("FarmFactoryABI"), factoryAddress);
            const types = [
                "address",
                "bytes",
                "address",
                "address",
                "bytes",
            ];
            console.log(deployData);
            const encodedSetups = abi.encode(["tuple(bool,uint256,uint256,uint256,uint256,uint256,address,address,address,address,bool,uint256,uint256,uint256)[]"], [setups]);
            const params = [props.dfoCore.web3.utils.toChecksumAddress(extensionAddress ? extensionAddress : hostDeployedContract), extensionPayload || extensionInitData || "0x", props.dfoCore.getContextElement("ethItemOrchestratorAddress"), rewardTokenAddress, encodedSetups || 0];
            console.log(params)
            console.log(extensionInitData);
            console.log(extensionPayload);
            console.log(extensionAddress);
            const payload = props.dfoCore.web3.utils.sha3(`init(${types.join(',')})`).substring(0, 10) + (props.dfoCore.web3.eth.abi.encodeParameters(types, params).substring(2));
            console.log(payload);
            const gas = await farmFactory.methods.deploy(payload).estimateGas({ from: props.dfoCore.address });
            deployTransaction = await farmFactory.methods.deploy(payload).send({ from: props.dfoCore.address, gas });
            deployTransaction = await props.dfoCore.web3.eth.getTransactionReceipt(deployTransaction.transactionHash);
            var farmMainContractAddress = props.dfoCore.web3.eth.abi.decodeParameter("address", deployTransaction.logs.filter(it => it.topics[0] === props.dfoCore.web3.utils.sha3("FarmMainDeployed(address,address,bytes)"))[0].topics[1]);
            setFarmingContract(farmMainContractAddress);
        } catch (error) {
            console.error(error);
            error = true;
        } finally {
            if (!error && deployTransaction) {
                props.updateFarmingContract(null);
                await Promise.all(farmingSetups.map(async (_, i) => {
                    removeFarmingSetup(i);
                }));
                props.setFarmingContractStep(0);
                setDeployStep(deployStep + 1);
            }
            setDeployLoading(false);
        }
    }

    const deployExtension = async () => {
        let error = false;
        setDeployLoading(true);
        try {
            const { byMint, host, deployContract } = deployData;
            if (!deployContract) {
                const factoryAddress = props.dfoCore.getContextElement("farmFactoryAddress");
                const farmFactory = await props.dfoCore.getContract(props.dfoCore.getContextElement("FarmFactoryABI"), factoryAddress);
                const cloneGasLimit = await farmFactory.methods.cloneFarmDefaultExtension().estimateGas({ from: props.dfoCore.address });
                const cloneExtensionTransaction = await farmFactory.methods.cloneFarmDefaultExtension().send({ from: props.dfoCore.address, gas: cloneGasLimit });
                const cloneExtensionReceipt = await props.dfoCore.web3.eth.getTransactionReceipt(cloneExtensionTransaction.transactionHash);
                const extensionAddress = props.dfoCore.web3.eth.abi.decodeParameter("address", cloneExtensionReceipt.logs.filter(it => it.topics[0] === props.dfoCore.web3.utils.sha3('ExtensionCloned(address)'))[0].topics[1])
                const farmExtension = new props.dfoCore.web3.eth.Contract(props.dfoCore.getContextElement("FarmExtensionABI"), extensionAddress);
                const extensionInitData = farmExtension.methods.init(byMint, host, treasuryAddress || props.dfoCore.voidEthereumAddress).encodeABI();
                setDeployData({ ...deployData, extensionAddress, extensionInitData });
            } else {
                const { abi, bytecode } = deployContract;
                const gasLimit = await new props.dfoCore.web3.eth.Contract(abi).deploy({ data: bytecode }).estimateGas({ from: props.dfoCore.address });
                const extension = await new props.dfoCore.web3.eth.Contract(abi).deploy({ data: bytecode }).send({ from: props.dfoCore.address, gasLimit, gas: gasLimit });
                console.log(extension.options.address);
                setDeployData({ ...deployData, extensionAddress: extension.options.address });
            }
            setDeployStep(!error ? deployStep + 1 : deployStep);
        } catch (error) {
            console.error(error);
            error = true;
        } finally {
            setDeployLoading(false);
        }
    }

    function filterDeployedContract(contractData) {
        var abi = contractData.abi;
        if (abi.filter(abiEntry => abiEntry.type === 'constructor').length > 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability !== 'view' && abiEntry.stateMutability !== 'pure' && abiEntry.name === 'transferTo' && (!abiEntry.outputs || abiEntry.outputs.length === 0) && abiEntry.inputs && abiEntry.inputs.length === 1 && abiEntry.inputs[0].type === 'uint256').length === 0) {
            return false;
        }
        if (abi.filter(abiEntry => abiEntry.type === 'function' && abiEntry.stateMutability === 'payable' && abiEntry.name === 'backToYou' && (!abiEntry.outputs || abiEntry.outputs.length === 0) && abiEntry.inputs && abiEntry.inputs.length === 1 && abiEntry.inputs[0].type === 'uint256').length === 0) {
            return false;
        }
        return true;
    }

    function onHasTreasuryAddress(e) {
        setTreasuryAddress("");
        setHasTreasuryAddress(e.target.checked);
    }

    function onTreasuryAddressChange(e) {
        var addr = e.currentTarget.value;
        setTreasuryAddress(window.isEthereumAddress(addr) ? addr : "");
    }

    function onHostSelection(e) {
        setSelectedHost(e.target.value);
        setHostWalletAddress("");
        setHostDeployedContract("");
        setExtensionPayload("");
        setUseDeployedContract(false);
        setTreasuryAddress("");
        setHasTreasuryAddress(false);
        setDeployContract(null);
    }

    function canDeploy() {
        if(!selectedHost) {
            return false;
        }
        if(selectedHost === 'wallet') {
            if(hasTreasuryAddress && !window.isEthereumAddress(treasuryAddress)) {
                return false;
            }
            return window.isEthereumAddress(hostWalletAddress);
        }
        if(selectedHost === 'custom-extension') {
            if(useDeployedContract) {
                return window.isEthereumAddress(hostDeployedContract);
            }
            return deployContract !== undefined && deployContract !== null && deployContract.contract !== undefined && deployContract.contract !== null;
        }
        return window.isEthereumAddress(hostDeployedContract);
    }

    const getCreationComponent = () => {
        return <div className="CheckboxQuestions">
                    <h6>Reward token address</h6>
                    <p className="BreefRecapB">The reward token is the token chosen to reward farmers and can be one per contract.</p>
                    <TokenInput placeholder={"Reward token"} onClick={onSelectRewardToken} tokenAddress={(selectedRewardToken && selectedRewardToken.address) || ""} text={"Load"} /> 
                
            {
                loading ? <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div> : <>
                        {selectedRewardToken && <div className="CheckboxQuestions">
                            <p><Coin address={selectedRewardToken.address} /> {selectedRewardToken.symbol}</p>
                            {/*@todoM add logic to the select - OLD code at line 297*/}
                            <p className="BreefRecapB">If “by reserve” is selected, the input token will be sent from a wallet. If “by mint” is selected, it will be minted and then sent. The logic of this action must be carefully coded into the extension! To learn more, read the Documentation <a>Documentation (coming Soon)</a></p>
                            <select  className="SelectRegular">
                                <option value="">Select method</option>
                                {/*!enterInETH &&*/ <option value="mint">By mint</option>}
                                <option value="reserve">By reserve</option>
                            </select>
                        </div>
                        }
                    {<>

                        {/* OLD CODE @todo Select logic (like in the top) for experience dynamics = to Inflation > Create
                            selectedRewardToken && <div className="form-check my-4">
                            <input className="form-check-input" type="checkbox" checked={byMint} onChange={(e) => setByMint(e.target.checked)} id="setByMint" />
                            <label className="form-check-label" htmlFor="setByMint">
                                By mint
                        </label>*/}
                    </>}
                    {
                        selectedRewardToken && <div className="Web2ActionsBTNs">
                            <a className="web2ActionBTN" onClick={() => {
                                props.updateFarmingContract({ rewardToken: { ...selectedRewardToken, byMint } });
                                setDeployStep(0);
                            }}>Start</a>
                        </div>
                    }
                </>
            }

        </div>
    }

    const getDeployComponent = () => {

        if (deployLoading) {
            return <div className="col-12">
                <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        }

        if (deployStep === 1) {
            return <div className="col-12 flex flex-column justify-content-center align-items-center">
                <div className="row mb-4">
                    <h6><b>Deploy extension</b></h6>
                </div>
                <div className="row">
                    <a onClick={() => setDeployStep(0)} className="backActionBTN mr-4">Back</a>
                    <a onClick={() => deployExtension()} className="Web3ActionBTN">Deploy extension</a>
                </div>
            </div>
        } else if (deployStep === 2) {
            return <div className="col-12 flex flex-column justify-content-center align-items-center">
                <div className="row mb-4">
                    <h6><b>Deploy Farming Contract</b></h6>
                </div>
                <div className="row">
                    <a onClick={() => setDeployStep(hostDeployedContract ? 0 : 1)} className="backActionBTN mr-4">Back</a>
                    <a onClick={() => deploy()} className="Web3ActionBTN">Deploy contract</a>
                </div>
            </div>
        } else if (deployStep === 3) {
            return <div className="col-12 flex flex-column justify-content-center align-items-center">
                <div className="row mb-4">
                    <h6 className="text-secondary"><b>Deploy successful!</b></h6>
                </div>
            </div>
        }

        return (
            <div className="col-12">
                <div className="row">
                    <h6><b>Host</b></h6>
                </div>
                <div className="row mb-2">
                    <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row mb-4">
                    <div className="col-12 p-0">
                        <select className="SelectRegular" value={selectedHost} onChange={onHostSelection}>
                            <option value="">Choose an host..</option>
                            <option value="wallet">Wallet</option>
                            <option value="custom-extension">Custom Contract</option>
                            <option value="deployed-contract">Already deployed Contract</option>
                        </select>
                    </div>
                </div>
                {
                    selectedHost === 'wallet' ? <>
                        <div className="row mb-2 justify-content-center">
                            <input type="text" className="TextRegular" value={hostWalletAddress || ""} onChange={(e) => setHostWalletAddress(e.target.value.toString())} placeholder={"Wallet address"} aria-label={"Wallet address"} />
                        </div>
                        <div className="row mb-4">
                            <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                        </div>
                        <div className="row mb-4 justify-content-center">
                            <label>
                                Set separated treasury
                                <input type="checkbox" checked={hasTreasuryAddress} onChange={onHasTreasuryAddress} />
                            </label>
                            {hasTreasuryAddress && <input type="text" className="TextRegular" value={treasuryAddress || ""} onChange={onTreasuryAddressChange} placeholder={"Treasury address"} aria-label={"Treasury address"} />}
                        </div>
                    </> : selectedHost === 'custom-extension' ? <>
                        <div className="form-check my-4">
                            <input className="form-check-input" type="checkbox" checked={useDeployedContract} onChange={(e) => setUseDeployedContract(e.target.checked)} id="setIsDeploy" />
                            <label className="form-check-label" htmlFor="setIsDeploy">
                                Use deployed contract
                            </label>
                        </div>
                        {
                            !useDeployedContract ? <ContractEditor filterDeployedContract={filterDeployedContract} dfoCore={props.dfoCore} onContract={setDeployContract} templateCode={farmingExtensionTemplateCode} /> : <>
                                <div className="row mb-2">
                                    <input type="text" className="TextRegular" value={hostDeployedContract} onChange={(e) => setHostDeployedContract(e.target.value.toString())} placeholder={"Deployed contract address"} aria-label={"Deployed contract address"} />
                                </div>
                            </>
                        }
                        <div>
                            <h6><b>Extension payload</b></h6>
                            <input type="text" className="TextRegular" value={extensionPayload || ""} onChange={(e) => setExtensionPayload(e.target.value.toString())} placeholder={"Payload"} aria-label={"Payload"} />
                        </div>
                    </> : selectedHost === 'deployed-contract' ? <>
                        <div className="row mb-2">
                            <input type="text" className="TextRegular" value={hostDeployedContract} onChange={(e) => setHostDeployedContract(e.target.value.toString())} placeholder={"Deployed contract address"} aria-label={"Deployed contract address"} />
                        </div>
                        <div>
                            <h6><b>Extension payload</b></h6>
                            <input type="text" className="TextRegular" value={extensionPayload || ""} onChange={(e) => setExtensionPayload(e.target.value.toString())} placeholder={"Payload"} aria-label={"Payload"} />
                        </div>
                    </> : <div />
                }
                <div className="row justify-content-center my-4">
                    <a onClick={() => {
                        setSelectedHost(null);
                        setIsDeploy(false);
                    }} className="backActionBTN mr-4">Back</a>
                    <a onClick={() => {
                        if(!canDeploy()) {
                            return;
                        }
                        initializeDeployData();
                        setDeployStep(hostDeployedContract ? 2 : 1);
                    }} className="web2ActionBTN ml-4" disabled={!canDeploy()}>Deploy</a>
                </div>
            </div>
        )
    }

    const getFarmingContractStatus = () => {
        return (
            <div className="col-12">
                <div className="row flex-column align-items-start mb-4">
                    <h5 className="text-secondary"><b>Farm {props.farmingContract.rewardToken.symbol}</b></h5>
                </div>
                <CreateOrEditFarmingSetups
                    rewardToken={selectedRewardToken}
                    farmingSetups={farmingSetups}
                    onAddFarmingSetup={(setup) => addFarmingSetup(setup)}
                    onRemoveFarmingSetup={(i) => removeFarmingSetup(i)}
                    onEditFarmingSetup={(setup, i) => editFarmingSetup(setup, i)}
                    onCancel={() => { props.updateFarmingContract(null); }}
                    onFinish={() => setIsDeploy(true)}
                />
            </div>
        )
    }

    if(farmingContract) {
        return (
            <div>
                <h3>Congratulations!</h3>
                <p>You can find the new farming contract at the address <a href={props.dfoCore.getContextElement("etherscanURL") + "address/" + farmingContract} target="_blank">{farmingContract}</a></p>
                <p>In order to be able to activate all the setups you created, {byMint ? "be sure to grant the permission to mint at least" : "you must send"} <b>{window.fromDecimals(totalRewardToSend, selectedRewardToken.decimals, true)}</b> {selectedRewardToken.symbol} <Coin address={selectedRewardToken.address}/> {byMint ? "for the extension" : "to its extension, having address"} <a href={props.dfoCore.getContextElement("etherscanURL") + "address/" + deployData.extensionAddress} target="_blank">{deployData.extensionAddress}</a></p>
            </div>
        );
    }

    if (isDeploy) {
        return (
            <div className="create-component">
                <div className="row mb-4">
                    {getDeployComponent()}
                </div>
            </div>
        )
    }

    return (
        <div>
            { !props.farmingContract && getCreationComponent() }
            { props.farmingContract && getFarmingContractStatus() }
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { farmingContract, farmingSetups, creationStep } = session;
    return { dfoCore: core.dfoCore, farmingContract, farmingSetups, creationStep };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFarmingContractStep: (index) => dispatch(setFarmingContractStep(index)),
        updateFarmingContract: (contract) => dispatch(updateFarmingContract(contract)),
        addFarmingSetup: (setup) => dispatch(addFarmingSetup(setup)),
        removeFarmingSetup: (index) => dispatch(removeFarmingSetup(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);