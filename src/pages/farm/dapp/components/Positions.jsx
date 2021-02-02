import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SetupComponent } from '../../../../components';

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
        manage: true,
    }
];

const Positions = (props) => {
    const [farmingSetups, setFarmingSetups] = useState([]);

    useEffect(() => {
        getPositions();
    }, []);

    const getPositions = async () => {
        await props.dfoCore.loadPositions();
    }

    return (
        <div className="positions-component">
            <div className="row mb-4">
                {
                    farmingSetups.map((farmingSetup) => {
                        return (
                            <SetupComponent className="col-12 mb-4" setup={farmingSetup} dfoCore={props.dfoCore} manage={farmingSetup.manage} redeem={farmingSetup.redeem} farm={farmingSetup.farm} hasBorder />
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

export default connect(mapStateToProps)(Positions);