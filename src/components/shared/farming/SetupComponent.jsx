import Coin from '../coin/Coin';
import { useEffect, useState } from 'react';
import { Input, ApproveButton } from '..';
import { connect } from 'react-redux';
import { addTransaction } from '../../../store/actions';
import axios from 'axios';
import LockedPositionComponent from './LockedPositionComponent';
import metamaskLogo from "../../../assets/images/metamask-fox.svg";

const SetupComponent = (props) => {
    let { className, dfoCore, setupIndex, lmContract, hostedBy } = props;
    // general info and setup data
    const [setup, setSetup] = useState(null);
    const [setupInfo, setSetupInfo] = useState(null);
    const [blockNumber, setBlockNumber] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activateLoading, setActivateLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    // panel status
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [showFreeTransfer, setShowFreeTransfer] = useState(false);
    // amm data
    const [AMM, setAMM] = useState({ name: "", version: "" });
    const [ammContract, setAmmContract] = useState(null);

    const [freeTransferAddress, setFreeTransferAddress] = useState("");
    const [extensionContract, setExtensionContract] = useState(null);
    const [farmTokenDecimals, setFarmTokenDecimals] = useState(18);
    const [farmTokenERC20Address, setFarmTokenERC20Address] = useState("");
    const [farmTokenSymbol, setFarmTokenSymbol] = useState("");
    const [farmTokenBalance, setFarmTokenBalance] = useState("0");
    const [farmTokenRes, setFarmTokenRes] = useState([]);
    const [canActivateSetup, setCanActivateSetup] = useState(false);
    const [setupTokens, setSetupTokens] = useState([]);
    const [tokensAmounts, setTokensAmount] = useState([]);
    const [tokensApprovals, setTokensApprovals] = useState([]);
    const [tokensContracts, setTokensContracts] = useState([]);
    const [lpTokenAmount, setLpTokenAmount] = useState(0);
    const [lockedEstimatedReward, setLockedEstimatedReward] = useState(0);
    const [freeEstimatedReward, setFreeEstimatedReward] = useState(0);
    const [lpTokenInfo, setLpTokenInfo] = useState(null);
    const [mainTokenInfo, setMainTokenInfo] = useState(null);
    const [rewardTokenInfo, setRewardTokenInfo] = useState(null);
    const [removalAmount, setRemovalAmount] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [manageStatus, setManageStatus] = useState(null);
    const [freeAvailableRewards, setFreeAvailableRewards] = useState(0);
    const [lockedPositions, setLockedPositions] = useState([]);
    const [lockedPositionStatuses, setLockedPositionStatuses] = useState([]);
    const [lockedPositionRewards, setLockedPositionRewards] = useState([]);
    const [updatedRewardPerBlock, setUpdatedRewardPerBlock] = useState(0);
    const [updatedRenewTimes, setUpdatedRenewTimes] = useState(0);
    const [openPositionForAnotherWallet, setOpenPositionForAnotherWallet] = useState(false);
    const [uniqueOwner, setUniqueOwner] = useState("");
    const [apy, setApy] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [inputType, setInputType] = useState("add-pair");
    const [outputType, setOutputType] = useState("to-pair");
    const [ethAmount, setEthAmount] = useState(0);
    const [ethBalanceOf, setEthBalanceOf] = useState("0");

    useEffect(() => {
        getSetupMetadata();
        return () => {
            console.log('clearing interval.');
            if (intervalId) clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        if (intervalId) clearInterval(intervalId);
        if (setupTokens && setupTokens.length > 0) {
            const interval = setInterval(async () => {
                const lockPositions = [];
                const positionIds = [];
                let position = null;
                const events = await window.getLogs({
                    address: lmContract.options.address,
                    topics: [
                        window.web3.utils.sha3("Transfer(uint256,address,address)")
                    ],
                    fromBlock: props.dfoCore.getContextElement('deploySearchStart'),
                    toBlock: await window.web3ForLogs.eth.getBlockNumber(),
                });
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const { topics } = event;
                    var positionId = props.dfoCore.web3.eth.abi.decodeParameter("uint256", topics[1]);
                    const pos = await lmContract.methods.position(positionId).call();
                    if (dfoCore.isValidPosition(pos) && parseInt(pos.setupIndex) === parseInt(setupIndex)) {
                        if (setupInfo.free) {
                            position = { ...pos, positionId };
                        } else if (!positionIds.includes(positionId)) {
                            lockPositions.push({ ...pos, positionId });
                            positionIds.push(positionId);
                        }
                    }
                }
                setCurrentPosition(position);
                setLockedPositions(lockPositions);

                const farmTokenCollectionAddress = await lmContract.methods._farmTokenCollection().call();
                const farmTokenCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), farmTokenCollectionAddress);
                if (!setupInfo.free) {
                    // retrieve farm token data
                    const objectId = setup.objectId;
                    if (objectId !== "0") {
                        const ftBalance = await farmTokenCollection.methods.balanceOf(props.dfoCore.address, objectId).call();
                        const ftSymbol = await farmTokenCollection.methods.symbol(objectId).call();
                        const ftDecimals = await farmTokenCollection.methods.decimals(objectId).call();
                        const ftERC20Address = await farmTokenCollection.methods.asInteroperable(objectId).call();
                        setFarmTokenERC20Address(ftERC20Address);
                        setFarmTokenSymbol(ftSymbol);
                        setFarmTokenBalance(ftBalance);
                        setFarmTokenDecimals(ftDecimals);
                        const ftRes = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, ftBalance).call();
                        setFarmTokenRes(ftRes['tokensAmounts']);
                    } else {
                        setFarmTokenBalance("0");
                    }
                }

                const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
                const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), rewardTokenAddress);
                const rewardTokenApproval = await rewardToken.methods.allowance(dfoCore.address, lmContract.options.address).call();
                const rewardTokenBalance = await rewardToken.methods.balanceOf(dfoCore.address).call();
                setRewardTokenInfo({ ...rewardTokenInfo, approval: parseInt(rewardTokenApproval) !== 0, balance: rewardTokenBalance });
    
                const lpTokenBalance = await lpTokenInfo.contract.methods.balanceOf(dfoCore.address).call();
                const lpTokenApproval = await lpTokenInfo.contract.methods.allowance(dfoCore.address, lmContract.options.address).call();
                setLpTokenInfo({ ...lpTokenInfo, balance: lpTokenBalance, approval: parseInt(lpTokenApproval) !== 0 });
                const tokenAddress = setupInfo.liquidityPoolTokenAddress;
                let res;
                if (setupInfo.free) {
                    res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, setup.totalSupply).call();
                } else {
                    res = await ammContract.methods.byTokenAmount(tokenAddress, setupInfo.mainTokenAddress, setup.totalSupply).call();
                    res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, res.liquidityPoolAmount).call();
                }
                let mtInfo = null;
                const tokens = [];
                const approvals = [];
                const contracts = [];
                
                for (let i = 0; i < res.liquidityPoolTokens.length; i++) {
                    const address = res.liquidityPoolTokens[i];
                    const token = !isWeth(setupInfo, address) ? await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address) : null;
                    const symbol = token ? await token.methods.symbol().call() : 'ETH';
                    const decimals = token ? await token.methods.decimals().call() : 18;
                    const balance = token ? await token.methods.balanceOf(dfoCore.address).call() : await dfoCore.web3.eth.getBalance(dfoCore.address);
                    const approval = token ? await token.methods.allowance(dfoCore.address, lmContract.options.address).call() : true;
                    approvals.push(parseInt(approval) !== 0);
                    tokens.push({ amount: 0, balance: dfoCore.toDecimals(dfoCore.toFixed(balance), decimals), liquidity: res.tokensAmounts[i], decimals, address: token ? address : dfoCore.voidEthereumAddress, symbol });
                    contracts.push(token);
                    if (address.toLowerCase() === setupInfo.mainTokenAddress.toLowerCase()) {
                        mtInfo = { approval: parseInt(approval) !== 0, decimals, contract: token, address: token ? address : dfoCore.voidEthereumAddress, symbol };
                        setMainTokenInfo(mtInfo);
                    }
                }
                setSetupTokens(tokens);
                setTokensContracts(contracts);
                setTokensApprovals(approvals);
                if (position && position.positionId) {
                    const positionId = position.positionId;
                    //position = await lmContract.methods.position(positionId).call();
                    setCurrentPosition(position.creationBlock != "0" ? { ...position, positionId } : null);
                    if (position.creationBlock != "0") {
                        const free = position['free'];
                        const creationBlock = position['creationBlock'];
                        const positionSetupIndex = position['setupIndex'];
                        const liquidityPoolTokenAmount = position['liquidityPoolTokenAmount'];
                        const mainTokenAmount = position['mainTokenAmount'];
                        const amounts = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, liquidityPoolTokenAmount).call();
                        const availableReward = await lmContract.methods.calculateFreeFarmingReward(positionId, true).call();
                        let freeReward = parseInt(availableReward);
                        if (blockNumber < parseInt(setup.endBlock)) {
                            freeReward += (parseInt(setup.rewardPerBlock) * (parseInt(position.liquidityPoolTokenAmount) / parseInt(setup.totalSupply)))
                        }
                        freeReward = freeReward.toString().split('.')[0];
                        setFreeAvailableRewards(freeReward);
                        setManageStatus({ free, creationBlock, positionSetupIndex, liquidityPoolAmount: liquidityPoolTokenAmount, mainTokenAmount, tokensAmounts: amounts['tokensAmounts'], tokens })
                    }
                } else if (lockPositions.length > 0) {
                    const lockStatuses = [];
                    const lockRewards = [];
                    for (let j = 0; j < lockPositions.length; j++) {
                        let lockedPosition = lockPositions[j];
                        const positionId = lockedPosition.positionId;
                        lockedPosition = await lmContract.methods.position(positionId).call();
                        if (lockedPosition.creationBlock != "0") {
                            const free = lockedPosition['free'];
                            const creationBlock = lockedPosition['creationBlock'];
                            const positionSetupIndex = lockedPosition['setupIndex'];
                            const liquidityPoolTokenAmount = lockedPosition['liquidityPoolTokenAmount'];
                            const mainTokenAmount = lockedPosition['mainTokenAmount'];
                            const amounts = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, liquidityPoolTokenAmount).call();
                            const availableReward = await lmContract.methods.calculateLockedFarmingReward(0, 0, true, positionId).call();
                            const lockedReward = parseInt(availableReward.reward) + (parseInt(setup.endBlock) <= parseInt(blockNumber) ? 0 : parseInt(lockedPosition.lockedRewardPerBlock));
                            const partiallyRedeemed = await lmContract.methods._partiallyRedeemed(positionId).call();
                            lockRewards.push(lockedReward);
                            lockStatuses.push({ free, creationBlock, positionSetupIndex, partiallyRedeemed, liquidityPoolAmount: liquidityPoolTokenAmount, mainTokenAmount, tokensAmounts: amounts['tokensAmounts'], tokens })    
                            //lockPositions.push({ ...lockedPosition, positionId: positionId });
                        }
                    }
                    setLockedPositionStatuses(lockStatuses);
                    setLockedPositionRewards(lockRewards);
                    //setLockedPositions(lockPositions);
                }
                // calculate APY
                setApy(await calculateApy(setup, rewardTokenAddress, rewardTokenInfo.decimals, setupTokens));
            }, 5000);
            setIntervalId(interval);
        }
    }, [tokensApprovals]);


    const calculateApy = async (setup, rewardTokenAddress, rewardTokenDecimals, setupTokens) => {
        if (parseInt(setup.totalSupply) === 0) return 0;
        const yearlyBlocks = 2304000;
        try {
            const searchTokens = `${rewardTokenAddress},${setupTokens.map((token) => (token && token.address) ? `${token.address},` : '')}`.slice(0, -1);
            const { data } = await axios.get(dfoCore.getContextElement("coingeckoCoinPriceURL") + searchTokens);
            const rewardTokenPriceUsd = data[rewardTokenAddress.toLowerCase()].usd;
            let den = 0;
            await Promise.all(setupTokens.map(async (token) => {
                if (token && token.address) {
                    const tokenPrice = data[token.address.toLowerCase()].usd;
                    den += (tokenPrice * token.liquidity * 10**(18 - token.decimals));
                }
            }))
            const num = (parseInt(setup.rewardPerBlock) * 10**(18 - rewardTokenDecimals) * yearlyBlocks) * rewardTokenPriceUsd;
            return (num / (den * 100));
        } catch (error) {
            return 0;
        }
    }

    const isWeth = (setupInfo, address) => {
        return address.toLowerCase() === setupInfo.ethereumAddress.toLowerCase() && setupInfo.involvingETH;
    }

    const getPeriodFromDuration = (duration) => {
        const blockIntervals = dfoCore.getContextElement('blockIntervals');
        const inv = Object.entries(blockIntervals).reduce((ret, entry) => {
            const [ key, value ] = entry;
            ret[ value ] = key;
            return ret;
            }, {});
        return inv[duration];
    }

    const getSetupMetadata = async () => {
        setLoading(true);
        try {
            let position = null;
            let lockPositions = [];
            let positionIds = [];
            const { '0': farmSetup, '1': farmSetupInfo } = await lmContract.methods.setup(setupIndex).call();
            const farmTokenCollectionAddress = await lmContract.methods._farmTokenCollection().call();
            const farmTokenCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), farmTokenCollectionAddress);
            const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), farmSetupInfo.ammPlugin);
            setAmmContract(ammContract);
            if (!farmSetup.free) {
                // retrieve farm token data
                const objectId = farmSetup.objectId;
                if (objectId !== "0") {
                    const ftBalance = await farmTokenCollection.methods.balanceOf(props.dfoCore.address, objectId).call();
                    const ftSymbol = await farmTokenCollection.methods.symbol(objectId).call();
                    const ftDecimals = await farmTokenCollection.methods.decimals(objectId).call();
                    const ftERC20Address = await farmTokenCollection.methods.asInteroperable(objectId).call();
                    setFarmTokenERC20Address(ftERC20Address);
                    setFarmTokenSymbol(ftSymbol);
                    setFarmTokenBalance(ftBalance);
                    setFarmTokenDecimals(ftDecimals);
                    const ftRes = await ammContract.methods.byLiquidityPoolAmount(farmSetupInfo.liquidityPoolTokenAddress, ftBalance).call();
                    setFarmTokenRes(ftRes['tokensAmounts']);
                } else {
                    setFarmTokenBalance("0");
                }
            }
            setLockedEstimatedReward(0);
            setUpdatedRenewTimes(farmSetupInfo.renewTimes);
            setUpdatedRewardPerBlock(farmSetup.rewardPerBlock);
            setSetup(farmSetup);
            setSetupInfo(farmSetupInfo);
            const events = await window.getLogs({
                address: lmContract.options.address,
                topics: [
                    window.web3.utils.sha3("Transfer(uint256,address,address)")
                ],
                fromBlock: props.dfoCore.getContextElement('deploySearchStart'),
                toBlock: await window.web3ForLogs.eth.getBlockNumber(),
            });
            for (let i = 0; i < events.length; i++) {
                const event = events[i];
                const { topics } = event;
                var positionId = props.dfoCore.web3.eth.abi.decodeParameter("uint256", topics[1]);
                const pos = await lmContract.methods.position(positionId).call();
                if (dfoCore.isValidPosition(pos) && parseInt(pos.setupIndex) === parseInt(setupIndex)) {
                    if (farmSetupInfo.free) {
                        position = { ...pos, positionId };
                    } else if (!positionIds.includes(positionId)) {
                        lockPositions.push({ ...pos, positionId });
                        positionIds.push(positionId);
                    }
                }
            }
            setCurrentPosition(position);
            setLockedPositions(lockPositions);
            if (!position) {
                setOpen(false);
                setWithdrawOpen(false);
            }
            const extensionAddress = await lmContract.methods._extension().call();
            console.log(`extension address ${extensionAddress}`);
            const extContract = await dfoCore.getContract(dfoCore.getContextElement("FarmExtensionABI"), extensionAddress);
            setExtensionContract(extContract);
            const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
            const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), rewardTokenAddress);
            const rewardTokenSymbol = await rewardToken.methods.symbol().call();
            const rewardTokenDecimals = await rewardToken.methods.decimals().call();
            const rewardTokenApproval = await rewardToken.methods.allowance(dfoCore.address, lmContract.options.address).call();
            const rewardTokenBalance = await rewardToken.methods.balanceOf(dfoCore.address).call();
            setRewardTokenInfo({ contract: rewardToken, symbol: rewardTokenSymbol, decimals: rewardTokenDecimals, balance: rewardTokenBalance, address: rewardTokenAddress, approval: parseInt(rewardTokenApproval) !== 0  });

            const bNumber = await dfoCore.getBlockNumber();
            setBlockNumber(bNumber);

            const lpToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), farmSetupInfo.liquidityPoolTokenAddress);
            const lpTokenSymbol = await lpToken.methods.symbol().call();
            const lpTokenDecimals = await lpToken.methods.decimals().call();
            const lpTokenBalance = await lpToken.methods.balanceOf(dfoCore.address).call();
            const lpTokenApproval = await lpToken.methods.allowance(dfoCore.address, lmContract.options.address).call();
            setLpTokenInfo({ contract: lpToken, symbol: lpTokenSymbol, decimals: lpTokenDecimals, balance: lpTokenBalance, approval: parseInt(lpTokenApproval) !== 0 });

            const activateSetup = parseInt(farmSetupInfo.renewTimes) > 0 && !farmSetup.active && parseInt(farmSetupInfo.lastSetupIndex) === parseInt(setupIndex);
            setCanActivateSetup(activateSetup);

            const tokenAddress = farmSetupInfo.liquidityPoolTokenAddress;
            let res;
            if (farmSetupInfo.free) {
                res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, farmSetup.totalSupply).call();
            } else {
                res = await ammContract.methods.byTokenAmount(tokenAddress, farmSetupInfo.mainTokenAddress, farmSetup.totalSupply).call();
                res = await ammContract.methods.byLiquidityPoolAmount(tokenAddress, res.liquidityPoolAmount).call();
            }
            let mtInfo = null;
            const tokens = [];
            const approvals = [];
            const contracts = [];
            for (let i = 0; i < res.liquidityPoolTokens.length; i++) {
                const address = res.liquidityPoolTokens[i];
                const token = !isWeth(farmSetupInfo, address) ? await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), address) : null;
                const symbol = token ? await token.methods.symbol().call() : 'ETH';
                const decimals = token ? await token.methods.decimals().call() : 18;
                const balance = token ? await token.methods.balanceOf(dfoCore.address).call() : await dfoCore.web3.eth.getBalance(dfoCore.address);
                const approval = token ? await token.methods.allowance(dfoCore.address, lmContract.options.address).call() : true;
                approvals.push(parseInt(approval) !== 0);
                tokens.push({ amount: 0, balance: dfoCore.toDecimals(dfoCore.toFixed(balance), decimals), liquidity: res.tokensAmounts[i], decimals, address: token ? address : dfoCore.voidEthereumAddress, symbol });
                contracts.push(token);
                if (address.toLowerCase() === farmSetupInfo.mainTokenAddress.toLowerCase()) {
                    mtInfo = { approval: parseInt(approval) !== 0, decimals, contract: token, address: token ? address : dfoCore.voidEthereumAddress, symbol };
                    setMainTokenInfo(mtInfo)
                }
            }
            const info = await ammContract.methods.info().call();
            setAMM({ name: info['0'], version: info['1'] });
            setSetupTokens(tokens);
            setTokensContracts(contracts);
            setLpTokenAmount(0);
            setTokensAmount(new Array(tokens.length).fill(0));
            setTokensApprovals(approvals);
            // retrieve the manage data using the position
            if (position) {
                const free = position['free'];
                const creationBlock = position['creationBlock'];
                const positionSetupIndex = position['setupIndex'];
                const liquidityPoolTokenAmount = position['liquidityPoolTokenAmount'];
                const mainTokenAmount = position['mainTokenAmount'];
                const amounts = await ammContract.methods.byLiquidityPoolAmount(farmSetupInfo.liquidityPoolTokenAddress, liquidityPoolTokenAmount).call();
                const availableReward = await lmContract.methods.calculateFreeFarmingReward(position.positionId, true).call();
                let freeReward = parseInt(availableReward);
                if (blockNumber < parseInt(farmSetup.endBlock)) {
                    freeReward += (parseInt(farmSetup.rewardPerBlock) * (parseInt(position.liquidityPoolTokenAmount) / parseInt(farmSetup.totalSupply)))
                }
                freeReward = freeReward.toString().split('.')[0];
                setFreeAvailableRewards(freeReward);
                setManageStatus({ free, creationBlock, positionSetupIndex, liquidityPoolAmount: liquidityPoolTokenAmount, mainTokenAmount, tokensAmounts: amounts['tokensAmounts'], tokens })
            } else if (lockPositions.length > 0) {
                const lockStatuses = [];
                const lockRewards = [];
                for (let j = 0; j < lockPositions.length; j++) {
                    const lockedPosition = lockPositions[j];
                    const free = lockedPosition['free'];
                    const creationBlock = lockedPosition['creationBlock'];
                    const positionSetupIndex = lockedPosition['setupIndex'];
                    const liquidityPoolTokenAmount = lockedPosition['liquidityPoolTokenAmount'];
                    const mainTokenAmount = lockedPosition['mainTokenAmount'];
                    const amounts = await ammContract.methods.byLiquidityPoolAmount(farmSetupInfo.liquidityPoolTokenAddress, liquidityPoolTokenAmount).call();
                    const availableReward = await lmContract.methods.calculateLockedFarmingReward(0, 0, true, lockedPosition.positionId).call();
                    const lockedReward = parseInt(availableReward.reward) + (parseInt(farmSetup.endBlock) <= parseInt(blockNumber) ? 0 : parseInt(lockedPosition.lockedRewardPerBlock));
                    const partiallyRedeemed = await lmContract.methods._partiallyRedeemed(lockedPosition.positionId).call();
                    lockRewards.push(lockedReward);
                    lockStatuses.push({ free, creationBlock, positionSetupIndex, partiallyRedeemed, liquidityPoolAmount: liquidityPoolTokenAmount, mainTokenAmount, tokensAmounts: amounts['tokensAmounts'], tokens })    
                }
                setLockedPositionStatuses(lockStatuses);
                setLockedPositionRewards(lockRewards);
            }
            // calculate APY
            setApy(await calculateApy(farmSetup, rewardTokenAddress, rewardTokenDecimals, tokens));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const activateSetup = async () => {
        setActivateLoading(true);
        try {
            const gas = await lmContract.methods.activateSetup(setupIndex).estimateGas({ from: props.dfoCore.address });
            const result = await lmContract.methods.activateSetup(setupIndex).send({ from: props.dfoCore.address, gas });
            props.addTransaction(result);
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setActivateLoading(false);
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
            setLockedEstimatedReward(0);
            setFreeEstimatedReward(0);
            setTokensAmount(tokensAmounts.map((old, i) => "0"));
            return;
        }
        var ethereumAddress = (await ammContract.methods.data().call())[0];
        var tokenAddress = setupTokens[index].address;
        tokenAddress = tokenAddress === window.voidEthereumAddress ? ethereumAddress : tokenAddress;
        var result = await ammContract.methods.byTokenAmount(setupInfo.liquidityPoolTokenAddress, tokenAddress, props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(setupTokens[index].decimals)))).call();
        var { liquidityPoolAmount } = result;
        //result = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, liquidityPoolAmount).call();
        var ams = result.tokensAmounts;
        console.log(ams);
        setLpTokenAmount(props.dfoCore.toDecimals(liquidityPoolAmount, lpTokenInfo.decimals))
        setTokensAmount(ams.map((old, i) => ams[i]));
        if (!setupInfo.free) {
            let mainTokenIndex = 0;
            setupTokens.forEach((t, i) => {
                if (t.address === setupInfo.mainTokenAddress) {
                    mainTokenIndex = i;
                }
            })
            if (parseInt(ams[mainTokenIndex]) > 0) {
                const reward = await lmContract.methods.calculateLockedFarmingReward(setupIndex, ams[mainTokenIndex], false, 0).call();
                setLockedEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(parseInt(reward.relativeRewardPerBlock) * (parseInt(setup.endBlock) - blockNumber)), rewardTokenInfo.decimals));
            }
        } else {
            setFreeEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(parseInt(liquidityPoolAmount) * 6400 * parseInt(setup.rewardPerBlock) / (parseInt(setup.totalSupply) + parseInt(liquidityPoolAmount))), rewardTokenInfo.decimals))
        }
    }

    const onUpdateLpTokenAmount = async (value, index) => {
        if (!value || value === 'NaN') {
            setLockedEstimatedReward(0);
            setFreeEstimatedReward(0);
            // setLpTokenAmount("0");
            return;
        }
        const result = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(lpTokenInfo.decimals)))).call();
        const ams = result.tokensAmounts;
        setLpTokenAmount(value)
        setTokensAmount(tokensAmounts.map((old, i) => ams[i]));
        if (!setupInfo.free) {
            let mainTokenIndex = 0;
            setupTokens.forEach((t, i) => {
                if (t.address === setupInfo.mainTokenAddress) {
                    mainTokenIndex = i;
                }
            })
            if (parseInt(ams[mainTokenIndex]) > 0) {
                const reward = await lmContract.methods.calculateLockedFarmingReward(setupIndex, ams[mainTokenIndex], false, 0).call();
                setLockedEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(parseInt(reward.relativeRewardPerBlock) * (parseInt(setup.endBlock) - blockNumber)), rewardTokenInfo.decimals));
            }
        }
        setFreeEstimatedReward(props.dfoCore.toDecimals(props.dfoCore.toFixed(parseInt(props.dfoCore.toFixed(props.dfoCore.fromDecimals(value, parseInt(lpTokenInfo.decimals)))) * 6400 * parseInt(setup.rewardPerBlock) / (parseInt(setup.totalSupply) + parseInt(value))), rewardTokenInfo.decimals))
    }

    const addLiquidity = async () => {
        setAddLoading(true);
        try {
            const stake = {
                setupIndex,
                amount: 0,
                amountIsLiquidityPool: inputType === 'add-lp' ? true : false,
                positionOwner: uniqueOwner || dfoCore.voidEthereumAddress,
            };

            let ethTokenIndex = null;
            let ethTokenValue = 0;
            let mainTokenIndex = 0;
            await Promise.all(setupTokens.map(async (token, i) => {
                if (setupInfo.involvingETH && token.address === props.dfoCore.voidEthereumAddress) {
                    ethTokenIndex = i;
                } else if (token.address === setupInfo.mainTokenAddress) {
                    mainTokenIndex = i;
                }
            }))
            console.log(ethTokenIndex);
            let lpAmount = dfoCore.toFixed(dfoCore.fromDecimals(lpTokenAmount.toString()));
            const res = await ammContract.methods.byLiquidityPoolAmount(setupInfo.liquidityPoolTokenAddress, lpAmount).call();
            var localTokensAmounts = stake.amountIsLiquidityPool ? res.tokensAmounts : tokensAmounts;
            // const res = await ammContract.methods.byTokensAmount(setupInfo.liquidityPoolTokenAddress,  , stake.amount).call();
            stake.amount = stake.amountIsLiquidityPool ? lpAmount : localTokensAmounts[mainTokenIndex];
            ethTokenValue = localTokensAmounts[ethTokenIndex];
            console.log(ethTokenValue);
            var value = setupInfo.involvingETH && !stake.amountIsLiquidityPool ? ethTokenValue : 0;
            console.log(value);
            console.log(stake);
            if ((currentPosition && isValidPosition(currentPosition)) || setupInfo.free) {
                // adding liquidity to the setup
                if (!currentPosition) {
                    const gasLimit = await lmContract.methods.openPosition(stake).estimateGas({ from: dfoCore.address, value});
                    console.log(gasLimit);
                    const result = await lmContract.methods.openPosition(stake).send({ from: dfoCore.address, gasLimit: parseInt(gasLimit * (props.dfoCore.getContextElement("gasMultiplier") || 1)), value});
                    props.addTransaction(result);

                } else {
                    const gasLimit = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).estimateGas({ from: dfoCore.address, value});
                    const result = await lmContract.methods.addLiquidity(currentPosition.positionId, stake).send({ from: dfoCore.address, gasLimit: parseInt(gasLimit * (props.dfoCore.getContextElement("gasMultiplier") || 1)), value});
                    props.addTransaction(result);
                }

            } else if (!setupInfo.free) {

                // opening position
                const gasLimit = await lmContract.methods.openPosition(stake).estimateGas({ from: dfoCore.address, value});
                console.log(gasLimit);
                const result = await lmContract.methods.openPosition(stake).send({ from: dfoCore.address, gasLimit: parseInt(gasLimit * (props.dfoCore.getContextElement("gasMultiplier") || 1)), value});
                props.addTransaction(result);
            }
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setAddLoading(false);
        }
    }

    const removeLiquidity = async () => {
        if (setupInfo.free && (!removalAmount || removalAmount === 0)) return;
        setRemoveLoading(true);
        try {
            if (setupInfo.free) {
                const removedLiquidity = removalAmount === 100 ? manageStatus.liquidityPoolAmount : props.dfoCore.toFixed(parseInt(manageStatus.liquidityPoolAmount) * removalAmount / 100).toString().split('.')[0];
                const gasLimit = await lmContract.methods.withdrawLiquidity(currentPosition.positionId, 0, outputType === 'to-pair', removedLiquidity).estimateGas({ from: dfoCore.address });
                const result = await lmContract.methods.withdrawLiquidity(currentPosition.positionId, 0, outputType === 'to-pair', removedLiquidity).send({ from: dfoCore.address, gasLimit });
                props.addTransaction(result);
            } else {
                const gasLimit = await lmContract.methods.withdrawLiquidity(0, setup.objectId, outputType === 'to-pair', farmTokenBalance).estimateGas({ from: dfoCore.address });
                const result = await lmContract.methods.withdrawLiquidity(0, setup.objectId, outputType === 'to-pair', farmTokenBalance).send({ from: dfoCore.address, gasLimit });
                props.addTransaction(result);
            }
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setRemoveLoading(false);
        }
    }

    const withdrawReward = async () => {
        setClaimLoading(true);
        try {
            const gasLimit = await lmContract.methods.withdrawReward(currentPosition.positionId).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.withdrawReward(currentPosition.positionId).send({ from: dfoCore.address, gasLimit });
            props.addTransaction(result);
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setClaimLoading(false);
        }
    }
    
    const transferPosition = async (positionId, index) => {
        if (!positionId) return;
        if (setupInfo.free) {
            setTransferLoading(true);
            try {
                const gasLimit = await lmContract.methods.transferPosition(freeTransferAddress, positionId).estimateGas({ from: dfoCore.address });
                const result = await lmContract.methods.transferPosition(freeTransferAddress, positionId).send({ from: dfoCore.address, gasLimit });
                props.addTransaction(result);
                await getSetupMetadata();
            } catch (error) {
                console.error(error);
            } finally {
                setTransferLoading(false);
            }
        }
        /* 
        else {
            if ((!index && index !== 0) || !transferAddress[index]) return;
            setLockedTransferLoading(lockedTransferLoading.map((v, i) => i === index ? true : v));
            try {
                const gasLimit = await lmContract.methods.transferPosition(transferAddress[index], positionId).estimateGas({ from: dfoCore.address });
                const result = await lmContract.methods.transferPosition(transferAddress[index], positionId).send({ from: dfoCore.address, gasLimit });
                await getSetupMetadata();
            } catch (error) {
                console.error(error);
            } finally {
                setTransferLoading(lockedTransferLoading.map((v, i) => i === index ? false : v));
            }
        }
        */
    }
