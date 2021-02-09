import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

const ContractEditor = (props) => {
    const { onChange, dfoCore, onFinish } = props;
    const [contractCode, setContractCode] = useState("");
    const [solidityVersions, setSolidityVersions] = useState([]);
    const [solVersion, setSolVersion] = useState("");
    const [contracts, setContracts] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractPayload, setContractPayload] = useState("");

    useEffect(() => {
        getSolidityData()
    }, []);

    const getSolidityData = async () => {
        const { releases } = await window.SolidityUtilities.getCompilers();
        setSolidityVersions(releases);
    }

    const onUpdateContractCode = (value, event) => {
        setContractCode(value);
        onChange(value, event);
    }

    const onUploadFile = async (e) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            setContractCode(event.target.result);
        };
        reader.readAsText(file);
    }

    const compileContractCode = async () => {
        const result = await window.SolidityUtilities.compile(contractCode, solVersion);
        setContracts(result.optimized);
    }

    const setChosenContract = (value) => {
        console.log(contracts[value]);
        setContract(value);
        onFinish(contracts[value], contractPayload);
    }

    return (
        <>  
            <div className="row mb-4">
                <div className="col-md-6 col-12">
                    <select className="custom-select wusd-pair-select" value={solVersion} onChange={(e) => setSolVersion(e.target.value)}>
                        <option value={""}>Choose version</option>
                        {
                            Object.keys(solidityVersions).map((item) => {
                                return <option value={solidityVersions[item]}>{item}</option>
                            })
                        }
                    </select>
                </div>
                <div className="col-md-3"></div>
                <div className="col-md-3 col-12">
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="customFile" onChange={(e) => onUploadFile(e)} />
                        <label className="custom-file-label" for="customFile"></label>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <Editor
                    value={contractCode}
                    height="80vh"
                    defaultLanguage="sol"
                    defaultValue=""
                    onChange={(value, event) => onUpdateContractCode(value, event)}
                />
            </div>
            <div className="row">
                <div className="col-md-6 col-12">
                    <button onClick={() => compileContractCode()} disabled={!solVersion} className="btn btn-secondary">Compile</button>
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
            {
                contract && <div className="row mt-4 justify-content-center">
                    <div className="col-md-6 col-12">
                        <input type="text" className="form-control" value={contractPayload} onChange={(e) => setContractPayload(e.target.value)} onBlur={() => onFinish(contracts[contract], contractPayload)} placeholder={"Payload, if any"} aria-label={"Payload, if any"}/>
                    </div>
                </div>
            }
        </>
    )
}

export default ContractEditor;