import { useState } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';

const USDN = (props) => {
    const [redAmount, setRedAmount] = useState(0);
    const [blueAmount, setBlueAmount] = useState(0);

    const getRedInput = () => {
        return (
            <>
            <div className="col-12 mb-4">
                <Input showMax={true} value={redAmount} balance={1000} min={0} onChange={(e) => setRedAmount(e.target.value)} showCoin={true} showBalance={true} name="Red WUSDN" />
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
                        <ApproveButton onError={(error) => console.log(error)} onApproval={() => console.log('success')} />
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-secondary">Redeem</button>
                    </div>
                </div>
            </div>
        )
    }

    const getBlueInput = () => {
        return (
            <>
                <div className="col-12 mb-4">
                    <Input showMax={true} value={blueAmount} balance={1000} min={0} onChange={(e) => setBlueAmount(e.target.value)} showCoin={true} showBalance={true} name="Blue WUSDN" />
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
                        <ApproveButton onError={(error) => console.log(error)} onApproval={() => console.log('success')} />
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-secondary">Redeem</button>
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