import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const SetupComponent = (props) => {
    const { className, dfoCore, setup, manage, farm, redeem } = props;
    const [open, setOpen] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [setupTokens, setSetupTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AMM, setAMM] = useState({ name: "", version: ""});
    const [status, setStatus] = useState('farm');

    useEffect(() => {
        if (!blockNumber) {
            getSetupMetadata();
        }
    }, []);

    const getSetupMetadata = async () => {
        console.log(setup);
        setLoading(true);
        const tokens = [];
        try {
            setBlockNumber(await dfoCore.getBlockNumber());
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('ammABI'), setup.ammPlugin);
            for (let j = 0; j < setup.liquidityPoolTokenAddresses.length; j++) {
                console.log(setup.liquidityPoolTokenAddresses[j]);
                const byTokensRes = await ammContract.methods.byLiquidityPool(setup.liquidityPoolTokenAddresses[j]).call();
                console.log(dfoCore.toDecimals(byTokensRes['0']))
                for (let i = 0; i < byTokensRes['2'].length; i++) {
                    const token = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), byTokensRes['2'][i]);
                    const symbol = await token.methods.symbol().call();
                    tokens.push({ address: byTokensRes['2'][i], amount: parseFloat(dfoCore.toDecimals(byTokensRes['1'][i])), symbol, tot: parseInt(dfoCore.toDecimals(byTokensRes['0'])) });
                    console.log('done');
                }
            }
            const info = await ammContract.methods.info().call();
            setAMM(info);
            setSetupTokens(tokens);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        // TODO update with real contract metadata retrieval
        /*
        */
    }

    console.log(setupTokens);

    const getButton = () => {
        if (open) {
            return <button className="btn btn-secondary" onClick={() => setOpen(false)}>Close</button>;
        } else {
            if (status === 'manage') {
                return <button className="btn btn-secondary" onClick={() => setOpen(true)}>Manage</button>;
            } else if (status === 'farm') {
                return <button className="btn btn-secondary" onClick={() => setOpen(true)}>Farm</button>;
            } else if (status === 'redeem') {
                return <button className="btn btn-warning" onClick={() => setOpen(true)}>Redeem</button>;
            } else {
                return <div/>
            }
        }
    }

    const getAdvanced = () => {
        if (status === 'manage') {
            return getManageAdvanced();
        } else if (status === 'farm') {
            return getFarmAdvanced();
        } else if (status === 'redeem') {
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
                        { loading ? <div className="col-12 justify-content-center">
                                <div class="spinner-border text-secondary" role="status">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div> : <>
                            <div className="col-12 col-md-7 setup-component-main-col">
                                <div className="row mb-4">
                                    <h5><b>{setup.free ? "Free farming" : "Locked farming"} {(!setup.free && parseInt(setup.endBlock) <= blockNumber) && <span className="text-danger">(ended)</span>}</b></h5>
                                </div>
                                {
                                    setup.free ? <>
                                        <div className="row mb-4">
                                            {setupTokens.map((token, i) => <span key={token.address}>{i !== 0 ? '+ ' : ''}<Coin address={token.address} className="mr-2 mb-1" /> </span>)} = {dfoCore.toDecimals(setup.rewardPerBlock).substring(0, 6)} <Coin address={setup.rewardTokenAddress} className="mx-2" />/block
                                        </div>
                                        <div className="row">
                                            <p className="mb-0 setup-component-small-p"><b>Shared reward</b>: {AMM.name}</p>
                                        </div> 
                                    </> : <>
                                        <div className="row mb-4">
                                            {dfoCore.toDecimals(setup.rewardPerBlock)} <Coin address={setup.rewardTokenAddress} className="ml-2" />/block = {setupTokens.map((token, i) => <span key={token.address}>{i !== 0 ? '+' : ''}<Coin address={token.address} className="mx-2 mb-1" /></span>)}
                                        </div>
                                        <div className="row">
                                            <p className="mb-0 setup-component-small-p"><b>Fixed reward</b>: {AMM.name} - <span className="text-underline">block end: {setup.endBlock}</span></p>
                                        </div> 
                                    </>
                                }
                            </div>
                            <div className="col-12 col-md-5 setup-component-main-col align-items-end">
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <p className="mb-0 setup-component-small-p"><b>liquidity</b>: {setupTokens.map((token, i) => <span>{token.amount * setup.totalSupply} <Coin address={token.address} height={18} />{i !== setupTokens.length - 1 ? '+ ' : ''}</span> ) }</p>
                                    </div>
                                    {
                                        !setup.free && 
                                        <div className="col-12 mt-2">
                                            <p className="mb-0 setup-component-small-p"><b>reward/block</b>: {dfoCore.toDecimals(setup.rewardPerBlock)} <Coin address={setup.rewardTokenAddress} height={18} /> - <span className="text-secondary"><b>available:</b> {dfoCore.toDecimals((parseInt(setup.rewardPerBlock) - parseInt(setup.currentRewardPerBlock)).toString())} <Coin address={setup.rewardTokenAddress} height={18} /></span></p>
                                        </div>
                                    }
                                </div>
                                <div className="row mt-4">
                                    { getButton() }
                                </div>
                            </div>
                        </> 
                        }
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