import { connect } from 'react-redux';
import { useState } from 'react';
import { Input } from '../../../../components';
import Operation from './Operation';

const Entry = (props) => {

    const [step, setStep] = useState(0);
    const [operations, setOperations] = useState(props.entry.operations || []);
    const [entryName, setEntryName] = useState(props.entry.name || '');
    const [lastBlock, setLastBlock] = useState(props.entry.lastBlock || 0);
    const [blockInterval, setBlockInterval] = useState(props.entry.blockInterval || Object.values(props.dfoCore.getContextElement("blockIntervals"))[0]);
    const [callerRewardPercentage, setCallerRewardPercentage] = useState(props.entry.callerRewardPercentage || 0);
    const [hasCallerRewardPercentage, setHasCallerRewardPercentage] = useState((props.entry.callerRewardPercentage || 0) > 0);
    const [hasLastBlock, setHasLastBlock] = useState((props.entry.lastBlock || 0) > 0);
    const [editingOperation, setEditingOperation] = useState(null);

    function editOrAddEntryOperation(entryOperationIndex) {
        if (isNaN(entryOperationIndex)) {
            entryOperationIndex = operations.length;
            operations.push({ add: true, receivers: [], pathTokens: [] });
            setOperations(operations);
        }
        setEditingOperation(entryOperationIndex);
    }

    function cancelEditOperation() {
        if (operations[editingOperation].add && editingOperation === operations.length - 1) {
            operations.pop();
            setOperations(operations);
        }
        setEditingOperation(null);
    }

    function saveEditOperation(operation) {
        delete operation.add;
        operations[editingOperation] = operation;
        setOperations(operations);
        setEditingOperation(null);
    }

    function removeEntryOperation(entryOperationIndex) {
        operations.splice(entryOperationIndex, 1);
        setOperations(operations.map(it => it));
    }

    function onCallerPercentageChange(e) {
        var value = 0;
        try {
            value = parseFloat(e.target.value.split('-').join('').trim());
        } catch (e) {
        }
        setCallerRewardPercentage(value > 99 ? 99 : value);
    }

    function onHasCallerRewardPercentageChange(e) {
        setHasCallerRewardPercentage(e.currentTarget.checked);
        setCallerRewardPercentage(0);
    }

    function onHasLastBlockChange(e) {
        setHasLastBlock(e.currentTarget.checked);
        setLastBlock(0);
    }

    var steps = [
        [function () {
            return <>
                <div className="InputForm">
                    <input className="TextRegular" placeholder="Title" onChange={e => setEntryName(e.currentTarget.value)} value={entryName} />
                    <h5>Block Interval:</h5>
                    <select className="SelectRegular" onChange={e => setBlockInterval(e.currentTarget.value)} value={blockInterval}>
                        {Object.entries(props.dfoCore.getContextElement("blockIntervals")).map(it => <option key={it[0]} value={it[1]}>{it[0]}</option>)}
                    </select>
                    <p>The amount of time between every execution</p>
                </div>
            </>
        },
        function () {
            return entryName === '' || blockInterval === 0
        }],
        [function () {
            return <>
                <div className="CheckboxQuestions">
                    <label>
                        <h5>Start Block</h5>
                        <input type="checkbox" checked={hasLastBlock} onChange={onHasLastBlockChange} />
                        <p>The first execution of this Inflation Contract will be after this typed block. If Disabled the Contract will be available to execute by the deployment block</p>
                    </label>
                    {hasLastBlock && <input type="number" className="TextRegular" placeholder="Start Block" label="Start Block:" min="0" onChange={e => setLastBlock(parseInt(e.target.value))} value={lastBlock} />}
                    <label>
                        <h5>Executor Reward</h5>
                        <input type="checkbox" checked={hasCallerRewardPercentage} onChange={onHasCallerRewardPercentageChange} />
                        <p>By activating the Executor Reward, you can set a % of reward by all of the operations for the executor of the inflation.</p>
                    </label>
                    {hasCallerRewardPercentage &&
                        <div className="SpecialInputPerch">
                            <aside>%</aside>
                            <input className="TextRegular" placeholder="Executor Reward Perchentage (%)" label="Caller reward %:" min="0" max="100" onChange={onCallerPercentageChange} value={callerRewardPercentage} />
                        </div>
                    }
                </div>
            </>
        },
        function () {
            return !(lastBlock >= 0 && (!hasCallerRewardPercentage || (callerRewardPercentage > 0 && callerRewardPercentage < 100)));
        }],
        [function () {
            return <>
                    <h6><b>Operations:</b></h6>
                {operations.length === 0 && <div className="CreateList"><p>No operations</p></div>}
                {editingOperation === null && operations.map((entryOperation, entryOperationIndex) => <div key={entryOperationIndex} className="CreateListOp">
                        <p>{entryOperation.actionType} {entryOperation.amount !== 0 ? entryOperation.amount : `${entryOperation.percentage}% (supply)`} {entryOperation.inputToken.symbol} to {entryOperation.receivers.length} receiver(s)</p>
                        <div className="Web2ActionsBTNs">
                            <a className="web2ActionBTN" onClick={() => editOrAddEntryOperation(entryOperationIndex)}><b>EDIT</b></a>
                            <a className="web2ActionBTN" onClick={() => removeEntryOperation(entryOperationIndex)}><b>X</b></a>
                        </div>
                </div>)}
                <div className="Web2ActionsBTNs">
                    <a onClick={editOrAddEntryOperation} className="web2ActionBTN">+</a>
                </div>
            </>
        },
        function () {
            return operations.length === 0;
        }]
    ];

    return editingOperation != null ?
        <Operation operation={operations[editingOperation]} cancelEditOperation={cancelEditOperation} saveEditOperation={saveEditOperation} />
        : <>
            <div className="CreateList">
                <h6><b> {entryName}</b></h6>
                {steps[step][0]()}
            </div>
            <div className="Web2ActionsBTNs">
                {step !== 0 && <a onClick={() => setStep(step - 1)} className="backActionBTN">Back</a>}
                {step !== steps.length - 1 && <a disabled={steps[step][1]()} onClick={() => !steps[step][1]() && setStep(step + 1)} className={"web2ActionBTN" + (steps[step][1]() ? " disabled" : "")}>Next</a>}
                {step === steps.length - 1 && <a disabled={steps[step][1]()} onClick={() => !steps[step][1]() && props.saveEntry(entryName, lastBlock, blockInterval, callerRewardPercentage, operations)} className={"web2ActionBTN" + (steps[step][1]() ? " disabled" : "")}>Save</a>}
            </div>
        </>
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { dfoCore } = core;
    const { inflationSetups } = session;
    return { dfoCore, inflationSetups };
}

export default connect(mapStateToProps)(Entry);