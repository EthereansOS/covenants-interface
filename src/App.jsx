import { connect } from 'react-redux';
import { Header, HomeContainer, DappContainer } from './components';

function App(props: any) {

  return (
    <div className="App">
      <Header />
      {
        props.dappLaunched ? <DappContainer /> : <HomeContainer />
      }
    </div>
  );
  
}

function mapStateToProps(state: any) {
  const { session } = state;
  const { dappLaunched } = session;
  return { dappLaunched };
}

export default connect(mapStateToProps)(App);
