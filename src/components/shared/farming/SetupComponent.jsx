import PropTypes from 'prop-types';
import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input, ApproveButton } from '..';

const SetupComponent = (props) => {
    const { className, dfoCore, setup, setupIndex, hostedBy, lmContract, manage, farm, redeem } = props;
    const [open, setOpen] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [setupTokens, setSetupTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AMM, setAMM] = useState({ name: "", version: ""});
    const [ammContract, setAmmContract] = useState(null);
    const [status, setStatus] = useState('farm');
    const [edit, setEdit] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [addLiquidityType, setAddLiquidityType] = useState("add-tokens"); 
    const [tokensAmounts, setTokensAmount] = useState([]);
    const [tokensApprovals, setTokensApprovals] = useState([]);
    const [tokensContracts, setTokensContracts] = useState([]);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [lockedEstimatedReward, setLockedEstimatedReward] = useState(0);
    const [lpTokenInfo, setLpTokenInfo] = useState(null);
    const [rewardTokenInfo, setRewardTokenInfo] = useState(null);

    useEffect(() => {
        if (!blockNumber) {
            getSetupMetadata();
        }
    }, []);

    const onTokenApproval = (index) => {
        setTokensApprovals(tokensApprovals.map((val, i) => i === index ? true : val));
    }

    const getSetupMetadata = async () => {
        console.log(setup);
        setLoading(true);
        setCurrentBlock(await dfoCore.getBlockNumber());
        const tokens = [];
        const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), await lmContract.methods._rewardTokenAddress().call());
        const rewardTokenSymbol = await rewardToken.methods.symbol().call();
        const rewardTokenDecimals = await rewardToken.methods.decimals().call();
        setRewardTokenInfo({ contract: rewardToken, symbol: rewardTokenSymbol, decimals: rewardTokenDecimals });
        const lpToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), setup.liquidityPoolTokenAddress);
        const lpTokenSymbol = await lpToken.methods.symbol().call();
        const lpTokenDecimals = await lpToken.methods.decimals().call();
        const lpTokenBalance = await lpToken.methods.balanceOf(dfoCore.address).call();
        setLpTokenInfo({ contract: lpToken, symbol: lpTokenSymbol, decimals: lpTokenDecimals, balance: lpTokenBalance });
        try {
            setBlockNumber(await dfoCore.getBlockNumber());
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), setup.ammPlugin);
            setAmmContract(ammContract);
            const tokenAddress = setup.liquidityPoolTokenAddress;
            const byTokensRes = await ammContract.methods.byLiquidityPool(tokenAddress).call();
            const approvals = [];
            const contracts = [];
            for (let i = 0; i < byTokensRes['2'].length; i++) {
                const token = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), byTokensRes['2'][i]);
                const symbol = await token.methods.symbol().call();
                const decimals = await token.methods.decimals().call();
                const balance = await token.methods.balanceOf(dfoCore.address).call();
                const approval = await token.methods.allowance(dfoCore.address, lmContract.options.address).call();
                const totalSupply = await token.methods.totalSupply().call();
                approvals.push(parseInt(approval) === parseInt(totalSupply));
                contracts.push(token);
                tokens.push({ amount: 0, balance: dfoCore.toDecimals(dfoCore.toFixed(balance), decimals), decimals, address: byTokensRes['2'][i], symbol });
            }
            const info = await ammContract.methods.info().call();
            setAMM({ name: info['0'], version: info['1'] });
            setSetupTokens(tokens);
            setTokensContracts(contracts);
            setTokensAmount([].fill(0));
            setTokensApprovals(approvals);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onUpdateTokenAmount = async (value, index) => {
        if (!value) {
            setTokensAmount(tokensAmounts.map((old, i) => i === index ? "0" : old));
            return;
        }
        const result = await ammContract.methods.byTokenAmount(setup.liquidityPoolTokenAddress, setupTokens[index].address, props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(setupTokens[index].decimals)))).call();
        const { liquidityPoolAmount, tokensAmounts } = result;
        console.log(result);
        setLpTokenAmount(props.dfoCore.toDecimals(liquidityPoolAmount, lpTokenInfo.decimals))
        setTokensAmount(tokensAmounts.map((old, i) => props.dfoCore.toDecimals(tokensAmounts[i], setupTokens[i].decimals)));
        if (!setup.free) {
            if (parseInt(tokensAmounts[0]) > 0) {
                const reward = await lmContract.methods.calculateLockedLiquidityMiningSetupReward(setupIndex, tokensAmounts[0], false, 0).call();
                console.log(reward)
                setLockedEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(reward.relativeRewardPerBlock), rewardTokenInfo.decimals));
            }
        }
    }

    const addLiquidity = async () => {
        if (addLiquidityType === 'add-tokens') {
            // adding liquidity via tokens
            const stake = {
                setupIndex,
                amount: dfoCore.toFixed(dfoCore.fromDecimals(tokensAmounts[0])),
                amountIsLiquidityPool: false,
                positionOwner: dfoCore.voidEthereumAddress,
            };
            console.log(stake);
            const gasLimit = await lmContract.methods.openPosition(stake).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.openPosition(stake).send({ from: dfoCore.address, gasLimit });
            console.log(result);
            await getSetupMetadata();
        } else {
            // adding liquidity to position
        }
    }

    const getButton = () => {
        if (open || edit) {
            return <button className="btn btn-secondary" onClick={() => { setOpen(false); setEdit(false) }}>Close</button>;
        } else {
            if ((setup.free && setup.rewardPerBlock > 0) || (!setup.free && setup.startBlock <= currentBlock)) {
                console.log(currentBlock);
                return <button className="btn btn-secondary" onClick={() => { setOpen(true); setEdit(false) }}>Farm</button>
            }
            /*
            if (status === 'manage' && !edit) {
                return <button className="btn btn-secondary" onClick={() => { setOpen(true); setEdit(false) }}>Manage</button>;
            } else if (status === 'farm' && !edit) {
                return <button className="btn btn-secondary" onClick={() => { setOpen(true); setEdit(false) }}>Farm</button>;
            } else if (status === 'redeem' && !edit) {
                return <button className="btn btn-warning" onClick={() => { setOpen(true); setEdit(false) }}>Redeem</button>;
            } else {
                return <div/>
            }
            */
        }
    }

    const getApproveButton = () => {
        const notApprovedIndex = tokensApprovals.findIndex((value) => !value);
        if (notApprovedIndex !== -1) {
            return <ApproveButton contract={tokensContracts[notApprovedIndex]} from={props.dfoCore.address} spender={lmContract.options.address} onError={(error) => console.log(error)} onApproval={() => onTokenApproval(notApprovedIndex)} text={`Approve ${setupTokens[notApprovedIndex].symbol}`} />
        } else {
            return <div/>
        }
    }

    const getEditButton = () => {
        return <button className="btn btn-primary mr-2" onClick={() => { setEdit(true); setEdit(true) }}>Edit</button>;
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

    const getEdit = () => {
        return <div className="row">
            <hr/>
        </div>
    }

    const getManageAdvanced = () => {
        return <div className="row">
            <hr/>
        </div>
    }

    const getFarmAdvanced = () => {
        return <>
            <div className="row mt-4">
                <div className="col-md-6 col-12">
                    <select className="custom-select wusd-pair-select" value={addLiquidityType} onChange={(e) => setAddLiquidityType(e.target.value)}>
                        <option value="add-tokens">Add liquidity</option>
                        <option value="add-lp">Add liquidity by LP token</option>
                    </select>
                </div>
            </div>
            {
                addLiquidityType === 'add-tokens' ? <div className="row justify-content-center mt-4">
                <div className="col-md-6 col-12">
                    {
                        setupTokens.map((setupToken, i) => {
                            return <div className="row text-center mb-4">
                                <Input showMax={true} step={0.0001} address={setupToken.address} value={tokensAmounts[i]} balance={setupToken.balance} min={0} onChange={(e) => onUpdateTokenAmount(e.target.value, i)} showCoin={true} showBalance={true} name={setupToken.symbol} />
                            </div>
                        })
                    }
                    </div>
                </div> : <div className="row justify-content-center mt-4">
                    <div className="col-md-6 col-12">
                        <div className="row text-center mb-4">
                            <Input showMax={true} step={0.0001} address={setup.liquidityPoolTokenAddress} value={lpTokenAmount} balance={dfoCore.toDecimals(lpTokenInfo.balance, lpTokenInfo.decimals)} min={0} onChange={(e) => console.log(e)} showCoin={true} showBalance={true} name={lpTokenInfo.symbol} />
                        </div>
                    </div>
                </div>
            }
            {
                (!setup.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                    <b>Stimated earnings (total)</b>: {lockedEstimatedReward} {rewardTokenInfo.symbol}/block
                </div>
            }
            <div className="row justify-content-center mt-4">
                {
                    tokensApprovals.some((value) => !value) && <div className="col-md-6 col-12">
                        { getApproveButton() }
                    </div>
                }
                <div className="col-md-6 col-12">
                    <button className="btn btn-secondary" onClick={() => addLiquidity()} disabled={tokensApprovals.some((value) => !value) || tokensAmounts.some((value) => value === 0)}>Add</button>
                </div>
            </div>
        </>
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
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden"></span>
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
                                            {props.dfoCore.toDecimals(setup.rewardPerBlock)} <Coin address={setup.rewardTokenAddress} className="ml-2" />/block = {setupTokens.map((token, i) => <span key={token.address}>{i !== 0 ? '+' : ''}<Coin address={token.address} className="mx-2 mb-1" /></span>)}
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
                                    { (hostedBy && !edit) ? getEditButton() : <></> } { getButton() }
                                </div>
                            </div>
                        </> 
                        }
                    </div>
                    {
                        (open && !edit) ? getAdvanced() : <div/>
                    }
                    {
                        (edit && !open) ? getEdit() : <div/>
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