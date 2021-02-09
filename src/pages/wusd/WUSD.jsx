import { PageContainer } from "../../components";
import wusdHomeImage from '../../assets/images/3.png';
import { Route, Switch } from "react-router-dom";
import DappWUSD from './dapp/dapp';

const lorem = 'One stablecoin to pool them all, in all the pools of DeFi. $WUSD is minted at the confluence of other stablecoins, which flow back out as its collateral into the pools of AMMs everywhere. Free from any oracle or issuer, it is the most resilient and decentralized stablecoin out there. Disclamer: You can farm it';

const WUSD = () => {
    return (
        <Switch>
            <Route path="/wusd/dapp">
                <DappWUSD />
            </Route>
            <Route path="/wusd/">
                <PageContainer image={wusdHomeImage} imageHeight={300} text={lorem} launchDapp={true} title={"Wrapped USD"} link={"/wusd/dapp"} />
            </Route>
        </Switch>
    )
}

export default WUSD;