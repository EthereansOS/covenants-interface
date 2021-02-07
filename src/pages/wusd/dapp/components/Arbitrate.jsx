import { connect } from 'react-redux';

const Arbitrate = (props) => {
    return (
        <div className="dapp-container">
            <div className="row">
                <div className="col-12 dapp-col text-center justify-content-center">
                    <p>Coming soon!</p>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Arbitrate);