import { connect } from 'react-redux';
import DFOCore from '../../../core';
import { setDFOCore, removeDFOCore } from '../../../store/actions';
import { default as context } from '../../../data/context.json';
import { useState } from 'react';
import { DappMenu } from '../../../components';
import { Create, Explore, ExploreInflationContract } from './components';
import { Switch, Route, useHistory } from 'react-router-dom';

const Dapp = (props) => {
    const history = useHistory();
    const [currentTab, setCurrentTab] = useState('explore');

    const connectCore = async () => {
        const core = new DFOCore(context);
        await core.init();
        props.setCore(core);
    }

    const setTab = (name) => {
        history.replace('/inflation/dapp');
        setCurrentTab(name);
    }

    const getContent = () => {
        switch (currentTab) {
            case 'explore':
                return <Explore />;
            case 'create':
                return <Create />;
            default:
                return <div/>;
        }
    }

    if (!props.dfoCore) {
        return (
            <div className="dapp-container">
                <div className="row">
                    <div className="col-12 dapp-col text-center justify-content-center">
                        <button className="btn btn-primary mx-4" onClick={() => connectCore()}>Connect</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dapp-container">
            <div className="row" style={{flexDirection: 'column'}}>
                <div className="col-12 dapp-col text-center">
                    <DappMenu className="wusd-dapp-menu" onClick={(name) => setTab(name)} currentTab={currentTab} options={['Explore', 'Create']} />
                    <div className="wusd-dapp-content mt-4">
                            <Switch>
                                <Route path="/inflation/dapp/:address">
                                    <ExploreInflationContract />
                                </Route>
                                <Route path="/inflation/dapp">
                                    { getContent() }
                                </Route>
                            </Switch>
                    </div>
                </div>
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
        setCore: (dfoCore) => dispatch(setDFOCore(dfoCore)),
        removeCore: () => dispatch(removeDFOCore()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);