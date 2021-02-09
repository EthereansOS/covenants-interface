import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/4.png';
import { Route, Switch } from "react-router-dom";
import CraftingDapp from './dapp/dapp';

const lorem = 'Covenant wizards have made a breakthrough in the science of liquidity. Ethereans can now Craft it at the molecular level, allowing for more deeply programmable pools than ever thought possible.\nAlready, a crack team of entrepreneurial penguins have innovated Craftable Initial Liquidity Offerings (ILOs). Projects can use these to provide initial liquidity for tokens, secure it from Sniper bots and more.\nThe Wizard scientists will be publishing their latest findings soon. In the meantime, you can read their first report here ';

const Crafting = () => {
    return (
        <Switch>
            {
                /*
                    <Route path="/crafting/dapp">
                        <CraftingDapp />
                    </Route>
                */
            }
            <Route path="/crafting/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={false} title={"Crafting"} buttonText={"Coming soon"} />
            </Route>
        </Switch>
    )
}

export default Crafting;