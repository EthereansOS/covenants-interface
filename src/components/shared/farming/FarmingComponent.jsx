import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';

const FarmingComponent = (props) => {
    const { className, contract, goBack, hasBorder } = props;

    const getContractMetadata = (contract) => {
        // TODO update with real contract metadata retrieval
        return {
            name: 'Farm SSJ',
            apy: '10% yearly',
            valueLocked: '$20,000,000.05',
            rewardPerBlock: '1,000,000 SSJ',
            byMint: true,
            freeSetups: 10,
            lockedSetups: 5,
            hosted: '0x00...512',
        }
    }

    const metadata = getContractMetadata(contract);

    return (
        <div className={className}>
            <div className={`card farming-card ${!hasBorder ? "no-border" : ""}`}>
                <div className="card-body">
                    <div className="row px-2 farming-component-main-row">
                        <div className="col-12 col-md-3 farming-component-main-col">
                            <div className="row">
                                <Coin /> <h5><b>{metadata.name}</b></h5>
                            </div>
                            <div className="row">
                                <Link to={ goBack ? `/farm/dapp/` : `/farm/dapp/${metadata.hosted}`} className="btn btn-secondary btn-sm">{ goBack ? "Back" : "Enter" }</Link>
                            </div>
                        </div>
                        <div className="col-12 col-md-5">
                            <div className="row">
                                <p className="farming-component-paragraph"><b>Returns (APY)</b>: {metadata.apy}</p>
                                <p className="farming-component-paragraph"><b>Value locked</b>: {metadata.valueLocked}</p>
                                <p className="farming-component-paragraph"><b>Rewards/block</b>: {metadata.rewardPerBlock}</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="row">
                                <p className="farming-component-paragraph"><b>Rewards</b>: {metadata.byMint ? "By mint" : "By reserve"}</p>
                                <p className="farming-component-paragraph"><b>Setups (f/l)</b>: {metadata.freeSetups} | {metadata.lockedSetups}</p>
                                <p className="farming-component-paragraph"><b>Hosted</b>: {metadata.hosted}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

FarmingComponent.propTypes = {
    className: PropTypes.string,
    contract: PropTypes.any.isRequired,
    goBack: PropTypes.bool,
    hasBorder: PropTypes.bool
};

export default FarmingComponent;