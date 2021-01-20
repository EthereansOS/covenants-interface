import { Switch, Route } from 'react-router-dom';
import { Header, HomeContainer, DappContainer } from './components';

const App = () => {

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

export default App;
