import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';
import { ethers } from 'ethers';

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
    const [estimatedToken0, setEstimatedToken0] = useState(0);
    const [estimatedToken1, setEstimatedToken1] = useState(0);
    const [estimatedLpToken, setEstimatedLpToken] = useState(0);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getController();
    }, [])

    const getController = async () => {
        const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
        console.log(contract);
        setWusdExtensionController(contract);
        const allowedAMMS = await contract.methods.allowedAMMs().call();
        let allowedPairs = [];
        await Promise.all(allowedAMMS.map(async (allowedAMM, ammIndex) => {
            const { ammAddress, liquidityPools } = allowedAMM;
            const pools = [];
            await Promise.all(liquidityPools.map(async (liquidityPool, lpIndex) => {
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
                setFirstTokenBalance(props.dfoCore.toDecimals(balance0, parseInt(token0decimals)));
                setSecondTokenBalance(props.dfoCore.toDecimals(balance1, parseInt(token1decimals)));
                pools.push({ ammContract, ammIndex, lpIndex, totalAmount, token0Amount, token1Amount, liquidityPool, token0, token1, symbol0, symbol1, token0decimals, token1decimals, token0Contract, token1Contract });
            }));
            allowedPairs = [...allowedPairs, ...pools ];
        }))
        const wusdInfo = await contract.methods.wusdInfo().call();  
        const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
        const balance = await wusdContract.methods.balanceOf(props.dfoCore.address).call();
        const approval = await wusdContract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
        setWusdContract(wusdContract);
        console.log(approval);
        setWusdApproved(parseInt(approval) !== 0);
        setWusdBalance(props.dfoCore.toDecimals(balance, await wusdContract.methods.decimals().call()));
        setPairs(allowedPairs);
    }

    const onTokenApproval = (type) => {
        switch (type) {
            case 'wusd':
                setWusdApproved(true);
            default:
                return;
        }
    }

    const clearTokens = () => {
        setEstimatedToken0(0);
        setEstimatedToken1(0);
        setEstimatedLpToken(0);
    }

    const onWUSDAmountChange = async (amount) => {
        setLoading(true);
        setAmount(amount);
        if (!amount) {
            clearTokens();
            return;
        }
        if (parseInt(amount) <= 0) {
            clearTokens();
            return;
        }
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0decimals, token1decimals } = chosenPair;
        const wusdAmount = props.dfoCore.fromDecimals(amount.toString(), 18);

        const res = await ammContract.methods.byLiquidityPool(liquidityPool).call();

        const liquidityPoolAmount = res[0];
        const tokensAmounts = res[1];
        const liquidityPoolTokens = res[2];
        const updatedSecondTokenAmount = tokensAmounts[1] * 10**12;

        const ratio = tokensAmounts[0] / updatedSecondTokenAmount;
        const ratio2 = updatedSecondTokenAmount / tokensAmounts[0];

        const wusdRealAmount = (parseInt(wusdAmount) * ratio) / 2;

        const result = await ammContract.methods.byTokenAmount(liquidityPool, liquidityPoolTokens[0], wusdRealAmount.toString()).call();
        const [token0, token1] = result.tokensAmounts;
        const stableCoinOutput = parseInt(token0) + parseInt(token1 * 10**12);
        const rate = parseInt(wusdAmount) / stableCoinOutput;
        const lpResult = await ammContract.methods.byTokenAmount(liquidityPool, liquidityPoolTokens[0], (parseInt(token0) * rate).toString()).call();

        setEstimatedToken0(props.dfoCore.toDecimals(parseInt(token0) * rate, token0decimals));
        setEstimatedToken1(props.dfoCore.toDecimals(parseInt(token1) * rate, token1decimals));
        setEstimatedLpToken(props.dfoCore.toDecimals(lpResult.liquidityPoolAmount, 18));
        setLoading(false);
    }

    const burnWUSD = async () => {
        const info = await wusdExtensionController.methods.wusdInfo().call();
        const collectionAddress = info['0'];
        const wusdObjectId = info['1'];
        const wusdInteroperableInterfaceAddress = info['2'];
        console.log(collectionAddress, wusdObjectId, wusdInteroperableInterfaceAddress);
        const wusdCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), collectionAddress);
        console.log(pairs[pair]);
        const burnData = abi.encode(["uint256","uint256","uint256","bool"], [pairs[pair].ammIndex, pairs[pair].lpIndex, props.dfoCore.fromDecimals(estimatedLpToken, 18), !getLpToken])
        const data = abi.encode(["uint256", "bytes"], [0, burnData]);
        console.log(data);
        console.log(props.dfoCore.fromDecimals(amount, 18).toString());
        console.log(wusdExtensionController);
        // await wusdCollection.methods.setApprovalForAll(collectionAddress, true).send({ from: props.dfoCore.address });
        const res = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [props.dfoCore.fromDecimals(amount, 18).toString()], abi.encode(["bytes[]"], [[data]])).send({ from: props.dfoCore.address});
        console.log(res);
        await getController();
    }

    const getWUSDToken = () => {
        return (
            <div className="col-12 mb-4">
                <Input showMax={true} value={amount} balance={wusdBalance} min={0} onChange={(e) => onWUSDAmountChange(e.target.value)} address={props.dfoCore.getContextElement("WUSDAddress")} showCoin={true} showBalance={true} name="WUSD" />
            </div>
        )
    }

    const getBurnAmount = () => {
        if (!pair) {
            return (<div/>);
        }
        /*
        if (loading) {
            return (
                <div className="col-12 justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            )
        }
        */
        if (getLpToken) {
            return (
                <div className="col-12 mb-4">
                    <div className="row justify-content-center">
                        <b>For</b>
                    </div>
                    <div className="row justify-content-center">
                    { estimatedLpToken } { pairs[pair].symbol0 }/{ pairs[pair].symbol1 }
                    </div>
                </div>
            )
        }
        return (
            <div className="col-12 mb-4">
                <div className="row justify-content-center">
                    <b>For</b>
                </div>
                <div className="row justify-content-center">
                    { estimatedToken0 } { pairs[pair].symbol0 } / { estimatedToken1 } { pairs[pair].symbol1 }
                </div>
            </div>
        )
    }

    const getButtons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row justify-content-center">
                    {
                        !wusdApproved ? <div className="col-12 col-md-6">
                            <ApproveButton contract={wusdContract} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")} onError={(error) => console.log(error)} onApproval={() => onTokenApproval('wusd')} text={`Approve WUSD`} />
                        </div> : <div/>
                    }
                    <div className="col-12 col-md-6">
                        <button onClick={() => burnWUSD()} className="btn btn-secondary">Burn</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="burn-component">
            <div className="row">
                <div className="col-12 mb-4">
                    <select className="custom-select wusd-pair-select" value={pair} onChange={(e) => setPair(e.target.value)}>
                        <option value="">Choose pair..</option>
                        {
                            pairs.map((pair, index) => {
                                return <option key={index} value={index}>{pair.symbol0}/{pair.symbol1}</option>
                            })
                        }
                    </select>
                    <div className="form-check mt-4">
                        <input className="form-check-input" type="checkbox" value={getLpToken} onChange={(e) => setGetLpToken(e.target.checked)} id="getLpToken" disabled={!pair} />
                        <label className="form-check-label" htmlFor="getLpToken">
                            Get liquidity pool token
                        </label>
                    </div>
                </div>
                {
                    pair ? getWUSDToken() : <div/>
                }
                { getBurnAmount() }
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

export default connect(mapStateToProps)(Burn);