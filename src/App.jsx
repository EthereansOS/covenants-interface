import { connect } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Header, Footer, PageNotFound, Sidemenu, Transactions } from './components';
import { ArbitragePage, BazaarPage, CraftingPage, GrimoirePage, MorePage, IndexPage, MultiswapPage, FarmPage, InflationPage, WUSDPage } from './pages';
import { useEffect } from 'react/cjs/react.development';

const mapStateToProps = (state) => {
  const { core } = state;
  return { dfoCore: core.dfoCore, magicMode: core.magicMode };
}

const App = (props) => {
  const location = useLocation();

  useEffect(() => {
    
    if (location.pathname.includes('/dapp')) {
      document.body.className = `${window.localStorage.magicMode === "true" ? 'magic' : 'penguin'}`;
    } else {
      document.body.className = `fantasy`;
    }
  }, [location]);

  if (props.dfoCore) {
      props.dfoCore.provider.on('accountsChanged', (accounts) => {
          window.location.reload();
      })
      props.dfoCore.provider.on('chainChanged', (chainId) => {
         window.location.reload();
      })
  }

  useEffect(() => {
    console.log('updating.');
  }, []);

  return (
    <div className={`app`}>
      <Transactions />
      <Header />
      <div className="container app-container">
        <div className="row app-row w-100 align-items-start">
          <div className="col-md-2 col-12 flex align-items-center justify-content-center">
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

export default connect(mapStateToProps)(App);
