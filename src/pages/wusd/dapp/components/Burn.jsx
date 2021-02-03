import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';

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


    useEffect(() => {
        getController();
    }, [])

    const getController = async () => {
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

    const onWUSDAmountChange = async (amount) => {
        setAmount(amount);
        /*
        const chosenPair = pairs[pair];
        const { ammContract, liquidityPool, token0decimals, token1decimals } = chosenPair;
        const lpAmount = props.dfoCore.fromDecimals(amount.toString(), 18).toString();
        const res = await ammContract.methods.byLiquidityPoolAmount(liquidityPool, lpAmount).call();
        const { tokensAmounts, liquidityPoolTokens } = res;
        const [firstTokenAmount, secondTokenAmount] = tokensAmounts;
        const updatedFirstTokenAmount = props.dfoCore.fromDecimals(props.dfoCore.toDecimals(tokensAmounts[0], token0decimals), token0decimals);
        const updatedSecondTokenAmount = props.dfoCore.fromDecimals(props.dfoCore.toDecimals(tokensAmounts[1], token1decimals), token0decimals);
        const wusdRealAmount = props.dfoCore.fromDecimals(amount.toString(), 18) * (updatedFirstTokenAmount/updatedSecondTokenAmount);
        const result = await ammContract.methods.byTokenAmount(liquidityPool, wusdContract.options.address, wusdRealAmount.toString()).call();
        console.log(result);
        */
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
        if (getLpToken) {
            return (
                <div className="col-12 mb-4">
                    <div className="row justify-content-center">
                        <b>For</b>
                    </div>
                    <div className="row justify-content-center">
                        1000 DAI/USDC
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
                        <button className="btn btn-secondary">Burn</button>
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