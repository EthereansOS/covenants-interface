export default function Entries(props) {
    return <>
        <div className="row flex-column align-items-start mb-4">
            <h6 className="text-secondary"><b>Entries:</b></h6>
        </div>
        {props.entries.length === 0 && <span>No entries</span>}
        {props.entries.map((entry, entryIndex) => <div key={entry.name} className="row flex-column align-items-start mb-4">
            <div className="col-8">
                <p><b>{entry.name}</b> ({entry.operations.length} operations)</p>
            </div>
            <div className="col-4 flex justify-content-start mb-4">
                <button className="btn btn-sm btn-danger ml-1" onClick={() => props.editOrAddEntry(entryIndex)}><b>EDIT</b></button>
                <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => props.removeEntry(entryIndex)}><b>X</b></button>
            </div>
        </div>)}
    </>
}