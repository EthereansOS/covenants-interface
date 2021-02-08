import { PageContainer } from "../../components";
import homeBazaarImage from '../../assets/images/5.png';
import { Route, Switch } from "react-router-dom";
import BazaarDapp from './dapp/dapp';

const lorem = 'Take a walk through the Bazar, bustling with busy DeFi creatures, and browse a mélange of services making creative use of the Aggregator. Mint, burn and create your very own Index Tokens. Conduct on-chain, cross-AMM arbitrage and multi-Swaps.';

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
                <PageContainer image={homeBazaarImage} imageHeight={300} text={lorem} launchDapp={false} title={"Bazaar"} buttonText={"Coming soon"} />
            </Route>
        </Switch>
    )
}

export default Bazaar;