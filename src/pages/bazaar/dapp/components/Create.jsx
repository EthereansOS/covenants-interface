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
        setLoading(true);
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
            setLoading(false);
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
            <div className="create-component">
                <div className="row mb-4">
                    <h6 className="text-secondary"><b>New Index Token</b></h6>
                </div>
                <div className="row mb-4">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                </div>
                <div className="row mb-4">
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <div className="row mb-4">
                    <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)}  placeholder="Symbol" />
                </div>
                <div className="row justify-content-center">
                    <h6 className="text-secondary"><b>Icon</b></h6>
                </div>
                <div className="row mb-4">
                    <input type="file" accept=".png,.gif" onChange={captureFile} />
                </div>
                <div className="row">
                    <a onClick={() => onCancel()} className="btn btn-light">Cancel</a>
                    <button onClick={() => setStep(1)} className="btn btn-secondary" disabled={!title || !description || !symbol || !icon}>Next</button>
                </div>
            </div>
        )
    }

    return (
        <div className="create-component">
            <div className="row">
                1 { symbol }
            </div>
            <div className="row">
                <TokenInput placeholder={"Token address"} width={60} onClick={(address) => onAddToken(address)} text={"Load"} />
            </div>
            {
                tokens.length > 0 && tokens.map((token, index) => {
                    return (
                            <div key={index} className="row mb-2">
                                <Input min={0} value={token.amount} onChange={(e) => setTokens(tokens.map((t, i) => i !== index ? t : { ...token, amount: e.target.value}))} showCoin={true} address={token.address} name={token.symbol} />
                                <button className="btn btn-sm btn-outline-danger ml-1" onClick={() => setTokens(tokens.filter((_, i) => i !== index))}>X</button>
                            </div>
                    )
                })
            }
            <div className="row">
                <a onClick={() => setStep(0)} className="btn btn-light">Cancel</a>
                <button onClick={() => deployIndexToken()} disabled={tokens.length === 0 || tokens.map((token) => parseFloat(token.amount) === 0).filter((v) => v).length > 0 } className="btn btn-secondary">Deploy</button>
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