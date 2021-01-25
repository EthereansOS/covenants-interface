import { useState } from 'react';
import { connect } from 'react-redux';
import { Coin } from '../../../../components';

const Mint = (props) => {
    const [pair, setPair] = useState("");
    const [useLpToken, setUseLpToken] = useState(false);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [firstAmount, setFirstAmount] = useState(0);
    const [secondAmount, setSecondAmount] = useState(0);

    const getLpToken = () => {
        return (
            <div className="col-12 mb-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-secondary" type="button">MAX</button>
                    </div>
                    <input type="number" class="form-control" value={lpTokenAmount} min={0} onChange={(e) => setLpTokenAmount(e.target.value)} />
                    <div class="input-group-append">
                        <span class="input-group-text" id=""> DAI/USDC</span>
                    </div>
                </div>
                <small class="form-text text-muted">Balance: 0 DAI/USDC</small>
            </div>
        )
    }

    const getMultipleTokens = () => {
        return (
            <>
                <div className="col-12 mb-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-secondary" type="button">MAX</button>
                        </div>
                        <input type="number" class="form-control" value={firstAmount} min={0} onChange={(e) => setFirstAmount(e.target.value)} />
                        <div class="input-group-append">
                            <span class="input-group-text" id=""><Coin /> DAI</span>
                        </div>
                    </div>
                    <small class="form-text text-muted">Balance: 0 DAI</small>
                </div>
                <div className="col-12 mb-2">
                    <p><b>And</b></p>
                </div>
                <div className="col-12 mb-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-secondary" type="button">MAX</button>
                        </div>
                        <input type="number" class="form-control" value={secondAmount} min={0} onChange={(e) => setSecondAmount(e.target.value)} />
                        <div class="input-group-append">
                            <span class="input-group-text" id=""><img className="mr-2" src="https://assets.trustwalletapp.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" height={24} /> USDC</span>
                        </div>
                    </div>
                    <small class="form-text text-muted">Balance: 0 USDC</small>
                </div>
            </>
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