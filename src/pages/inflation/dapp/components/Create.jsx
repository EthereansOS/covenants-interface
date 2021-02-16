import { useState } from 'react';
import CreateOrEdit from './CreateOrEdit';
import Loading from '../../../../components/shared/Loading';

const Create = () => {

    const [step, setStep] = useState(NaN);
    const [entries, setEntries] = useState([]);
    const [deploying, setDeploying] = useState(false);
    const [extensionType, setExtensionType] = useState("wallet");
    const [walletAddress, setWalletAddress] = useState("");
    const [code, setCode] = useState("");

    function onExtensionType(e) {
        setWalletAddress("");
        setCode("");
        setExtensionType(e.currentTarget.value);
    }

    var steps = [
        [
            function () {
                return <>
                    <div className="row">
                        <div className="col-12">
                            <h6>Host</h6>
                            <p>Quando mio figlio era criaturo ié 'ò purtàv a vré e scigne e iss mi ricév papà? Ma com'è possibile? Degli animali accussì scemi vogliono fare quello che fanno i cristiani?</p>
                            <select className="custom-select wusd-pair-select" value={extensionType} onChange={onExtensionType}>
                                <option value="wallet">Wallet</option>
                                <option value="deployedContract">Deployed Contract</option>
                            </select>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {extensionType === 'wallet' && <input type="text" value={walletAddress} onKeyUp={e => window.isEthereumAddress(e.currentTarget.value) && setWalletAddress(e.currentTarget.value)}/>}
                            </div>
                        </div>
                    </div>
                </>
            },
            function () {
                return !(extensionType === 'wallet' ? walletAddress : code)
            }]
    ];

    async function deploy() {
        setDeploying(true);
        try {

        } catch (e) {
        }
        setDeploying(false);
    }

    function render() {
        return <>
            <div className="row">
                <div className="col-12">
                    <h6>Deploy</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {steps[step][0]()}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button disabled={deploying} onClick={() => setStep(step === 0 ? NaN : step - 1)} className="btn btn-light">Back</button>
                    {step !== steps.length - 1 && <button disabled={steps[step][1]()} onClick={() => setStep(step + 1)} className="btn btn-primary">Next</button>}
                    {step === steps.length - 1 && (deploying ? <Loading /> : <button disabled={steps[step][1]()} onClick={deploy} className="btn btn-primary">Deploy</button>)}
                </div>
            </div>
        </>
    }

    return isNaN(step) ? <CreateOrEdit entries={entries} continue={() => setStep(0) && setEntries(entries)} /> : render();
}

export default Create;