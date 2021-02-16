import { useState } from 'react';
import Entries from './Entries';
import Entry from './Entry';
import Loading from '../../../../components/shared/Loading';
import Operation from './Operation';

const CreateOrEdit = (props) => {

    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState(props.entries || []);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editingOperation, setEditingOperation] = useState(null);

    async function loadContract() {
        if (!props.fixedInflationContractAddress) {
            return setLoading(false);
        }
    }

    function canContinue() {
        return entries.length > 0;
    }

    function editOrAddEntry(entryIndex) {
        if(isNaN(entryIndex)) {
            entries.push({
                name : '',
                operations : [],
                add : true,
                create: true
            });
            setEntries(entries.map(it => it));
            entryIndex = entries.length - 1;
        }
        setEditingEntry(entryIndex);
    }

    function saveEntry(entryName, lastBlock, blockInterval, callerRewardPercentage) {
        entries[editingEntry].name = entryName;
        entries[editingEntry].lastBlock = lastBlock;
        entries[editingEntry].blockInterval = blockInterval;
        entries[editingEntry].callerRewardPercentage = callerRewardPercentage;
        delete entries[editingEntry].create;
        setEntries(entries.map(it => it));
        setEditingEntry(null);
    }

    function copy(entry) {
        var copy = {
        };
        for(var key of Object.keys(entry)) {
            copy[key] = entry[key];
        }
        copy.operations = [];
        for(var operation of entry.operations) {
            var operationCopy = {};
            Object.entries(operation).forEach(it => operationCopy[it[0]] = it[1]);
            copy.operations.push(operationCopy);
        }
        return copy;
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

    function editOrAddEntryOperation(entryOperationIndex) {
        if(isNaN(entryOperationIndex)) {
            entryOperationIndex = entries[editingEntry].operations.length;
            entries[editingEntry].operations.push({add: true, receivers : [], pathTokens : []});
            setEntries(entries.map(it => it));
        }
        setEditingOperation(entryOperationIndex);
    }

    function cancelEditOperation() {
        if(entries[editingEntry].operations[editingOperation].add && editingOperation === entries[editingEntry].operations.length - 1) {
            entries[editingEntry].operations.pop();
            setEntries(entries.map(it => it));
        }
        setEditingOperation(null);
    }

    function saveEditOperation(operation) {
        delete operation.add;
        entries[editingEntry].operations[editingOperation] = operation;
        setEntries(entries.map(it => it));
        setEditingOperation(null);
    }

    function removeEntryOperation(entryOperationIndex) {
        entries[editingEntry].operations.splice(entryOperationIndex, 1);
        setEntries(entries.map(it => it));
    }

    function render() {
        return <>
            {editingEntry == null && editingOperation == null && <>
                <Entries entries={entries} removeEntry={removeEntry} editOrAddEntry={editOrAddEntry}/>
                <div className="row">
                    <div className="col-12">
                        {props.fixedInflationContractAddress && <button onClick={props.cancelEdit} className="btn btn-light">Cancel</button>}
                        <button disabled={!canContinue()} onClick={() => props.continue(entries)} className="btn btn-primary">{props.fixedInflationContractAddress ? "Deploy" : "Next"}</button>
                    </div>
                </div>
            </>}
            {editingEntry != null && <Entry visible={editingOperation == null} entry={copy(entries[editingEntry])} entryIndex={editingEntry} cancelEditEntry={cancelEditEntry} editOrAddEntryOperation={editOrAddEntryOperation} removeEntryOperation={removeEntryOperation} saveEntry={saveEntry} />}
            {editingOperation != null && <Operation entry={entries[editingEntry]} entryIndex={editingEntry} operation={entries[editingEntry].operations[editingOperation]} operationIndex={editingOperation} cancelEditOperation={cancelEditOperation} saveEditOperation={saveEditOperation} />}
        </>
    }

    loading && setTimeout(loadContract);

    return loading ? <Loading /> : render();
}

export default CreateOrEdit;