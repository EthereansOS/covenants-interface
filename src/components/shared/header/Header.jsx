import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore } from '../../../store/actions';
import map from '../../../assets/images/map.svg';
import diamond from '../../../assets/images/diamond.svg';
import wizardLogo from '../../../assets/images/wizard.svg';
import { default as context } from '../../../data/context.json';
import { Link } from 'react-router-dom';

const Header = (props) => {

    const connectCore = async () => {
      const core = new DFOCore(context);
      await core.init();
      props.setCore(core);
    }
    
    const disconnectCore = () => {
        props.removeCore();
    }

    const formatAddress = (address) => {
        return `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`;
    }

    return (
        <nav class="navbar navbar-light bg-transparent">
            <div class="container-fluid">
                <Link to={"/"} class="navbar-brand">
                    <img src={wizardLogo} alt="" height={50} />
                    <span className="mx-3"><b>Covenants</b></span>
                </Link>
                <div class="d-flex">
                    <img src={map} alt="" height={36} />
                    {
                        props.dfoCore ? <button className="btn btn-primary mx-4" onClick={() => disconnectCore()}>{formatAddress(props.dfoCore.address)}</button> : <button className="btn btn-primary mx-4" onClick={() => connectCore()}>Connect</button>
                    }
                    <img src={diamond} alt="" height={36} />
                </div>
            </div>
        </nav>
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