/*
    const updateSetup = async () => {
        setLoading(true);
        try {
            const updatedSetup = {
                free: false,
                blockDuration: 0,
                originalRewardPerBlock: updatedRewardPerBlock,
                minStakeable: 0,
                maxStakeable: 0,
                renewTimes: updatedRenewTimes,
                ammPlugin: dfoCore.voidEthereumAddress,
                liquidityPoolTokenAddress: dfoCore.voidEthereumAddress,
                mainTokenAddress: dfoCore.voidEthereumAddress,
                ethereumAddress: dfoCore.voidEthereumAddress,
                involvingETH: false,
                penaltyFee: 0,
                setupsCount: 0,
                lastSetupIndex: 0,
            };
            const updatedSetupConfiguration = { add: false, disable: false, index: parseInt(setupIndex), info: updatedSetup };
            const gasLimit = await extensionContract.methods.setFarmingSetups([updatedSetupConfiguration]).estimateGas({ from: dfoCore.address });
            const result = await extensionContract.methods.setFarmingSetups([updatedSetupConfiguration]).send({ from: dfoCore.address, gasLimit });
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const disableSetup = async () => {
        setLoading(true);
        try {
            const updatedSetup = {
                free: false,
                blockDuration: 0,
                originalRewardPerBlock: 0,
                minStakeable: 0,
                maxStakeable: 0,
                renewTimes: 0,
                ammPlugin: dfoCore.voidEthereumAddress,
                liquidityPoolTokenAddress: dfoCore.voidEthereumAddress,
                mainTokenAddress: dfoCore.voidEthereumAddress,
                ethereumAddress: dfoCore.voidEthereumAddress,
                involvingETH: false,
                penaltyFee: 0,
                setupsCount: 0,
                lastSetupIndex: 0,
            };
            const updatedSetupConfiguration = { add: false, disable: true, index: parseInt(setupIndex), info: updatedSetup };
            const gasLimit = await extensionContract.methods.setFarmingSetups([updatedSetupConfiguration]).estimateGas({ from: dfoCore.address });
            const result = await extensionContract.methods.setFarmingSetups([updatedSetupConfiguration]).send({ from: dfoCore.address, gasLimit });
            await getSetupMetadata();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    */

    const getApproveButton = (isLp) => {
        if (!isLp) {
            const notApprovedIndex = tokensApprovals.findIndex((value) => !value);
            if (notApprovedIndex !== -1) {
                return <ApproveButton contract={tokensContracts[notApprovedIndex]} from={props.dfoCore.address} spender={lmContract.options.address} onApproval={() => onTokenApproval(notApprovedIndex, false)} onError={(error) => console.error(error)} text={`Approve ${setupTokens[notApprovedIndex].symbol}`} />
            } else {
                return <div />
            }
        } else {

            if (!lpTokenInfo.approval) {
                return <ApproveButton contract={lpTokenInfo.contract} from={props.dfoCore.address} spender={lmContract.options.address} onApproval={() => onTokenApproval(null, true)} onError={(error) => console.error(error)} text={`Approve ${lpTokenInfo.symbol}`} />
            } else {
                return <div />
            }
        }
    }

    const onInputTypeChange = async (e) => {
        setInputType(e.target.value);
        const ethBalance = await props.dfoCore.web3.eth.getBalance(props.dfoCore.address);
        setEthBalanceOf(ethBalance);
    }

    const onOutputTypeChange = e => {
        setOutputType(e.target.value);
    }

    const updateEthAmount = async amount => {
        try {
            setEthAmount(amount || "0");
            if (!amount) {
                return;
            };
        } catch (error) {
            console.error(error);
        }
    }

    const calculateLockedFixedValue = () => {
        const { rewardPerBlock } = setup;
        const { maxStakeable } = setupInfo;
        const normalizedRewardPerBlock = parseInt(rewardPerBlock) * 10**(18 - rewardTokenInfo.decimals);
        const normalizedMaxStakeable = parseInt(maxStakeable) * 10**(18 - mainTokenInfo.decimals);
        const amount = normalizedRewardPerBlock * (1 / normalizedMaxStakeable);
        return (canActivateSetup) ? window.formatMoney(amount * parseInt(setupInfo.blockDuration), 6) : parseInt(blockNumber) >= parseInt(setup.endBlock) ? 0 : window.formatMoney(amount * (parseInt(setup.endBlock) - parseInt(blockNumber)), 6);
    }

    const getAdvanced = () => {
        return !edit ? getManageAdvanced() : getEdit();
    }

    const getEdit = () => {
        return 
        
        {/* @locked For upcoming release
        <div className="pb-4 px-4">
            <hr />
            <div className="row mt-2 align-items-center justify-content-start">
                {
                    setupInfo.free &&
                    <div className="col-12 mb-md-2">
                        <Input value={dfoCore.toDecimals(updatedRewardPerBlock)} min={0} onChange={(e) => setUpdatedRewardPerBlock(dfoCore.toFixed(dfoCore.fromDecimals(e.target.value), rewardTokenInfo.decimals))} label={"Reward per block"} />
                    </div>
                }
                <div className="col-12 mb-md-2">
                    <Input value={updatedRenewTimes} min={0} onChange={(e) => setUpdatedRenewTimes(e.target.value)} label={"Renew times"} />
                </div>
                <div className="col-12">
                    <button onClick={() => updateSetup()} className="btn btn-secondary">Update</button>
                    {setup.active && <button onClick={() => disableSetup()} className="btn btn-primary">Disable</button>}
                </div>
            </div>
        </div>*/}
    }

    const getManageAdvanced = () => {
        if (withdrawOpen && currentPosition && setupInfo.free) {
            return (
                <div className="FarmActions">
                    <input type="range" value={removalAmount} onChange={(e) => setRemovalAmount(parseInt(e.target.value))} className="form-control-range" id="formControlRange" />
                    <div className="Web2ActionsBTNs">
                    <p><b>Amount:</b> {removalAmount}% ({window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(parseInt(manageStatus.liquidityPoolAmount) * removalAmount / 100).toString(), lpTokenInfo.decimals), lpTokenInfo.decimals)} {lpTokenInfo.symbol} - {manageStatus.tokens.map((token, i) => <span key={token.address}> {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(parseInt(manageStatus.tokensAmounts[i]) * removalAmount / 100).toString(), token.decimals), token.decimals)} {token.symbol} </span>)})</p>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(10)} >10%</a>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(25)} >25%</a>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(50)} >50%</a>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(75)} >75%</a>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(90)} >90%</a>
                        <a className="web2ActionBTN" onClick={() => setRemovalAmount(100)} >MAX</a>
                    </div>
                    <div className="row">
                        <div className="QuestionRegular">
                            <label className="PrestoSelector">
                                <span>To Pair</span>
                                <input name="outputType" type="radio" value="to-pair" checked={outputType === "to-pair"} onChange={onOutputTypeChange} />
                            </label>
                            <label className="PrestoSelector">
                                <span>To LP Token</span>
                                <input name="outputType" type="radio" value="to-lp" checked={outputType === "to-lp"} onChange={onOutputTypeChange} />
                            </label>
                        </div>
                    </div>
                    <div className="Web2ActionsBTNs">
                        {
                            removeLoading ? <a className="Web3ActionBTN" disabled={removeLoading}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </a> : <a onClick={() => removeLiquidity()} className="Web3ActionBTN">Remove</a>
                        }
                    </div>
                </div>
            )
        }

        return <div className="FarmActions">
            {
                (parseInt(setup.endBlock) > parseInt(blockNumber) || currentPosition) &&
                        <div className="QuestionRegular">
                            {setup.active && (setupInfo.free || !currentPosition) && parseInt(setup.endBlock) > parseInt(blockNumber) && <>
                                    <label className="PrestoSelector">
                                        <span>From Pair</span>
                                        <input name={`inputType-${lmContract.options.address}-${setupIndex}`} type="radio" value="add-pair" checked={inputType === "add-pair"} onChange={(e) => onInputTypeChange(e)} />
                                    </label>
                                    <label className="PrestoSelector">
                                        <span>From ETH</span>
                                        <input name={`inputType-${lmContract.options.address}-${setupIndex}`} type="radio" value="add-eth" checked={inputType === "add-eth"} onChange={(e) => onInputTypeChange(e)} />
                                    </label>
                                    <label className="PrestoSelector">
                                        <span>From LP Token</span>
                                        <input name={`inputType-${lmContract.options.address}-${setupIndex}`} type="radio" value="add-lp" checked={inputType === "add-lp"} onChange={(e) => onInputTypeChange(e)} />
                                    </label>
                                </>
                            }
                        </div>
            }
            {inputType === 'add-pair' ? <>
                {
                    setupTokens.map((setupToken, i) => {
                        return <div key={setupToken.address} className="InputTokenRegular">
                            <Input showMax={true} address={setupToken.address} value={window.fromDecimals(tokensAmounts[i], setupToken.decimals, true)} balance={setupToken.balance} min={0} onChange={(e) => onUpdateTokenAmount(e.target.value, i)} showCoin={true} showBalance={true} name={setupToken.symbol} />
                        </div>
                    })
                }
                {
                    (!setupInfo.free || !currentPosition) && 
                    <label className="OptionalThingsFarmers" htmlFor="openPositionWallet1">
                        <input className="form-check-input" type="checkbox" checked={openPositionForAnotherWallet} onChange={(e) => setOpenPositionForAnotherWallet(e.target.checked)} id="openPositionWallet1" />
                        <p>External Owner</p>
                    </label>
                }
                {
                    openPositionForAnotherWallet && <div className="DiffWallet">
                            <input type="text" className="TextRegular" placeholder="Position owner address" value={uniqueOwner} onChange={(e) => setUniqueOwner(e.target.value)} id="uniqueOwner" />
                            <p className="BreefExpl">Open this farming position as another wallet - The wallet you insert here will be the owner of the entire position and Farm Tokens (if "Locked Position")</p>
                    </div>
                }
                {
                    (!setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                            <p><b>Total Rewards until end block</b>: {window.formatMoney(lockedEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                            <p className="BreefExpl">Once you lock this liquidity you'll be able to withdraw it at the Setup End Block. If you want to Unlock this position earlier, you'll need to pay a Penalty Fee (in Reward Tokens) + all of the Reward Tokens you Claimed from this position + All of the Farm Token you're minting (representing your LP tokens locked).</p>
                    </div>
                }
                {
                    (setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                            <p><b>Estimated reward per day</b>: {window.formatMoney(freeEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                    </div>
                }
                <div className="Web3BTNs">
                    {
                        tokensApprovals.some((value) => !value) && <>
                            {getApproveButton()}
                        </>
                    }
                    {
                        addLoading ? <a className="Web3ActionBTN" disabled={addLoading}>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </a> : <a className="Web3ActionBTN" onClick={() => addLiquidity()} disabled={tokensApprovals.some((value) => !value) || tokensAmounts.some((value) => value === 0)}>Add Liquidity</a>
                    }
                </div>
            </> : inputType === 'add-lp' ? <>
                        <div className="InputTokenRegular">
                            <Input showMax={true} address={lpTokenInfo.contract.options.address} value={lpTokenAmount} balance={window.fromDecimals(lpTokenInfo.balance, lpTokenInfo.decimals, true)} min={0} onChange={(e) => onUpdateLpTokenAmount(e.target.value)} showCoin={true} showBalance={true} name={lpTokenInfo.symbol} />
                        </div>
                {
                    parseFloat(lpTokenAmount) > 0 && <div className="row justify-content-center mt-2">
                        <p><b>Pair</b>: 
                            {
                                setupTokens.map((setupToken, i) => <span key={setupToken.address}> {window.formatMoney(dfoCore.toDecimals(tokensAmounts[i], setupToken.decimals), setupToken.decimals)} {setupToken.symbol}</span>)
                            }
                        </p>
                    </div>
                }
                {
                    (!setupInfo.free || !currentPosition) && <label className="OptionalThingsFarmers" htmlFor="openPosition2">
                        <input className="form-check-input" type="checkbox" checked={openPositionForAnotherWallet} onChange={(e) => setOpenPositionForAnotherWallet(e.target.checked)} id="openPosition2" />
                         <p>External Owner</p>
                    </label>
                }
                {
                    openPositionForAnotherWallet && <div>
                        <input type="text" className="TextRegular" placeholder="Position owner address" value={uniqueOwner} onChange={(e) => setUniqueOwner(e.target.value)} id="uniqueOwner" />
                        <p className="BreefExpl">Open this farming position as another wallet - The wallet you insert here will be the owner of the entire position and Farm Tokens (if "Locked Position")</p>
                    </div>
                }
                {
                    (!setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                            <p><b>Total Rewards until end block</b>: {window.formatMoney(lockedEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                            <p className="BreefExpl">Once you lock this liquidity you'll be able to withdraw it at the Setup End Block. If you want to Unlock this position earlier, you'll need to pay a Penalty Fee (in Reward Tokens) + all of the Reward Tokens you Claimed from this position + All of the Farm Token you're minting (representing your LP tokens locked).</p>
                    </div>
                }
                {
                    (setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                            <p><b>Estimated reward per day</b>: {window.formatMoney(freeEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                    </div>
                }
                <div className="Web3BTNs">
                    {
                        !lpTokenInfo.approval && <>
                            {getApproveButton(true)}
                        </>
                    }
                    {
                        addLoading ? <a className="Web3ActionBTN" disabled={addLoading}>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </a> : <a className="Web3ActionBTN" onClick={() => addLiquidity()} disabled={!lpTokenInfo.approval || parseFloat(lpTokenAmount) === 0}>Add Liquidity</a>
                    }
                </div>
            </> : 
             inputType === 'add-eth' ? <>
                <div className="InputTokenRegular">
                    <Input showMax={true} address={dfoCore.voidEthereumAddress} value={ethAmount} balance={dfoCore.toDecimals(ethBalanceOf, 18)} min={0} onChange={e => updateEthAmount(e.target.value)} showCoin={true} showBalance={true} name={"ETH"} />
                </div>
             {
                 (!setupInfo.free || !currentPosition) && 
                     <label className="OptionalThingsFarmers" htmlFor="openPosition2">
                        <input className="form-check-input" type="checkbox" checked={openPositionForAnotherWallet} onChange={(e) => setOpenPositionForAnotherWallet(e.target.checked)} id="openPosition2" />
                         <p>External Owner</p>
                    </label>
             }
             {
                 openPositionForAnotherWallet && <div>
                        <input type="text" className="TextRegular" placeholder="Position owner address" value={uniqueOwner} onChange={(e) => setUniqueOwner(e.target.value)} id="uniqueOwner" />
                        <p className="BreefExpl">Open this farming position as another wallet - The wallet you insert here will be the owner of the entire position and Farm Tokens (if "Locked Position")</p>
                 </div>
             }
             {
                 (!setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                         <p><b>Total Rewards until end block</b>: {window.formatMoney(lockedEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                         <p className="BreefExpl">Once you lock this liquidity you'll be able to withdraw it at the Setup End Block. If you want to Unlock this position earlier, you'll need to pay a Penalty Fee (in Reward Tokens) + all of the Reward Tokens you Claimed from this position + All of the Farm Token you're minting (representing your LP tokens locked).</p>
                 </div>
             }
             {
                 (setupInfo.free && rewardTokenInfo) && <div className="row justify-content-center mt-4">
                         <p><b>Estimated reward per day</b>: {window.formatMoney(freeEstimatedReward, rewardTokenInfo.decimals)} {rewardTokenInfo.symbol}</p>
                 </div>
             }
             <div className="Web3BTNs">
                {
                    addLoading ? <a className="Web3ActionBTN" disabled={addLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a> :  <a className="Web3ActionBTN" onClick={() => addLiquidity()} disabled={parseFloat(ethAmount) === 0}>Add Liquidity</a>
                }
             </div>
         </> : <></>
        }
        </div>
    }

    if (loading || !setup) {
        return (
            <div className={className}>
                <div className="row px-2 farming-component-main-row">
                    <div className="col-12 flex justify-content-center align-items-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className={className}>
            <div className="FarmSetupMain">
                <h5><b>{setupInfo.free ? "Free Farming" : "Locked Farming"} {(!setup.active && canActivateSetup) ? <span className="text-secondary">(new)</span> : (!setup.active) ? <span className="text-danger">(inactive)</span> : <></> } {(parseInt(setup.endBlock) <= blockNumber && parseInt(setup.endBlock) !== 0) && <span>(ended)</span>}</b> <a>{AMM.name}</a></h5>
                <aside>
                    { parseInt(setup.endBlock) > 0 ? <p><b>block end</b>: <a target="_blank" href={`https://etherscan.io/block/${setup.endBlock}`}>{setup.endBlock}</a></p> : <p><b>Duration</b>: {getPeriodFromDuration(setupInfo.blockDuration)}</p> }
                    <p><b>Min to Stake</b>: {window.formatMoney(window.fromDecimals(setupInfo.minStakeable, mainTokenInfo.decimals, true), 6)} {mainTokenInfo.symbol}</p>
                    {!setupInfo.free && <p><b>Penalty fee</b>: {parseInt(setupInfo.penaltyFee) === 0 ? `0` : props.dfoCore.formatMoney(props.dfoCore.toDecimals(props.dfoCore.toFixed(setupInfo.penaltyFee), 18) * 100, 18)}%</p>}
                </aside>
                <div className="SetupFarmingInstructions">
                    <p>{setupTokens.map((token, i) => <figure key={token.address}>{i !== 0 ? '+ ' : ''}{token.address !== props.dfoCore.voidEthereumAddress ? <a target="_blank" href={`https://etherscan.io/token/${token.address}`}><Coin address={token.address} /></a> : <Coin address={token.address} />} </figure>)} = <b>APY</b>: {!apy || apy === 0 ? "?" : window.formatMoney(apy, 0)}%</p>
                </div>
                <div className="SetupFarmingOthers">
                    {
                        setupInfo.free ? <>
                            <p><b>Total {rewardTokenInfo.symbol}/day</b>: {props.dfoCore.toDecimals(parseInt(setup.rewardPerBlock) * 6400, rewardTokenInfo.decimals, 6)} {rewardTokenInfo.symbol} <span>(Shared)</span></p>
                            <p><b>Total Deposited</b>: {props.dfoCore.toDecimals(parseInt(setup.totalSupply), lpTokenInfo.decimals, 6)} {lpTokenInfo.symbol} ({setupTokens.map((token, index) => <span key={token.address}>{props.dfoCore.toDecimals(token.liquidity, token.decimals, 6)} {token.symbol}{index !== setupTokens.length - 1 ? ' - ' : ''}</span> )})</p>
                        </> : <>
                                <p><b>Max Stakeable</b>: {props.dfoCore.toDecimals(setupInfo.maxStakeable, mainTokenInfo.decimals)} {mainTokenInfo.symbol} (Available: {props.dfoCore.toDecimals(parseInt(setupInfo.maxStakeable) - parseInt(setup.totalSupply), mainTokenInfo.decimals)} {mainTokenInfo.symbol})</p>
                                <p><b>{calculateLockedFixedValue()} {rewardTokenInfo.symbol}</b> (fixed) for every {mainTokenInfo.symbol} locked until the end block</p>
                        </>
                    }
                </div>
            </div>
            <div className="YourFarmingPositions">
                {
                    setupInfo.free ? <>
                    <div className="FarmYou">
                        {
                            currentPosition && <>
                                <p>
                                    <b>Your Deposit</b>: {window.formatMoney(window.fromDecimals(manageStatus.liquidityPoolAmount, lpTokenInfo.decimals, true), 6)} {lpTokenInfo.symbol} - {manageStatus.tokens.map((token, i) => <span key={token.address}> {window.formatMoney(window.fromDecimals(manageStatus.tokensAmounts[i], token.decimals, true), 6)} {token.symbol} </span>)}
                                </p>
                            </>
                        }
                        {
                            canActivateSetup && <>
                                {
                                    activateLoading ? <a className="Web3ActionBTN" disabled={activateLoading}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </a> : <a className="Web3ActionBTN" onClick={() => { activateSetup() }}>Activate</a>
                                }
                            </>
                        }
                        {
                            (hostedBy && extensionContract && !edit && parseInt(setupInfo.lastSetupIndex) === parseInt(setupIndex) && hostedBy) &&
                            <a className="web2ActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(true) }}>Edit</a>
                        }
                        {
                            (edit) &&
                            <a className="backActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(false) }}>Close</a>
                        }
                        {
                            (!open && parseInt(setup.endBlock) > parseInt(blockNumber)) && <a className="web2ActionBTN" onClick={() => { setOpen(true); setWithdrawOpen(false); setEdit(false); }}>Farm</a>
                        }
                        {
                            (open) &&
                            <a className="backActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(false) }}>Close</a>
                        }
                        {
                            (!withdrawOpen && currentPosition) && <a className="web2ActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(true); setEdit(false); }}>Remove</a>   
                        }
                        {
                            (withdrawOpen) &&
                            <a className="backActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(false) }}>Close</a>
                        }
                    </div>
                    {
                        currentPosition && 
                        <div className="Farmed">
                            <p><b>{rewardTokenInfo.symbol}/Day</b>: {window.formatMoney(window.fromDecimals((parseInt(setup.rewardPerBlock) * 6400) * (parseInt(manageStatus.liquidityPoolAmount)/parseInt(setup.totalSupply)), rewardTokenInfo.decimals, true), 6)} {rewardTokenInfo.symbol}</p>
                            <p><b>Available</b>: {window.formatMoney(window.fromDecimals(freeAvailableRewards, rewardTokenInfo.decimals, true), 6)} {rewardTokenInfo.symbol}</p>
                            {
                                !showFreeTransfer ? <a onClick={() => setShowFreeTransfer(true)} className="web2ActionBTN">Transfer</a> : <a onClick={() => setShowFreeTransfer(false)} className="backActionBTN">Close</a>
                            }
                            {
                                claimLoading ? <a className="Web3ActionBTN" disabled={claimLoading}>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </a> : <a onClick={() => withdrawReward()} className="Web3ActionBTN">Claim</a>
                            }
                            {
                                showFreeTransfer && <div className="Tranferpos">
                                    <input type="text" className="TextRegular" placeholder="Position receiver" value={freeTransferAddress} onChange={(e) => setFreeTransferAddress(e.target.value)} id={`transferAddress`} />
                                    {
                                        transferLoading ? <a className="Web3ActionBTN" disabled={transferLoading}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        </a> : <a onClick={() => transferPosition(currentPosition.positionId)} className="Web3ActionBTN">Transfer</a>
                                    }
                                </div>
                            }
                        </div>
                    }
                    </> : <>
                    {
                        parseInt(farmTokenBalance) > 0 && <div className="LockedFarmTokensPosition"> 
                            <p><b>Your Farm ITEM (fLP) Balance</b>:</p>
                            <p>{window.formatMoney(window.fromDecimals(farmTokenBalance, farmTokenDecimals, true), 9)} ({setupTokens.map((setupToken, i) => `${parseInt(farmTokenBalance) === 0 ? 0 : window.formatMoney(window.fromDecimals(farmTokenRes[i], setupToken.decimals, true), 3)} ${setupToken.symbol}${i !== setupTokens.length - 1 ? ' - ' : ''}`)}) 
                            <a className="MetamaskAddButton" onClick={() => props.dfoCore.addTokenToMetamask(farmTokenERC20Address, /* farmTokenSymbol */"fLP", farmTokenDecimals)}>
                                    <img height={14} src={metamaskLogo} alt="Metamask" className="mb-1" /> Add {/* farmTokenSymbol */ "fLP"}
                                </a>
                            </p>
                        </div>
                    }
                    {
                        (parseInt(blockNumber) >= parseInt(setup.endBlock) && parseInt(farmTokenBalance) > 0) && <>
                            <div className="QuestionRegular">
                                <label className="PrestoSelector">
                                    <span>To Pair</span>
                                    <input name={`outputType-${lmContract.options.address}-${setupIndex}`} type="radio" value="to-pair" checked={outputType === "to-pair"} onChange={onOutputTypeChange} />
                                </label>
                                <label className="PrestoSelector">
                                    <span>To LP Token</span>
                                    <input name={`outputType-${lmContract.options.address}-${setupIndex}`} type="radio" value="to-lp" checked={outputType === "to-lp"} onChange={onOutputTypeChange} />
                                </label>
                            </div>
                            {
                            removeLoading ? <a className="Web3ActionBTN Web3ActionBTNV" disabled={removeLoading}>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </a> : (parseInt(blockNumber) >= parseInt(setup.endBlock)) ? <a className="Web3ActionBTN Web3ActionBTNV" onClick={() => removeLiquidity()}>Withdraw Liquidity</a> : <></>
                            }
                        </>
                    }
                    {
                        lockedPositions.length > 0 && <>
                            {
                                lockedPositions.map((position, index) => {
                                    return (
                                        <LockedPositionComponent 
                                            key={index}
                                            farmTokenBalance={farmTokenBalance} 
                                            farmTokenSymbol={farmTokenSymbol}
                                            farmTokenDecimals={farmTokenDecimals}
                                            onComplete={(result) => { 
                                                props.addTransaction(result); getSetupMetadata(); }
                                            } 
                                            lmContract={lmContract} 
                                            position={position} 
                                            blockNumber={blockNumber} 
                                            setup={setup}
                                            setupInfo={setupInfo}
                                            dfoCore={dfoCore}
                                            rewardTokenInfo={rewardTokenInfo}
                                            setupTokens={setupTokens}
                                            lpTokenInfo={lpTokenInfo} 
                                            lockedPositionStatus={lockedPositionStatuses[index]}
                                            lockedPositionReward={lockedPositionRewards[index]}
                                            mainTokenInfo={mainTokenInfo}
                                            onRewardTokenApproval={() => setRewardTokenInfo({ ...rewardTokenInfo, approval: true })}
                                        />
                                    )
                                })
                            }
                        </>
                    }
                    <div className="FarmYou">
                        {
                            canActivateSetup && <>
                                {
                                    activateLoading ? <a className="Web3ActionBTN" disabled={activateLoading}>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </a> : <a className="Web3ActionBTN" onClick={() => { activateSetup() }}>Activate</a>
                                }
                            </>
                        } 
                        {
                            (hostedBy && extensionContract && !edit && parseInt(setupInfo.lastSetupIndex) === parseInt(setupIndex) && hostedBy) &&
                            <a className="web2ActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(true) }}>Edit</a>
                        }
                        {
                            (edit) &&
                            <a className="backActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(false) }}>Close</a>
                        }
                        {
                            (!open && parseInt(setup.endBlock) > parseInt(blockNumber)) && <a className="web2ActionBTN" onClick={() => { setOpen(true); setWithdrawOpen(false); setEdit(false); }}>Farm</a>
                        }
                        {
                            (open) &&
                            <a className="backActionBTN" onClick={() => { setOpen(false); setWithdrawOpen(false); setEdit(false) }}>Close</a>
                        }
                    </div>
                    </>
                }
            </div>
            {
                ((open || withdrawOpen) && !edit) ? <><hr />{getAdvanced()}</> : <div />
            }
            {
                (edit && !open && !withdrawOpen) ? getEdit() : <div />
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTransaction: (index) => dispatch(addTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupComponent);