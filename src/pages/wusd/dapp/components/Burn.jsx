import { useState } from 'react';
import { connect } from 'react-redux';

const Burn = (props) => {
    const [pair, setPair] = useState("");
    const [getLpToken, setGetLpToken] = useState(false);
    const [amount, setAmount] = useState(0);

    const getWUSDToken = () => {
        return (
            <div className="col-12 mb-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-secondary" type="button">MAX</button>
                    </div>
                    <input type="number" class="form-control" value={amount} min={0} onChange={(e) => setAmount(e.target.value)} />
                    <div class="input-group-append">
                        <span class="input-group-text" id=""> WUSD</span>
                    </div>
                </div>
                <small class="form-text text-muted">Balance: 0 WUSD</small>
            </div>
        )
    }

    const getBurnAmount = () => {
        if (!pair) {
            return (<div/>);
        }
        if (getLpToken) {
            return (
                <div className="col-12 mb-4">
                    <div className="row justify-content-center">
                        For
                    </div>
                    <div className="row justify-content-center">
                        1000 DAI/USDC
                    </div>
                </div>
            )
        }
        return (
            <div className="col-12 mb-4">
                <div className="row justify-content-center">
                    For
                </div>
                <div className="row justify-content-center">
                    1000 DAI, 1000 USDC
                </div>
            </div>
        )
    }

    const getButtons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <button className="btn btn-primary">Approve</button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-secondary">Mint</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="burn-component">
            <div className="row">
                <div className="col-12 mb-4">
                    <select className="custom-select wusd-pair-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                        <option value="">Choose pair..</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="form-check mt-4">
                        <input class="form-check-input" type="checkbox" value={getLpToken} onChange={(e) => setGetLpToken(e.target.checked)} id="getLpToken" disabled={!pair} />
                        <label class="form-check-label" for="getLpToken">
                            Get liquidity pool token
                        </label>
                    </div>
                </div>
                {
                    pair ? getWUSDToken() : <div/>
                }
                { getBurnAmount() }
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

export default connect(mapStateToProps)(Burn);