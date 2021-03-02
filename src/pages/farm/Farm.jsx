import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/2.png';
import { Route, Switch, useParams } from "react-router-dom";
import FarmDapp from './dapp/dapp';

const lorem = 'Ethereans love to farm. They do it all day and night—apes, penguins and wizards alike. But farming in DeFi is not always well-managed, and the hard-earned harvests of farmers are often at risk. Covenant farming contracts allow us to farm safely and on our own terms. Anyone can host or participate in Free and Locked setups that pool tokens across multiple AMMs at once, and even free-locked hybrids using the Load Balancer.';

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