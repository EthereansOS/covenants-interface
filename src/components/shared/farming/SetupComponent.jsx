import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const SetupComponent = (props) => {
    const { className, setup, manage, farm, redeem } = props;
    const [open, setOpen] = useState(false);

    const getSetupMetadata = (setup) => {
        // TODO update with real contract metadata retrieval
        return {
            type: 'Free farm',
            mainToken: null,
            secondaryToken: null,
            rewardToken: null,
            sharedRewardFrom: 'Uniswap V2',
            mainTokenLiquidity: 10,
            secondaryTokenLiquidity: 1000,
            estimated: '1 SSJ/block = 1 ETH + 1,000 BUIDL'
        }
    }

    const metadata = getSetupMetadata(setup);

    const getButton = () => {
        if (open) {
            return <button className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>;
        } else {
            if (manage) {
                return <button className="btn btn-secondary" onClick={() => setOpen(true)}>Manage</button>;
            } else if (farm) {
                return <button className="btn btn-secondary" onClick={() => setOpen(true)}>Farm</button>;
            } else if (redeem) {
                return <button className="btn btn-warning" onClick={() => setOpen(true)}>Redeem</button>;
            } else {
                return <div/>
            }
        }
    }

    const getAdvanced = () => {
        if (manage) {
            return getManageAdvanced();
        } else if (farm) {
            return getFarmAdvanced();
        } else if (redeem) {
            return getRedeemAdvanced();
        }
        return <div/>
    }

    const getManageAdvanced = () => {
        return <div className="row">
            <hr/>
        </div>
    }

    const getFarmAdvanced = () => {
        return <div className="row">
            <hr/>   
        </div>
    }

    const getRedeemAdvanced = () => {
        return <div className="row">
            <hr/>
        </div>
    }

    return (
        <div className={className}>
            <div className={`card farming-card`}>
                <div className="card-body">
                    <div className="row px-2 farming-component-main-row">
                        <div className="col-12 col-md-4 setup-component-main-col">
                            <div className="row mb-4">
                                <h5><b>{metadata.type}</b></h5>
                            </div>
                            <div className="row mb-4">
                                <Coin address={metadata.mainToken} /> + <Coin address={metadata.secondaryToken} className="mx-2" /> = 10 <Coin address={metadata.rewardToken} className="mx-2" />/block
                            </div>
                            <div className="row">
                                <p className="mb-0 setup-component-small-p"><b>Shared reward</b>: {metadata.sharedRewardFrom}</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 setup-component-main-col align-items-end">
                            <div className="row mb-4">
                                <div className="col-12">
                                    <p className="mb-0 setup-component-small-p"><b>Liquidity</b>: {metadata.mainTokenLiquidity} ETH + {metadata.secondaryTokenLiquidity} BUIDL</p>
                                </div>
                                <div className="col-12">
                                    <p className="mb-0 setup-component-small-p"><b>Estimated</b> - {metadata.estimated}</p>
                                </div>
                            </div>
                            <div className="row mt-4">
                                { getButton() }
                            </div>
                        </div>
                    </div>
                    {
                        open ? getAdvanced() : <div/>
                    }
                </div>
            </div>
        </div>
    )
}

SetupComponent.propTypes = {
    className: PropTypes.string,
    contract: PropTypes.any.isRequired,
    goBack: PropTypes.bool,
    hasBorder: PropTypes.bool
};

export default SetupComponent;