import { PageContainer } from "../../components";
import homeBazaarImage from '../../assets/images/home-bazaar.png';
import { Route, Switch } from "react-router-dom";
import BazaarDapp from './dapp/dapp';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Bazaar = () => {
    return (
        <Switch>
            <Route path="/bazaar/dapp">
                <BazaarDapp />
            </Route>
            <Route path="/bazaar/">
                <PageContainer image={homeBazaarImage} imageHeight={300} text={lorem} launchDapp={true} title={"Bazaar"} link={"/bazaar/dapp"} />
            </Route>
        </Switch>
    )
}

export default Bazaar;