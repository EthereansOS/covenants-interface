import { useState } from 'react';
import { Input } from '../../../../components';

const Entry = (props) => {

    const [entryName, setEntryName] = useState(props.entry.name || '');
    const [lastBlock, setLastBlock] = useState(props.entry.lastBlock || 0);
    const [blockInterval, setBlockInterval] = useState(props.entry.blockInterval || 0);
    const [callerRewardPercentage, setCallerRewardPercentage] = useState(props.entry.callerRewardPercentage || 0);

    function canSave() {
        return entryName !== '' && props.entry.operations.length > 0;
    }

    return (<>
        <div className="row">
            <div className="col-12">
                <div className="row flex-column align-items-start mb-4">
                    <p>
                        <label>Name:</label>
                        <input onChange={e => setEntryName(e.currentTarget.value)} value={entryName} />
                    </p>
                    <p>
                        <Input label="Start Block:" min="0" onChange={e => setLastBlock(e.target.value)} value={lastBlock} />
                    </p>
                    <p>
                        <Input label="Block Interval:" onChange={e => setBlockInterval(e.target.value)} value={blockInterval} />
                    </p>
                    <p>
                        <Input label="Caller reward %:" min="0" max="100" onChange={e => setCallerRewardPercentage(e.target.value)} value={callerRewardPercentage} />
                    </p>
                </div>
                <div className="row flex-column align-items-start mb-4">
                    <h6 className="text-secondary"><b>Operations:</b></h6>
                </div>
                {props.entry.operations.length === 0 && <span>No operations</span>}
                {props.entry.operations.map((entryOperation, entryOperationIndex) => <div key={entryOperationIndex} className="row align-items-center text-left mb-md-2 mb-4">
                    <div className="col-md-9 col-12">
                        <b style={{ fontSize: 14 }}>{entryOperation.actionType} {entryOperation.amount !== 0 ? entryOperation.amount : `${entryOperation.percentage}%`} {entryOperation.inputToken.symbol} to {entryOperation.receivers.length} wallet(s)</b>
                    </div>
                    <div className="col-md-3 col-12 flex">
                        <button className="btn btn-sm btn-danger ml-1" onClick={() => props.editOrAddEntryOperation(entryOperationIndex)}><b>EDIT</b></button>
                        <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => props.removeEntryOperation(entryOperationIndex)}><b>X</b></button>
                    </div>
                </div>)}
            </div>
        </div>
        <div className="row justify-content-between mt-4">
            <div className="col-12 flex justify-content-start mb-4">
                <button onClick={props.editOrAddEntryOperation} className="btn btn-light">Add Operation</button>
                <button onClick={props.cancelEditEntry} className="btn btn-light">Cancel</button>
                <button disabled={!canSave()} onClick={() => props.saveEntry(entryName, lastBlock, blockInterval, callerRewardPercentage)} className="btn btn-light">Save</button>
            </div>
        </div>
    </>);
}

export default Entry;