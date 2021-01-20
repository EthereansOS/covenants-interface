import { connect } from 'react-redux';
import { menu } from '../shared';
import { selectIndex, toggleDappLaunch } from '../../store/actions';
import { Link } from 'react-router-dom';

const DappContainer = (props) => {
    return (
        <section className="main-container">
            <article className="main-container-top-row">
                <ul>
                    {
                        menu.map(
                            (menuItem, i) => (
                                <li key={menuItem.name} style={{ fontWeight: props.selectedIndex === i ? 'bold' : 'initial' }} onClick={() => props.selectIndex(i)}>
                                    <img src={menuItem.asset.default} alt="" height={30} />
                                    <span>{menuItem.name}</span>
                                </li>
                            )
                        )
                    } 
                </ul>
                <div className="main-container-section">
                    
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