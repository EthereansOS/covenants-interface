import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from '../../../../components';
import { addInflationSetup, removeEntry, removeInflationSetup  } from '../../../../store/actions';
import CreateEntry from './CreateEntry';

const CreateSetup = (props) => {
    const { onFinish, onCancel, editSetup } = props;
    // first step
    const [title, setTitle] = useState("");
    const [recurringExecution, setRecurringExecution] = useState("");
    // second step
    const [setup, setSetup] = useState({});
    // third step
    const [hasExecutionReward, setHasExecutionReward] = useState(false);
    const [executionRewardAmount, setExecutionRewardAmount] = useState(0);
    // general
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [add, setAdd] = useState(false);
    const [editEntry, setEditEntry] = useState(null);

    // general methods
    useEffect(() => {
        if (editSetup) {
            setTitle(editSetup.title);
            setRecurringExecution(editSetup.recurringExecution);
            setSetup(editSetup);
            setHasExecutionReward(editSetup.hasExecutionReward);
            setExecutionRewardAmount(editSetup.executionRewardAmount);
        }
    }, []);

    const getSetup = () => {
        return {
            ...setup,
            hasExecutionReward,
            executionRewardAmount,
        }
    }

    // first step methods
    const finishFirstStep = () => {
        setLoading(true);
        editSetup ? setSetup({ ...editSetup, title, recurringExecution }) : setSetup({ title, recurringExecution, entries: [] });
        setStep(1);
        setLoading(false);
    }

    // second step methods
    const addInflationEntry = (entry) => {
        if (editEntry) {
            setSetup({
                ...setup,
                entries: setup.entries.map((e, i) => i === editEntry.index ? entry : e),
            })
        } else {
            setSetup({
                ...setup,
                entries: setup.entries.concat(entry),
            });
        }
        setAdd(false);
        setEditEntry(null);
    }

    const removeEntry = (index) => {
        setSetup({
            ...setup,
            entries: setup.entries.filter((_, i) => i !== index),
        })
    }

    // third step methods


    // step retrieval methods
    const getStep = () => {
        switch (step) {
            case 0:
                return getFirstStep();
            case 1:
                return getSecondStep();
            case 2:
                return getThirdStep();
            default:
                return getFirstStep();
        }
    }

    const getFirstStep = () => {
        return <div className="col-12">
            <div className="row mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-12 col-md-6 flex flex-column align-items-center">
                    <div className="row mb-2 justify-content-center">
                        <h4><b>Create setup</b></h4>
                    </div>
                    <div className="row">
                        <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <input type="text" className="form-control inflation-name-input" placeholder="Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="row justify-content-center">
                        <h6><b>Recurring execution</b></h6>
                        <p style={{fontSize: 12}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row w-100 mb-4">
                        <select value={recurringExecution} onChange={(e) => setRecurringExecution(e.target.value)} className="custom-select wusd-pair-select">
                            <option value="">Select one</option>
                            {
                                Object.keys(props.dfoCore.getContextElement("blockIntervals")).map((key, index) => {
                                   return <option key={index} value={props.dfoCore.getContextElement("blockIntervals")[key]}>{key}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="row">
                        { onCancel ? <button onClick={() => onCancel()} className="btn btn-light mr-4">Cancel</button> : <></> }
                        <button onClick={() => finishFirstStep()} disabled={!title || !recurringExecution} className="btn btn-secondary ml-4">{!editSetup ? "Create" : "Next"}</button>
                    </div>
                </div>
            </div>
        </div>;
    }

    const getSecondStep = () => {
        if (add || editEntry) {
            return <CreateEntry onCancel={() => { setAdd(false); setEditEntry(null); }} onFinish={(entry) => addInflationEntry(entry)} entry={editEntry} setup={setup} />;
        }
        return (
            setup.entries.length === 0 ? <CreateEntry onCancel={() => setStep(0)} onFinish={(entry) => addInflationEntry(entry)} setup={setup} /> : listSetupEntries()
        )
    }

    const getThirdStep = () => {
        return (<div className="col-12 p-0">
            <div className="row flex-column align-items-start mb-4">
                <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
                <p><b>{ title } setup</b></p>
            </div>
            <div className="row justify-content-center">
                <div className="form-check my-4">
                    <input className="form-check-input" type="checkbox" value={hasExecutionReward} onChange={(e) => setHasExecutionReward(e.target.checked)} id="executionReward" />
                    <label className="form-check-label" htmlFor="executionReward">
                        Execution reward
                    </label>
                </div>
            </div>
            <div className="row mb-4">
                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
            </div>
            {
                hasExecutionReward && <div className="row mb-4 justify-content-center">
                    <div className="col-md-6 col-12">
                        <Input min={0} max={100} value={executionRewardAmount} onChange={(e) => setExecutionRewardAmount(e.target.value)} />
                    </div>
                </div>
            }
            <div className="col-12 mt-4">
                <button onClick={() => {
                    setStep(step - 1);
                }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => onFinish(getSetup())} className="btn btn-secondary ml-4">Add</button>
            </div>
        </div>)
    }

    const listSetupEntries = () => {
        return <div className="col-12 p-0">
                <div className="row flex-column align-items-start mb-4">
                    <h6 className="text-secondary"><b>Setup inflation contract</b></h6>
                    <p><b>{ title } setup</b></p>
                </div>
            {
                setup.entries.map((entry, i) => {
                    return (
                        <div key={i} className="row align-items-center text-left mb-md-2 mb-4">
                            <div className="col-md-9 col-12">
                                <b style={{fontSize: 14}}>{entry.actionType} {entry.amount !== 0 ? entry.amount : `${entry.percentage}%`} {entry.inputToken.symbol} to {entry.receivers.length} wallet</b>
                            </div>
                            <div className="col-md-3 col-12 flex">
                                <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => removeEntry(i)}><b>X</b></button> <button onClick={() => setEditEntry({ ...entry, index: i })} className="btn btn-sm btn-danger ml-1"><b>EDIT</b></button>
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
                        setStep(step - 1);
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => setStep(step + 1)} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        </div>
    }

    const getLoading = () => {
        return <div className="col-12">
            <div className="row justify-content-center">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden"></span>
                </div>
            </div>
        </div>

    }

    return loading ? getLoading() : getStep();
}

const mapStateToProps = (state) => {
    const { session, core } = state;
    const { inflationSetups } = session;
    return { inflationSetups, dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addInflationSetup: (setup) => dispatch(addInflationSetup(setup)),
        removeInflationSetup: (index) => dispatch(removeInflationSetup(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSetup);