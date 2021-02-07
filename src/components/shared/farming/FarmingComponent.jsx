import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FarmingComponent = (props) => {
    const { className, dfoCore, contract, goBack, hasBorder, hostedBy } = props;
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        getContractMetadata();
    }, []);

    const getContractMetadata = async () => {
        const rewardTokenAddress = await contract.methods._rewardTokenAddress().call();
        const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), rewardTokenAddress);
        const symbol = await rewardToken.methods.symbol().call();
        const extensionAddress = await contract.methods._extension().call();
        const extensionContract = await dfoCore.getContract(dfoCore.getContextElement('LiquidityMiningExtensionABI'), extensionAddress);
        const { host, byMint } = await extensionContract.methods.data().call();
        
        const setups = await contract.methods.setups().call();
        const freeSetups = setups.filter((setup) => setup.free).length;
        const lockedSetups = setups.length - freeSetups;

        const { data } = await axios.get(dfoCore.getContextElement("coingeckoCoinPriceURL") + rewardTokenAddress);
        console.log(data);
        const rewardTokenPriceUsd = data[rewardTokenAddress.toLowerCase()].usd;
        const yearlyBlocks = 36000;

        let valueLocked = 0;
        let rewardPerBlock = 0;
        await Promise.all(setups.map(async (setup) => {
            console.log(setup);
            rewardPerBlock += parseInt(setup.rewardPerBlock);
            console.log(dfoCore.toDecimals(setup.currentStakedLiquidity, 18, 18));
            if (setup.free) {
                valueLocked += parseInt(dfoCore.toDecimals(setup.totalSupply, 18, 18));
            } else {
                console.log(setup.currentStakedLiquidity);
                valueLocked += parseInt(dfoCore.toDecimals(setup.currentStakedLiquidity, 18, 18));
            }
        }))

        const apy = (rewardPerBlock * rewardTokenPriceUsd * yearlyBlocks * 100) / valueLocked;
        console.log(apy);
        
        await Promise.all(setups.map(async (setup) => {
            const { rewardPerBlock } = setup;
            console.log(rewardPerBlock);
        }))

        setMetadata({
            name: `Farm ${symbol}`,
            contractAddress: contract.options.address,
            rewardTokenAddress: rewardToken.options.address,
            apy: `${dfoCore.toFixed(apy)}% yearly`,
            valueLocked: `$ 0`,
            rewardPerBlock: `${(dfoCore.toDecimals(dfoCore.toFixed(rewardPerBlock).toString()))} ${symbol}`,
            byMint,
            freeSetups,
            lockedSetups,
            host: `${host.substring(0, 5)}...${host.substring(host.length - 3, host.length)}`,
        });
    }

    return (
        <div className={className}>
            <div className={`card farming-card primary-farming-card ${!hasBorder ? "no-border" : ""}`}>
                <div className="card-body">
                    <div className="row px-2 farming-component-main-row">
                        {
                            metadata ? <>
                            <div className="col-12 col-md-3 farming-component-main-col">
                                <div className="row mb-2">
                                    <Coin address={metadata.rewardTokenAddress} /> <h6><b>{metadata.name}</b></h6>
                                </div>
                                <div className="row">
                                    <Link to={ goBack ? `/farm/dapp/` : `/farm/dapp/${metadata.contractAddress}`} className="btn btn-secondary btn-sm">{ goBack ? "Back" : "Enter" }</Link>
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <div className="row">
                                    <p className="farming-component-paragraph"><b>Returns (APY)</b>: {metadata.apy}</p>
                                    <p className="farming-component-paragraph"><b>Rewards/block</b>: {metadata.rewardPerBlock}</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="row">
                                    <p className="farming-component-paragraph"><b>Rewards</b>: {metadata.byMint ? "By mint" : "By reserve"}</p>
                                    <p className="farming-component-paragraph"><b>Setups (f/l)</b>: {metadata.freeSetups} | {metadata.lockedSetups}</p>
                                    <p className="farming-component-paragraph"><b>Hosted</b>: {metadata.host}</p>
                                </div>
                            </div>
                            </> : <div className="col-12 justify-content-center">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FarmingComponent;