import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { Header, HomeContainer, DappContainer } from './components';

function App(props) {

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/dapp">
          <DappContainer />
        </Route>
        <Route path="/">
          <HomeContainer />
        </Route>
      </Switch>
    </div>
  );
  
}

function mapStateToProps(state) {
  const { session } = state;
  const { dappLaunched } = session;
  return { dappLaunched };
}

export default connect(mapStateToProps)(App);
