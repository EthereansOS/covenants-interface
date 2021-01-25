import { Switch, Route } from 'react-router-dom';
import { Header, Footer, PageNotFound, Sidemenu } from './components';
import { ArbitragePage, BazaarPage, CraftingPage, GrimoirePage, MorePage, IndexPage, MultiswapPage, FarmPage, InflationPage, WUSDPage } from './pages';

const App = () => {

  return (
    <div className="app">
      <Header />
      <div className="container app-container">
        <div className="row app-row w-100 align-items-center">
          <div className="col-md-2 col-12">
            <Sidemenu />
          </div>
          <div className="col-md-10 col-12">
          <Switch>
          <Route path="/arbitrage">
            <ArbitragePage />
          </Route>
          <Route path="/bazaar">
            <BazaarPage />
          </Route>
          <Route path="/crafting">
            <CraftingPage />
          </Route>
          <Route path="/grimoire">
            <GrimoirePage />
          </Route>
          <Route path="/farm">
            <FarmPage />
          </Route>
          <Route path="/more">
            <MorePage />
          </Route>
          <Route path="/multiswap">
            <MultiswapPage />
          </Route>
          <Route path="/inflation">
            <InflationPage />
          </Route>
          <Route path="/wusd">
            <WUSDPage />
          </Route>
          <Route path="/">
            <IndexPage />
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
  
}

export default App;
