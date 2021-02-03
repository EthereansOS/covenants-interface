import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setInflationContractStep, updateInflationContract, addEntry, removeEntry, addInflationSetup, removeInflationSetup  } from '../../../../store/actions';
import CreateSetup from './CreateSetup';

const Create = (props) => {
    const [step, setStep] = useState(0);
    const [add, setAdd] = useState(false);
    const [editSetup, setEditSetup] = useState(null);
    const [selectedHost, setSelectedHost] = useState("");

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
                    <CreateSetup onCancel={() => { setAdd(false); setEditSetup(null); }} onFinish={(setup) => addSetup(setup)} setup={editSetup} />
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
                    <select className="custom-select wusd-pair-select" value={selectedHost} onChange={(e) => setSelectedHost(e.target.value)}>
                        <option value="">Choose an host..</option>
                        <option value="deployed-contract">Deployed Contract</option>
                        <option value="deploy-contract">Deploy Contract</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-12 mt-4">
                    <button onClick={() => {
                        setStep(step - 1);
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => console.log('deploy')} className="btn btn-secondary ml-4">Deploy</button>
                </div>
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