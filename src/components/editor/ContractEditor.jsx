import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import Loading from "../shared/Loading";

const ContractEditor = (props) => {
    const { onChange, dfoCore, onContract } = props;
    const [contractCode, setContractCode] = useState(props.templateCode || "");
    const [solidityVersions, setSolidityVersions] = useState([]);
    const [solVersion, setSolVersion] = useState("");
    const [contracts, setContracts] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractError, setContractError] = useState("");
    const [compiling, setCompiling] = useState(false);

    useEffect(() => {
        getSolidityData()
    }, []);

    const getSolidityData = async () => {
        const { releases } = await window.SolidityUtilities.getCompilers();
        setSolidityVersions(releases);
    }

    const onUpdateContractCode = (value, event) => {
        setContractCode(value);
        onChange && onChange(value, event);
    }

    const onUploadFile = async (e) => {
        try {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
                setContractCode(event.target.result);
            };
            reader.readAsText(file);
        } catch(e) {
        }
    }

    function cleanList(list) {
        var cleanList = Object.entries(list || {}).filter(it => {
            if(it[1].bytecode === '0x') {
                return false;
            }
            return props.filterDeployedContract ? props.filterDeployedContract(it[1], it[0]) : true;
        });
        var cleanListObject = {};
        cleanList.forEach(it => cleanListObject[it[0]] = it[1]);
        return cleanListObject;
    }

    const compileContractCode = async () => {
        setContractError("");
        setCompiling(true);
        setContracts(null);
        setContract(null);
        onContract(null)
        try {
            const result = await window.SolidityUtilities.compile(contractCode, solVersion);
            var cleanedList = cleanList(result.optimized);
            setContracts(cleanedList);
            setContract(Object.keys(cleanedList)[0]);
            onContract(Object.values(cleanedList)[0]);
        } catch(e) {
            setContractError(e.message || e);
        }
        setCompiling(false);
    }

    const setChosenContract = (value) => {
        setContract(value);
        onContract(contracts[value]);
    }

    return (
        <>  
            <div className="row mb-4">
                <div className="col-md-6 col-12">
                    <select className="custom-select wusd-pair-select" value={solVersion} onChange={(e) => setSolVersion(e.target.value)}>
                        <option value={""}>Choose version</option>
                        {
                            Object.keys(solidityVersions).map((item) => {
                                return <option key={item} value={solidityVersions[item]}>{item}</option>
                            })
                        }
                    </select>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-3 col-12">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="customFile" accept=".sol" onChange={(e) => onUploadFile(e)} />
                        <label className="custom-file-label" htmlFor="customFile"></label>
                    </div>
                </div>
            </div>
            <div className="row mb-4" style={{width : '600px'}}>
                <Editor
                    value={contractCode}
                    height="80vh"
                    defaultLanguage="sol"
                    onChange={(value, event) => onUpdateContractCode(value, event)}
                />
            </div>
            {contractError && <div className="row">
                <div className="col-md-6 col-12">
                    {contractError}
                </div>
            </div>}
            <div className="row">
                <div className="col-md-6 col-12">
                    {!compiling && <button onClick={() => compileContractCode()} disabled={!solVersion} className="btn btn-secondary">Compile</button>}
                    {compiling && <Loading/>}
                </div>
                <div className="col-md-6 col-12">
                    {
                        contracts && <select className="custom-select wusd-pair-select" value={contract} onChange={(e) => setChosenContract(e.target.value)}>
                            <option value={""}>Choose contract</option>
                            {
                                Object.keys(contracts).map((item) => {
                                    return <option value={item}>{item}</option>
                                })
                            }
                        </select>
                    }
                </div>
            </div>
        </>
    )
}

export default ContractEditor;