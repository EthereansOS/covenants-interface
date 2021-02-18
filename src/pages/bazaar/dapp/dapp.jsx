import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore } from '../../../store/actions';
import { default as context } from '../../../data/context.json';
import { useState } from 'react';
import { DappMenu } from '../../../components';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Arbitrage, Explore, Multiswap, ExploreIndexToken } from './components';

const Dapp = (props) => {
    const history = useHistory();
    const [currentTab, setCurrentTab] = useState('explore');

    const connectCore = async () => {
        const core = new DFOCore(context);
        await core.init();
        props.setCore(core);
    }

    const setTab = (name) => {
        history.replace('/bazaar/dapp');
        setCurrentTab(name);
    }

    const getContent = () => {
        switch (currentTab) {
            case 'explore':
                return <Explore />;
            case 'arbitrage':
                return <Arbitrage />;
            case 'multiswap':
                return <Multiswap />;
            default:
                return <div/>;
        }
    }

    if (!props.dfoCore || !props.dfoCore.initialized || !props.dfoCore.address || props.dfoCore.address === props.dfoCore.voidEthereumAddress) {
        return (
            <div className="dapp-container">
                <div className="row">
                    <div className="col-12 dapp-col text-center justify-content-center">
                        <p className="Web3">You need a <a target="_blank" href="https://etherscan.io/directory/Wallet">web3-enabler</a> to use this Dapp - If you have problems connecting, refresh the page.</p>
                        <button className="ConnectBTN" onClick={() => connectCore()}>Connect</button>
                    </div>
                </div>
                <div className="FooterP">
                <p>Covenants is an <a href="https://ethereansos.eth.link">EthOS</a> research and development project. <b>Use it at your own risk!</b> This protocol is ruled by the <a href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a>  a fully decentralized organization that operates 100% on-chain without the involvement of any legal entity. If you find a bug, please notify us on our <a href="https://github.com/b-u-i-d-l">Github</a></p>
                </div>
            </div>
        )
    }

    return (
        <div className="dapp-container">
            <div className="row" style={{flexDirection: 'column'}}>
                <div className="col-12 dapp-col text-center">
                    <DappMenu className="wusd-dapp-menu" onClick={(name) => setTab(name)} currentTab={currentTab} options={['Explore', 'Arbitrage', 'Multiswap']} />
                    <div className="wusd-dapp-content mt-4">
                        <Switch>
                            <Route path="/bazaar/dapp/:address">
                                <ExploreIndexToken />
                            </Route>
                            <Route path="/bazaar/dapp">
                                { getContent() }
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
            <div className="FooterP">
            <p>Covenants is an <a href="https://ethereansos.eth.link">EthOS</a> research and development project. <b>Use it at your own risk!</b> This protocol is ruled by the <a href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a>  a fully decentralized organization that operates 100% on-chain without the involvement of any legal entity. If you find a bug, please notify us on our <a href="https://github.com/b-u-i-d-l">Github</a></p>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCore: (dfoCore) => {
            dispatch(setDFOCore(dfoCore));
        },
        removeCore: () => dispatch(removeDFOCore()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);