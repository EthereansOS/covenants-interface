import { useState } from 'react';
import { connect } from 'react-redux';

const USDN = (props) => {
    const [redAmount, setRedAmount] = useState(0);
    const [blueAmount, setBlueAmount] = useState(0);

    const getRedInput = () => {
        return (
            <>
            <div className="col-12 mb-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-secondary" type="button">MAX</button>
                    </div>
                    <input type="number" class="form-control" value={redAmount} min={0} onChange={(e) => setRedAmount(e.target.value)} />
                    <div class="input-group-append">
                        <span class="input-group-text" id=""> Red uSDN</span>
                    </div>
                </div>
                <small class="form-text text-muted">Balance: 0 Red uSDN</small>
            </div>
            <div className="col-12 mb-4">
                <div className="row justify-content-center">
                    For
                </div>
                <div className="row justify-content-center">
                    700 uSD
                </div>
            </div>
            </>
        )
    }

    const getRedButtons = () => {
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

    const getBlueInput = () => {
        return (
            <>
                <div className="col-12 mb-4">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <button class="btn btn-secondary" type="button">MAX</button>
                        </div>
                        <input type="number" class="form-control" value={blueAmount} min={0} onChange={(e) => setBlueAmount(e.target.value)} />
                        <div class="input-group-append">
                            <span class="input-group-text" id=""> Blue uSDN</span>
                        </div>
                    </div>
                    <small class="form-text text-muted">Balance: 0 Blue uSDN</small>
                </div>
                <div className="col-12 mb-4">
                    <div className="row justify-content-center">
                        For
                    </div>
                    <div className="row justify-content-center">
                        700 uSD
                    </div>
                </div>
            </>
        )
    }

    const getBlueButtons = () => {
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
        <div className="usdn-component">
            <div className="row">
                { getRedInput() }
                { getRedButtons() }
                <div className="col-12 my-4" />
                { getBlueInput() }
                { getBlueButtons() }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(USDN);