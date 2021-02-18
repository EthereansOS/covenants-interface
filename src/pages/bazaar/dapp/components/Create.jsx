import { useState } from 'react';
import { connect } from 'react-redux';
import { TokenInput, Input } from '../../../../components/shared';
import { addTransaction } from '../../../../store/actions';

const Create = (props) => {
    const { onCancel, onFinish } = props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [symbol, setSymbol] = useState("");
    const [icon, setIcon] = useState(null);
    const [step, setStep] = useState(0);
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deployLoading, setDeployLoading] = useState(false);

    const captureFile = (event) => {
        event.preventDefault();

        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1000 * 1024 * 1024) return;
            const sizeReader = new FileReader();
            const image = new Image();
            sizeReader.readAsDataURL(file);
            sizeReader.onloadend = (ended) => {
                image.src = ended.target.result;
            }
            image.onload = () => {
                if (image.width <= 350) {
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onloadend = () => {
                        console.log(reader);
                        setIcon({ buffer: Buffer(reader.result) });
                    }
                }
            }
            
        }
    }

    const onAddToken = async (address) => {
        setLoading(true);
        try {
            const t = tokens.filter((tok) => tok.address.toLowerCase() !== address.toLowerCase());
            const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
            const symbol = await tokenContract.methods.symbol().call();
            const decimals = await tokenContract.methods.decimals().call();
            t.push({
                contract: tokenContract,
                address,
                symbol,
                decimals,
                amount: 0,
            })
            setTokens(t);
        } catch (error) {
            console.error(error);
            setTokens(tokens);
        } finally {
            setLoading(false);
        }
    }

    const deployIndexToken = async () => {
        if (tokens.length === 0 || tokens.map((token) => parseFloat(token.amount) === 0).filter((v) => v).length > 0) {
            return;
        }
        setDeployLoading(true);
        try {
            const indexContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IndexABI"), props.dfoCore.getContextElement("indexAddress"));
            console.log(indexContract);
            const gas = await indexContract.methods.mint(title, symbol, "google.com", tokens.map((token) => token.address), tokens.map((token) => props.dfoCore.toFixed(token.amount * 10**token.decimals).toString()), 0, props.dfoCore.voidEthereumAddress).estimateGas({ from: props.dfoCore.address });
            const result = await indexContract.methods.mint(title, symbol, "google.com", tokens.map((token) => token.address), tokens.map((token) => props.dfoCore.toFixed(token.amount * 10**token.decimals).toString()), 0, props.dfoCore.voidEthereumAddress).send({ from: props.dfoCore.address, gas });
            props.addTransaction(result);
            onFinish();
        } catch (error) {
            console.error(error);
        } finally {
            setDeployLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="create-component">
                <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        )
    }

    if (step == 0) {
        return (
            <div className="CreateList">
                    <h6><b>New Index</b></h6>
                    <div className="InputForm">
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="TextRegular" placeholder="Title" />
                        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="TextRegular"  placeholder="Symbol" />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="TextAreaRegular" placeholder="Description" />
                    </div>
                <div className="InputForm">
                    <h6><b>Cover</b></h6>
                    <input type="file" accept=".png,.gif" onChange={captureFile} />
                    <p>The cover image must be .png or .gif, with a size limit of 5 MB and max. width of 350px, due to users experience in IPFS download speed limitations</p>
                </div>
                <div className="Web2ActionsBTNs">
                    <a onClick={() => onCancel()} className="backActionBTN">Cancel</a>
                    <a onClick={() => (!title || !description || !symbol || !icon) ? console.log('missing parameters') : setStep(1)} className="web2ActionBTN" disabled={!title || !description || !symbol || !icon}>Next</a>
                </div>
            </div>
        )
    }

    return (
        <div className="CreateList">
                <h6>{ symbol }</h6>
                <TokenInput placeholder={"Token address"} width={60} onClick={(address) => onAddToken(address)} text={"Load"} />
                <p>Load all of the tokens needed to mint 1 { symbol }</p>
            {
                tokens.length > 0 && tokens.map((token, index) => {
                    return (
                            <div key={index} className="TokenLoaded">
                                <div>
                                    <Input min={0} value={token.amount} onChange={(e) => setTokens(tokens.map((t, i) => i !== index ? t : { ...token, amount: e.target.value}))} showCoin={true} address={token.address} name={token.symbol} />
                                    <a className="backActionBTN" onClick={() => setTokens(tokens.filter((_, i) => i !== index))}>X</a>
                                    <p>Insert the amount of {token.symbol} needed to mint 1 { symbol }</p>
                                </div>
                            </div>
                    )
                })
            }
            <div className="Web2ActionsBTNs">
                <a onClick={() => setStep(0)} className="backActionBTN">Cancel</a>
                {
                    deployLoading ? <a className="Web3ActionBTN" disabled={deployLoading}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </a> : <a onClick={() => deployIndexToken()} disabled={tokens.length === 0 || tokens.map((token) => parseFloat(token.amount) === 0).filter((v) => v).length > 0 } className="Web3ActionBTN">Deploy</a>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}


const mapDispatchToProps = (dispatch) => {
    return {
        addTransaction: (index) => dispatch(addTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);