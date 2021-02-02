import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Coin, Input, TokenInput } from '../../../../components/shared';
import { setInflationContractStep, updateInflationContract, addEntry, removeEntry  } from '../../../../store/actions';

const Create = (props) => {
    const [inflationContractName, setInflationContractName] = useState(null);
    const [recurringExecution, setRecurringExecution] = useState(null);
    const [selectedActionType, setSelectedActionType] = useState(null);
    const [transferType, setTransferType] = useState(null);
    const [inputToken, setInputToken] = useState(null);
    const [inputTokenMethod, setInputTokenMethod] = useState(null);
    const [percentage, setPercentage] = useState(0);
    const [amount, setAmount] = useState(0);
    const [currentReceiver, setCurrentReceiver] = useState("");
    const [receivers, setReceivers] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [isAddExecutionRewards, setIsAddExecutionRewards] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidPercentage = () => {
        const totalPercentage = receivers.map((receiver) => receiver.percentage).reduce((acc, num) => acc + num);
        return totalPercentage == 100;
    }

    const onPercentageChange = (index, percentage) => {
        percentage = parseInt(percentage);
        const updatedReceivers = receivers.map((receiver, i) => {
            if (i === index) {
                return { ...receiver, percentage };
            }
            return receiver;
        });
        setReceivers(updatedReceivers);
    }

    const onSelectInputToken = async (address) => {
        if (!address) return;
        setLoading(true);
        const inputTokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
        const symbol = await inputTokenContract.methods.symbol().call();
        setInputToken({ symbol, address });
        setLoading(false);
    }

    const addFinishedEntry = () => {
        const entry = { receivers, percentage, recurringExecution, amount, inputToken, transferType, selectedActionType, inputTokenMethod };
        props.addEntry(entry);
        setInputTokenMethod(null);
        setInputToken(null);
        setRecurringExecution(null);
        setReceivers([]);
        setAmount(0);
        setPercentage(0);
        setSelectedActionType(null);
        setIsAdd(false);
        props.setInflationContractStep(0);
    }

    const getCreationComponent = () => {
        return <div className="col-12">
            <div className="row mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-md-6 flex flex-column align-items-center">
                    <div className="row mb-2 justify-content-center">
                        <h4><b>Create the first entry</b></h4>
                    </div>
                    <div className="row">
                        <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <input type="text" class="form-control inflation-name-input" placeholder="Name" value={inflationContractName} onChange={(e) => setInflationContractName(e.target.value)} />
                    </div>
                    <div className="row justify-content-center">
                        <h6><b>Recurring execution</b></h6>
                        <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row w-100 mb-4">
                        <select value={recurringExecution} onChange={(e) => setRecurringExecution(e.target.value)} className="custom-select wusd-pair-select">
                            <option value="">Select one</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <div className="row">
                        <button onClick={() => props.updateInflationContract({ name: inflationContractName })} disabled={!inflationContractName || !recurringExecution} className="btn btn-secondary ml-4">Next</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    const getEntries = () => {
        return <div className="col-12 p-0">
            {
                props.entries.map((entry, i) => {
                    return (
                        <div key={i} className="row align-items-center text-left mb-md-0 mb-4">
                            <div className="col-md-9 col-12">
                                <b style={{fontSize: 14}}>{entry.selectedActionType} {entry.amount !== 0 ? entry.amount : `${entry.percentage}%`} {entry.inputToken.symbol} to {entry.receivers.length} wallet</b>
                            </div>
                            <div className="col-md-3 col-12 flex">
                                <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => props.removeEntry(i)}><b>X</b></button> <button className="btn btn-sm btn-danger ml-1"><b>EDIT</b></button>
                            </div>
                        </div>
                    )
                })
            }
            <div className="row justify-content-between mt-4">
                <div className="col-12 flex justify-content-start mb-4">
                    <button onClick={() => setIsAdd(true)} className="btn btn-light">Add entry</button>
                </div>
                <div className="col-12 mt-4">
                    <button onClick={() => {
                        props.entries.forEach((_, index) => props.removeEntry(index));
                        props.updateInflationContract(null);
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => setIsAddExecutionRewards(true)} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        </div>
    }

    const getEmptyEntries = () => {
        if (props.inflationCreationStep === 0) {
            return (
                <div className="col-12">
                    <div className="row justify-content-center mb-4">
                        <h6><b>Select action type</b></h6>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <button onClick={() => setSelectedActionType(selectedActionType !== 'transfer' ? 'transfer' : null)} className={`btn ${selectedActionType === 'transfer' ? "btn-secondary" : "btn-outline-secondary"} mr-4`}>Transfer</button>
                        <button onClick={() => setSelectedActionType(selectedActionType !== 'swap' ? 'swap' : null)} className={`btn ${selectedActionType === 'swap' ? "btn-secondary" : "btn-outline-secondary"}`}>Swap</button>
                    </div>
                    <div className="row mb-4">
                        <p style={{fontSize: 14}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row justify-content-center">
                        <button onClick={() => {
                            setSelectedActionType(null);
                            props.updateInflationContract(null);
                        }} className="btn btn-light mr-4">Cancel</button>
                        <button onClick={() => props.setInflationContractStep(1)} disabled={!selectedActionType} className="btn btn-primary">Next</button>
                    </div>
                </div>
            );
        } else if (props.inflationCreationStep === 1) {
            return (
                <div className="col-12 flex flex-column align-items-center">
                    <div className="row">
                        <TokenInput label={"Input token"} placeholder={"Input token address"} width={60} onClick={(address) => onSelectInputToken(address)} text={"Load"} />
                    </div>
                    {
                        !inputToken && 
                        <div className="row mb-4">
                            <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                        </div>
                    }
                    {
                        loading ? <div className="row justify-content-center">
                            <div class="spinner-border text-secondary" role="status">
                                <span class="visually-hidden"></span>
                            </div>
                        </div> : <>
                            <div className="row mb-4">
                                { inputToken && <div className="col-12">
                                        <b>{inputToken.symbol}</b> <Coin address={inputToken.address} className="ml-2" />
                                    </div>
                                }
                            </div>
                            <div className="row w-50 mb-4">
                                <select value={inputTokenMethod} onChange={(e) => setInputTokenMethod(e.target.value)} className="custom-select wusd-pair-select">
                                    <option value="">Select method</option>
                                    <option value="mint">By mint</option>
                                    <option value="reserve">By reserve</option>
                                </select>
                            </div>
                            <div className="row mb-4">
                                <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                            </div>
                        </>
                    }
                    <div className="row justify-content-center">
                        <button onClick={() => {
                            setInputToken(null);
                            props.setInflationContractStep(0);
                        }} className="btn btn-light mr-4">Cancel</button>
                        <button onClick={() => props.setInflationContractStep(2)} disabled={!inputToken || !inputTokenMethod} className="btn btn-secondary">Next</button>
                    </div>
                </div>
            )
        } else if (props.inflationCreationStep === 2) {
            return selectedActionType === 'transfer' ? getTransferSecondStep() : getSwapSecondStep();
        }
        return <div/>
    }

    const getTransferSecondStep = () => {
        return <div className="col-12 flex flex-column align-items-center">
            <div className="row mb-4">
                <h6><b>Transfer</b></h6>
            </div>
            <div className="row w-50 mb-4">
                <select value={transferType} onChange={(e) => setTransferType(e.target.value)} className="custom-select wusd-pair-select">
                    <option value="">Select type</option>
                    <option value="percentage">Percentage</option>
                    <option value="amount">Amount</option>
                </select>
            </div>
            {
                transferType ? 
                    transferType == 'percentage' ? 
                        <div className="row mb-4 justify-content-center align-items-center">
                            <input type="number" min={0} max={100} value={percentage} onChange={(e) => setPercentage(e.target.value)} className="form-control mr-2" style={{width: '33%'}} />% of { inputToken.symbol } <Coin address={inputToken.address} className="ml-2" />
                        </div>
                    : 
                        <div className="row mb-4 justify-content-center align-items-center">
                            <Input showCoin={true} address={inputToken.address} name={inputToken.symbol} value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                : <div/>
            }
            {
                transferType ? <>
                    <div className="row">
                        <h6><b>Receiver</b></h6>
                    </div>
                    <div className="row">
                        <div className="input-group mb-3">
                            <input type="text"  value={currentReceiver} onChange={(e) => setCurrentReceiver(e.target.value)} className="form-control" placeholder="Address" aria-label="Receiver" aria-describedby="button-add" />
                            <button onClick={() => {
                                const exists = receivers.filter((r) => r.address.toLowerCase() === currentReceiver.toLowerCase()).length > 0;
                                if (exists) return;
                                setReceivers(receivers.concat({ address: currentReceiver, percentage: receivers.length === 0 ? 100 : 0}));
                                setCurrentReceiver("");
                            }} className="btn btn-outline-secondary ml-2" type="button" id="button-add">Add</button>
                        </div>
                    </div>
                    <div className="row mb-4">
                        {
                            receivers.map((receiver, index) => {
                                return (
                                    <div className="col-12 mb-2">
                                        {
                                            receivers.length === 1 ? <div className="row align-items-center">
                                                <b>{receiver.address}</b>
                                                <button onClick={() => setReceivers(receivers.filter((_, i) => i !== index))} className="btn btn-danger btn-sm ml-2">X</button>
                                            </div> : <div className="row align-items-center">
                                                <div className="col-md-8 col-12">
                                                    <b>{receiver.address}</b>
                                                </div>
                                                <div className="col-md-2 col-12">
                                                    <input type="number" min={0} max={100} onChange={(e) => onPercentageChange(index, e.target.value)} className="form-control mr-1" value={receiver.percentage} />
                                                </div>
                                                <div className="col-md-2 col-12">
                                                    <button onClick={() => setReceivers(receivers.filter((_, i) => i !== index))} className="btn btn-danger btn-sm">X</button>
                                                </div>    
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </> : <div/>
            }
            <div className="row justify-content-center">
                <button onClick={() => {
                    setReceivers([]);
                    setAmount(0);
                    setPercentage(0);
                    setTransferType(null);
                    props.setInflationContractStep(1);
                }} className="btn btn-light mr-4">Cancel</button>
                <button onClick={() => addFinishedEntry()} disabled={(!amount && !percentage) || !transferType || receivers.length === 0 || !isValidPercentage()} className="btn btn-secondary">Add</button>
            </div>
        </div>
    }

    const getSwapSecondStep = () => {
        return <div/>
    }

    const getInflationContractStatus = () => {
            return <div className="col-12">
            <div className="row flex-column align-items-start mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
                <p><b>{props.inflationContract.name} setup</b></p>
            </div>
                <div className="col-12">
                    {
                        (props.entries.length > 0 && !isAdd) && getEntries()
                    }
                    {
                        (props.entries.length === 0 || isAdd) && getEmptyEntries()
                    }
                </div>
        </div>;
    }

    return (<div className="create-inflation-component">
        <div className="row mb-4">
            { !props.inflationContract && getCreationComponent() }
            { props.inflationContract && getInflationContractStatus() }
        </div>
    </div>);
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { inflationContract, entries, inflationCreationStep } = session;
    return { dfoCore: core.dfoCore, inflationContract, entries, inflationCreationStep };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setInflationContractStep: (index) => dispatch(setInflationContractStep(index)),
        updateInflationContract: (contract) => dispatch(updateInflationContract(contract)),
        addEntry: (entry) => dispatch(addEntry(entry)), 
        removeEntry: (index) => dispatch(removeEntry(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);