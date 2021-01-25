import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/dragon.png';
import { Route, Switch } from "react-router-dom";
import DappWUSD from './dapp/dapp';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const WUSD = () => {
    return (
        <Switch>
            <Route path="/wusd/dapp">
                <DappWUSD />
            </Route>
            <Route path="/wusd/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={true} title={"uSD"} link={"/wusd/dapp"} />
            </Route>
        </Switch>
    )
}

export default WUSD;