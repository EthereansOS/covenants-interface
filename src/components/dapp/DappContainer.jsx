/*
import { connect } from 'react-redux';
import { selectIndex, toggleDappLaunch } from '../../store/actions';
import { Link, Switch, Route, useRouteMatch, useLocation } from 'react-router-dom';
import { LiquidityMining, USD, FixedInflation } from './pages';

const DappContainer = (props) => {
    const match = useRouteMatch();
    const location = useLocation();

    return (
        <section className="main-container">
            <article className="main-container-top-row">
                <div className="container pre-main-container-section">
                    <ul className="main-container-nav">
                        {
                            menu.map(
                                (menuItem, i) => (
                                    <Link key={menuItem.name} className="dapp-container-link" to={`/dapp/${menuItem.name.toLowerCase()}`}>
                                        <li className="main-container-nav-item" key={menuItem.name} style={{ fontWeight: location.pathname === `/dapp/${menuItem.name.toLowerCase()}` ? 'bold' : 'initial' }} onClick={() => props.selectIndex(i)}>
                                            <img src={menuItem.asset.default} alt="" height={30} />
                                            <span>{menuItem.name}</span>
                                        </li>
                                    </Link>
                                )
                            )
                                } 
                    </ul>
                    <Switch>
                        <Route path={`${match.path}/farm`}>
                            <LiquidityMining />
                        </Route>
                        <Route path={`${match.path}/inflation`}>
                            <FixedInflation />
                        </Route>
                        <Route path={`${match.path}/usd`}>
                            <USD />
                        </Route>
                    </Switch>
                </div>
            </article>
            <article className="main-container-top-row">
                <Link to={"/"}>
                    <button className="launch-dapp-button" disabled={props.dfoCore ? false : true}>Go back</button>
                </Link>
            </article>
        </section>
    )
}


const mapStateToProps = (state) => {
    const { session, core } = state;
    const { dfoCore } = core;
    const { dappLaunched, selectedIndex } = session;
    return { dappLaunched, selectedIndex, dfoCore };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        goBack: () => dispatch(toggleDappLaunch()),
        selectIndex: (index) => dispatch(selectIndex(index)),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(DappContainer);
*/