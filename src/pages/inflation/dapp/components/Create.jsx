import { useState } from 'react';
import { connect } from 'react-redux';
import CreateOrEdit from './CreateOrEdit';
import Loading from '../../../../components/shared/Loading';
import ContractEditor from '../../../../components/editor/ContractEditor';

const Create = (props) => {

    var fixedInflationFactory = window.newContract(props.dfoCore.getContextElement("FixedInflationFactoryABI"), props.dfoCore.getContextElement("fixedInflationFactoryAddress"));

    const [step, setStep] = useState(NaN);
    const [entries, setEntries] = useState([]);
    const [deploying, setDeploying] = useState(false);
    const [extensionType, setExtensionType] = useState("wallet");
    const [walletAddress, setWalletAddress] = useState("");
    const [code, setCode] = useState("");
    const [payload, setPayload] = useState("");
    const [extensionAddress, setExtensionAddress] = useState("");
    const [deployMessage, setDeployMessage] = useState("");
    const [fixedInflationAddress, setFixedInflationAddress] = useState("");

    function onExtensionType(e) {
        setWalletAddress("");
        setCode("");
        setExtensionType(e.currentTarget.value);
    }

    function creationComplete(newEntries) {
        setEntries(newEntries);
        setStep(0);
    }

    var deployMethodologies = {
        async wallet() {
            setDeployMessage("1/3 - Deploying Extension...");

            var transaction = await fixedInflationFactory.methods.cloneLiquidityMiningDefaultExtension().send({ from: props.dfoCore.address });
            var receipt = await window.web3.eth.getTransactionReceipt(transaction.transactionHash);
            var fixedInflationExtensionAddress = window.web3.eth.abi.decodeParameter("address", receipt.logs.filter(it => it.topics[0] === window.web3.utils.sha3('ExtensionCloned(address)'))[0].topics[1]);

            setExtensionType("deployedContract");
            setExtensionAddress(fixedInflationExtensionAddress);

            var payload = window.web3.utils.sha3("init(address)").substring(0, 10);
            payload += window.web3.eth.abi.encodeParameter("address", walletAddress).substring(2);
            setPayload(payload);

            await deployMethodologies.deployedContract(fixedInflationExtensionAddress, payload);
        },
        async deployedContract(preDeployedContract, builtPayload) {
            setDeployMessage(`${preDeployedContract ? "2/3" : "1/2"} - Deploying Liqudity Mining Contract...`);
            var elaborateEntries = entries.map(entry => {
                return {
                    id: window.web3.utils.sha3('0'),
                    name: entry.name,
                    lastBlock: entry.lastBlock,
                    blockInterval: entry.blockInterval,
                    callerRewardPercentage: window.toDecimals(window.numberToString((entry.callerRewardPercentage || 0) / 100), 18),
                    operations: entry.operations.map(operation => {
                        var receivers = operation.receivers.map(it => it.address);
                        var receiversPercentages = operation.receivers.map(it => window.toDecimals(window.numberToString(it.percentage / 100), 18));
                        receiversPercentages.pop();
                        return {
                            inputTokenAddress: operation.enterInETH && operation.amm ? operation.amm.ethAddress : operation.inputToken.address,
                            inputTokenAmount: window.toDecimals(window.numberToString(operation.amount || parseFloat(operation.percentage) / 100), operation.transferType === 'percentage' ? "18" : operation.inputToken.decimals),
                            inputTokenAmountIsPercentage: operation.percentage !== '',
                            inputTokenAmountIsByMint: operation.inputTokenMethod === 'mint',
                            ammPlugin: operation.amm ? operation.amm.ammContract.options.address : window.voidEthereumAddress,
                            liquidityPoolAddresses: operation.pathTokens ? operation.pathTokens.map(it => it.address) : [],
                            swapPath: operation.pathTokens ? operation.pathTokens.map(it => it.outputTokenAddress) : [],
                            receivers: receivers,
                            receiversPercentages: receiversPercentages,
                            enterInETH: (operation.enterInETH && operation.amm !== undefined && operation.amm !== null) || false,
                            exitInETH: operation.exitInETH || false
                        }
                    })
                }
            });

            console.log(JSON.stringify(elaborateEntries));

            var data = window.newContract(props.dfoCore.getContextElement("FixedInflationABI")).methods.init(
                preDeployedContract || extensionAddress,
                builtPayload || payload,
                elaborateEntries,
                elaborateEntries.map(it => it.operations)
            ).encodeABI();

            var result = await fixedInflationFactory.methods.deploy(data).send({ from: props.dfoCore.address });
            result = await window.web3.eth.getTransactionReceipt(result.transactionHash);
            var fixedInflationAddress = window.web3.eth.abi.decodeParameter("address", result.logs.filter(it => it.topics[0] === window.web3.utils.sha3('FixedInflationDeployed(address,address,bytes)'))[0].topics[1]);

            setDeployMessage(`${preDeployedContract ? "3/3" : "2/2"} - Enabling Extension...`);

            var extension = await props.dfoCore.getContract(props.dfoCore.getContextElement("FixedInflationExtensionABI"), preDeployedContract || extensionAddress);
            await extension.methods.setActive(true).send({ from: props.dfoCore.address });
            setFixedInflationAddress(fixedInflationAddress);
        }
    }

    function setDeployContract(contract, payload) {
        console.log(contract, payload);
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
                                {/*<option value="fromSourceCode">From Source Code</option>*/}
                            </select>
                        </div>
                        {(extensionType === 'wallet' || extensionType === 'deployedContract') && <div className="row">
                            <div className="col-12">
                                {extensionType === 'wallet' && <input type="text" placeholder="Host address" defaultValue={walletAddress} onKeyUp={e => setWalletAddress(window.isEthereumAddress(e.currentTarget.value) ? e.currentTarget.value : "")} />}
                                {extensionType === 'deployedContract' && <input type="text" placeholder="Insert extension address" defaultValue={extensionAddress} onKeyUp={e => setExtensionAddress(window.isEthereumAddress(e.currentTarget.value) ? e.currentTarget.value : "")} />}
                            </div>
                        </div>}
                        {extensionType === 'fromSourceCode' && <ContractEditor dfoCore={props.dfoCore} onFinish={setDeployContract}/>}
                        {extensionType !== 'wallet' && <div className="row">
                            <div className="col-12">
                                <input placeholder="Optional init payload" type="text" defaultValue={payload} onKeyUp={e => setPayload(e.currentTarget.value)} />
                            </div>
                        </div>}
                    </div>
                </>
            },
            function () {
                return !(extensionType === 'wallet' ? walletAddress && walletAddress !== window.voidEthereumAddress : extensionType === 'deployedContract' ? extensionAddress : code)
            }]
    ];

    async function deploy() {
        setDeploying(true);
        setDeployMessage("");
        var error;
        try {
            await deployMethodologies[extensionType]();
        } catch (e) {
            error = e;
        }
        setDeploying(false);
        setDeployMessage("");
        error && alert(`Error: ${error.message}`);
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
                    {deployMessage && <span>{deployMessage}</span>}
                </div>
            </div>
        </>
    }

    function success() {
        return <>
            <div className="row">
                <div className="col-12">
                    <h6>Success!</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}/address/${fixedInflationAddress}`}>{fixedInflationAddress}</a>
                </div>
            </div>
        </>
    }

    return fixedInflationAddress ? success() : isNaN(step) ? <CreateOrEdit entries={entries} continue={creationComplete} /> : render();
}

const mapStateToProps = (state) => {
    return { dfoCore: state.core.dfoCore };
}

export default connect(mapStateToProps)(Create);