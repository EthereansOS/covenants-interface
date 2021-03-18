import { useState } from 'react';
import { connect } from 'react-redux';
import { Coin, Input, TokenInput } from '../../../../components/shared';

const CreateOrEditFarmingSetup = (props) => {
    const { rewardToken, onAddFarmingSetup, editSetup, editSetupIndex, onEditFarmingSetup, selectedFarmingType, dfoCore, onCancel } = props;
    // general purpose
    const [loading, setLoading] = useState(false);
    const [minStakeable, setMinSteakeable] = useState((editSetup && editSetup.minStakeable) ? editSetup.minStakeable : 0);
    const [blockDuration, setBlockDuration] = useState((editSetup && editSetup.period) ? editSetup.period : 0);
    const [isRenewable, setIsRenewable] = useState((editSetup && editSetup.renewTimes) ? editSetup.renewTimes > 0 : false);
    const [renewTimes, setRenewTimes] = useState((editSetup && editSetup.renewTimes) ? editSetup.renewTimes : 0);
    const [involvingEth, setInvolvingEth] = useState((editSetup && editSetup.involvingEth) ? editSetup.involvingEth : false);
    const [ethAddress, setEthAddress] = useState((editSetup && editSetup.ethAddress) ? editSetup.ethAddress : "");
    const [ethSelectData, setEthSelectData] = useState((editSetup && editSetup.ethSelectData) ? editSetup.ethSelectData : null);
    // free setup state
    const [freeLiquidityPoolToken, setFreeLiquidityPoolToken] = useState((editSetup && editSetup.data) ? editSetup.data : null);
    const [freeRewardPerBlock, setFreeRewardPerBlock] = useState((editSetup && editSetup.rewardPerBlock) ? editSetup.rewardPerBlock : 0);
    const [freeMainTokenIndex, setFreeMainTokenIndex] = useState((editSetup && editSetup.freeMainTokenIndex) ? editSetup.freeMainTokenIndex : 0);
    const [freeMainToken, setFreeMainToken] = useState((editSetup && editSetup.freeMainToken) ? editSetup.freeMainToken : null);
    // locked setup state
    const [lockedMainToken, setLockedMainToken] = useState((editSetup && editSetup.data) ? editSetup.data : null);
    const [lockedMaxLiquidity, setLockedMaxLiquidity] = useState((editSetup && editSetup.maxLiquidity) ? editSetup.maxLiquidity : 0);
    const [lockedRewardPerBlock, setLockedRewardPerBlock] = useState((editSetup && editSetup.rewardPerBlock) ? editSetup.rewardPerBlock : 0);
    const [lockedSecondaryToken, setLockedSecondaryToken] = useState((editSetup && editSetup.secondaryToken) ? editSetup.secondaryToken : null);
    const [lockedHasPenaltyFee, setLockedHasPenaltyFee] = useState((editSetup && editSetup.penaltyFee) ? editSetup.penaltyFee > 0 : false);
    const [lockedPenaltyFee, setLockedPenaltyFee] = useState((editSetup && editSetup.penaltyFee) ? editSetup.penaltyFee : 0);
    const [lockedMainTokenIsEth, setLockedMainTokenIsEth] = useState((editSetup && editSetup.lockedMainTokenIsEth) ? editSetup.lockedMainTokenIsEth : false);
    // current step
    const [currentStep, setCurrentStep] = useState(0);

    const onSelectMainToken = async (address) => {
        if (!address) return;
        setLoading(true);
        try {
            if (address === dfoCore.voidEthereumAddress) {
                setLockedMainToken({ symbol: 'ETH', address, decimals: 18 });
            } else {
                const mainTokenContract = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address);
                const symbol = await mainTokenContract.methods.symbol().call();
                const decimals = await mainTokenContract.methods.decimals().call();
                setLockedMainToken({ symbol, address, decimals });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setEthSelectData(null);
            setInvolvingEth(false);
            setLockedSecondaryToken(null);
            setLockedMainTokenIsEth(false);
            setLoading(false);
        }
    }

    const onSelectLockedSecondaryToken = async (address) => {
        if (!address) return;
        setLoading(true);
        try {
            const ammAggregator = await dfoCore.getContract(dfoCore.getContextElement('AMMAggregatorABI'), dfoCore.getContextElement('ammAggregatorAddress'));
            const res = await ammAggregator.methods.info(address).call();
            const name = res['name'];
            const ammAddress = res['amm'];
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), ammAddress);
            const ammData = await ammContract.methods.data().call();
            const secondatoryTokenInfo = await ammContract.methods.byLiquidityPool(address).call();
            const tokens = [];
            let ethTokenFound = false;
            let mainTokenFound = false;
            let mainTokenIsEth = false;
            await Promise.all(secondatoryTokenInfo[2].map(async (tkAddress) => {
                if (tkAddress.toLowerCase() === ammData[0].toLowerCase()) {
                    ethTokenFound = true;
                    if (tkAddress.toLowerCase() === lockedMainToken.address.toLowerCase()) {
                        mainTokenFound = true;
                        mainTokenIsEth = true;
                    }
                    setInvolvingEth(true);
                    if (ammData[0] === dfoCore.voidEthereumAddress) {
                        setEthAddress(dfoCore.voidEthereumAddress);
                        setEthSelectData(null);
                    } else {
                        setEthAddress(ammData[0]);
                        const notEthToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), ammData[0]);
                        const notEthTokenSymbol = await notEthToken.methods.symbol().call();
                        setEthSelectData({ symbol: notEthTokenSymbol })
                    }
                } else if (tkAddress.toLowerCase() === lockedMainToken.address.toLowerCase()) {
                    mainTokenFound = true;
                }
                const currentToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), tkAddress);
                const symbol = await currentToken.methods.symbol().call();
                tokens.push({ symbol, address: tkAddress, isEth: tkAddress.toLowerCase() === ammData[0].toLowerCase() })
            }));
            if (!mainTokenFound) return;
            if (!ethTokenFound) setEthSelectData(null);
            setLockedMainTokenIsEth(mainTokenIsEth);
            setLockedSecondaryToken({ 
                address, 
                name,
                tokens,
            });
        } catch (error) {
            console.error(error);
            setLockedSecondaryToken(null);
        } finally {
            setLoading(false);
        }

    }

    const onSelectFreeLiquidityPoolToken = async (address) => {
        if (!address) return;
        setLoading(true);
        try {
            const ammAggregator = await dfoCore.getContract(dfoCore.getContextElement('AMMAggregatorABI'), dfoCore.getContextElement('ammAggregatorAddress'));
            const res = await ammAggregator.methods.info(address).call();
            const name = res['name'];
            const ammAddress = res['amm'];
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), ammAddress);
            const ammData = await ammContract.methods.data().call();
            const lpInfo = await ammContract.methods.byLiquidityPool(address).call();
            const tokens = [];
            let ethTokenFound = false;
            await Promise.all(lpInfo[2].map(async (tkAddress) => {
                if (tkAddress.toLowerCase() === ammData[0].toLowerCase()) {
                    setInvolvingEth(true);
                    ethTokenFound = true;
                    if (ammData[0] === dfoCore.voidEthereumAddress) {
                        setEthAddress(dfoCore.voidEthereumAddress);
                        setEthSelectData(null);
                    } else {
                        setEthAddress(ammData[0]);
                        const notEthToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), ammData[0]);
                        const notEthTokenSymbol = await notEthToken.methods.symbol().call();
                        setEthSelectData({ symbol: notEthTokenSymbol })
                    }
                }
                const currentToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), tkAddress);
                const symbol = await currentToken.methods.symbol().call();
                tokens.push({ symbol, address: tkAddress, isEth: tkAddress.toLowerCase() === ammData[0].toLowerCase() })
            }));
            const lpTokenContract = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address);
            const decimals = await lpTokenContract.methods.decimals().call();
            if (!ethTokenFound) setEthSelectData(null);
            setFreeLiquidityPoolToken({ 
                address, 
                name,
                tokens,
                decimals,
            });
        } catch (error) {
            setFreeLiquidityPoolToken(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onUpdatePenaltyFee = (value) => {
        setLockedPenaltyFee(value > 100 ? 100 : value);
    }

    const onFreeRewardPerBlockUpdate = (value) => {
        const parsedValue = dfoCore.fromDecimals(value, rewardToken.decimals);
        console.log("parsed value", parsedValue < 1);
        console.log(value);
        setFreeRewardPerBlock(parsedValue < 1 ? 0 : value);
    }

    const addFreeSetup = () => {
            if (!freeLiquidityPoolToken || freeRewardPerBlock <= 0 || minStakeable <= 0 || !blockDuration) return;
            if (editSetup) {
                onEditFarmingSetup(
                    { 
                        rewardPerBlock: freeRewardPerBlock, 
                        data: freeLiquidityPoolToken, 
                        freeMainTokenIndex, 
                        freeMainToken: freeMainToken || freeLiquidityPoolToken.tokens[freeMainTokenIndex], 
                        period: blockDuration, 
                        minStakeable, 
                        renewTimes, 
                        involvingEth, 
                        ethAddress, 
                        ethSelectData
                    }, 
                    editSetupIndex
                );
            } else {
                onAddFarmingSetup(
                    { 
                        rewardPerBlock: freeRewardPerBlock, 
                        freeMainTokenIndex, 
                        freeMainToken: freeMainToken || freeLiquidityPoolToken.tokens[freeMainTokenIndex], 
                        data: freeLiquidityPoolToken, 
                        period: blockDuration, 
                        minStakeable, 
                        renewTimes, 
                        involvingEth, 
                        ethAddress, 
                        ethSelectData 
                    }
                );
            }
    }

    const getFreeFirstStep = () => {
        return <div className="col-12">
            <div className="row mb-4">
                <div className="col-12">
                    <select className="SelectRegular" value={blockDuration} onChange={(e) => setBlockDuration(e.target.value)}>
                        <option value={0}>Choose setup duration</option>
                        {
                            Object.keys(props.dfoCore.getContextElement("blockIntervals")).map((key, index) => {
                                return <option key={key} value={props.dfoCore.getContextElement("blockIntervals")[key]}>{key}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-9">
                    <TokenInput label={"Liquidity pool address"} placeholder={"Liquidity pool address"} width={60} onClick={(address) => onSelectFreeLiquidityPoolToken(address)} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div> :  <>
                    <div className="row mb-4">
                        { (freeLiquidityPoolToken && freeLiquidityPoolToken.tokens.length > 0) && <div className="col-12">
                                <b>{freeLiquidityPoolToken.name} | {freeLiquidityPoolToken.tokens.map((token) => <>{!token.isEth ? token.symbol : involvingEth ? 'ETH' : token.symbol} </>)}</b> {freeLiquidityPoolToken.tokens.map((token) => <Coin address={!token.isEth ? token.address : involvingEth ? props.dfoCore.voidEthereumAddress : token.address} className="mr-2" /> )}
                            </div>
                        }
                    </div>
                    {
                        freeLiquidityPoolToken && <>
                            {
                                (ethSelectData) && <div className="row justify-content-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={involvingEth} onChange={(e) => setInvolvingEth(e.target.checked)} id="involvingEth" />
                                        <label className="form-check-label" htmlFor="involvingEth">
                                            Use {ethSelectData.symbol} as ETH
                                        </label>
                                    </div>
                                </div>
                            }
                            <div className="row justify-content-center mb-4">
                                <select className="SelectRegular" value={freeMainTokenIndex} onChange={(e) => { setFreeMainTokenIndex(e.target.value); setFreeMainToken(freeLiquidityPoolToken.tokens[e.target.value]); }}>
                                    {
                                        freeLiquidityPoolToken.tokens.map((tk, index) => {
                                            return <option key={tk.address} value={index}>{!tk.isEth ? tk.symbol : involvingEth ? 'ETH' : tk.symbol}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input min={dfoCore.fromDecimals(rewardToken, rewardToken.decimals)} showCoin={true} address={rewardToken.address} value={freeRewardPerBlock} name={rewardToken.symbol} label={"Reward per block"} onChange={(e) => onFreeRewardPerBlockUpdate(e.target.value)} />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center flex-column mb-2">
                                <p className="text-center"><b>Total reward ({`${blockDuration}`} blocks): {freeRewardPerBlock * blockDuration} {rewardToken.symbol}</b></p>
                            </div>
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input min={0} showCoin={true} address={(!freeMainToken?.isEth && !freeLiquidityPoolToken.tokens[freeMainTokenIndex].isEth) ? `${freeMainToken?.address || freeLiquidityPoolToken.tokens[freeMainTokenIndex].address}` : involvingEth ? props.dfoCore.voidEthereumAddress : `${freeMainToken?.address || freeLiquidityPoolToken.tokens[freeMainTokenIndex].address}`} value={minStakeable} name={(!freeMainToken?.isEth && !freeLiquidityPoolToken.tokens[freeMainTokenIndex].isEth) ? `${freeMainToken?.symbol || freeLiquidityPoolToken.tokens[freeMainTokenIndex].symbol}` : involvingEth ? 'ETH' : `${freeMainToken?.symbol || freeLiquidityPoolToken.tokens[freeMainTokenIndex].symbol}`} label={"Min stakeable"} onChange={(e) => setMinSteakeable(e.target.value)} />
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="form-check my-4">
                                    <input className="form-check-input" type="checkbox" checked={isRenewable} onChange={(e) => setIsRenewable(e.target.checked)} id="repeat" />
                                    <label className="form-check-label" htmlFor="repeat">
                                        Repeat
                                    </label>
                                </div>
                            </div>
                            {
                                isRenewable && <div className="row mb-4 justify-content-center">
                                    <div className="col-md-6 col-12">
                                        <Input min={0} width={50} value={renewTimes} onChange={(e) => setRenewTimes(e.target.value)} />
                                    </div>
                                </div>
                            }
                        </>
                    }
                    <div className="row justify-content-center mb-4">
                        <a onClick={() => onCancel() } className="backActionBTN mr-4">Back</a>
                        <a 
                            onClick={() => addFreeSetup()} 
                            disabled={!freeLiquidityPoolToken || freeRewardPerBlock <= 0 || minStakeable <= 0 || !blockDuration} 
                            className="web2ActionBTN ml-4"
                        >
                            {editSetup ? 'Edit' : 'Add'}
                        </a>
                    </div>
                </>
            }
        </div>
    }

    const getLockedFirstStep = () => {
        return <div className="col-12">
            <div className="row mb-4">
                <div className="col-12">
                    <select className="SelectRegular" value={blockDuration} onChange={(e) => setBlockDuration(e.target.value)}>
                        <option value={0}>Choose setup duration</option>
                        {
                            Object.keys(props.dfoCore.getContextElement("blockIntervals")).map((key, index) => {
                                return <option key={index} value={props.dfoCore.getContextElement("blockIntervals")[key]}>{key}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-9">
                    <TokenInput label={"Main token"} placeholder={"Main token address"} width={60} onClick={(address) => onSelectMainToken(address)} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div> :  <>
                    <div className="row mb-4">
                        { lockedMainToken && <div className="col-12">
                                <b>{(lockedMainTokenIsEth && involvingEth) ? 'ETH' : lockedMainToken.symbol}</b> <Coin address={(lockedMainTokenIsEth && involvingEth) ? props.dfoCore.voidEthereumAddress : lockedMainToken.address} className="ml-2" />
                            </div>
                        }
                    </div>
                    {
                        lockedMainToken && <>
                            <hr/>
                            <div className="row justify-content-center my-4">
                                <div className="col-9">
                                    <TokenInput label={"Liquidity pool token"} placeholder={"Liquidity pool token address"} width={60} onClick={(address) => onSelectLockedSecondaryToken(address)} text={"Load"} />
                                </div>
                            </div>
                            {
                                (lockedSecondaryToken && lockedSecondaryToken.tokens.length > 0) && <div key={lockedSecondaryToken.address} className="row align-items-center mb-4">
                                    <div className="col-md-9 col-12">
                                        <b>{lockedSecondaryToken.name} | {lockedSecondaryToken.tokens.map((token) => <>{!token.isEth ? token.symbol : involvingEth ? 'ETH' : token.symbol} </>)}</b> {lockedSecondaryToken.tokens.map((token) => <Coin address={!token.isEth ? token.address : involvingEth ? props.dfoCore.voidEthereumAddress : token.address} className="mr-2" /> )}
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => setLockedSecondaryToken(null)}>Remove</button>
                                    </div>
                                </div>
                            }
                            {
                                (lockedSecondaryToken && ethSelectData) && <div className="row justify-content-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={involvingEth} onChange={(e) => setInvolvingEth(e.target.checked)} id="involvingEth" />
                                        <label className="form-check-label" htmlFor="involvingEth">
                                            Use {ethSelectData.symbol} as ETH
                                        </label>
                                    </div>
                                </div>
                            }
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input min={0} showCoin={true} address={(lockedMainTokenIsEth && involvingEth) ? props.dfoCore.voidEthereumAddress : lockedMainToken.address} value={minStakeable} name={(lockedMainTokenIsEth && involvingEth) ? 'ETH' : lockedMainToken.symbol} label={"Min stakeable"} onChange={(e) => setMinSteakeable(e.target.value)} />
                                </div>
                            </div>
                            <div className="row justify-content-center mt-4 mb-4">
                                <div className="col-6">
                                    <Input label={"Max stakeable"} min={0} showCoin={true} address={(lockedMainTokenIsEth && involvingEth) ? props.dfoCore.voidEthereumAddress : lockedMainToken.address} value={lockedMaxLiquidity} name={(lockedMainTokenIsEth && involvingEth) ? 'ETH' : lockedMainToken.symbol} onChange={(e) => setLockedMaxLiquidity(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                            </div>
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input label={"Reward per block"} min={0} showCoin={true} address={rewardToken.address} value={lockedRewardPerBlock} name={rewardToken.symbol} onChange={(e) => setLockedRewardPerBlock(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                            </div>
                            <div className="row justify-content-center align-items-center flex-column mb-2">
                                <p className="text-center"><b>Reward/block per {(lockedMainTokenIsEth && involvingEth) ? 'ETH': lockedMainToken.symbol}: {!lockedMaxLiquidity ? 0 : parseFloat((lockedRewardPerBlock * (1 / lockedMaxLiquidity)).toPrecision(4))} {rewardToken.symbol}</b></p>
                            </div>
                        </>
                    }
                    <div className="row justify-content-center mb-4">
                        <a onClick={() => onCancel() } className="backActionBTN mr-4">Back</a>
                        <a onClick={() => setCurrentStep((!lockedMainToken || lockedRewardPerBlock <= 0 || !lockedMaxLiquidity || !lockedSecondaryToken || !blockDuration) ? currentStep : 1) } disabled={!lockedMainToken || lockedRewardPerBlock <= 0 || !lockedMaxLiquidity || !lockedSecondaryToken || !blockDuration} className="web2ActionBTN ml-4">Next</a>
                    </div>
                </>
            }
        </div>
    }

    const getLockedSecondStep = () => {
        return (
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" checked={lockedHasPenaltyFee} onChange={(e) => setLockedHasPenaltyFee(e.target.checked)} id="penaltyFee" />
                        <label className="form-check-label" htmlFor="penaltyFee">
                            Penalty fee <span><Coin address={rewardToken.address} height={24} /></span>
                        </label>
                    </div>
                </div>
                {
                    lockedHasPenaltyFee && <div className="row mb-4 justify-content-center">
                        <div className="col-md-6 col-12 flex justify-content-center">
                            <input type="number" className="form-control w-50" step={0.001} max={100} min={0} value={lockedPenaltyFee} onChange={(e) => onUpdatePenaltyFee(e.target.value)} />
                        </div>
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" checked={isRenewable} onChange={(e) => setIsRenewable(e.target.checked)} id="repeat" />
                        <label className="form-check-label" htmlFor="repeat">
                            Repeat
                        </label>
                    </div>
                </div>
                {
                    isRenewable && <div className="row mb-4 justify-content-center">
                        <div className="col-md-6 col-12">
                            <Input min={0} width={50} address={lockedMainToken.address} value={renewTimes} onChange={(e) => setRenewTimes(e.target.value)} />
                        </div>
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center mb-4">
                    <a onClick={() => setCurrentStep(0) } className="backActionBTN mr-4">Back</a>
                    <a onClick={() => {
                            if ((isRenewable && renewTimes === 0) || (lockedHasPenaltyFee && lockedPenaltyFee === 0)) return;
                            editSetup ? 
                            onEditFarmingSetup({
                                period: blockDuration,
                                data: lockedMainToken,
                                maxLiquidity: lockedMaxLiquidity,
                                rewardPerBlock: lockedRewardPerBlock,
                                penaltyFee: lockedPenaltyFee,
                                renewTimes,
                                secondaryToken: lockedSecondaryToken,
                                minStakeable,
                                involvingEth,
                                ethAddress,
                                ethSelectData,
                                lockedMainTokenIsEth,
                            }, editSetupIndex) : onAddFarmingSetup({
                                period: blockDuration,
                                data: lockedMainToken,
                                maxLiquidity: lockedMaxLiquidity,
                                rewardPerBlock: lockedRewardPerBlock,
                                penaltyFee: lockedPenaltyFee,
                                renewTimes,
                                secondaryToken: lockedSecondaryToken,
                                minStakeable,
                                involvingEth,
                                ethAddress,
                                ethSelectData,
                                lockedMainTokenIsEth
                            }
                        )}
                    } disabled={(isRenewable && renewTimes === 0) || (lockedHasPenaltyFee && lockedPenaltyFee === 0)} className="web2ActionBTN ml-4">
                        {editSetup ? 'Edit' : 'Add'}
                    </a>
                </div>
            </div>
        )
    }

    if (currentStep === 0) {
        return selectedFarmingType === 'free' ? getFreeFirstStep() : getLockedFirstStep();
    } else if (currentStep === 1) {
        return getLockedSecondStep();
    }

    return (
        <div/>
    )
}


const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(CreateOrEditFarmingSetup);