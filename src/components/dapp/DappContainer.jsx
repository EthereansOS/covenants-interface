import { connect } from 'react-redux';
import { menu } from '../shared';
import { selectIndex, toggleDappLaunch } from '../../store/actions';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { LiquidityMining, USD, FixedInflation } from './components';

const DappContainer = (props) => {
    const match = useRouteMatch();

    return (
        <section className="main-container">
            <article className="main-container-top-row">
                <ul>
                    {
                        menu.map(
                            (menuItem, i) => (
                                <Link className="dapp-container-link" to={`/dapp/${menuItem.name.toLowerCase()}`}>
                                    <li key={menuItem.name} style={{ fontWeight: props.selectedIndex === i ? 'bold' : 'initial' }} onClick={() => props.selectIndex(i)}>
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