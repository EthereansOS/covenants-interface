import { connect } from 'react-redux';

const Multiswap = (props) => {
    return (
        <div className="DisclamerRegular">
            <p><b>Coming Soon</b></p>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Multiswap);