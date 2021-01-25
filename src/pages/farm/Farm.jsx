import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/dragon.png';
import { Route, Switch } from "react-router-dom";
import FarmDapp from './dapp/dapp';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Farm = () => {
    return (
        <Switch>
            <Route path="/farm/dapp">
                <FarmDapp />
            </Route>
            <Route path="/farm/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={true} title={"Farm"} link={"/farm/dapp"} />
            </Route>
        </Switch>
    )
}

export default Farm;