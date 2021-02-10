import { PageContainer } from "../../components";
import homeBazaarImage from '../../assets/images/5.png';
import { Route, Switch } from "react-router-dom";
import BazaarDapp from './dapp/dapp';

const lorem = 'Take a walk through the Bazar, bustling with busy DeFi creatures. Here you can mint, burn and create your very own Index Tokens, or make creative use of the Aggregator by conducting on-chain cross-AMM arbitrage and multi-swaps.';

const Bazaar = () => {
    return (
        <Switch>
            {
                /*
                    <Route path="/bazaar/dapp">
                        <BazaarDapp />
                    </Route>
                */
            }
            <Route path="/bazaar/">
                <PageContainer image={homeBazaarImage} imageHeight={300} text={lorem} launchDapp={false} title={"Bazar"} buttonText={"Coming soon"} />
            </Route>
        </Switch>
    )
}

export default Bazaar;