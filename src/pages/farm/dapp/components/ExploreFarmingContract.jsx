import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { FarmingComponent, SetupComponent } from '../../../../components';

const setups = [
    {
        type: 'Free farm',
        mainToken: null,
        secondaryToken: null,
        rewardToken: null,
        sharedRewardFrom: 'Uniswap V2',
        mainTokenLiquidity: 10,
        secondaryTokenLiquidity: 1000,
        estimated: '1 SSJ/block = 1 ETH + 1,000 BUIDL',
        manage: true,
    },
    {
        type: 'Free farm',
        mainToken: null,
        secondaryToken: null,
        rewardToken: null,
        sharedRewardFrom: 'Uniswap V2',
        mainTokenLiquidity: 10,
        secondaryTokenLiquidity: 1000,
        estimated: '1 SSJ/block = 1 ETH + 1,000 BUIDL',
        redeem: true,
    },
    {
        type: 'Free farm',
        mainToken: null,
        secondaryToken: null,
        rewardToken: null,
        sharedRewardFrom: 'Uniswap V2',
        mainTokenLiquidity: 10,
        secondaryTokenLiquidity: 1000,
        estimated: '1 SSJ/block = 1 ETH + 1,000 BUIDL',
        farm: true,
    }
];

const ExploreFarmingContract = (props) => {
    const { address } = useParams();
    const [farmingSetups, setFarmingSetups] = useState(setups);

    const getContractMetadata = (address) => {
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

    const metadata = getContractMetadata(address);

    return (
        <div className="explore-farming-contract-component">
            <div className="row">
                <FarmingComponent goBack={true} />
            </div>
            <div className="row">
                {
                    farmingSetups.map((farmingSetup) => {
                        return (
                            <SetupComponent className="col-12 mb-4" setup={farmingSetup} manage={farmingSetup.manage} redeem={farmingSetup.redeem} farm={farmingSetup.farm} hasBorder />
                        )
                    })
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(ExploreFarmingContract);