import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore, setMagicVisualMode, removeMagicVisualMode, toggleSidemenu } from '../../../store/actions';
import map from '../../../assets/images/map.svg';
import diamond from '../../../assets/images/ethereum.png';
import wizardLogo from '../../../assets/images/covlogo.png';
import { default as context } from '../../../data/context.json';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = (props) => {
    const [address, setAddress] = useState(null);
    const location = useLocation();

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
                <Link to={"/"} onClick={() => document.body.className = "fantasy"} className="navbar-brand">
                    <span  className="LogoM" src={wizardLogo} alt=""></span>
                    <span className="mx-3 TitleCov"><b>Covenants</b></span>
                </Link>
                <div className="d-flex">
                    {location.pathname.includes('/dapp') && !window.localStorage.magicMode && <a className="ChangeMod" onClick={props.setMagicMode}>&#10024;</a>}
                    {location.pathname.includes('/dapp') && window.localStorage.magicMode && <a className="ChangeMod" onClick={props.removeMagicMode}>&#128188;</a>}
                    {
                        props.dfoCore ? <a className="BtnConnectAfter" onClick={() => disconnectCore()}>{formatAddress(props.dfoCore.address)}</a> : <a className="BtnConnect" onClick={() => connectCore()}>Connect</a>
                    }
                    <img className="menuIconEth" src={diamond} alt=""/>
                </div>
                <a onClick={() => props.toggleSidemenu()}>Toggle</a>
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
        setCore: (dfoCore) => dispatch(setDFOCore(dfoCore)),
        removeCore: () => dispatch(removeDFOCore()),
        setMagicMode: () => {
            window.localStorage.setItem("magicMode", true);
            document.body.className = "magic";
            dispatch(setMagicVisualMode())
        },
        removeMagicMode: () => {
            window.localStorage.removeItem("magicMode", true);
            document.body.className = "penguin";
            dispatch(removeMagicVisualMode())
        },
        toggleSidemenu: () => dispatch(toggleSidemenu())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);