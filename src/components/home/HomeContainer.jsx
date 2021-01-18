import { connect } from 'react-redux';
import { selectIndex, toggleDappLaunch } from '../../store/actions';
import { menu } from '../shared';

function HomeContainer(props) {

    return (
        <section className="main-container">
            <article className="main-container-top-row">
                <div className="container pre-main-container-section">
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
                        <div className="main-container-section-content">
                            <div className="main-container-section-content-description">
                                <h1><b>{menu[props.selectedIndex].name}</b></h1>
                                <p>{ menu[props.selectedIndex].description }</p>
                            </div>
                            <img className="main-container-section-content-image" src={menu[props.selectedIndex].descriptionAsset.default} alt="" height={400} width={302} />
                        </div>
                    </div>
                </div>
            </article>
            <article className="main-container-top-row">
                <button onClick={() => props.dfoCore ? props.launchDapp() : console.log('not enabled.')} className="launch-dapp-button" disabled={props.dfoCore ? false : true}>Launch DAPP</button>
            </article>
        </section>
    )
}

function mapStateToProps(state) {
  const { session, core } = state;
  const { dfoCore } = core;
  const { dappLaunched, selectedIndex } = session;
  return { dappLaunched, selectedIndex, dfoCore };
}

function mapDispatchToProps(dispatch) {
    return {
        launchDapp: () => dispatch(toggleDappLaunch()),
        selectIndex: (index) => dispatch(selectIndex(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);