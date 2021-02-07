import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setInflationContractStep, updateInflationContract, addEntry, removeEntry, addInflationSetup, removeInflationSetup  } from '../../../../store/actions';
import CreateSetup from './CreateSetup';
import ContractEditor from '../../../../components/editor/ContractEditor';

const Create = (props) => {
    const [step, setStep] = useState(0);
    const [add, setAdd] = useState(false);
    const [editSetup, setEditSetup] = useState(null);
    const [selectedHost, setSelectedHost] = useState("");
    const [hostWalletAddress, setHostWalletAddress] = useState(null);
    const [hostDeployedContract, setHostDeployedContract] = useState(null);
    const [deployContract, setDeployContract] = useState(null);
    const [useDeployedContract, setUseDeployedContract] = useState(false);
    const [extensionPayload, setExtensionPayload] = useState("");
    const [deployStep, setDeployStep] = useState(0);
    const [deployLoading, setDeployLoading] = useState(false);
    const [deployData, setDeployData] = useState(null);

    const addSetup = (setup) => {
        if (editSetup) {
            props.removeInflationSetup(setup.index);
        }
        props.addInflationSetup(setup);
        setAdd(false);
        setEditSetup(null);
    }

    const removeSetup = (index) => {
        props.removeInflationSetup(index);
    }

    const initializeDeployData = async () => {
        setDeployLoading(true);
        try {
            const updatedEntries = [];
            for (let i = 0; i < props.inflationSetups.length; i++) {
                const entry = props.inflationSetups[i];
                const currentEntry = {
                    id: props.dfoCore.web3.utils.sha3(i.toString()),
                    lastBlock: 0,
                    name: entry.name,
                    blockInterval: parseInt(entry.recurringExecution),
                    callerRewardPercentage: !entry.hasExecutionReward ? 0 : props.dfoCore.fromDecimals((parseInt(entry.executionRewardAmount) / 100).toString(), 18),
                    operations: []
                };
                for (let j = 0; j < entry.entries.length; j++) {
                    const currentOperation = entry.entries[j];
                    const isPercentage = currentOperation.transferType.toLowerCase() === "percentage";
                    const byMint = currentOperation.inputTokenMethod.toLowerCase() !== "reserve";
                    const isSwap = currentOperation.actionType.toLowerCase() !== "transfer";
                    let ammPlugin = props.dfoCore.voidEthereumAddress;
                    let ethAddress = props.dfoCore.voidEthereumAddress;
                    if (isSwap) {
                        const pathToken = currentOperation.pathTokens[0];
                        const ammAggregator = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMAggregatorABI"), props.dfoCore.getContextElement("ammAggregatorAddress"));
                        const info = await ammAggregator.methods.info(pathToken.address).call();
                        ammPlugin = info['amm'];
                        const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), ammPlugin);
                        const ammData = await ammContract.methods.data().call();
                        ethAddress = ammData[0];
                        console.log(ammData);
                    }
                    const liquidityPoolAddresses = currentOperation.pathTokens.map((token) => props.dfoCore.web3.utils.toChecksumAddress(token.address));
                    const swapPath = currentOperation.pathTokens.map((token) => props.dfoCore.web3.utils.toChecksumAddress(token.exitTokenAddress));
                    const receivers = currentOperation.receivers.map((receiver) => props.dfoCore.web3.utils.toChecksumAddress(receiver.address));
                    const receiversPercentages = currentOperation.receivers.length === 1 ? [] : currentOperation.receivers.map((receiver) => props.dfoCore.toFixed(props.dfoCore.fromDecimals(receiver.percentage.toString())));
                    if (receiversPercentages.length > 1) {
                        receiversPercentages.splice(-1, 1);
                    }
                    console.log(liquidityPoolAddresses);
                    currentEntry.operations.push({
                        inputTokenAddress: currentOperation.inputToken.address,
                        inputTokenAmount: isPercentage ? currentOperation.percentage : props.dfoCore.toFixed(props.dfoCore.fromDecimals(currentOperation.amount)),
                        inputTokenAmountIsPercentage: isPercentage,
                        inputTokenAmountIsByMint: byMint,
                        ammPlugin,
                        liquidityPoolAddresses,
                        swapPath,
                        receivers,
                        receiversPercentages,
                        enterInETH: currentOperation.inputToken.address.toLowerCase() === ethAddress.toLowerCase(),
                        exitInETH: swapPath.length > 0 ? swapPath[swapPath.length - 1].toLowerCase() === ethAddress.toLowerCase() : false,
                    });
                }
                updatedEntries.push(currentEntry);
            }
            console.log({ entries: updatedEntries, hostWalletAddress, hostDeployedContract, extensionPayload, useDeployedContract, deployContract });
            setDeployData({ entries: updatedEntries, hostWalletAddress, hostDeployedContract, extensionPayload, deployContract, useDeployedContract })
        } catch (error) {
            console.error(error);
        } finally {
            setDeployLoading(false);
            // setDeployStep(useDeployedContract ? 2 : 1);
        }
    }

    const deployExtension = async () => {
        let error = false;
        let deployTransaction = null;
        setDeployLoading(true);
        try {
        } catch (error) {
            console.error(error);
        } finally {
            if (!error && deployTransaction) {
                setDeployStep(2);
            }
            setDeployLoading(false);
        }
    }

    const deploy = async () => {

    }

    const onChangeSelectedHost = (value) => {
        setSelectedHost(value);
        if (value === 'wallet') {
            setHostDeployedContract("");
            setDeployContract("");
        } else if (value === "deployed-contract") {
            setHostWalletAddress("");
        }
    }

    const getSteps = () => {
        switch (step) {
            case 0:
                return getFirstStep();
            case 1:
                return getSecondStep();
            default:
                return <div/>
        }
    }

    const getFirstStep = () => {
        if (add || editSetup) {
            return <div className="create-inflation-component">
                <div className="row mb-4">
                    <CreateSetup onCancel={() => { setAdd(false); setEditSetup(null); }} onFinish={(setup) => addSetup(setup)} editSetup={editSetup} />
                </div>
            </div>;
        }
    
        return (
            <div className="create-inflation-component">
                <div className="row mb-4">
                    { props.inflationSetups.length === 0 && <CreateSetup onFinish={(setup) => addSetup(setup)} /> }
                    { props.inflationSetups.length > 0 && listSetups() }
                </div>
            </div>
        );
    }

    const listSetups = () => {
        return <div className="col-12 p-0">
            <div className="row flex-column align-items-start mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
                <p><b>Entry list</b></p>
            </div>
            {
                props.inflationSetups.map((setup, i) => {
                    return (
                        <div key={i} className="row align-items-center text-left mb-md-2 mb-4">
                            <div className="col-md-9 col-12">
                                <b style={{fontSize: 14}}>{setup.title} ({setup.recurringExecution})</b>
                            </div>
                            <div className="col-md-3 col-12 flex">
                                <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => removeSetup(i)}><b>X</b></button> <button onClick={() => setEditSetup({ ...setup, index: i })} className="btn btn-sm btn-danger ml-1"><b>EDIT</b></button>
                            </div>
                        </div>
                    )
                })
            }
            <div className="row justify-content-between mt-4">
                <div className="col-12 flex justify-content-start mb-4">
                    <button onClick={() => setAdd(true)} className="btn btn-light">Add entry</button>
                </div>
                <div className="col-12 mt-4">
                    <button onClick={() => {
                        props.inflationSetups.forEach((_, i) => props.removeInflationSetup(i));
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => setStep(step + 1)} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        </div>
    }

    const getSecondStep = () => {
        return <div className="col-12 p-0">
            <div className="row flex-column align-items-start mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
                <p><b>Deploy</b></p>
            </div>
            <div className="row">
                <h6><b>Host</b></h6>
            </div>
            <div className="row mb-2">
                <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
            </div>
            <div className="row mb-4">
                <div className="col-12 p-0">
                    <select className="custom-select wusd-pair-select" value={selectedHost} onChange={(e) => onChangeSelectedHost(e.target.value)}>
                        <option value="">Choose an host..</option>
                        <option value="deployed-contract">Deployed Contract</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>
            </div>
            {
                selectedHost === 'wallet' ? <>
                    <div className="row mb-2">
                        <input type="text" className="form-control" value={hostWalletAddress} onChange={(e) => setHostWalletAddress(e.target.value.toString())} placeholder={"Wallet address"} aria-label={"Wallet address"}/>
                    </div>
                    <div className="row mb-4">
                        <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                    </div>
                </> : selectedHost === 'deployed-contract' ? <>
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" value={useDeployedContract} onChange={(e) => setUseDeployedContract(e.target.checked)} id="setIsDeploy" />
                        <label className="form-check-label" htmlFor="setIsDeploy">
                            Use deployed contract
                        </label>
                    </div>
                    {
                        !useDeployedContract ? <ContractEditor dfoCore={props.dfoCore} onChange={(c, p) => console.log('update.')} onFinish={(contract, payload) => setDeployContract({contract, payload})} /> : <>
                            <div className="row mb-2">
                                <input type="text" className="form-control" value={hostDeployedContract} onChange={(e) => setHostDeployedContract(e.target.value.toString())} placeholder={"Deployed contract address"} aria-label={"Deployed contract address"}/>
                            </div>
                        </>
                    }
                </> : <div/>
            }
            {
                (selectedHost && (useDeployedContract || selectedHost === 'wallet')) && <div className="col-12 mt-4">
                    <input type="text" className="form-control" value={extensionPayload || ""} onChange={(e) => setExtensionPayload(e.target.value.toString())} placeholder={"Payload"} aria-label={"Payload"}/>
                </div>
            }
            <div className="row">
                <div className="col-12 mt-4">
                    <button onClick={() => {
                        setStep(step - 1);
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => { initializeDeployData(); }} disabled={!selectedHost || (selectedHost === 'wallet' && (!hostWalletAddress || !props.dfoCore.isValidAddress(hostWalletAddress))) || (selectedHost === 'deployed-contract' && ((!useDeployedContract && (!deployContract || !deployContract.contract)) || (useDeployedContract && !hostDeployedContract)))} className="btn btn-secondary ml-4">Deploy</button>
                </div>
            </div>
        </div>
    }


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
                <button onClick={() => deployExtension()} className="btn btn-secondary">Deploy extension</button>
            </div>
        </div>
    } else if (deployStep === 2) {
        return <div className="col-12 flex flex-column justify-content-center align-items-center">
            <div className="row mb-4">
                <h6><b>Deploy Farming Cotnract</b></h6>
            </div>
            <div className="row">
                <button onClick={() => deploy()} className="btn btn-secondary">Deploy contract</button>
            </div>
        </div>
    }

    return getSteps();
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { inflationContract, inflationSetups, entries, inflationCreationStep } = session;
    return { dfoCore: core.dfoCore, inflationSetups, inflationContract, entries, inflationCreationStep };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setInflationContractStep: (index) => dispatch(setInflationContractStep(index)),
        updateInflationContract: (contract) => dispatch(updateInflationContract(contract)),
        addInflationSetup: (setup) => dispatch(addInflationSetup(setup)),
        removeInflationSetup: (index) => dispatch(removeInflationSetup(index)),
        addEntry: (entry) => dispatch(addEntry(entry)), 
        removeEntry: (index) => dispatch(removeEntry(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);