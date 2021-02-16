import { useState } from 'react';
import Entry from './Entry';
import Loading from '../../../../components/shared/Loading';

const CreateOrEdit = (props) => {

    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(props.fixedInflationContractAddress ? [] : props.entries || []);
    const [editingEntry, setEditingEntry] = useState(null);

    async function loadContract() {
        if (!props.fixedInflationContractAddress) {
            return setLoading(false);
        }
    }

    function canContinue() {
        return entries.length > 0 && entries.filter(it => it.operations.length === 0).length === 0;
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

    function editOrAddEntry(entryIndex) {
        if (isNaN(entryIndex)) {
            entries.push({
                name: '',
                operations: [],
                add: true,
                create: true
            });
            entryIndex = entries.length - 1;
            setEntries(entries.map(it => it));
        }
        setEditingEntry(entryIndex);
    }

    function saveEntry(entryName, lastBlock, blockInterval, callerRewardPercentage, operations) {
        entries[editingEntry].name = entryName;
        entries[editingEntry].lastBlock = lastBlock;
        entries[editingEntry].blockInterval = blockInterval;
        entries[editingEntry].callerRewardPercentage = callerRewardPercentage;
        entries[editingEntry].operations = operations;
        delete entries[editingEntry].create;
        setEntries(entries.map(it => it));
        setEditingEntry(null);
    }

    function cancelEditEntry() {
        entries[editingEntry].edit = false;
        setEditingEntry(null);
        entries[editingEntry].create && editingEntry === entries.length - 1 && entries.pop();
        setEntries(entries.map(it => it));
    }

    function removeEntry(entryIndex) {
        entries[entryIndex].remove = true;
        entries[entryIndex].edit = false;
        entries[entryIndex].add && entries.splice(entryIndex, 1);
        setEntries(entries.map(it => it));
    }

    function render() {
        return (
            editingEntry !== null ? <Entry entry={copy(entries[editingEntry])} cancelEditEntry={cancelEditEntry} saveEntry={saveEntry} />
                : <>
                    <div className="row">
                        <div className="col-5">
                            <h6 className="text-secondary"><b>Entries:</b></h6>
                        </div>
                        <div className="col-3">
                            <button onClick={editOrAddEntry} className="btn btn-outline-secondary">Add</button>
                        </div>
                    </div>
                    {entries.length === 0 && <span>No entries</span>}
                    {entries.map((entry, entryIndex) => <div key={entry.name} className="row">
                        <div className="col-8">
                            <p><b>{entry.name}</b> ({entry.operations.length} operations)</p>
                        </div>
                        <div className="col-4 flex">
                            <button className="btn btn-sm btn-danger ml-1" onClick={() => editOrAddEntry(entryIndex)}><b>EDIT</b></button>
                            <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => removeEntry(entryIndex)}><b>X</b></button>
                        </div>
                    </div>)}
                    <div className="row">
                        <div className="col-12">
                            {props.fixedInflationContractAddress && <button onClick={props.cancelEdit} className="btn btn-light">Cancel</button>}
                            <button disabled={!canContinue()} onClick={() => props.continue(entries)} className="btn btn-primary">{props.fixedInflationContractAddress ? "Deploy" : "Next"}</button>
                        </div>
                    </div>
                </>
        );
    }

    loading && setTimeout(loadContract);

    return loading ? <Loading /> : render();
}

export default CreateOrEdit;