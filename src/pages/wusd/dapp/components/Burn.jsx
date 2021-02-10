import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input } from '../../../../components';
import { ethers } from 'ethers';
import { addTransaction } from '../../../../store/actions';

const abi = new ethers.utils.AbiCoder();

const Burn = (props) => {
    const [pair, setPair] = useState("");
    const [pairs, setPairs] = useState([]);
    const [getLpToken, setGetLpToken] = useState(false);
    const [amount, setAmount] = useState(0);
    const [firstTokenBalance, setFirstTokenBalance] = useState(0);
    const [secondTokenBalance, setSecondTokenBalance] = useState(0);
    const [lpTokenBalance, setLpTokenBalance] = useState(0);
    const [wusdAmount, setWusdAmount] = useState(0);
    const [wusdContract, setWusdContract] = useState(null);
    const [wusdBalance, setWusdBalance] = useState(0);
    const [wusdApproved, setWusdApproved] = useState(false);
    const [wusdDecimals, setWusdDecimals] = useState(18);
    const [estimatedToken0, setEstimatedToken0] = useState(0);
    const [estimatedToken1, setEstimatedToken1] = useState(0);
    const [estimatedLpToken, setEstimatedLpToken] = useState(0);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isHealthyPair, setIsHealthyPair] = useState(true);
    const [burnLoading, setBurnLoading] = useState(false);

    useEffect(() => {
        getController();

        const interval = setInterval(() => {
            if (wusdContract) {
                wusdContract.methods.balanceOf(props.dfoCore.address).call()
                    .then((result) => {            
                        setWusdBalance(props.dfoCore.toDecimals(result, wusdDecimals));
                    })
            }
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    const getController = async () => {
        setLoading(true);
        try {
            clearTokens();
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
            const allowedAMMS = await contract.methods.allowedAMMs().call();
            let allowedPairs = [];
            await Promise.all(allowedAMMS.map(async (allowedAMM, ammIndex) => {
                const { ammAddress, liquidityPools } = allowedAMM;
                const pools = [];
                await Promise.all(liquidityPools.map(async (liquidityPool, lpIndex) => {
                    const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), ammAddress);
                    const poolInfo = await ammContract.methods.byLiquidityPool(liquidityPool).call();
                    const ammInfo = await ammContract.methods.info().call();
                    const ammName = ammInfo[0];
                    const totalAmount = poolInfo['0'];
                    const [token0Amount, token1Amount] = poolInfo['1'];
                    const [token0, token1] = poolInfo['2'];
                    const token0Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token0);
                    const token1Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token1);
                    const symbol0 = await token0Contract.methods.symbol().call();
                    const symbol1 = await token1Contract.methods.symbol().call();
                    const token0decimals = await token0Contract.methods.decimals().call();
                    const token1decimals = await token1Contract.methods.decimals().call();
                    const lpContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), liquidityPool);
                    const lpSymbol = await lpContract.methods.symbol().call();
                    const decimalsLp = await lpContract.methods.decimals().call();
                    const approval = await lpContract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
                    pools.push({ ammName, ammContract, ammIndex, lpContract, lpIndex, lpSymbol, totalAmount, token0Amount, token1Amount, liquidityPool, token0, token1, symbol0, symbol1, token0decimals, token1decimals, decimalsLp, token0Contract, token1Contract, lpTokenApproved: parseInt(approval) !== 0 });
                }));
                allowedPairs = [...allowedPairs, ...pools ];
            }))
            allowedPairs = allowedPairs.sort((a, b) => (a.ammName + a.symbol0 + a.symbol1).localeCompare(b.ammName + b.symbol0 + b.symbol1));
            const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
            const balance = await wusdContract.methods.balanceOf(props.dfoCore.address).call();
            const approval = await wusdContract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
            setWusdContract(wusdContract);
            setWusdApproved(parseInt(approval) !== 0);
            const decimals = await wusdContract.methods.decimals().call();
            setWusdDecimals(decimals);
            setWusdBalance(props.dfoCore.toDecimals(balance, decimals));
            setPairs(allowedPairs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const setChosenPair = async (pairIndex) => {
        setLoading(true);
        try {
            if (pairIndex) {
                const chosenPair = pairs[pairIndex];

                const res = await chosenPair.ammContract.methods.byLiquidityPool(chosenPair.liquidityPool).call();

                const tokensAmounts = res[1];
                const updatedFirstTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[0], chosenPair.token0decimals));
                const updatedSecondTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[1], chosenPair.token1decimals));

                const ratio = parseInt(updatedFirstTokenAmount) > parseInt(updatedSecondTokenAmount) ? parseInt(updatedFirstTokenAmount) / parseInt(updatedSecondTokenAmount) : parseInt(updatedSecondTokenAmount) / parseInt(updatedFirstTokenAmount);
                const maximumPairRatioPerBurn = await wusdExtensionController.methods.maximumPairRatioForBurn().call();
                const oneHundred = await wusdExtensionController.methods.ONE_HUNDRED().call()
        
                if (parseFloat(ratio) > (parseInt(maximumPairRatioPerBurn) / parseInt(oneHundred))) {
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

    const clearTokens = () => {
        setEstimatedToken0({ value: 0, full: 0 });
        setEstimatedToken1({ value: 0, full: 0 });
        setEstimatedLpToken({ value: 0, full: 0});
    }

    const onWUSDAmountChange = async (amount) => {
        setAmount({ value: amount, full: props.dfoCore.fromDecimals(amount.toString(), 18)});
        if (!amount || parseFloat(amount) <= 0) {
            clearTokens();
            return;
        }
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp } = chosenPair;
        setWusdAmount(props.dfoCore.fromDecimals(amount.toString(), 18));

        const res = await ammContract.methods.byLiquidityPool(liquidityPool).call();

        const tokensAmounts = res[1];
        const liquidityPoolTokens = res[2];
        const updatedFirstTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[0], token0decimals));
        const updatedSecondTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(tokensAmounts[1], token1decimals));

        const liquidityPoolMaxRatio = updatedFirstTokenAmount > updatedSecondTokenAmount ? updatedFirstTokenAmount / updatedSecondTokenAmount : updatedSecondTokenAmount / updatedFirstTokenAmount;
        const maximumPairRatioPerBurn = await wusdExtensionController.methods.maximumPairRatioForBurn().call();
        const oneHundred = await wusdExtensionController.methods.ONE_HUNDRED().call()

        if (parseFloat(liquidityPoolMaxRatio) > (parseInt(maximumPairRatioPerBurn) / parseInt(oneHundred))) {
            return setIsHealthyPair(false);
        }

        var token0WusdAmount = props.dfoCore.fromDecimals(amount.toString(), token0decimals);

        var byTokenAmountValue = await ammContract.methods.byTokenAmount(liquidityPool, liquidityPoolTokens[0], props.dfoCore.toFixed(token0WusdAmount).toString()).call();

        var token0Amount = window.web3.utils.toBN(byTokenAmountValue[1][0]).div(window.web3.utils.toBN(2)).toString();
        var token1Amount = window.web3.utils.toBN(byTokenAmountValue[1][1]).div(window.web3.utils.toBN(2)).toString();
        var lpTokenAmount = window.web3.utils.toBN(byTokenAmountValue[0]).div(window.web3.utils.toBN(2)).toString();

        setEstimatedToken0({ full: props.dfoCore.normalizeValue(token0Amount, token0decimals), value: props.dfoCore.toDecimals(token0Amount , token0decimals)});
        setEstimatedToken1({ full: props.dfoCore.normalizeValue(token1Amount, token1decimals), value: props.dfoCore.toDecimals(token1Amount, token1decimals)});
        setEstimatedLpToken({ full: lpTokenAmount, value: props.dfoCore.toDecimals(lpTokenAmount, decimalsLp)});
    }

    const burnWUSD = async () => {
        setBurnLoading(true);
        try {
            const info = await wusdExtensionController.methods.wusdInfo().call();
            const collectionAddress = info['0'];
            const wusdObjectId = info['1'];

            const wusdCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), collectionAddress);
            const burnData = abi.encode(["uint256","uint256","uint256","bool"], [pairs[pair].ammIndex, pairs[pair].lpIndex, estimatedLpToken.full, getLpToken])
            const data = abi.encode(["uint256", "bytes"], [0, burnData]);

            const gasLimit = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [wusdAmount], abi.encode(["bytes[]"], [[data]])).estimateGas({ from: props.dfoCore.address});
            const res = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [wusdAmount], abi.encode(["bytes[]"], [[data]])).send({ from: props.dfoCore.address, gasLimit });
            props.addTransaction(res);
            await getController();
        } catch (error) {
            console.error(error);
        } finally {
            setBurnLoading(false);
        }
    }

    const getWUSDToken = () => {
        return (
            <div className="InputTokensRegular">
                <div className="InputTokenRegular">
                    <Input showMax={true} value={amount.value} balance={wusdBalance} min={0} onChange={(e) => onWUSDAmountChange(e.target.value)} address={props.dfoCore.getContextElement("WUSDAddress")} showCoin={true} showBalance={true} name="WUSD" />
                </div>
            </div>
        )
    }

    const getBurnAmount = () => {
        if (!pair) {
            return (<div/>);
        }
        
        if (getLpToken) {
            return (
                <div className="Resultsregular">
                        <p>For <b> { estimatedLpToken.value } { pairs[pair].lpSymbol } </b></p>
                </div>
            )
        }
        return (
            <div className="Resultsregular">
                    <p>For <b> { estimatedToken0.value } { pairs[pair].symbol0 } / { estimatedToken1.value } { pairs[pair].symbol1 }</b></p>
            </div>
        )
    }

    const getButtons = () => {
        return (
            <div className="Web3BTNs">
                    {
                        /*
                        !wusdApproved ? <div className="col-12 col-md-6">
                            <ApproveButton contract={wusdContract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('wusd')} text={`Approve WUSD`} />
                        </div> : <div/>
                        */
                    }
                    {
                        /*
                        !pairs[pair].lpTokenApproved ? <div className="col-12 col-md-6">
                            <ApproveButton contract={pairs[pair].lpContract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval(pair)} text={`Approve ${pairs[pair].lpSymbol}`} />
                        </div> : <div/>
                        */
                    }
                            {
                                burnLoading ? <a className="Web3ActionBTN" disabled={burnLoading}>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </a> : <a onClick={() => burnWUSD()} disabled={!amount.full || !amount.value || amount.value === 0 || amount.full === 0} className="Web3ActionBTN">Burn</a>
                            }
            </div>
        )
    }
    
    if (loading) {
        return (
            <div className="explore-component">
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
        <div className="MintBurn">
                <div className="PairSelector">
                    <select className="SelectRegular" value={pair} onChange={(e) => setChosenPair(e.target.value)}>
                        <option value="">Select a pair..</option>
                        {
                            pairs.map((pair, index) => {
                                return <option key={pair.ammName + pair.symbol0 + pair.symbol1} value={index}>{pair.ammName} - {pair.symbol0}/{pair.symbol1}</option>
                            })
                        }
                    </select>
                    {
                        isHealthyPair && <div className="QuestionRegular">
                            <input type="checkbox" value={getLpToken} onChange={(e) => setGetLpToken(e.target.checked)} id="getLpToken" disabled={!pair} />
                            <label htmlFor="getLpToken">Get liquidity pool token</label>
                        </div>
                    }
                </div>
                {
                    !isHealthyPair && <div className="DisclamerRegular">
                        <p><b>This pair is not healthy at the moment!</b> <br></br> Select a different pair or try again at another time.</p>
                    </div>
                }
                {
                    (pair && isHealthyPair) ? getWUSDToken() : <div/>
                }
                { isHealthyPair && getBurnAmount() }
                {
                    (isHealthyPair && pair) ? getButtons() : <div/>
                }
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTransaction: (index) => dispatch(addTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Burn);