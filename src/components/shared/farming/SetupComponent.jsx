import Coin from '../coin/Coin';
import { useEffect, useState } from 'react';
import { Input, ApproveButton } from '..';

const SetupComponent = (props) => {
    const { className, dfoCore, setupIndex, hostedBy, setup, lmContract, manage, farm, redeem } = props;
    const [open, setOpen] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const [AMM, setAMM] = useState({ name: "", version: ""});
    const [ammContract, setAmmContract] = useState(null);
    const [status, setStatus] = useState('farm');
    const [edit, setEdit] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [addLiquidityType, setAddLiquidityType] = useState(""); 
    const [setupTokens, setSetupTokens] = useState([]);
    const [tokensAmounts, setTokensAmount] = useState([]);
    const [tokensApprovals, setTokensApprovals] = useState([]);
    const [tokensContracts, setTokensContracts] = useState([]);
    const [setupLiquidity, setSetupLiquidity] = useState(null);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [lockedEstimatedReward, setLockedEstimatedReward] = useState(0);
    const [freeAvailableRewards, setFreeAvailableRewards] = useState([]);
    const [lockedAvailableRewards, setLockedAvailableRewards] = useState([]);
    const [lpTokenInfo, setLpTokenInfo] = useState(null);
    const [rewardTokenInfo, setRewardTokenInfo] = useState(null);
    const [extension, setExtension] = useState(null);
    const [removalAmount, setRemovalAmount] = useState(0);
    const [manageStatuses, setManageStatuses] = useState([]);
    const [unwrapPair, setUnwrapPair] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [positions, setPositions] = useState([]);
    const [updatedRewardPerBlock, setUpdatedRewardPerBlock] = useState(dfoCore.toDecimals(setup.rewardPerBlock));

    useEffect(() => {
        getSetupMetadata();
    }, []);

    const isWeth = (address) => {
        return address.toLowerCase() === props.dfoCore.getContextElement('wethTokenAddress').toLowerCase();
    }

    const isFinished = (setup) => {
        return (setup.free && parseInt(setup.rewardPerBlock) === 0) || (!setup.free && ((parseInt(setup.rewardPerBlock) - parseInt(setup.currentRewardPerBlock) === 0) || (parseInt(setup.maximumLiquidity) - parseInt(setup.currentStakedLiquidity) === 0)));
    }

    const getSetupMetadata = async () => {
        setLoading(true);
        try {
            const posArray = [];
            const events = await lmContract.getPastEvents('Transfer', { filter: { to: dfoCore.address, setupIndex }, fromBlock: 11790157 });
            for (let i = 0; i < events.length; i++) {
                const { returnValues } = events[i];
                const pos = await lmContract.methods.position(returnValues.positionId).call();
                if (dfoCore.isValidPosition(pos)) {
                    posArray.push({ ...pos, positionId: returnValues.positionId, index: posArray.length });
                }
            }
            setCurrentPosition(posArray.length === 1 ? posArray[0] : null);
            setPositions(posArray);
            const extensionAddress = await lmContract.methods._extension().call();
            setExtension(extensionAddress);
            setCurrentBlock(await dfoCore.getBlockNumber());
            const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
            const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), await lmContract.methods._rewardTokenAddress().call());
            const rewardTokenSymbol = await rewardToken.methods.symbol().call();
            const rewardTokenDecimals = await rewardToken.methods.decimals().call();
            console.log(`balance ${await dfoCore.getBlockNumber()}`);
            setRewardTokenInfo({ contract: rewardToken, symbol: rewardTokenSymbol, decimals: rewardTokenDecimals, address: rewardTokenAddress });
            const lpToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), setup.liquidityPoolTokenAddress);
            const lpTokenSymbol = await lpToken.methods.symbol().call();
            const lpTokenDecimals = await lpToken.methods.decimals().call();
            const lpTokenBalance = await lpToken.methods.balanceOf(dfoCore.address).call();
            const lpTokenApproval = await lpToken.methods.allowance(dfoCore.address, lmContract.options.address).call();
            setLpTokenInfo({ contract: lpToken, symbol: lpTokenSymbol, decimals: lpTokenDecimals, balance: lpTokenBalance, approval: parseInt(lpTokenApproval) !== 0 });
            setBlockNumber(await dfoCore.getBlockNumber());
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), setup.ammPlugin);
            setAmmContract(ammContract);
            const tokenAddress = setup.liquidityPoolTokenAddress;
            let res;
            if (setup.free) {
                res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, setup.totalSupply).call();
            } else {
                res = await ammContract.methods.byTokenAmount(tokenAddress, setup.mainTokenAddress, setup.currentStakedLiquidity).call();
                res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, res.liquidityPoolAmount).call();
            }
            console.log(setup);
            const tokens = [];
            const approvals = [];
            const contracts = [];
            for(let i = 0; i < res.liquidityPoolTokens.length; i++) {
                const address = res.liquidityPoolTokens[i];
                const token = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address);
                const symbol = !isWeth(address) ? await token.methods.symbol().call() : 'ETH';
                const decimals = await token.methods.decimals().call();
                const balance = !isWeth(address) ? await token.methods.balanceOf(dfoCore.address).call() : await dfoCore.web3.eth.getBalance(dfoCore.address);
                const approval = !isWeth(address) ? await token.methods.allowance(dfoCore.address, lmContract.options.address).call() : true;
                approvals.push(approval);
                tokens.push({ amount: 0, balance: dfoCore.toDecimals(dfoCore.toFixed(balance), decimals), liquidity: res.tokensAmounts[i], decimals, address, symbol });
            }
            const info = await ammContract.methods.info().call();
            setAMM({ name: info['0'], version: info['1'] });
            setSetupTokens(tokens);
            setTokensContracts(contracts);
            setTokensAmount(new Array(tokens.length).fill(0));
            setTokensApprovals(approvals);
            const statuses = [];
            const freeRewards = [];
            const lockedRewards = [];
            for (let i = 0; i < posArray.length; i++) {
                // retrieve the manage data using the position
                const free = posArray[i]['free'];
                const creationBlock = posArray[i]['creationBlock'];
                const positionSetupIndex = posArray[i]['setupIndex'];
                const liquidityPoolTokenAmount = posArray[i]['liquidityPoolTokenAmount'];
                const mainTokenAmount = posArray[i]['mainTokenAmount'];
                const amounts = await ammContract.methods.byLiquidityPoolAmount(setup.liquidityPoolTokenAddress, liquidityPoolTokenAmount).call();
                if (free) {
                    const reward = await lmContract.methods.calculateFreeLiquidityMiningSetupReward(posArray[i].positionId, true).call();
                    freeRewards.push(reward);
                } else {
                    const reward = await lmContract.methods.calculateLockedLiquidityMiningSetupReward(0, 0, true, posArray[i].positionId).call();
                    console.log(reward);
                    lockedRewards.push(parseInt(reward.reward) + parseInt(posArray[i].lockedRewardPerBlock));
                }
                statuses.push({ free, creationBlock, positionSetupIndex, liquidityPoolAmount: liquidityPoolTokenAmount, mainTokenAmount, tokensAmounts: amounts['tokensAmounts'], tokens  })
            }
            console.log(statuses);
            console.log(freeRewards);
            console.log(lockedRewards);
            setManageStatuses(statuses);
            setFreeAvailableRewards(freeRewards);
            setLockedAvailableRewards(lockedRewards);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onTokenApproval = (index, isLp) => {
        if (isLp) {
            setLpTokenInfo({ ...lpTokenInfo, approval: true });
            return;
        }
        setTokensApprovals(tokensApprovals.map((val, i) => i === index ? true : val));
    }

    const isValidPosition = (position) => {
        return position.uniqueOwner !== dfoCore.voidEthereumAddress && position.creationBlock !== '0';
    }

    const onUpdateTokenAmount = async (value, index) => {
        
        if (!value) {
            setTokensAmount(tokensAmounts.map((old, i) => i === index ? "0" : old));
            return;
        }
        const result = await ammContract.methods.byTokenAmount(setup.liquidityPoolTokenAddress, setupTokens[index].address, props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(setupTokens[index].decimals)))).call();
        const { liquidityPoolAmount } = result;
        const ams = result.tokensAmounts;
        setLpTokenAmount(props.dfoCore.toDecimals(liquidityPoolAmount, lpTokenInfo.decimals, 8))
        setTokensAmount(tokensAmounts.map((old, i) => props.dfoCore.toDecimals(ams[i], setupTokens[i].decimals)));
        if (!setup.free) {
            if (parseInt(ams[0]) > 0) {
                const reward = await lmContract.methods.calculateLockedLiquidityMiningSetupReward(setupIndex, ams[0], false, 0).call();
                
                setLockedEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(reward.relativeRewardPerBlock), rewardTokenInfo.decimals));
            }
        }
    }

    const onUpdateLpTokenAmount = async (value, index) => {
        if (!value || value === 'NaN') {
            setLpTokenAmount("0");
            return;
        }
        const result = await ammContract.methods.byLiquidityPoolAmount(setup.liquidityPoolTokenAddress, props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(lpTokenInfo.decimals)))).call();
        const ams = result.tokensAmounts;
        setLpTokenAmount(value)
        setTokensAmount(tokensAmounts.map((old, i) => props.dfoCore.toDecimals(ams[i], setupTokens[i].decimals)));
        if (!setup.free) {
            if (parseInt(ams[0]) > 0) {
                const reward = await lmContract.methods.calculateLockedLiquidityMiningSetupReward(setupIndex, ams[0], false, 0).call();
                
                setLockedEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(reward.relativeRewardPerBlock), rewardTokenInfo.decimals));
            }
        }
    }

    const addLiquidity = async () => {
        setLoading(true);
        try {
            const stake = {
                setupIndex,
                amount: addLiquidityType === 'add-lp' ? dfoCore.toFixed(dfoCore.fromDecimals(lpTokenAmount.toString())) : dfoCore.toFixed(dfoCore.fromDecimals(tokensAmounts[0].toString())),
                amountIsLiquidityPool: addLiquidityType === 'add-lp' ? true : false,
                positionOwner: dfoCore.voidEthereumAddress,
            };
            
            let ethTokenIndex = null;
            let ethTokenValue = 0;
            if (setup.involvingETH) {
                await Promise.all(setupTokens.map(async (token, i) => {
                    if (isWeth(token.address)) {
                        ethTokenIndex = i;
                    }
                }))
            }
            const res = await ammContract.methods.byLiquidityPoolAmount(setup.liquidityPoolTokenAddress, dfoCore.toFixed(dfoCore.fromDecimals(lpTokenAmount.toString()))).call();
            if (!setup.free) {
                stake.amount = res.tokensAmounts[0];
                ethTokenValue = res.tokensAmounts[ethTokenIndex];
            } else {
                ethTokenValue = res.tokensAmounts[ethTokenIndex];
            }
            console.log(ethTokenValue);
            if (currentPosition.positionId && isValidPosition(currentPosition)) {
                // adding liquidity to the setup
                const gasLimit = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).estimateGas({ from: dfoCore.address, value: setup.involvingETH ? ethTokenValue : 0 });
                const result = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).send({ from: dfoCore.address, gasLimit, value: setup.involvingETH ? ethTokenValue : 0 });
                
            } else if (!currentPosition.positionId) {
                console.log('here');
                // opening position
                const gasLimit = await lmContract.methods.openPosition(stake).estimateGas({ from: dfoCore.address, value: setup.involvingETH ? ethTokenValue : 0  });
                const result = await lmContract.methods.openPosition(stake).send({ from: dfoCore.address, gasLimit, value: setup.involvingETH ? ethTokenValue : 0  });
                
            }
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const removeLiquidity = async () => {
        setLoading(true);
        try {
            if (manageStatuses[currentPosition.index].free) {
                const removedLiquidity = props.dfoCore.toFixed(parseInt(manageStatuses[currentPosition.index].liquidityPoolAmount) * removalAmount / 100).toString().split('.')[0];
                console.log(removedLiquidity);
                const gasLimit = await lmContract.methods.withdrawLiquidity(currentPosition.positionId, 0, unwrapPair, removedLiquidity).estimateGas({ from: dfoCore.address });
                const result = await lmContract.methods.withdrawLiquidity(currentPosition.positionId, 0, unwrapPair, removedLiquidity).send({ from: dfoCore.address, gasLimit });
                
            }
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const withdrawReward = async () => {
        setLoading(true);
        try {
            
            const gasLimit = await lmContract.methods.withdrawReward(currentPosition.positionId).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.withdrawReward(currentPosition.positionId).send({ from: dfoCore.address, gasLimit});
            
            await getSetupMetadata();
        } catch (error) {
            
        } finally {
            setLoading(false);
        }
    }

    const unlockPosition = async () => {

        setLoading(true);
        try {
            const gasLimit = await lmContract.methods.unlock(currentPosition.positionId, unwrapPair).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.unlock(currentPosition.positionId, unwrapPair).send({ from: dfoCore.address, gasLimit });
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getButton = () => {
        if (open || edit) {
            return <button className="btn btn-secondary" onClick={() => { setOpen(false); setEdit(false) }}>Close</button>;
        } else {
            if (manage && currentPosition) {
                return <button className="btn btn-secondary" onClick={() => { setOpen(true); setEdit(false); setStatus('manage') }}>Manage</button>;
            } else if ((setup.free && setup.rewardPerBlock > 0) || (!setup.free && setup.startBlock <= currentBlock)) {
                
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

    const getApproveButton = (isLp) => {
        if (!isLp) {
            const notApprovedIndex = tokensApprovals.findIndex((value) => !value);
            if (notApprovedIndex !== -1) {
                return <ApproveButton contract={tokensContracts[notApprovedIndex]} from={props.dfoCore.address} spender={lmContract.options.address} onApproval={() => onTokenApproval(notApprovedIndex, false)} onError={(error) => console.log(error)} text={`Approve ${setupTokens[notApprovedIndex].symbol}`} />
            } else {
                return <div/>
            }
        } else {
            
            if (!lpTokenInfo.approval) {
                return <ApproveButton contract={lpTokenInfo.contract} from={props.dfoCore.address} spender={lmContract.options.address} onApproval={() => setTokensApprovals(null, true)} onError={(error) => console.log(error)} text={`Approve ${lpTokenInfo.symbol}`} />
            } else {
                return <div/>
            }
        }
    }

    const getAdvanced = () => {
        /*
        if (status === 'manage') {
            return getManageAdvanced();
        } else if (status === 'farm') {
            return getFarmAdvanced();
        } else if (status === 'redeem') {
            return getRedeemAdvanced();
        }
        */
        return getManageAdvanced();
    }

    const getEdit = () => {
        return <div className="row">
            <hr/>
        </div>
    }

    const getManageAdvanced = () => {
        return <div className="pb-4 px-4">
                    <div className="row mt-2 align-items-center justify-content-start">   
                    {
                        positions.map((position, index) => <>
                            <hr/>
                            <div className="col-12 mt-4">
                                <h6 style={{fontSize: 14}}>
                                    <b>Your position: </b> 
                                    {dfoCore.toDecimals(manageStatuses[currentPosition.index].liquidityPoolAmount, lpTokenInfo.decimals, 8)} {lpTokenInfo.symbol} - {manageStatuses[currentPosition.index].tokens.map((token, i) =>  <span> {dfoCore.toDecimals(manageStatuses[currentPosition.index].tokensAmounts[i], token.decimals)} {token.symbol} </span>)}
                                    ({manageStatuses[currentPosition.index].free ? manageStatuses[currentPosition.index].liquidityPoolAmount/setup.totalSupply : parseInt(manageStatuses[currentPosition.index].mainTokenAmount)/parseInt(setup.currentStakedLiquidity)}%)
                                </h6>
                            </div>
                            {
                                position.free && <>
                                    <div className="col-md-6 col-12">
                                        <h6 style={{fontSize: 14}}>
                                            <b>Available reward:</b> {dfoCore.toDecimals(dfoCore.toFixed(freeAvailableRewards[currentPosition.index]), rewardTokenInfo.decimals, 8)} {rewardTokenInfo.symbol}
                                        </h6>
                                    </div>
                                    {
                                        freeAvailableRewards[currentPosition.index] && <div className="col-md-6 col-12">
                                            <button onClick={() => withdrawReward()} className="btn btn-primary">Redeem</button>
                                        </div>
                                    }
                                </>
                            }
                            {
                                !position.free && <>
                                    <div className="col-md-6 col-12">
                                        <h6 style={{fontSize: 14}}>
                                            <b>Available reward:</b> {dfoCore.toDecimals(dfoCore.toFixed(lockedAvailableRewards[currentPosition.index]), rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}
                                        </h6>
                                    </div>
                                    {
                                        lockedAvailableRewards[currentPosition.index] && <div className="col-md-6 col-12">
                                            <button onClick={() => withdrawReward()} className="btn btn-primary">Partial reward</button>
                                        </div>
                                    }
                                </>
                            }
                            {
                                !position.free && <>
                                    <hr/>
                                    <div className="col-md-6">
                                        <p style={{fontSize: 14}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value={unwrapPair} onChange={(e) => setUnwrapPair(e.target.checked)} id="getLpToken" />
                                            <label className="form-check-label" htmlFor="getLpToken">
                                                Unwrap tokens
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button onClick={() => unlockPosition()} className="btn btn-secondary">Unlock position</button>
                                    </div>
                                </>
                            }
                        </>
                        )
                    }
                    </div>
                    
                    {
                        (currentPosition && (currentPosition.free || parseInt(currentPosition.setupEndBlock) > currentBlock)) && <>
                            <hr/>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <select className="custom-select wusd-pair-select" value={addLiquidityType} onChange={(e) => setAddLiquidityType(e.target.value)}>
                                        <option value="">Choose..</option>
                                        {
                                            (currentPosition.free || parseInt(setup.rewardPerBlock) > parseInt(setup.currentRewardPerBlock)) && <>
                                                <option value="add-tokens" disabled={!currentPosition.free && (isFinished(setup))}>Add liquidity</option>
                                                <option value="add-lp">Add liquidity by LP token</option>
                                            </>
                                        }
                                        {
                                            currentPosition.free && <option value="remove">Remove liquidity</option>
                                        }
                                    </select>
                                </div>
                            </div>
                            { addLiquidityType === 'add-tokens' ? <>
                                <div className="row justify-content-center mt-4">
                                    <div className="col-md-9 col-12">
                                        {
                                            setupTokens.map((setupToken, i) => {
                                                return <div className="row text-center mb-4">
                                                    <Input showMax={true} address={setupToken.address} value={tokensAmounts[i]} balance={setupToken.balance} min={0} onChange={(e) => onUpdateTokenAmount(e.target.value, i)} showCoin={true} showBalance={true} name={setupToken.symbol} />
                                                </div>
                                            })
                                        }
                                        </div>
                                    </div>
                                    {
                                        (!setup.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                                            <b>Estimated earnings (total)</b>: {lockedEstimatedReward} {rewardTokenInfo.symbol}/block
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
                                </>  : addLiquidityType === 'add-lp' ? <>
                                    <div className="row justify-content-center mt-4">
                                        <div className="col-md-9 col-12">
                                            <div className="row text-center mb-4">
                                                <Input showMax={true} address={setup.liquidityPoolTokenAddress} value={lpTokenAmount} balance={dfoCore.toDecimals(lpTokenInfo.balance, lpTokenInfo.decimals, 8)} min={0} onChange={(e) => onUpdateLpTokenAmount(e.target.value)} showCoin={true} showBalance={true} name={lpTokenInfo.symbol} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (!setup.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                                            <b>Estimated earnings (total)</b>: {lockedEstimatedReward} {rewardTokenInfo.symbol}/block
                                        </div>
                                    }
                                    <div className="row justify-content-center mt-4">
                                        {
                                            !lpTokenInfo.approval && <div className="col-md-6 col-12">
                                                { getApproveButton(true) }
                                            </div>
                                        }
                                        <div className="col-md-6 col-12">
                                            <button className="btn btn-secondary" onClick={() => addLiquidity()} disabled={!lpTokenInfo.approval || parseFloat(lpTokenAmount) === 0}>Add</button>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="row justify-content-center mt-4">
                                        <div class="form-group w-100">
                                            <label htmlFor="formControlRange" className="text-secondary"><b>Amount:</b> {removalAmount}%</label>
                                            <input type="range" value={removalAmount} onChange={(e) => setRemovalAmount(e.target.value)} class="form-control-range" id="formControlRange" />
                                        </div>
                                    </div>
                                    <div className="row mt-2 justify-content-evenly">
                                        <button className="btn btn-outline-secondary mr-2" onClick={() => setRemovalAmount(10)} >10%</button>
                                        <button className="btn btn-outline-secondary mr-2" onClick={() => setRemovalAmount(25)} >25%</button>
                                        <button className="btn btn-outline-secondary mr-2" onClick={() => setRemovalAmount(50)} >50%</button>
                                        <button className="btn btn-outline-secondary mr-2" onClick={() => setRemovalAmount(75)} >75%</button>
                                        <button className="btn btn-outline-secondary mr-2" onClick={() => setRemovalAmount(90)} >90%</button>
                                        <button className="btn btn-outline-secondary" onClick={() => setRemovalAmount(100)} >MAX</button>
                                    </div>
                                    <div className="row mt-4">
                                        <h6><b>Remove: </b> {dfoCore.toDecimals(dfoCore.toFixed(parseInt(manageStatuses[currentPosition.index].liquidityPoolAmount) * removalAmount / 100).toString(), lpTokenInfo.decimals, 8)} {lpTokenInfo.symbol} - {manageStatuses[currentPosition.index].tokens.map((token, i) =>  <span> {dfoCore.toDecimals(dfoCore.toFixed(parseInt(manageStatuses[currentPosition.index].tokensAmounts[i]) * removalAmount / 100).toString(), token.decimals)} {token.symbol} </span>)}</h6>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value={unwrapPair} onChange={(e) => setUnwrapPair(e.target.checked)} id="getLpToken" />
                                            <label className="form-check-label" htmlFor="getLpToken">
                                                Unwrap tokens
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center mt-4">
                                        <button onClick={() => removeLiquidity()} disabled={!removalAmount || removalAmount === 0} className="btn btn-secondary">Remove</button>
                                    </div>
                                </>
                            }
                        </>
                    }
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
                <div className="col-md-9 col-12">
                    {
                        setupTokens.map((setupToken, i) => {
                            return <div className="row text-center mb-4">
                                <Input showMax={true} step={0.0001} address={setupToken.address} value={tokensAmounts[i]} balance={setupToken.balance} min={0} onChange={(e) => onUpdateTokenAmount(e.target.value, i)} showCoin={true} showBalance={true} name={setupToken.symbol} />
                            </div>
                        })
                    }
                    </div>
                </div> : <div className="row justify-content-center mt-4">
                    <div className="col-md-9 col-12">
                        <div className="row text-center mb-4">
                            <Input showMax={true} step={0.0001} address={setup.liquidityPoolTokenAddress} value={lpTokenAmount} balance={dfoCore.toDecimals(lpTokenInfo.balance, lpTokenInfo.decimals)} min={0} onChange={(e) => console.log(e)} showCoin={true} showBalance={true} name={lpTokenInfo.symbol} />
                        </div>
                    </div>
                </div>
            }
            {
                (!setup.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                    <b>Estimated earnings (total)</b>: {lockedEstimatedReward} {rewardTokenInfo.symbol}/block
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
                    {
                        loading ? <div className="row px-2 farming-component-main-row">
                            <div className="col-12 justify-content-center">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        </div> : <>
                        <div className="row px-2 farming-component-main-row">
                            <div className="col-12 col-md-7 setup-component-main-col">
                                <div className="row mb-4">
                                    <h5><b>{setup.free ? "Free farming" : "Locked farming"} {(!setup.free && parseInt(setup.endBlock) <= blockNumber) && <span className="text-danger">(ended)</span>}</b></h5>
                                </div>
                                {
                                    setup.free ? <>
                                        <div className="row mb-4">
                                            {setupTokens.map((token, i) => <span key={token.address}>{i !== 0 ? '+ ' : ''}<Coin address={token.address} className="mr-2 mb-1" /> </span>)} = {dfoCore.toDecimals(setup.rewardPerBlock).substring(0, 6)} <Coin address={rewardTokenInfo?.address} className="mx-2" />/block
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
                                        <p className="mb-0 setup-component-small-p"><b>liquidity</b>: {setupTokens.map((token, i) => <span>{dfoCore.toDecimals(dfoCore.toFixed(dfoCore.normalizeValue(token.liquidity, token.decimals)).toString())} <Coin address={token.address} height={18} />{i !== setupTokens.length - 1 ? '+ ' : ''}</span> ) }</p>
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
                        </div>
                        {
                            (open && !edit) ? <><hr/>{getAdvanced()}</> : <div/>
                        }
                        {
                            (edit && !open) ? getEdit() : <div/>
                        }
                        </>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default SetupComponent;