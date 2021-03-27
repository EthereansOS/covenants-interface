import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Coin, Input, TokenInput } from '../../../../components/shared';

const CreateOrEditFarmingSetup = (props) => {
    const { rewardToken, onAddFarmingSetup, editSetup, onEditFarmingSetup, dfoCore, onCancel } = props;
    const selectedFarmingType = editSetup ? (editSetup.free ? "free" : "locked") : props.selectedFarmingType;
    // general purpose
    const [loading, setLoading] = useState(false);
    const [blockDuration, setBlockDuration] = useState((editSetup && editSetup.blockDuration) ? editSetup.blockDuration : 0);
    const [hasMinStakeable, setHasMinStakeable] = useState((editSetup && editSetup.minStakeable) ? editSetup.minStakeable : false);
    const [minStakeable, setMinSteakeable] = useState((editSetup && editSetup.minStakeable) ? editSetup.minStakeable : 0);
    const [isRenewable, setIsRenewable] = useState((editSetup && editSetup.renewTimes) ? editSetup.renewTimes > 0 : false);
    const [renewTimes, setRenewTimes] = useState((editSetup && editSetup.renewTimes) ? editSetup.renewTimes : 0);
    const [involvingEth, setInvolvingEth] = useState((editSetup && editSetup.involvingEth) ? editSetup.involvingEth : false);
    const [ethSelectData, setEthSelectData] = useState((editSetup && editSetup.ethSelectData) ? editSetup.ethSelectData : null);
    // token state
    const [liquidityPoolToken, setLiquidityPoolToken] = useState((editSetup && editSetup.data) ? editSetup.data : null);
    const [mainTokenIndex, setMainTokenIndex] = useState((editSetup && editSetup.mainTokenIndex) ? editSetup.mainTokenIndex : 0);
    const [mainToken, setMainToken] = useState((editSetup && editSetup.mainToken) ? editSetup.mainToken : null);
    const [rewardPerBlock, setRewardPerBlock] = useState((editSetup && editSetup.rewardPerBlock) ? editSetup.rewardPerBlock : 0);
    const [maxStakeable, setMaxStakeable] = useState((editSetup && editSetup.maxStakeable) ? editSetup.maxStakeable : 0);
    const [hasPenaltyFee, setHasPenaltyFee] = useState((editSetup && editSetup.penaltyFee) ? editSetup.penaltyFee > 0 : false);
    const [penaltyFee, setPenaltyFee] = useState((editSetup && editSetup.penaltyFee) ? editSetup.penaltyFee : 0);
    const [ethAddress, setEthAddress] = useState((editSetup && editSetup.ethAddress) ? editSetup.ethAddress : "");
    // current step
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (editSetup && (editSetup.liquidityPoolTokenAddress || (editSetup.liquidityPoolToken && editSetup.liquidityPoolToken.address))) {
            onSelectLiquidityPoolToken(editSetup.liquidityPoolTokenAddress || editSetup.liquidityPoolToken.address).then(() => editSetup.mainToken && setMainToken(editSetup.mainToken));
        }
    }, []);

    const onSelectLiquidityPoolToken = async (address) => {
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
                    setEthAddress(ammData[0]);
                    if (ammData[0] === dfoCore.voidEthereumAddress) {
                        setEthSelectData(null);
                    } else {
                        const notEthToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), ammData[0]);
                        const notEthTokenSymbol = await notEthToken.methods.symbol().call();
                        setEthSelectData({ symbol: notEthTokenSymbol })
                    }
                }
                const currentToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), tkAddress);
                const symbol = tkAddress === window.voidEthereumAddress ? "ETH" : await currentToken.methods.symbol().call();
                tokens.push({ symbol, address: tkAddress, isEth: tkAddress.toLowerCase() === ammData[0].toLowerCase() })
            }));
            const lpTokenContract = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address);
            const decimals = await lpTokenContract.methods.decimals().call();
            if (!ethTokenFound) setEthSelectData(null);
            setLiquidityPoolToken({
                address,
                name,
                tokens,
                decimals,
            });
            setMainToken(tokens[0]);
        } catch (error) {
            setInvolvingEth(false);
            setEthSelectData(null);
            setLiquidityPoolToken(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onUpdateHasMinStakeable = (value) => {
        setHasMinStakeable(value);
        setMinSteakeable(0);
    }

    const onUpdateHasPenaltyFee = (value) => {
        setHasPenaltyFee(value);
        setPenaltyFee(0)
    }

    const onUpdatePenaltyFee = (value) => {
        setPenaltyFee(value > 100 ? 100 : value);
    }

    const onFreeRewardPerBlockUpdate = (value) => {
        const parsedValue = dfoCore.fromDecimals(value, rewardToken.decimals);
        setRewardPerBlock(parsedValue < 1 ? 0 : value);
    }

    const addSetup = () => {
        const setup = {
            free: selectedFarmingType === 'free',
            blockDuration,
            minStakeable,
            renewTimes,
            involvingEth,
            ethSelectData,
            liquidityPoolToken,
            mainTokenIndex,
            mainToken,
            rewardPerBlock,
            maxStakeable,
            penaltyFee,
            ethAddress
        };
        editSetup ? onEditFarmingSetup(setup, props.editSetupIndex) : onAddFarmingSetup(setup);
    }

    const getFirstStep = () => {
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
                    <TokenInput label={"Liquidity pool address"} placeholder={"Liquidity pool address"} tokenAddress={(editSetup && (editSetup.liquidityPoolTokenAddress || (editSetup.liquidityPoolToken && editSetup.liquidityPoolToken.address))) || ""} width={60} onClick={onSelectLiquidityPoolToken} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div> : <>
                    <div className="row mb-4">
                        {(liquidityPoolToken && liquidityPoolToken.tokens.length > 0) && <div className="col-12">
                            <b>{liquidityPoolToken.name} | {liquidityPoolToken.tokens.map((token) => <>{!token.isEth ? token.symbol : involvingEth ? 'ETH' : token.symbol} </>)}</b> {liquidityPoolToken.tokens.map((token) => <Coin address={!token.isEth ? token.address : involvingEth ? props.dfoCore.voidEthereumAddress : token.address} className="mr-2" />)}
                        </div>
                        }
                    </div>
                    {
                        liquidityPoolToken && <>
                            {
                                false && ethSelectData && <div className="row justify-content-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" checked={involvingEth} onChange={(e) => setInvolvingEth(e.target.checked)} id="involvingEth" />
                                        <label className="form-check-label" htmlFor="involvingEth">
                                            Use {ethSelectData.symbol} as ETH
                                        </label>
                                    </div>
                                </div>
                            }
                            {
                                selectedFarmingType === 'locked' && <>
                                    <select className="SelectRegular" value={mainTokenIndex} onChange={(e) => { setMainTokenIndex(e.target.value); setMainToken(liquidityPoolToken.tokens[e.target.value]); }}>
                                        {
                                            liquidityPoolToken.tokens.map((tk, index) => {
                                                return <option key={tk.address} value={index}>{!tk.isEth ? tk.symbol : involvingEth ? 'ETH' : tk.symbol}</option>
                                            })
                                        }
                                    </select>
                                    <div className="row justify-content-center mt-4 mb-4">
                                        <div className="col-6">
                                            <Input label={"Max stakeable"} min={0} showCoin={true} address={(mainToken.isEth && involvingEth) ? props.dfoCore.voidEthereumAddress : mainToken.address} value={maxStakeable} name={(mainToken.isEth && involvingEth) ? 'ETH' : mainToken.symbol} onChange={(e) => setMaxStakeable(e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="row justify-content-center my-4">
                                <div className="col-6">
                                    <Input min={dfoCore.fromDecimals(rewardToken, rewardToken.decimals)} showCoin={true} address={rewardToken.address} value={rewardPerBlock} name={rewardToken.symbol} label={"Reward per block"} onChange={(e) => onFreeRewardPerBlockUpdate(e.target.value)} />
                                </div>
                            </div>
                            {
                                selectedFarmingType !== 'free' && <div className="row justify-content-center align-items-center flex-column mb-2">
                                    <p className="text-center"><b>Reward/block per {(mainToken.isEth && involvingEth) ? 'ETH' : mainToken.symbol}: {!maxStakeable ? 0 : window.numberToString((rewardPerBlock * (1 / maxStakeable)))} {rewardToken.symbol}</b></p>
                                </div>
                            }
                            <div className="row justify-content-center align-items-center flex-column mb-2">
                                <p className="text-center"><b>Total reward ({`${blockDuration}`} blocks): {rewardPerBlock * blockDuration} {rewardToken.symbol}</b></p>
                            </div>
                        </>
                    }
                    <div className="row justify-content-center mb-4">
                        <a onClick={() => onCancel()} className="backActionBTN mr-4">Back</a>
                        <a onClick={() => setCurrentStep(1)} className="web2ActionBTN ml-4">Next</a>
                    </div>
                </>
            }
        </div>
    }

    const getSecondStep = () => {
        return (
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" checked={hasMinStakeable} onChange={(e) => onUpdateHasMinStakeable(e.target.checked)} id="minStakeable" />
                        <label className="form-check-label" htmlFor="minStakeable">
                            Min stakeable
                        </label>
                    </div>
                </div>
                {
                    hasMinStakeable && <div className="row justify-content-center mb-4">
                        <div className="col-6">
                            <Input min={0} showCoin={true} address={(!mainToken?.isEth && !liquidityPoolToken.tokens[mainTokenIndex].isEth) ? `${mainToken?.address || liquidityPoolToken.tokens[mainTokenIndex].address}` : involvingEth ? props.dfoCore.voidEthereumAddress : `${mainToken?.address || liquidityPoolToken.tokens[mainTokenIndex].address}`} value={minStakeable} name={(!mainToken?.isEth && !liquidityPoolToken.tokens[mainTokenIndex].isEth) ? `${mainToken?.symbol || liquidityPoolToken.tokens[mainTokenIndex].symbol}` : involvingEth ? 'ETH' : `${mainToken?.symbol || liquidityPoolToken.tokens[mainTokenIndex].symbol}`} onChange={(e) => setMinSteakeable(e.target.value)} />
                        </div>
                        {
                            selectedFarmingType === 'free' && <div className="col-12 mt-4">
                                {parseFloat(minStakeable) > 0 && <select className="SelectRegular" value={mainTokenIndex} onChange={(e) => { setMainTokenIndex(e.target.value); setMainToken(liquidityPoolToken.tokens[e.target.value]); }}>
                                    {
                                        liquidityPoolToken.tokens.map((tk, index) => {
                                            return <option key={tk.address} value={index}>{!tk.isEth ? tk.symbol : involvingEth ? 'ETH' : tk.symbol}</option>
                                        })
                                    }
                                </select>
                                }
                            </div>
                        }
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                {
                    selectedFarmingType === 'locked' && <>
                        <div className="row justify-content-center">
                            <div className="form-check my-4">
                                <input className="form-check-input" type="checkbox" checked={hasPenaltyFee} onChange={(e) => onUpdateHasPenaltyFee(e.target.checked)} id="penaltyFee" />
                                <label className="form-check-label" htmlFor="penaltyFee">
                                    Penalty fee <span><Coin address={rewardToken.address} height={24} /></span>
                                </label>
                            </div>
                        </div>
                        {
                            hasPenaltyFee && <div className="row mb-4 justify-content-center">
                                <div className="col-md-6 col-12 flex justify-content-center">
                                    <div className="SpecialInputPerch">
                                        <aside>%</aside>
                                        <input type="number" min={0} max={100} value={penaltyFee} onChange={(e) => onUpdatePenaltyFee(e.target.value)} className="TextRegular" />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="row mb-4">
                            <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                        </div>
                    </>
                }
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" checked={isRenewable} onChange={(e) => {
                            setRenewTimes(0);
                            setIsRenewable(e.target.checked);
                        }} id="repeat" />
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
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center mb-4">
                    <a onClick={() => setCurrentStep(0)} className="backActionBTN mr-4">Back</a>
                    <a onClick={() => addSetup()} className="web2ActionBTN ml-4">{editSetup ? 'Edit' : 'Add'}</a>
                </div>
            </div>
        )
    }

    return currentStep === 0 ? getFirstStep() : currentStep === 1 ? getSecondStep() : <div />

}


const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(CreateOrEditFarmingSetup);