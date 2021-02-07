import { useState } from 'react';
import { connect } from 'react-redux';
import { useEffect } from 'react/cjs/react.development';
import { ApproveButton, Input } from '../../../../components';

const Mint = (props) => {
    const [pair, setPair] = useState("");
    const [pairs, setPairs] = useState([]);
    const [useLpToken, setUseLpToken] = useState(false);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [firstAmount, setFirstAmount] = useState(0);
    const [secondAmount, setSecondAmount] = useState(0);
    const [firstTokenApproved, setFirstTokenApproved] = useState(false);
    const [secondTokenApproved, setSecondTokenApproved] = useState(false);
    const [firstTokenBalance, setFirstTokenBalance] = useState(0);
    const [secondTokenBalance, setSecondTokenBalance] = useState(0);
    const [lpTokenBalance, setLpTokenBalance] = useState(0);
    const [lpTokenApproved, setLpTokenApproved] = useState(false);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getController();
    }, [])

    const getController = async () => {
        setLoading(true);
        try {
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
            const allowedAMMS = await contract.methods.allowedAMMs().call();
            let allowedPairs = [];
            await Promise.all(allowedAMMS.map(async (allowedAMM, ammIndex) => {
                try {
                    const { ammAddress, liquidityPools } = allowedAMM;
                    const pools = [];
                    await Promise.all(liquidityPools.map(async (liquidityPool, lpIndex) => {
                        try {
                            const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), ammAddress);
                            const poolInfo = await ammContract.methods.byLiquidityPool(liquidityPool).call();
                            const totalAmount = poolInfo['0'];
                            const [token0Amount, token1Amount] = poolInfo['1'];
                            const [token0, token1] = poolInfo['2'];
                            const token0Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token0);
                            const token1Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token1);
                            const symbol0 = await token0Contract.methods.symbol().call();
                            const symbol1 = await token1Contract.methods.symbol().call();
                            const balance0 = await token0Contract.methods.balanceOf(props.dfoCore.address).call();
                            const token0decimals = await token0Contract.methods.decimals().call();
                            const balance1 = await token1Contract.methods.balanceOf(props.dfoCore.address).call();
                            const token1decimals = await token1Contract.methods.decimals().call();
                            const lpContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), liquidityPool);
                            const balanceLp = await lpContract.methods.balanceOf(props.dfoCore.address).call();
                            const decimalsLp = await lpContract.methods.decimals().call();
                            setLpTokenBalance(props.dfoCore.toDecimals(balanceLp, parseInt(decimalsLp)));
                            setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                            setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
                            pools.push({ ammContract, ammIndex, lpIndex, totalAmount, token0Amount, token1Amount, liquidityPool, token0, token1, symbol0, symbol1, token0decimals, token1decimals, decimalsLp, token0Contract, token1Contract });
                        } catch (error) {
                            console.log(error);
                        }
                    }));
                    allowedPairs = [...allowedPairs, ...pools ];
                } catch (error) {
                    console.log(error);
                }
            }))
            setPairs(allowedPairs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onTokenApproval = (type) => {
        switch (type) {
            case 'first':
                setFirstTokenApproved(true);
            case 'second':
                setSecondTokenApproved(true);
            case 'lp':
                setLpTokenApproved(true);
            default:
                return;
        }
    }

    const setChosenPair = async (pairIndex) => {
        setPair(pairIndex);
        if (pairIndex) {
            const chosenPair = pairs[pairIndex];
            const allowance0 = await chosenPair.token0Contract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
            const allowance1 = await chosenPair.token1Contract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
            console.log(allowance0, allowance1);
            setFirstTokenApproved(parseInt(allowance0) !== 0);
            setSecondTokenApproved(parseInt(allowance1) !== 0);
        }
    }

    const mintWUSD = async () => {
        setLoading(true);
        try {
            if (firstAmount > 0 && secondAmount > 0) {
                const chosenPair = pairs[pair];
                const { ammIndex, lpIndex, token0Contract, token1Contract, token0decimals, token1decimals } = chosenPair;
                await wusdExtensionController.methods.addLiquidity(ammIndex, lpIndex, props.dfoCore.fromDecimals(lpTokenAmount.toString(), 18).toString(), false).send({ from: props.dfoCore.address, gasLimit: 1000000 });
                const balance0 = await token0Contract.methods.balanceOf(props.dfoCore.address).call();
                const balance1 = await token1Contract.methods.balanceOf(props.dfoCore.address).call();
                setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
            } else if (lpTokenAmount > 0) {
                
            } else {
                return;
            }
            setFirstAmount(0);
            setSecondAmount(0);
            setLpTokenAmount(0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const updateFirstAmount = async (amount) => {
        if (!amount) return;
        setFirstAmount(amount);
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0, token0decimals, token1decimals, decimalsLp } = chosenPair;
        const amount0 = props.dfoCore.fromDecimals(amount.toString(), token0decimals).toString();

        const res = await ammContract.methods.byTokenAmount(liquidityPool, token0, props.dfoCore.toFixed(amount0)).call();
        const { tokensAmounts, liquidityPoolAmount } = res;

        const fixedSecondAmount = props.dfoCore.toDecimals(tokensAmounts[1], token1decimals);
        const fixedLpAmount = props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp);

        setSecondAmount(fixedSecondAmount);
        setLpTokenAmount(fixedLpAmount);
    }

    const updateSecondAmount = async (amount) => {
        if (!amount) return;
        setSecondAmount(amount);
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token1, token0decimals, token1decimals, decimalsLp } = chosenPair;
        const amount1 = props.dfoCore.fromDecimals(amount.toString(), token1decimals).toString();

        const res = await ammContract.methods.byTokenAmount(liquidityPool, token1, props.dfoCore.toFixed(amount1)).call();

        const { tokensAmounts, liquidityPoolAmount } = res;

        const fixedFirstAmount = props.dfoCore.toDecimals(tokensAmounts[0], token0decimals);
        const fixedLpAmount = props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp);

        setLpTokenAmount(fixedLpAmount);
        setFirstAmount(fixedFirstAmount);
    }

    const updateLpAmount = async (amount) => {
        if (!amount) return;
        setLpTokenAmount(amount);
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0decimals, token1decimals } = chosenPair;
        const lpAmount = props.dfoCore.fromDecimals(amount.toString(), 18).toString();
        const res = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, lpAmount).call();
        const { tokensAmounts } = res;
        setFirstAmount(props.dfoCore.toDecimals(tokensAmounts[0], token0decimals));
        setSecondAmount(props.dfoCore.toDecimals(tokensAmounts[1], token1decimals));
    }

    const getEstimatedAmount = () => {
        if (firstAmount != 0 && secondAmount != 0) {
            return parseFloat(firstAmount) + parseFloat(secondAmount);
        }
        return 0;
    }

    const getLpToken = () => {
        const chosenPair = pairs[pair];

        return (
            <div className="col-12 mb-4">
                <Input showMax={true} step={0.0001} value={lpTokenAmount} balance={lpTokenBalance} min={0} onChange={(e) => updateLpAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={`${chosenPair.symbol0}/${chosenPair.symbol1}`} />
            </div>
        )
    }

    const getMultipleTokens = () => {
        
        return (
            <>
                <div className="col-12 mb-4">
                    <Input showMax={true} step={0.0001}  value={firstAmount} address={pairs[pair].token0} balance={firstTokenBalance} min={0} onChange={(e) => updateFirstAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol0} />
                </div>
                <div className="col-12 mb-2">
                    <p><b>And</b></p>
                </div>
                <div className="col-12 mb-4">
                    <Input showMax={true} step={0.0001}  value={secondAmount} address={pairs[pair].token1} balance={secondTokenBalance} min={0} onChange={(e) => updateSecondAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol1} />
                </div>
            </>
        )
    }

    const getButtons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        {
                            !firstTokenApproved ? 
                                <ApproveButton contract={pairs[pair].token0Contract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('first')} text={`Approve ${pairs[pair].symbol0}`} />
                                :
                                !secondTokenApproved ?
                                    <ApproveButton contract={pairs[pair].token1Contract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('second')} text={`Approve ${pairs[pair].symbol1}`} />
                                : <ApproveButton disabled={true} onError={(error) => console.log(error)} />
                        }
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-secondary" onClick={() => mintWUSD()} disabled={((!firstAmount || !secondAmount) && !lpTokenAmount) || !firstTokenApproved || !secondTokenApproved}>Mint</button>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="mint-component">
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="mint-component">
            <div className="row">
                <div className="col-12 mb-4">
                    <select className="custom-select wusd-pair-select" value={pair} onChange={(e) => setChosenPair(e.target.value)}>
                        <option value="">Choose pair..</option>
                        {
                            pairs.map((pair, index) => {
                                return <option key={pair.ammName + pair.symbol0 + pair.symbol1} value={index}>{pair.ammName} - {pair.symbol0}/{pair.symbol1}</option>
                            })
                        }
                    </select>
                    <div className="form-check mt-4">
                        <input className="form-check-input" type="checkbox" value={useLpToken} onChange={(e) => setUseLpToken(e.target.checked)} id="useLpToken" disabled={!pair} />
                        <label className="form-check-label" htmlFor="useLpToken">
                            Use liquidity pool token
                        </label>
                    </div>
                </div>
                {
                    pair ? useLpToken ? getLpToken() : getMultipleTokens() : <div/>
                }
                {
                    pair ? <div className="col-12 mb-4">
                        <div className="row justify-content-center">
                            <b>For</b>
                        </div>
                        <div className="row justify-content-center">
                            { getEstimatedAmount() } WUSD
                        </div>
                    </div> : <div/>
                }
                {
                    pair ? getButtons() : <div/>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Mint);