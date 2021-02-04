import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore, setMagicVisualMode, removeMagicVisualMode } from '../../../store/actions';
import map from '../../../assets/images/map.svg';
import diamond from '../../../assets/images/diamond.svg';
import wizardLogo from '../../../assets/images/wizard.svg';
import { default as context } from '../../../data/context.json';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = (props) => {
    const [address, setAddress] = useState(null);

    if (props.dfoCore) {
        props.dfoCore.provider.on('accountsChanged', (accounts) => {
            setAddress(formatAddress(accounts[0]));
        })
    }

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
        <nav className="navbar navbar-light bg-transparent">
            <div className="container-fluid">
                <Link to={"/"} className="navbar-brand">
                    <img src={wizardLogo} alt="" height={50} />
                    <span className="mx-3"><b>Covenants</b></span>
                </Link>
                <div className="d-flex">
                    {props.dfoCore && !props.magicMode && <button className="btn btn-primary mx-4" onClick={props.setMagicMode}>Magic</button>}
                    {props.dfoCore && props.magicMode && <button className="btn btn-primary mx-4" onClick={props.removeMagicMode}>Penguin</button>}
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
    return { dfoCore: core.dfoCore, magicMode: core.magicMode };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCore: (dfoCore) => {
            document.body.className = `${!dfoCore ? 'fantasy' : window.localStorage.magicMode === "true" ? 'magic' : 'penguin'}`;
            dispatch(setDFOCore(dfoCore))
        },
        removeCore: () => {
            document.body.className = "fantasy";
            dispatch(removeDFOCore())
        },
        setMagicMode : () => {
            window.localStorage.setItem("magicMode", true);
            document.body.className = "magic";
            dispatch(setMagicVisualMode())
        },
        removeMagicMode : () => {
            window.localStorage.removeItem("magicMode", true);
            document.body.className = "penguin";
            dispatch(removeMagicVisualMode())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);