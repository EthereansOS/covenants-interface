import { useState, useEffect } from 'react';
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
    const [farmingSetups, setFarmingSetups] = useState([]);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        getContractMetadata()
    }, []);

    const getContractMetadata = async () => {
        const lmContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('liquidityMiningABI'), address);
        const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
        setContract(lmContract);
        const setups = await lmContract.methods.setups().call();
        setFarmingSetups(setups.map((setup) => { return {...setup, rewardTokenAddress }}));
    }

    return (
        <div className="explore-farming-contract-component">
            {
                contract ? 
                <div className="row">
                    <FarmingComponent dfoCore={props.dfoCore} contract={contract} goBack={true} />
                </div> : <div/>
            }
            <div className="row">
                {
                    farmingSetups.length > 0 ? farmingSetups.map((farmingSetup) => {
                        return (
                            <SetupComponent className="col-12 mb-4" dfoCore={props.dfoCore} setup={farmingSetup} hasBorder />
                        )
                    }) : <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
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