import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/4.png';
import { Route, Switch } from "react-router-dom";
import CraftingDapp from './dapp/dapp';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Crafting = () => {
    return (
        <Switch>
            <Route path="/crafting/dapp">
                <CraftingDapp />
            </Route>
            <Route path="/crafting/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={true} title={"Crafting"} link={"/crafting/dapp"} />
            </Route>
        </Switch>
    )
}

export default Crafting;