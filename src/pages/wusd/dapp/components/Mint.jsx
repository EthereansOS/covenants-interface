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
    const [mintLoading, setMintLoading] = useState(false);
    const [isHealthyPair, setIsHealthyPair] = useState(true);

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
                            const ammInfo = await ammContract.methods.info().call();
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
                            const symbolLp = await lpContract.methods.symbol().call();
                            const balanceLp = await lpContract.methods.balanceOf(props.dfoCore.address).call();
                            const decimalsLp = await lpContract.methods.decimals().call();
                            setLpTokenBalance(props.dfoCore.toDecimals(balanceLp, parseInt(decimalsLp)));
                            setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                            setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
                            pools.push({ ammContract, ammName: ammInfo[0], ammIndex, lpIndex, totalAmount, symbolLp, token0Amount, token1Amount, lpContract, liquidityPool, token0, token1, symbol0, symbol1, token0decimals, token1decimals, decimalsLp, token0Contract, token1Contract });
                        } catch (error) {
                            console.log(error);
                        }
                    }));
                    allowedPairs = [...allowedPairs, ...pools ];
                } catch (error) {
                    console.error(error);
                }
            }))
            allowedPairs = allowedPairs.sort((a, b) => a.ammName.localeCompare(b.ammName));
            setPairs(allowedPairs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const clear = () => {
        setFirstAmount({ value: 0, full: 0});
        setSecondAmount({ value: 0, full: 0});
        setLpTokenAmount({ value: 0, full: 0});
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
        setLoading(true);
        try {
            if (pairIndex) {
                const chosenPair = pairs[pairIndex];
                const allowance0 = await chosenPair.token0Contract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
                const allowance1 = await chosenPair.token1Contract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
                const allowanceLp = await chosenPair.lpContract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
                setFirstTokenApproved(parseInt(allowance0) !== 0);
                setSecondTokenApproved(parseInt(allowance1) !== 0);
                setLpTokenApproved(parseInt(allowanceLp) !== 0);
                const balance0 = await chosenPair.token0Contract.methods.balanceOf(props.dfoCore.address).call();
                const balance1 = await chosenPair.token1Contract.methods.balanceOf(props.dfoCore.address).call();
                const balanceLp = await chosenPair.lpContract.methods.balanceOf(props.dfoCore.address).call();
                setLpTokenBalance(props.dfoCore.toDecimals(balanceLp, parseInt(chosenPair.decimalsLp)));
                setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(chosenPair.token0decimals)));
                setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(chosenPair.token1decimals)));

                const res = await chosenPair.ammContract.methods.byLiquidityPool(chosenPair.liquidityPool).call();

                const tokensAmounts = res[1];
                const updatedFirstTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[0], chosenPair.token0decimals));
                const updatedSecondTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[1], chosenPair.token1decimals));
        
                const ratio = updatedFirstTokenAmount > updatedSecondTokenAmount ? updatedFirstTokenAmount / updatedSecondTokenAmount : updatedSecondTokenAmount / updatedFirstTokenAmount;
                const maximumPairRatioForMint = await wusdExtensionController.methods.maximumPairRatioForMint().call();
                const oneHundred = await wusdExtensionController.methods.ONE_HUNDRED().call()
                
                console.log(parseFloat(ratio), (parseInt(maximumPairRatioForMint) / parseInt(oneHundred)));
                if (parseFloat(ratio) > (parseInt(maximumPairRatioForMint) / parseInt(oneHundred))) {
                    setIsHealthyPair(false);
                } else {
                    setIsHealthyPair(true);
                }
            }
            setPair(pairIndex);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const mintWUSD = async () => {
        setMintLoading(true);
        try {
            if ((firstAmount.value > 0 && secondAmount.value > 0) || lpTokenAmount.value > 0) {
                const chosenPair = pairs[pair];
                const { ammIndex, lpIndex, token0Contract, token1Contract, token0decimals, token1decimals } = chosenPair;
                console.log(`amm index: ${ammIndex}`);
                console.log(`lp index ${lpIndex}`);
                console.log(`lp amount ${lpTokenAmount.full.toString()}`);
                console.log(`first token amount ${firstAmount.full.toString()}`);
                console.log(`second token amount ${firstAmount.full.toString()}`);
                const gasLimit = await wusdExtensionController.methods.addLiquidity(ammIndex, lpIndex, lpTokenAmount.full.toString(), false).estimateGas({ from: props.dfoCore.address });
                const result = await wusdExtensionController.methods.addLiquidity(ammIndex, lpIndex, lpTokenAmount.full.toString(), false).send({ from: props.dfoCore.address, gasLimit });
                const balance0 = await token0Contract.methods.balanceOf(props.dfoCore.address).call();
                const balance1 = await token1Contract.methods.balanceOf(props.dfoCore.address).call();
                setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
            } else {
                return;
            }
            setFirstAmount({ value: 0, full: 0});
            setSecondAmount({ value: 0, full: 0});
            setLpTokenAmount({ value: 0, full: 0});
        } catch (error) {
            console.error(error);
        } finally {
            setMintLoading(false);
        }
    }

    const updateFirstAmount = async (amount) => {
        if (!amount) {
            clear();
            return;
        };
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0, token0decimals, token1decimals, decimalsLp } = chosenPair;
        const updatedFirstAmount = { value: props.dfoCore.toFixed(amount), full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", token0decimals)).toString()};
        setFirstAmount(updatedFirstAmount);

        const res = await ammContract.methods.byTokenAmount(liquidityPool, token0, updatedFirstAmount.full.toString()).call();
        const { tokensAmounts, liquidityPoolAmount } = res;

        setSecondAmount({ value: props.dfoCore.toDecimals(tokensAmounts[1], token1decimals), full: tokensAmounts[1]});
        setLpTokenAmount({ value: props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp), full: liquidityPoolAmount });
    }

    const updateSecondAmount = async (amount) => {
        try {
            if (!amount) {
                clear();
                return;
            };
            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token1, token0decimals, token1decimals, decimalsLp } = chosenPair;
            const updatedSecondAmount = { value: props.dfoCore.toFixed(amount), full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", token1decimals)).toString()};
            setSecondAmount(updatedSecondAmount);
    
            const res = await ammContract.methods.byTokenAmount(liquidityPool, token1, updatedSecondAmount.full).call();
            const { tokensAmounts, liquidityPoolAmount } = res;
    
            setFirstAmount({ value: props.dfoCore.toDecimals(tokensAmounts[0], token0decimals), full: tokensAmounts[0]});
            setLpTokenAmount({ value: props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp), full: liquidityPoolAmount });
        } catch (error) {
            console.error(error);
        }
    }

    const updateLpAmount = async (amount) => {
        if (!amount) {
            clear();
            return;
        };
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp } = chosenPair;
        const updatedLpAmount = { value: props.dfoCore.toFixed(amount), full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", decimalsLp).toString())};
        setLpTokenAmount(updatedLpAmount);

        const res = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, updatedLpAmount.full).call();
        const { tokensAmounts } = res;

        setFirstAmount({ value: props.dfoCore.toDecimals(tokensAmounts[0], token0decimals), full: tokensAmounts[0]});
        setSecondAmount({ value: props.dfoCore.toDecimals(tokensAmounts[1], token1decimals), full: tokensAmounts[1]});
    }

    const getEstimatedAmount = () => {
        if (firstAmount.value != 0 && secondAmount.value != 0) {
            return parseFloat(firstAmount.value) + parseFloat(secondAmount.value);
        }
        return 0;
    }

    const getLpToken = () => {
        const chosenPair = pairs[pair];

        return (
            <div className="col-12 mb-4">
                <Input showMax={true} step={0.0001} value={lpTokenAmount.value} balance={lpTokenBalance} min={0} onChange={(e) => updateLpAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={`${chosenPair.symbol0}/${chosenPair.symbol1}`} />
            </div>
        )
    }

    const getMultipleTokens = () => {
        
        return (
            <>
                <div className="col-12 mb-4">
                    <Input showMax={true} step={0.0001}  value={firstAmount.value} address={pairs[pair].token0} balance={firstTokenBalance} min={0} onChange={(e) => updateFirstAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol0} />
                </div>
                <div className="col-12 mb-2">
                    <p><b>And</b></p>
                </div>
                <div className="col-12 mb-4">
                    <Input showMax={true} step={0.0001}  value={secondAmount.value} address={pairs[pair].token1} balance={secondTokenBalance} min={0} onChange={(e) => updateSecondAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol1} />
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
                            (!useLpToken && !firstTokenApproved) ? 
                                <ApproveButton contract={pairs[pair].token0Contract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('first')} text={`Approve ${pairs[pair].symbol0}`} />
                                :
                                (!useLpToken && !secondTokenApproved) ?
                                    <ApproveButton contract={pairs[pair].token1Contract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('second')} text={`Approve ${pairs[pair].symbol1}`} />
                                : <div/>
                        }
                        
                        {
                            (useLpToken && !lpTokenApproved) && 
                                <ApproveButton contract={pairs[pair].lpContract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('first')} text={`Approve ${pairs[pair].symbolLp}`} />
                        }
                    </div>
                    <div className={`col-12 ${(!useLpToken && firstTokenApproved && secondTokenApproved) || (useLpToken && lpTokenApproved) ? "" : "col-md-6"}`}>
                        {
                            mintLoading ? <button className="btn btn-secondary" disabled={mintLoading}>
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span class="sr-only">Loading...</span>
                            </button>
                            : 
                            <button className="btn btn-secondary" onClick={() => mintWUSD()} disabled={((!firstAmount.value || !secondAmount.value) && !lpTokenAmount.value) || !firstTokenApproved || !secondTokenApproved}>Mint</button>
                        }
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
                    <select className="custom-select wusd-pair-select" value={pair} onChange={(e) => { clear(); setChosenPair(e.target.value); }}>
                        <option value="">Choose pair..</option>
                        {
                            pairs.map((pair, index) => {
                                return <option key={pair.ammName + pair.symbol0 + pair.symbol1} value={index}>{pair.ammName} - {pair.symbol0}/{pair.symbol1}</option>
                            })
                        }
                    </select>
                    {
                        isHealthyPair && <div className="form-check mt-4">
                            <input className="form-check-input" type="checkbox" value={useLpToken} onChange={(e) => setUseLpToken(e.target.checked)} id="useLpToken" disabled={!pair} />
                            <label className="form-check-label" htmlFor="useLpToken">
                                Use liquidity pool token
                            </label>
                        </div>
                    }
                </div>
                {
                    !isHealthyPair && <div className="col-12">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere error, dicta nobis consequatur voluptas culpa dignissimos ipsam laudantium facilis. Ad quia deleniti commodi odit eum accusamus, delectus labore eaque recusandae!
                    </div>
                }
                {
                    (pair && isHealthyPair) ? useLpToken ? getLpToken() : getMultipleTokens() : <div/>
                }
                {
                    (pair && isHealthyPair) ? <div className="col-12 mb-4">
                        <div className="row justify-content-center">
                            <b>For</b>
                        </div>
                        <div className="row justify-content-center">
                            { getEstimatedAmount() } WUSD
                        </div>
                    </div> : <div/>
                }
                {
                    (pair && isHealthyPair) ? getButtons() : <div/>
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