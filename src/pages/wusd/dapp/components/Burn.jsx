import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input, Coin } from '../../../../components';
import { ethers } from 'ethers';
import { addTransaction } from '../../../../store/actions';

const abi = new ethers.utils.AbiCoder();

const Burn = (props) => {
    const [pair, setPair] = useState("");
    const [pairs, setPairs] = useState([]);
    const [outputType, setOutputType] = useState("pair");
    const [amount, setAmount] = useState(0);
    const [firstTokenBalance, setFirstTokenBalance] = useState(0);
    const [secondTokenBalance, setSecondTokenBalance] = useState(0);
    const [lpTokenBalance, setLpTokenBalance] = useState(0);
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
    const [wusdPresto, setWusdPresto] = useState(null);
    const [amms, setAmms] = useState([]);
    const [selectedAmmIndex, setSelectedAmmIndex] = useState(null);
    const [ethBalance, setEthBalance] = useState("0");
    const [ethAmount, setEthAmount] = useState({});
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        getController();
        return () => {
            console.log('clearing interval.');
            clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (wusdContract) {
                setWusdBalance(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(props.dfoCore.address).call(), wusdDecimals));
            }
        }, 2000);
        setIntervalId(interval);
    }, [wusdContract])

    useEffect(() => {
        updateETHAmount(selectedAmmIndex)
    }, [selectedAmmIndex, estimatedToken1]);

    const getController = async () => {
        setLoading(true);
        try {
            clearTokens();
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
            const extensionAddress = await contract.methods.extension().call();
            const ammAggregatorContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
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
                    const balanceOf = await ammAggregatorContract.methods.balanceOf(liquidityPool, extensionAddress).call();
                    const isValid = parseInt(balanceOf['0']) > 0;
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
                    pools.push({ ammName, ammContract, ammIndex, balanceOf, isValid, lpContract, lpIndex, lpSymbol, totalAmount, token0Amount, token1Amount, liquidityPool, token0, token1, symbol0, symbol1, token0decimals, token1decimals, decimalsLp, token0Contract, token1Contract, lpTokenApproved: parseInt(approval) !== 0 });
                }));
                allowedPairs = [...allowedPairs, ...pools];
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
            setWusdPresto(await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDPrestoABI"), props.dfoCore.getContextElement("WUSDPrestoAddress")));
            const amms = [];
            const ammAggregator = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
            const ammAddresses = await ammAggregator.methods.amms().call();
            for (let address of ammAddresses) {
                const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), address);
                const amm = {
                    address,
                    contract: ammContract,
                    info: await ammContract.methods.info().call(),
                    data: await ammContract.methods.data().call()
                }
                amm.data[2] && amms.push(amm);
            }
            setSelectedAmmIndex(0);
            const uniswap = amms.filter(it => it.info[0] === 'UniswapV2')[0];
            const index = amms.indexOf(uniswap);
            amms.splice(index, 1);
            amms.unshift(uniswap);
            setAmms(amms);
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

                setFirstTokenBalance(await chosenPair.token0Contract.methods.balanceOf(props.dfoCore.address).call());
                setSecondTokenBalance(await chosenPair.token1Contract.methods.balanceOf(props.dfoCore.address).call());
                setLpTokenBalance(await chosenPair.lpContract.methods.balanceOf(props.dfoCore.address).call());
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
        setEstimatedLpToken({ value: 0, full: 0 });
    }

    const onWUSDAmountChange = async (amount) => {
        setAmount({ value: amount, full: props.dfoCore.fromDecimals(amount.toString(), 18) });
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

        var token0Amount = window.toDecimals(amount.toString(), token0decimals);
        token0Amount = window.web3.utils.toBN(token0Amount).div(window.web3.utils.toBN(2)).toString();
        var byTokenValue = await ammContract.methods.byTokenAmount(liquidityPool, liquidityPoolTokens[0], token0Amount).call();
        var token1Amount = byTokenValue[1][1];

        var token0WUSD = props.dfoCore.normalizeValue(token0Amount, token0decimals);
        var token1WUSD = props.dfoCore.normalizeValue(token1Amount, token1decimals);
        var amountAsString = amount.toString();
        var splittedAmount = amountAsString.split('.');
        if (splittedAmount.length > 1 && splittedAmount[1].length > token1decimals) {
            amountAsString = `${splittedAmount[0]}.${splittedAmount[1].substring(0, token1decimals)}`;
        }
        var sum = window.web3.utils.toBN(token0WUSD).add(window.web3.utils.toBN(token1WUSD));
        if(sum.gt(window.web3.utils.toBN(window.toDecimals(amount, 18)))) {
            token1Amount = window.toDecimals(amountAsString, token1decimals);
            token1Amount = window.web3.utils.toBN(token1Amount).div(window.web3.utils.toBN(2)).toString();
            byTokenValue = await ammContract.methods.byTokenAmount(liquidityPool, liquidityPoolTokens[1], token1Amount).call();
            token0Amount = byTokenValue[1][0];
        }

        var lpTokenAmount = byTokenValue[0];

        var byLiquidityPool = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, lpTokenAmount).call();
        token0Amount = byLiquidityPool[0][0];
        token1Amount = byLiquidityPool[0][1];

        console.log({token0Amount, token1Amount, lpTokenAmount});

        setEstimatedToken0({ full: token0Amount, value: window.formatMoney(props.dfoCore.toDecimals(token0Amount, token0decimals), 2) });
        setEstimatedToken1({ full: token1Amount, value: window.formatMoney(props.dfoCore.toDecimals(token1Amount, token1decimals), 2) });
        setEstimatedLpToken({ full: lpTokenAmount, value: props.dfoCore.toDecimals(lpTokenAmount, decimalsLp) });
    }

    const burnWUSD = async () => {
        setBurnLoading(true);
        try {
            const info = await wusdExtensionController.methods.wusdInfo().call();
            const collectionAddress = info['0'];
            const wusdObjectId = info['1'];

            const wusdCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), collectionAddress);
            const burnData = abi.encode(["uint256", "uint256", "uint256", "bool"], [pairs[pair].ammIndex, pairs[pair].lpIndex, estimatedLpToken.full, outputType === 'lp'])
            const data = abi.encode(["uint256", "bytes"], [0, burnData]);
            var collectionData = abi.encode(["bytes[]"], [[data]]);

            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp, token0Contract, token1Contract } = chosenPair;
            const tokens = [token0Contract.options.address, token1Contract.options.address];
            var res;
            if(outputType !== 'eth') {
                const gasLimit = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [wusdAmount], collectionData).estimateGas({ from: props.dfoCore.address });
                res = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [wusdAmount], collectionData).send({ from: props.dfoCore.address, gasLimit: props.dfoCore.applyGasMultiplier(gasLimit, tokens) });
            } else {
                var operations = [{
                    inputTokenAddress : token0Contract.options.address,
                    inputTokenAmount : estimatedToken0.full,
                    ammContract : amms[selectedAmmIndex].contract.options.address,
                    liquidityPoolAddresses : [ethAmount.token0ETHLiquidityPool],
                    swapPath : [ethAmount.ethereumAddress],
                    enterInETH : false,
                    exitInETH : true,
                    receivers : [props.dfoCore.address],
                    receiversPercentages : []
                }, {
                    inputTokenAddress : token1Contract.options.address,
                    inputTokenAmount : estimatedToken1.full,
                    ammContract : amms[selectedAmmIndex].contract.options.address,
                    liquidityPoolAddresses : [ethAmount.token1ETHLiquidityPool],
                    swapPath : [ethAmount.ethereumAddress],
                    enterInETH : false,
                    exitInETH : true,
                    receivers : [props.dfoCore.address],
                    receiversPercentages : []
                }];
                var payload = abi.encode(["bytes", "address", "tuple(address,uint256,address,address[],address[],bool,bool,address[],uint256[])[]"],[collectionData, props.dfoCore.getContextElement("prestoAddress"), operations.map(it => Object.values(it))]);
                var sendingOptions = {from : props.dfoCore.address};
                var method = wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdPresto.options.address, [wusdObjectId], [wusdAmount], payload);
                sendingOptions.gasLimit = props.dfoCore.applyGasMultiplier(await method.estimateGas(sendingOptions), tokens);
                res = await method.send(sendingOptions);
            }

            props.addTransaction(res);
            await getController();
        } catch (error) {
            console.error(error);
        } finally {
            setBurnLoading(false);
        }
    }

    const onOutputTypeChange = async (e) => {
        setOutputType(e.target.value);
        if (e.target.value === 'eth') {
            setEthBalance(await props.dfoCore.web3.eth.getBalance(props.dfoCore.address));
        }
    }

    const onAmmChange = (e) => {
        setSelectedAmmIndex(parseInt(e.target.value));
        updateETHAmount(parseInt(e.target.value));
    }

    const updateETHAmount = async (ammIndex) => {
        if(!amms || amms.length === 0 || pair === '' || isNaN(pair)) {
            return;
        }
        var amm = amms[ammIndex];
        var ethereumAddress = amm.data[0];
        amm = amm.contract;
        var chosenPair = pairs[pair];
        var {token0Contract, token1Contract} = chosenPair;

        var token0ETHLiquidityPool = (await amm.methods.byTokens([ethereumAddress, token0Contract.options.address]).call())[2];
        var token0ETHValue = (await amm.methods.getSwapOutput(token0Contract.options.address, estimatedToken0.full, [token0ETHLiquidityPool], [ethereumAddress]).call());
        token0ETHValue = token0ETHValue[1];

        var token1ETHLiquidityPool = (await amm.methods.byTokens([ethereumAddress, token1Contract.options.address]).call())[2];
        var token1ETHValue = (await amm.methods.getSwapOutput(token1Contract.options.address, estimatedToken1.full, [token1ETHLiquidityPool], [ethereumAddress]).call());
        token1ETHValue = token1ETHValue[1];

        var estimatedOutputETHValue = props.dfoCore.web3.utils.toBN(token0ETHValue).add(props.dfoCore.web3.utils.toBN(token1ETHValue)).toString();
        if(ethAmount && ethAmount.estimatedOutputETHValue === estimatedOutputETHValue) {
            return;
        }
        setEthAmount({estimatedOutputETHValue, token0ETHLiquidityPool, token0ETHValue, token1ETHLiquidityPool, token1ETHValue, ethereumAddress});
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
            return (<div />);
        }

        if (outputType === 'lp') {
            return (<>
                <div className="Resultsregular">
                    <p><b>{pairs[pair].lpSymbol} balance</b>: {window.formatMoney(props.dfoCore.toDecimals(pairs[pair].balanceOf['0'], pairs[pair].decimalsLp), 2)}</p>
                </div>
                <div className="Resultsregular">
                    <p>For <b> {estimatedLpToken.value} {pairs[pair].lpSymbol} </b></p>
                </div>
            </>
            )
        }
        if (outputType === 'eth') {
            return (<>

                <div className="FromETHPrestoDesc">
                    <p>Swapping {window.formatMoney(estimatedToken0.value, 2)} {pairs[pair].symbol0} <Coin address={pairs[pair].token0} /> And {window.formatMoney(estimatedToken1.value, 2)} {pairs[pair].symbol1} <Coin address={pairs[pair].token1} /> on </p>
                    {amms.length > 0 && <select className="SelectRegular" value={selectedAmmIndex.toString()} onChange={onAmmChange}>
                        {amms.map((it, i) => <option key={it.address} value={i}>{it.info[0]}</option>)}
                    </select>}
                </div>
                <div className="Resultsregular">
                    <p>For <b> {window.fromDecimals(ethAmount.estimatedOutputETHValue || '0', 18)} ETH </b></p>
                </div>
            </>
            )
        }
        return (<>
            <div className="Resultsregular">
                <p>For <b> {estimatedToken0.value} {pairs[pair].symbol0} / {estimatedToken1.value} {pairs[pair].symbol1}</b></p>
            </div>
        </>
        )
    }

    const getButtons = () => {
        return (
            <div className="Web3BTNs">
                {
                    burnLoading ? <a className="Web3ActionBTN" disabled={burnLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a> : <a onClick={() => burnWUSD()} disabled={!amount.full || !amount.value || amount.value === 0 || amount.full === 0} className="Web3ActionBTN">Burn</a>
                }
                <div className="Resultsregular ResultsregularS">
                    <p><b>System Balance:</b> {window.formatMoney(props.dfoCore.toDecimals(pairs[pair].balanceOf['1'][0], pairs[pair].token0decimals), 2)} {pairs[pair].symbol0} / {window.formatMoney(props.dfoCore.toDecimals(pairs[pair].balanceOf['1'][1], pairs[pair].token1decimals), 2)} {pairs[pair].symbol1}</p>
                </div>
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
                            return <option disabled={!pair.isValid} key={pair.ammName + pair.symbol0 + pair.symbol1} value={index}>{pair.ammName} - {pair.symbol0}/{pair.symbol1}</option>
                        })
                    }
                </select>
                {
                    pair !== '' && !isNaN(pair) && isHealthyPair && <div className="QuestionRegular">
                        <label className="PrestoSelector">
                            <span>Get Pair</span>
                            <input name="outputType" type="radio" value="pair" checked={outputType === "pair"} onChange={onOutputTypeChange} disabled={isNaN(pair)} />
                        </label>
                        <label className="PrestoSelector">
                            <span>Get ETH</span>
                            <input name="outputType" type="radio" value="eth" checked={outputType === "eth"} onChange={onOutputTypeChange} disabled={isNaN(pair)} />
                        </label>
                        <label className="PrestoSelector">
                            <span>Get LP Token</span>
                            <input name="outputType" type="radio" value="lp" checked={outputType === "lp"} onChange={onOutputTypeChange} disabled={isNaN(pair)} />
                        </label>
                    </div>
                }
            </div>
            {
                !isHealthyPair && <div className="DisclamerRegular">
                    <p><b>This pair is not healthy at the moment!</b> <br></br> Select a different pair or try again at another time.</p>
                </div>
            }
            {
                (pair && isHealthyPair) ? getWUSDToken() : <div />
            }
            { isHealthyPair && getBurnAmount()}
            {
                (isHealthyPair && pair) ? getButtons() : <div />
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