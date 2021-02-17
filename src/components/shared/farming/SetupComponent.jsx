import Coin from '../coin/Coin';
import { useEffect, useState } from 'react';
import { Input, ApproveButton } from '..';

const SetupComponent = (props) => {
    const { className, dfoCore, setupIndex, setup, lmContract, manage, farm, redeem } = props;
    const [open, setOpen] = useState(false);
    const [blockNumber, setBlockNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const [AMM, setAMM] = useState({ name: "", version: ""});
    const [ammContract, setAmmContract] = useState(null);
    const [extensionContract, setExtensionContract] = useState(null);
    const [status, setStatus] = useState('farm');
    const [edit, setEdit] = useState(false);
    const [isHost, setIsHost] = useState(true);
    const [addLiquidityType, setAddLiquidityType] = useState(""); 
    const [setupTokens, setSetupTokens] = useState([]);
    const [tokensAmounts, setTokensAmount] = useState([]);
    const [tokensApprovals, setTokensApprovals] = useState([]);
    const [tokensContracts, setTokensContracts] = useState([]);
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
    const [updatedRewardPerBlock, setUpdatedRewardPerBlock] = useState(setup.rewardPerBlock);
    const [updatedRenewTimes, setUpdatedRenewTimes] = useState(setup.renewTimes);
    const [openPositionForAnotherWallet, setOpenPositionForAnotherWallet] = useState(false);
    const [uniqueOwner, setUniqueOwner] = useState(dfoCore.voidEthereumAddress);

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
            console.log(extensionAddress);
            try {
                const extContract = await dfoCore.getContract(dfoCore.getContextElement("LiquidityMiningExtensionABI"), extensionAddress);
                console.log(extContract);
                const extData = await extensionContract.methods.data().call();
                setExtensionContract(extContract);
                // setIsHost(extData["host"].toLowerCase() === dfoCore.address.toLowerCase());
            } catch (error) {
                console.error("non standard lm extension.");
            }
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
            console.log(await dfoCore.getBlockNumber());
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
                approvals.push(parseInt(approval) !== 0);
                tokens.push({ amount: 0, balance: dfoCore.toDecimals(dfoCore.toFixed(balance), decimals), liquidity: res.tokensAmounts[i], decimals, address, symbol });
                contracts.push(token);
            }
            const info = await ammContract.methods.info().call();
            setAMM({ name: info['0'], version: info['1'] });
            setSetupTokens(tokens);
            setTokensContracts(contracts);
            setTokensAmount(new Array(tokens.length).fill(0));
            setTokensApprovals(approvals);
            console.log(contracts);
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
            // const res = await ammContract.methods.byTokensAmount(setup.liquidityPoolTokenAddress,  , stake.amount).call();
            console.log(res);
            if (!setup.free) {
                stake.amount = res.tokensAmounts[0];
                ethTokenValue = res.tokensAmounts[ethTokenIndex];
            } else {
                ethTokenValue = res.tokensAmounts[ethTokenIndex];
            }

            console.log(ethTokenValue);
            if ((currentPosition && isValidPosition(currentPosition)) || setup.free) {
                // adding liquidity to the setup
                if (!currentPosition) {
                    const gasLimit = await lmContract.methods.openPosition(stake).estimateGas({ from: dfoCore.address, value: setup.involvingETH ? ethTokenValue : 0  });
                    const result = await lmContract.methods.openPosition(stake).send({ from: dfoCore.address, gasLimit, value: setup.involvingETH ? ethTokenValue : 0  });
                } else {
                    const gasLimit = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).estimateGas({ from: dfoCore.address, value: setup.involvingETH ? ethTokenValue : 0 });
                    const result = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).send({ from: dfoCore.address, gasLimit, value: setup.involvingETH ? ethTokenValue : 0 });
                }
                
            } else if (!setup.free) {
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
            if (currentPosition.free) {
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

    const updateSetup = async () => {
        setLoading(true);
        try {
            const updatedSetup = { ...setup, rewardPerBlock: updatedRewardPerBlock, renewTimes: updatedRenewTimes };
            const updatedSetupConfiguration = { add: false, index: setupIndex, data: updatedSetup };
            const gasLimit = await extensionContract.methods.setLiquidityMiningSetups([updatedSetupConfiguration], false, false, 0).estimateGas({ from: dfoCore.address });
            const result = await extensionContract.methods.setLiquidityMiningSetups([updatedSetupConfiguration], false, false, 0).send({ from: dfoCore.address, gasLimit });
            // await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getButton = () => {
        return <>
            {
                (isHost && extensionContract && !edit) && 
                    <a className="web2ActionBTN" onClick={() => { setOpen(false); setEdit(true) }}>Edit</a>
            }
            {
                (open || edit) && 
                    <a className="backActionBTN" onClick={() => { setOpen(false); setEdit(false) }}>Close</a>
            }
            {
                (parseInt(setup.startBlock) > 0 && blockNumber < parseInt(setup.startBlock)) ? 
                    <a className="web2ActionBTN" disabled={true}>{setup.startBlock}</a>
                    :(manage && currentPosition && !open) ? 
                    <a className="web2ActionBTN" onClick={() => { setOpen(true); setEdit(false); setStatus('manage') }}>Manage</a>
                    : (setup.rewardPerBlock > 0 && !open && (setup.free || parseInt(setup.startBlock) >= blockNumber)) ? 
                    <a className="web2ActionBTN" onClick={() => { setOpen(true); setEdit(false); setStatus('manage') }}>Farm</a>
                     : <div/>
        }
        </>
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
        return !edit ? getManageAdvanced() : getEdit();
    }

    const getEdit = () => {
        return <div className="pb-4 px-4">
        <hr/>
                <div className="row mt-2 align-items-center justify-content-start">  
                    <div className="col-12 mb-md-2">
                        <Input value={dfoCore.toDecimals(updatedRewardPerBlock)} min={0} onChange={(e) => setUpdatedRewardPerBlock(dfoCore.toFixed(dfoCore.fromDecimals(e.target.value)))} label={"Reward per block"} />
                    </div>
                    {
                        !setup.free && <div className="col-12 mb-md-2">
                            <Input value={updatedRenewTimes} min={0} onChange={(e) => setUpdatedRenewTimes(e.target.value)} label={"Renew times"} />
                        </div>
                    }
                    <div className="col-12">
                        <button onClick={() => updateSetup()} className="btn btn-secondary">Update</button>
                    </div>
            </div>
        </div>
    }

    const getManageAdvanced = () => {
        return <div className="pb-4 px-4">
            {
                positions.map((position, index) =>
                    <div className="row mt-2 align-items-center justify-content-start">
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
                        <hr/>
                    </div>
                    )
                }
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <select className="custom-select wusd-pair-select" value={addLiquidityType} onChange={(e) => setAddLiquidityType(e.target.value)}>
                                <option value="">Choose..</option>
                                {
                                    (setup.free || parseInt(setup.rewardPerBlock) > parseInt(setup.currentRewardPerBlock)) && <>
                                        <option value="add-tokens">Add liquidity</option>
                                        <option value="add-lp">Add liquidity by LP token</option>
                                    </>
                                }
                                {
                                    (currentPosition && currentPosition.free) && <option value="remove">Remove liquidity</option>
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
                                (!setup.free || positions.length === 0) && <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value={openPositionForAnotherWallet} onChange={(e) => setOpenPositionForAnotherWallet(e.target.checked)} id="openPositionWallet1" />
                                    <label className="form-check-label" htmlFor="openPositionWallet1">
                                        Open position for another wallet
                                    </label>
                                </div>
                            }
                            {
                                openPositionForAnotherWallet &&  <div className="row justify-content-center mb-4">
                                        <div className="col-md-9 col-12">
                                        <input type="text" value={uniqueOwner} onChange={(e) => setUniqueOwner(e.target.value)} className="form-control" id="uniqueOwner" ></input>
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
                        </>  : addLiquidityType === 'add-lp' ? <>
                            <div className="row justify-content-center mt-4">
                                <div className="col-md-9 col-12">
                                    <div className="row text-center mb-4">
                                        <Input showMax={true} address={setup.liquidityPoolTokenAddress} value={lpTokenAmount} balance={dfoCore.toDecimals(lpTokenInfo.balance, lpTokenInfo.decimals, 8)} min={0} onChange={(e) => onUpdateLpTokenAmount(e.target.value)} showCoin={true} showBalance={true} name={lpTokenInfo.symbol} />
                                    </div>
                                </div>
                            </div>
                            {
                                (!setup.free || positions.length === 0) && <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value={openPositionForAnotherWallet} onChange={(e) => setOpenPositionForAnotherWallet(e.target.checked)} id="openPosition2" />
                                    <label className="form-check-label" htmlFor="openPosition2">
                                        Open position for another wallet
                                    </label>
                                </div>
                            }
                            {
                                openPositionForAnotherWallet && <div className="row justify-content-center mb-4">
                                        <div className="col-md-9 col-12">
                                        <input type="text" value={uniqueOwner} onChange={(e) => setUniqueOwner(e.target.value)} className="form-control" id="uniqueOwner" ></input>
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
                                    !lpTokenInfo.approval && <div className="col-md-6 col-12">
                                        { getApproveButton(true) }
                                    </div>
                                }
                                <div className="col-md-6 col-12">
                                    <button className="btn btn-secondary" onClick={() => addLiquidity()} disabled={!lpTokenInfo.approval || parseFloat(lpTokenAmount) === 0}>Add</button>
                                </div>
                            </div>
                        </> : <> { (currentPosition && currentPosition.free) && <>
                            <div className="row justify-content-center mt-4">
                                <div className="form-group w-100">
                                    <label htmlFor="formControlRange" className="text-secondary"><b>Amount:</b> {removalAmount}%</label>
                                    <input type="range" value={removalAmount} onChange={(e) => setRemovalAmount(e.target.value)} className="form-control-range" id="formControlRange" />
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

    return (
        <div className={className}>
                    {
                        loading ? <div className="row px-2 farming-component-main-row">
                            <div className="col-12 justify-content-center">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden"></span>
                                </div>
                            </div>
                        </div> : <>
                        <div className="FarmSetupMain">
                                <h5><b>{setup.free ? "Free Farming" : "Locked Farming"} {(!setup.free && parseInt(setup.endBlock) <= blockNumber) && <span>(ended)</span>}</b> <a>{AMM.name}</a></h5>
                                <aside>
                                        {/* @todo - Setup Reward Token Symbol don't work*/}
                                        <p><b>block end</b>: {setup.endBlock}</p>
                                        <p><b>Min to Stake</b>: 20 Buidl</p>
                                </aside>
                                {
                                    setup.free ? <>
                                        <div className="SetupFarmingInstructions">
                                            {/* @todo - Insert  APY Calc*/}
                                            <p>{setupTokens.map((token, i) => <figure key={token.address}>{i !== 0 ? '+ ' : ''}<Coin address={token.address} /> </figure>)} = <b>APY</b>: 3% <span>(Unstable)</span></p>
                                        </div>
                                    </> : <>
                                        <div className="SetupFarmingInstructions">
                                            {/* @todo - Insert  APY Calc*/}
                                            <p>{setupTokens.map((token, i) => <figure key={token.address}>{i !== 0 ? '+' : ''}<Coin address={token.address} /></figure>)} = <b>APY</b>: 3%</p>                 
                                            </div>
                                    </>
                                }
                            <div className="SetupFarmingOthers">
                            {
                                    setup.free ? <>
                                        <p><b>Reward/Block</b>: {props.dfoCore.toDecimals(setup.rewardPerBlock)} {setup.rewardToken} <span>(Shared)</span></p>
                                    </> : <>
                                        {/* @todo - Insert  Reward for main token staked and Available to stake*/}
                                        {/* @todo - Setup Reward Token Symbol don't work*/}
                                        <p><b>Max Stakable</b>: {dfoCore.toDecimals(setup.rewardPerBlock)} {setup.rewardToken}</p> 
                                        <p><b>Available</b>: {dfoCore.toDecimals((parseInt(setup.rewardPerBlock) - parseInt(setup.currentRewardPerBlock)).toString())} {setup.rewardToken}</p>
                                        <p><b>1 Buidl Staked</b> = 0.00005 UniFi/Block</p>
                                    </>
                                }
                            </div>
                            <div className="SetupFarmingBotton">
                                    { getButton() }
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
    )
}

export default SetupComponent;