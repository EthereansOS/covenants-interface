import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FarmingComponent = (props) => {
    const { className, dfoCore, contract, goBack, hasBorder, hostedBy } = props;
    const [metadata, setMetadata] = useState(null);

    console.log(contract);

    useEffect(() => {
        getContractMetadata();
    }, []);

    const getContractMetadata = async () => {
        const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), await contract.methods._rewardTokenAddress().call());
        const symbol = await rewardToken.methods.symbol().call();
        const extensionAddress = await contract.methods._extension().call();
        const extensionContract = await dfoCore.getContract(dfoCore.getContextElement('LiquidityMiningExtensionABI'), extensionAddress);
        const { host, byMint } = await extensionContract.methods.data().call();

        const setups = await contract.methods.setups().call();
        const freeSetups = setups.filter((setup) => setup.free).length;
        const lockedSetups = setups.length - freeSetups;
        const { data } = await axios.get(dfoCore.getContextElement("coingeckoEthereumPriceURL"));
        const [ ethData ] = data;

        let rewardPerBlock = 0;
        await Promise.all(setups.map(async (setup) => {
            rewardPerBlock += parseInt(setup.rewardPerBlock);
        }))
        const uniswapV2Router = await dfoCore.getContract(dfoCore.getContextElement('uniswapV2RouterABI'), dfoCore.getContextElement('uniswapV2RouterAddress'));
        console.log(setups);
        let valueLocked = 0;
        await Promise.all(setups.map(async (setup) => {
            if (parseInt(setup.totalSupply) === 0 || parseInt(setup.currentStakedLiquidity) === 0) return;
            const amounts = await uniswapV2Router.methods.getAmountsOut(setup.totalSupply, [dfoCore.getContextElement('wethTokenAddress'), setup.liquidityPoolTokenAddress]).call();
            console.log(amounts);
            valueLocked += setup.free ? parseInt(setup.totalSupply) : parseInt(setup.currentStakedLiquidity);
        }))
        valueLocked = valueLocked * ethData.current_price;

        setMetadata({
            name: `Farm ${symbol}`,
            contractAddress: contract.options.address,
            rewardTokenAddress: rewardToken.options.address,
            apy: '10% yearly',
            valueLocked: `$ ${valueLocked}`,
            rewardPerBlock: `${dfoCore.toDecimals(rewardPerBlock.toString())} ${symbol}`,
            byMint,
            freeSetups,
            lockedSetups,
            host: `${host.substring(0, 5)}...${host.substring(host.length - 3, host.length)}`,
        });
    }

    return (
        <div className={className}>
            <div className={`card farming-card ${!hasBorder ? "no-border" : ""}`}>
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
                                    <p className="farming-component-paragraph"><b>Value locked</b>: {metadata.valueLocked}</p>
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