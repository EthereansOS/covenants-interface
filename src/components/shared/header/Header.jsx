import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore } from '../../../store/actions';
import map from '../../../assets/images/map.svg';
import diamond from '../../../assets/images/diamond.svg';
import wizardLogo from '../../../assets/images/wizard.svg';
import { default as context } from '../../../data/context.json';
import { Link } from 'react-router-dom';

const Header = (props) => {

    /**
     * initializes the DFOCore object and sets it in the state.
     */
    async function connectCore() {
      const core = new DFOCore(context);
      await core.init();
      props.setCore(core);
    }

    /**
     * removes the DFOCore object from the state.
     */
    function disconnectCore() {
        props.removeCore();
    }

    /**
     * formats the given address string to fit it inside the button.
     * @param address ethereum address to format for the button.
     */
    function formatAddress(address) {
        return `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`;
    }

    return (
        <section className="main-header">
            <article className="main-header-logo">
                <Link to={"/"}>
                    <img src={wizardLogo} alt="" height={50} />
                </Link>
                <h2>Covenants</h2>
            </article>
            <article className="main-header-connect">
                <img src={map} alt="" height={36} />
                {
                    props.dfoCore ? <button className="connect-button" onClick={() => disconnectCore()}>{formatAddress(props.dfoCore.address)}</button> : <button className="connect-button" onClick={() => connectCore()}>Connect</button>
                }
                <img src={diamond} alt="" height={36} />
            </article>
        </section>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCore: (dfoCore) => dispatch(setDFOCore(dfoCore)),
        removeCore: () => dispatch(removeDFOCore()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);