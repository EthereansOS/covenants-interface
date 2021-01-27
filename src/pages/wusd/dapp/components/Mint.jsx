import { useState } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';

const Mint = (props) => {
    const [pair, setPair] = useState("");
    const [useLpToken, setUseLpToken] = useState(false);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [firstAmount, setFirstAmount] = useState(0);
    const [secondAmount, setSecondAmount] = useState(0);

    const getLpToken = () => {
        return (
            <div className="col-12 mb-4">
                <Input showMax={true} value={lpTokenAmount} balance={1000} min={0} onChange={(e) => setLpTokenAmount(e.target.value)} showCoin={true} showBalance={true} name="DAI/USDC" />
            </div>
        )
    }

    const getMultipleTokens = () => {
        return (
            <>
                <div className="col-12 mb-4">
                    <Input showMax={true} value={firstAmount} balance={1000} min={0} onChange={(e) => setFirstAmount(e.target.value)} showCoin={true} showBalance={true} name="DAI" />
                </div>
                <div className="col-12 mb-2">
                    <p><b>And</b></p>
                </div>
                <div className="col-12 mb-4">
                    <Input showMax={true} value={secondAmount} balance={1000} min={0} onChange={(e) => setSecondAmount(e.target.value)} showCoin={true} showBalance={true} name="USDC" />
                </div>
            </>
        )
    }

    const getButtons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <ApproveButton onError={(error) => console.log(error)} onApproval={() => console.log('success')} />
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-secondary">Mint</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mint-component">
            <div className="row">
                <div className="col-12 mb-4">
                    <select className="custom-select wusd-pair-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                        <option value="">Choose pair..</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="form-check mt-4">
                        <input class="form-check-input" type="checkbox" value={useLpToken} onChange={(e) => setUseLpToken(e.target.checked)} id="useLpToken" disabled={!pair} />
                        <label class="form-check-label" for="useLpToken">
                            Use liquidity pool token
                        </label>
                    </div>
                </div>
                {
                    pair ? useLpToken ? getLpToken() : getMultipleTokens() : <div/>
                }
                {
                    pair ? getButtons() : <div/>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Mint);