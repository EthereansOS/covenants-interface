import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/dragon.png';
import { Route, Switch } from "react-router-dom";
import InflationDapp from './dapp/dapp';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Inflation = () => {
    return (
        <Switch>
            <Route path="/inflation/dapp">
                <InflationDapp />
            </Route>
            <Route path="/inflation/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={true} title={"Inflation"} link={"/inflation/dapp"} />
            </Route>
        </Switch>
    )
}

export default Inflation;