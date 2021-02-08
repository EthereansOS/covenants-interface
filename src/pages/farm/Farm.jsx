import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/2.png';
import { Route, Switch, useParams } from "react-router-dom";
import FarmDapp from './dapp/dapp';

const lorem = 'Ethereans love to farm. They do it all day and—apes, penguins and wizards alike. But farming in the State of DeFi is not so well-managed, and the hard-earned harvests of farmers are often at risk.Covenants free Ethereans to farm safely and on their own terms. Anyone can host or participate in free and locked setups that access multiple AMMs at once, and The Aggregator secures interaction with each.';

const Farm = () => {

    return (
        <Switch>
            {
                /* 
                    <Route path="/farm/dapp">
                        <FarmDapp />
                    </Route>
                */
            }
            <Route path="/farm/">
                <PageContainer image={dragonImage} imageHeight={300} text={lorem} launchDapp={false} title={"Farm"} buttonText={"Coming soon"} />
            </Route>
        </Switch>
    )
}

export default Farm;