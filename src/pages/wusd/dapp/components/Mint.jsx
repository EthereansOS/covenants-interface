import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input, Coin } from '../../../../components';
import { addTransaction } from '../../../../store/actions';
import WUSDLogo from '../../../../assets/images/x1WUSD.png';
import Loading from '../../../../components/shared/Loading';

const Mint = (props) => {
    const [pair, setPair] = useState("");
    const [pairs, setPairs] = useState([]);
    const [inputType, setInputType] = useState("pair");
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [firstAmount, setFirstAmount] = useState(0);
    const [secondAmount, setSecondAmount] = useState(0);
    const [firstTokenApproved, setFirstTokenApproved] = useState(false);
    const [secondTokenApproved, setSecondTokenApproved] = useState(false);
    const [firstTokenBalance, setFirstTokenBalance] = useState(0);
    const [secondTokenBalance, setSecondTokenBalance] = useState(0);
    const [lpTokenBalance, setLpTokenBalance] = useState(0);
    const [lpTokenApproved, setLpTokenApproved] = useState(false);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mintLoading, setMintLoading] = useState(false);
    const [isHealthyPair, setIsHealthyPair] = useState(true);
    const [intervalId, setIntervalId] = useState(null);
    const [ethBalance, setEthBalance] = useState("0");
    const [ethValue, setEthValue] = useState("0");
    const [ethValue0, setEthValue0] = useState("0");
    const [ethValue1, setEthValue1] = useState("0");
    const [onlyByToken0, setOnlyByToken0] = useState(false);
    const [onlyByToken1, setOnlyByToken1] = useState(false);
    const [singleTokenAmount, setSingleTokenAmount] = useState("");
    const [amms, setAmms] = useState([]);
    const [selectedAmmIndex, setSelectedAmmIndex] = useState(null);
    const [mintByEthLoading, setMintByEthLoading] = useState(false);
    const [wusdPresto, setWusdPresto] = useState(null);
    const [showPrestoError, setShowPrestoError] = useState(false);

    useEffect(() => {
        getController();
        return () => {
            console.log('clearing interval.');
            if (intervalId) clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        if (intervalId) clearInterval(intervalId);
        if (pair) {
            const interval = setInterval(async () => {
                if (pair && pairs[pair]) {
                    const chosenPair = pairs[pair];
                    setFirstTokenBalance(props.dfoCore.toDecimals(await chosenPair.token0Contract.methods.balanceOf(props.dfoCore.address).call(), parseInt(chosenPair.token0decimals)));
                    setSecondTokenBalance(props.dfoCore.toDecimals(await chosenPair.token1Contract.methods.balanceOf(props.dfoCore.address).call(), parseInt(chosenPair.token1decimals)));
                    setLpTokenBalance(props.dfoCore.toDecimals(await chosenPair.lpContract.methods.balanceOf(props.dfoCore.address).call(), parseInt(chosenPair.decimalsLp)));
                    setEthBalance(props.dfoCore.toDecimals(await props.dfoCore.web3.eth.getBalance(props.dfoCore.address), 18));
                }
            }, 2000);
            setIntervalId(interval);
        }
    }, [pair]);

    useEffect(() => {
        pairs && pairs.length > 0 && setChosenPair(pair);
    }, [onlyByToken0, onlyByToken1]);

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
                            console.error(error);
                        }
                    }));
                    allowedPairs = [...allowedPairs, ...pools];
                } catch (error) {
                    console.error(error);
                }
            }))
            allowedPairs = allowedPairs.sort((a, b) => (a.ammName + a.symbol0 + a.symbol1).localeCompare(b.ammName + b.symbol0 + b.symbol1));
            setPairs(allowedPairs);
            setWusdPresto(await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDPrestoABI"), props.dfoCore.getContextElement("WUSDPrestoAddress")));
            let amms = [];
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

    const clear = () => {
        setFirstAmount({ value: 0, full: 0 });
        setSecondAmount({ value: 0, full: 0 });
        setLpTokenAmount({ value: 0, full: 0 });
        setOnlyByToken0(false);
        setOnlyByToken1(false);
        setSingleTokenAmount("0");
        setEthValue("0");
        setEthValue0("0");
        setEthValue1("0");
        setMintByEthLoading(false);
    }

    const onTokenApproval = (type, res) => {
        props.addTransaction(res);
        type === 'first' && setFirstTokenApproved(true);
        type === 'second' && setSecondTokenApproved(true);
        type === 'lp' && setLpTokenApproved(true);
    }

    const setChosenPair = async (pairIndex) => {
        setLoading(true);
        try {
            if (pairIndex) {
                const chosenPair = pairs[pairIndex];
                const allowance0 = await chosenPair.token0Contract.methods.allowance(props.dfoCore.address, onlyByToken0 || onlyByToken1 ? wusdPresto.options.address : props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
                const allowance1 = await chosenPair.token1Contract.methods.allowance(props.dfoCore.address, onlyByToken0 || onlyByToken1 ? wusdPresto.options.address : props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
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
                const { ammContract, liquidityPool, ammIndex, lpIndex, token0Contract, token1Contract, token0decimals, token1decimals } = chosenPair;
                const tokens = [token0Contract.options.address, token1Contract.options.address];
                var result;
                if (inputType !== 'eth' && !onlyByToken0 && !onlyByToken1) {
                    const gasLimit = await wusdExtensionController.methods.addLiquidity(ammIndex, lpIndex, lpTokenAmount.full.toString(), inputType === 'lp').estimateGas({ from: props.dfoCore.address });
                    result = await wusdExtensionController.methods.addLiquidity(ammIndex, lpIndex, lpTokenAmount.full.toString(), inputType === 'lp').send({ from: props.dfoCore.address, gasLimit: props.dfoCore.applyGasMultiplier(gasLimit, tokens) });
                } else {
                    var value = '0';
                    var operations = [];
                    var amm = amms[selectedAmmIndex];
                    var ethereumAddress = amm.data[0];
                    amm = amm.contract;
                    if (inputType === 'eth') {
                        operations = [{
                            inputTokenAddress : ethereumAddress,
                            inputTokenAmount : ethValue0.firstTokenETH,
                            ammPlugin : amm.options.address,
                            liquidityPoolAddresses : [ethValue0.firstTokenETHLiquidityPoolAddress],
                            swapPath : [token0Contract.options.address],
                            enterInETH : true,
                            exitInETH : false,
                            receivers : [wusdPresto.options.address],
                            receiversPercentages : []
                        }, {
                            inputTokenAddress : ethereumAddress,
                            inputTokenAmount : ethValue1.secondTokenETH,
                            ammPlugin : amm.options.address,
                            liquidityPoolAddresses : [ethValue1.secondTokenETHLiquidityPoolAddress],
                            swapPath : [token1Contract.options.address],
                            enterInETH : true,
                            exitInETH : false,
                            receivers : [wusdPresto.options.address],
                            receiversPercentages : []
                        }];

                        value = props.dfoCore.web3.utils.toBN(ethValue0.firstTokenETH).add(props.dfoCore.web3.utils.toBN(ethValue1.secondTokenETH)).toString();
                    } else {
                        var halfValue = window.toDecimals(singleTokenAmount, onlyByToken0 ? token0decimals : token1decimals);
                        halfValue = props.dfoCore.web3.utils.toBN(halfValue).div(props.dfoCore.web3.utils.toBN(2)).toString();
                        operations = [{
                            inputTokenAddress : (onlyByToken0 ? token0Contract : token1Contract).options.address,
                            inputTokenAmount : halfValue,
                            ammPlugin : ammContract.options.address,
                            liquidityPoolAddresses : [liquidityPool],
                            swapPath : [(onlyByToken0 ? token1Contract : token0Contract).options.address],
                            enterInETH : false,
                            exitInETH : false,
                            receivers : [wusdPresto.options.address],
                            receiversPercentages : []
                        }, {
                            inputTokenAddress :  (onlyByToken0 ? token0Contract : token1Contract).options.address,
                            inputTokenAmount : onlyByToken0 ? firstAmount.full : secondAmount.full,
                            ammPlugin : window.voidEthereumAddress,
                            liquidityPoolAddresses : [],
                            swapPath : [],
                            enterInETH : false,
                            exitInETH : false,
                            receivers : [],
                            receiversPercentages : []
                        }];
                    }
                    var sendingOptions = { from : props.dfoCore.address, value };
                    var method = wusdPresto.methods.addLiquidity(
                        props.dfoCore.getContextElement("prestoAddress"),
                        operations,
                        wusdExtensionController.options.address,
                        ammIndex,
                        lpIndex
                    );
                    sendingOptions.gasLimit = await method.estimateGas(sendingOptions);
                    result = await method.send({ ...sendingOptions, gasLimit: props.dfoCore.applyGasMultiplier(sendingOptions.gasLimit, tokens) });
                }
                showPrestoError(false);
                props.addTransaction(result);
                const balance0 = await token0Contract.methods.balanceOf(props.dfoCore.address).call();
                const balance1 = await token1Contract.methods.balanceOf(props.dfoCore.address).call();
                setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
            } else {
                return;
            }
            setFirstAmount({ value: 0, full: 0 });
            setSecondAmount({ value: 0, full: 0 });
            setLpTokenAmount({ value: 0, full: 0 });
        } catch (error) {
            console.error(error);
            if (inputType == 'eth') {
                setShowPrestoError(true);
            }
        } finally {
            setMintLoading(false);
        }
    }

    const updateFirstAmount = async (amount) => {
        try {
            if (!amount) {
                clear();
                return;
            };
            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token0, token0decimals, token1decimals, decimalsLp } = chosenPair;
            const updatedFirstAmount = { value: amount, full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", token0decimals)).toString() };
            setFirstAmount(updatedFirstAmount);

            const res = await ammContract.methods.byTokenAmount(liquidityPool, token0, updatedFirstAmount.full.toString()).call();
            const { tokensAmounts, liquidityPoolAmount } = res;

            setSecondAmount({ value: props.dfoCore.toDecimals(tokensAmounts[1], token1decimals), full: tokensAmounts[1] });
            setLpTokenAmount({ value: props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp), full: liquidityPoolAmount });
        } catch (error) {
            console.error(error);
        }
    }

    const updateSecondAmount = async (amount) => {
        try {
            if (!amount) {
                clear();
                return;
            };
            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token1, token0decimals, token1decimals, decimalsLp } = chosenPair;
            const updatedSecondAmount = { value: amount, full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", token1decimals)).toString() };

            setSecondAmount(updatedSecondAmount);
            console.log(updatedSecondAmount);

            const res = await ammContract.methods.byTokenAmount(liquidityPool, token1, updatedSecondAmount.full.toString()).call();
            const { tokensAmounts, liquidityPoolAmount } = res;

            setFirstAmount({ value: props.dfoCore.toDecimals(tokensAmounts[0], token0decimals), full: tokensAmounts[0] });
            setLpTokenAmount({ value: props.dfoCore.toDecimals(liquidityPoolAmount, decimalsLp), full: liquidityPoolAmount });
        } catch (error) {
            console.error(error);
        }
    }

    const updateLpAmount = async (amount) => {
        try {
            if (!amount) {
                clear();
                return;
            };
            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp } = chosenPair;
            const updatedLpAmount = { value: amount, full: props.dfoCore.toFixed(props.dfoCore.fromDecimals(parseFloat(amount).toString() || "0", decimalsLp).toString()) };
            setLpTokenAmount(updatedLpAmount);

            const res = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, updatedLpAmount.full).call();
            const { tokensAmounts } = res;

            setFirstAmount({ value: props.dfoCore.toDecimals(tokensAmounts[0], token0decimals), full: tokensAmounts[0] });
            setSecondAmount({ value: props.dfoCore.toDecimals(tokensAmounts[1], token1decimals), full: tokensAmounts[1] });
        } catch (error) {
            console.error(error);
        }
    }

    const updateEthAmount = async (amount, ammIndex) => {
        try {
            if (!amount) {
                clear();
                return;
            };
            setEthValue(amount);
            setMintByEthLoading(true);
            const chosenPair = pairs[pair];
            const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp } = chosenPair;

            var amm = amms[!isNaN(ammIndex) ? ammIndex : selectedAmmIndex].contract;

            var value = props.dfoCore.fromDecimals(window.numberToString(amount), 18);
            var halfValue = props.dfoCore.web3.utils.toBN(value).div(props.dfoCore.web3.utils.toBN(2)).toString();
            var ethereumAddress = (await amm.methods.data().call())[0];

            async function calculateBestLP(firstToken, secondToken, firstDecimals, secondDecimals) {

                var liquidityPoolAddress = (await amm.methods.byTokens([ethereumAddress, firstToken]).call())[2];
                var firstTokenETHLiquidityPoolAddress = liquidityPoolAddress;

                var token0Value = (await amm.methods.getSwapOutput(ethereumAddress, halfValue, [liquidityPoolAddress], [firstToken]).call())[1];

                var token1Value = (await ammContract.methods.byTokenAmount(liquidityPool, firstToken, token0Value).call());
                var lpAmount = token1Value[0];
                token1Value = token1Value[1][token1Value[2].indexOf(secondToken)];

                const updatedFirstTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(token0Value, firstDecimals));
                const updatedSecondTokenAmount = props.dfoCore.formatNumber(props.dfoCore.normalizeValue(token1Value, secondDecimals));

                liquidityPoolAddress = (await amm.methods.byTokens([ethereumAddress, secondToken]).call())[2];
                var secondTokenETHLiquidityPoolAddress = liquidityPoolAddress;
                var token1ValueETH = (await amm.methods.getSwapOutput(secondToken, token1Value, [liquidityPoolAddress], [ethereumAddress]).call())[1];

                return { lpAmount, updatedFirstTokenAmount, updatedSecondTokenAmount, token0Value, token1Value, token1ValueETH, firstTokenETHLiquidityPoolAddress, secondTokenETHLiquidityPoolAddress };
            }

            var bestLP = await calculateBestLP(chosenPair.token0Contract.options.address, chosenPair.token1Contract.options.address, token0decimals, token1decimals);

            var lpAmount = bestLP.lpAmount;
            var firstTokenAmount = bestLP.token0Value;
            var secondTokenAmount = bestLP.token1Value;
            var firstTokenETH = halfValue;
            var secondTokenETH = bestLP.token1ValueETH;
            var firstTokenETHLiquidityPoolAddress = bestLP.firstTokenETHLiquidityPoolAddress;
            var secondTokenETHLiquidityPoolAddress = bestLP.secondTokenETHLiquidityPoolAddress;

            if (bestLP.updatedSecondTokenAmount > bestLP.updatedFirstTokenAmount) {
                bestLP = await calculateBestLP(chosenPair.token1Contract.options.address, chosenPair.token0Contract.options.address, token1decimals, token0decimals);

                lpAmount = bestLP.lpAmount;
                firstTokenAmount = bestLP.token1Value;
                secondTokenAmount = bestLP.token0Value;
                firstTokenETH = bestLP.token1ValueETH;
                secondTokenETH = halfValue;
                firstTokenETHLiquidityPoolAddress = bestLP.secondTokenETHLiquidityPoolAddress;
                secondTokenETHLiquidityPoolAddress = bestLP.firstTokenETHLiquidityPoolAddress;
            }

            setEthValue0({firstTokenETH, firstTokenETHLiquidityPoolAddress});
            setEthValue1({secondTokenETH, secondTokenETHLiquidityPoolAddress});
            setLpTokenAmount({ value: props.dfoCore.toDecimals(lpAmount, decimalsLp), full: lpAmount });
            setFirstAmount({ value: props.dfoCore.toDecimals(firstTokenAmount, token0decimals), full: firstTokenAmount });
            setSecondAmount({ value: props.dfoCore.toDecimals(secondTokenAmount, token1decimals), full: secondTokenAmount });
        } catch (error) {
            console.error(error);
        }
        setMintByEthLoading(false);
    }

    const onSingleTokenAmount = async (e) => {
        setSingleTokenAmount(e.target.value);
        var value = parseFloat(e.target.value);

        const { ammContract, liquidityPool, token0decimals, token1decimals, decimalsLp } = pairs[pair];

        var tokenDecimals = onlyByToken0 ? token0decimals : token1decimals;
        value = window.toDecimals(value, tokenDecimals);
        var halfValue = props.dfoCore.web3.utils.toBN(value).div(props.dfoCore.web3.utils.toBN(2)).toString();

        async function calculateBestLP(firstToken, secondToken, firstTokenDecimals, secondTokenDecimals) {

            var token1Value = (await ammContract.methods.getSwapOutput(firstToken, halfValue, [liquidityPool], [secondToken]).call())[1];

            var token0Value = await ammContract.methods.byTokenAmount(liquidityPool, secondToken, token1Value).call();
            var lpAmount = token0Value[0];

            token0Value = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, lpAmount).call();
            token1Value = token0Value[0][token0Value[1].indexOf(secondToken)];
            token0Value = token0Value[0][token0Value[1].indexOf(firstToken)];

            var normalizedValue = props.dfoCore.normalizeValue(value, firstTokenDecimals);
            var obtainedValue = window.web3.utils.toBN(props.dfoCore.normalizeValue(token0Value, firstTokenDecimals)).add(window.web3.utils.toBN(props.dfoCore.normalizeValue(token1Value, secondTokenDecimals))).toString();

            if(window.web3.utils.toBN(obtainedValue).gt(window.web3.utils.toBN(normalizedValue))) {
                token0Value = window.fromDecimals(token0Value, firstTokenDecimals);
                token1Value = window.toDecimals(token0Value, secondTokenDecimals);
                lpAmount = await ammContract.methods.byTokenAmount(liquidityPool, secondToken, token1Value).call();
                lpAmount = lpAmount[0];

                token0Value = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, lpAmount).call();
                token1Value = token0Value[0][token0Value[1].indexOf(secondToken)];
                token0Value = token0Value[0][token0Value[1].indexOf(firstToken)];
            }

            return { lpAmount, token0Value, token1Value };
        }

        var lpAmount = "0";
        var token0Value = "0";
        var token1Value = "0";

        try {
            var bestLP = await calculateBestLP(
                onlyByToken0 ? pairs[pair].token0Contract.options.address : pairs[pair].token1Contract.options.address,
                onlyByToken0 ? pairs[pair].token1Contract.options.address : pairs[pair].token0Contract.options.address,
                onlyByToken0 ? pairs[pair].token0decimals : pairs[pair].token1decimals,
                onlyByToken0 ? pairs[pair].token1decimals : pairs[pair].token0decimals
            );
            lpAmount = bestLP.lpAmount;
            token0Value = bestLP.token0Value;
            token1Value = bestLP.token1Value;
            console.log(bestLP);
        } catch (e) {
        }

        var firstTokenAmount = onlyByToken0 ? token0Value : token1Value;
        var secondTokenAmount = onlyByToken0 ? token1Value : token0Value;

        setLpTokenAmount({ value: props.dfoCore.toDecimals(lpAmount, decimalsLp), full: lpAmount });
        setFirstAmount({ value: props.dfoCore.toDecimals(firstTokenAmount, token0decimals), full: firstTokenAmount });
        setSecondAmount({ value: props.dfoCore.toDecimals(secondTokenAmount, token1decimals), full: secondTokenAmount });
    }

    const getEstimatedAmount = () => {
        try {
            return window.fromDecimals(window.web3.utils.toBN(props.dfoCore.normalizeValue(firstAmount.full, pairs[pair].token0decimals)).add(window.web3.utils.toBN(props.dfoCore.normalizeValue(secondAmount.full, pairs[pair].token1decimals))).toString(), 18);
        } catch(e) {
            return 0;
        }
    }

    const onSingleTokenChange = (e, token) => {
        if (token === "token0") {
            setOnlyByToken0(e.target.checked);
        }
        if (token === "token1") {
            setOnlyByToken1(e.target.checked);
        }
        e.target.checked && onSingleTokenAmount({
            target: {
                value: singleTokenAmount || "0"
            }
        })
    }

    const onInputTypeChange = (e) => {
        setShowPrestoError(false);
        setInputType(e.target.value);
        clear();
    }

    const onAmmChange = (e) => {
        setSelectedAmmIndex(parseInt(e.target.value));
        updateEthAmount(ethValue, parseInt(e.target.value));
    }

    const renderByETH = () => {
        return <>
            <div className="InputTokensRegular">
                <div className="InputTokenRegular">
                    <Input showMax={true} step={0.0001} address={window.voidEthereumAddress} value={ethValue} balance={ethBalance} min={0} onChange={(e) => updateEthAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name="ETH" />
                </div>
            </div>
            {mintByEthLoading && <Loading/>}
            {!mintByEthLoading && <div className="FromETHPrestoDesc">
                <p>Swapping for {window.formatMoney(firstAmount.value, 2)} {pairs[pair].symbol0} <Coin address={pairs[pair].token0} /> And {window.formatMoney(secondAmount.value, 2)} {pairs[pair].symbol1} <Coin address={pairs[pair].token1} /></p>
                {amms.length > 0 && <select className="SelectRegular" value={selectedAmmIndex.toString()} onChange={onAmmChange}>
                    {amms.map((it, i) => <option key={it.address} value={i}>{it.info[0]}</option>)}
                </select>}
            </div>}
        </>
    }

    const getLpToken = () => {
        const chosenPair = pairs[pair];

        return (
            <div className="InputTokensRegular">
                <div className="InputTokenRegular">
                    <Input showMax={true} step={0.0001} address={chosenPair.lpContract.options.address} value={lpTokenAmount.value} balance={lpTokenBalance} min={0} onChange={(e) => updateLpAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={`${chosenPair.symbol0}/${chosenPair.symbol1}`} />
                </div>
            </div>
        )
    }

    const getMultipleTokens = () => {

        return <>
            <div className="InputTokensRegular">
                {!onlyByToken0 && !onlyByToken1 && <p>Wrap</p>}
                {(onlyByToken0 || onlyByToken1) && <p>Use</p>}
                <div className="InputTokenRegular InputTokenRegularS">
                    {!onlyByToken1 && <label className="PrestoSelector">
                        <span>Only</span>
                        <input type="checkbox" onChange={e => onSingleTokenChange(e, "token0")} checked={onlyByToken0} />
                    </label>}
                    {onlyByToken0 && <Input showMax={true} step={0.0001} value={singleTokenAmount} address={pairs[pair].token0} balance={firstTokenBalance} min={0} onChange={onSingleTokenAmount} showCoin={true} showBalance={true} name={pairs[pair].symbol0} />}
                    {!onlyByToken0 && !onlyByToken1 && <Input showMax={true} step={0.0001} value={firstAmount.value} address={pairs[pair].token0} balance={firstTokenBalance} min={0} onChange={(e) => updateFirstAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol0} />}
                </div>
                {!onlyByToken0 && !onlyByToken1 && <p>And</p>}
                <div className="InputTokenRegular InputTokenRegularS">
                    {!onlyByToken0 && <label className="PrestoSelector">
                        <span>Only</span>
                        <input type="checkbox" onChange={e => onSingleTokenChange(e, "token1")} checked={onlyByToken1} />
                    </label>}
                    {onlyByToken1 && <Input showMax={true} step={0.0001} value={singleTokenAmount} address={pairs[pair].token1} balance={secondTokenBalance} min={0} onChange={onSingleTokenAmount} showCoin={true} showBalance={true} name={pairs[pair].symbol1} />}
                    {!onlyByToken0 && !onlyByToken1 && <Input showMax={true} step={0.0001} value={secondAmount.value} address={pairs[pair].token1} balance={secondTokenBalance} min={0} onChange={(e) => updateSecondAmount(parseFloat(e.target.value))} showCoin={true} showBalance={true} name={pairs[pair].symbol1} />}
                </div>
            </div>
            {(onlyByToken0 || onlyByToken1) && <div className="FromETHPrestoDesc">
                {onlyByToken1 && <>
                    <p>Swapping {window.formatMoney(secondAmount.value, 2)} {pairs[pair].symbol1} <Coin address={pairs[pair].token1} /> for {window.formatMoney(firstAmount.value, 2)} {pairs[pair].symbol0} <Coin address={pairs[pair].token0} /></p>
                </>}
                {onlyByToken0 && <>
                    <p>Swapping {window.formatMoney(firstAmount.value, 2)} {pairs[pair].symbol0} <Coin address={pairs[pair].token0} /> for {window.formatMoney(secondAmount.value, 2)} {pairs[pair].symbol1} <Coin address={pairs[pair].token1} /></p>
                </>}
            </div>}
        </>
    }

    const getButtons = () => {
        return (
            <div className="Web3BTNs">
                {
                    inputType === 'lp' || inputType === 'eth' ? <div />
                        :
                        !firstTokenApproved && !onlyByToken1 ? <ApproveButton contract={pairs[pair].token0Contract} from={props.dfoCore.address} spender={onlyByToken0 ? wusdPresto.options.address : props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.error(error)} onApproval={(res) => onTokenApproval('first', res)} text={`Approve ${pairs[pair].symbol0}`} />
                            :
                            !secondTokenApproved && !onlyByToken0 ? <ApproveButton contract={pairs[pair].token1Contract} from={props.dfoCore.address} spender={onlyByToken1 ? wusdPresto.options.address : props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.error(error)} onApproval={(res) => onTokenApproval('second', res)} text={`Approve ${pairs[pair].symbol1}`} />
                                : <div />
                }

                {
                    (inputType === 'lp' && !lpTokenApproved) &&
                    <ApproveButton contract={pairs[pair].lpContract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.error(error)} onApproval={(res) => onTokenApproval('lp', res)} text={`Approve ${pairs[pair].symbolLp}`} />
                }
                {
                    mintLoading ? <a className="Web3ActionBTN" disabled={mintLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a>
                        :
                        <a className="Web3ActionBTN" onClick={() => mintWUSD()} disabled={((!firstAmount.value || !secondAmount.value) && !lpTokenAmount.value) || !firstTokenApproved || !secondTokenApproved}>Mint</a>
                }
                {
                    ( showPrestoError && inputType === 'eth') && <div className="BetaAllert"><p className="BreefRecap"><b>The Presto "From ETH" feature is in beta. You might received a failed transaction. Use it at your own risk!</b></p></div>
                }
            </div>
        )
    }

    if (loading) {
        return (
            <div className="MintBurn">
                <div className="col-12 justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="MintBurn">
            <div className="PairSelector">
                <select className="SelectRegular" value={pair} onChange={(e) => { clear(); setChosenPair(e.target.value); }}>
                    <option value="">Select a pair..</option>
                    {
                        pairs.map((pair, index) => {
                            return <option key={pair.ammName + pair.symbol0 + pair.symbol1} value={index}>{pair.ammName} - {pair.symbol0}/{pair.symbol1}</option>
                        })
                    }
                </select>
                {
                    pair !== '' && !isNaN(pair) && isHealthyPair && <div className="QuestionRegular">
                        <label className="PrestoSelector">
                            <span>From Pair</span>
                            <input name="inputType" type="radio" value="pair" checked={inputType === "pair"} onChange={onInputTypeChange} disabled={!pair} />
                        </label>
                        <label className="PrestoSelector">
                            <span>From ETH (BETA)</span>
                            <input name="inputType" type="radio" value="eth" checked={inputType === "eth"} onChange={onInputTypeChange} disabled={!pair} />
                        </label>
                        <label className="PrestoSelector">
                            <span>From LP Token</span>
                            <input name="inputType" type="radio" value="lp" checked={inputType === "lp"} onChange={onInputTypeChange} disabled={!pair} />
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
                (pair && isHealthyPair) ? inputType === 'lp' ? getLpToken() : inputType === 'pair' ? getMultipleTokens() : renderByETH() : <div />
            }
            {
                (pair && isHealthyPair && !mintByEthLoading) ? <div className="Resultsregular">
                    <p>To mint <b>{window.formatMoney(getEstimatedAmount(), 2)} <img src={WUSDLogo}></img>WUSD</b></p>
                </div> : <div />
            }
            {
                (pair && isHealthyPair) ? getButtons() : <div />
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

export default connect(mapStateToProps, mapDispatchToProps)(Mint);