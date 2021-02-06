import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';

const Stats = (props) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [health, setHealth] = useState(100);
    const [credit, setCredit] = useState(0);
    const [debit, setDebit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [farmTreasury, setFarmTreasury] = useState(0);
    const [farmReward, setFarmReward] = useState(10);
    const [newFarmReward, setNewFarmReward] = useState(20);
    const [unifiTreasury, setUnifiTreasury] = useState(1000.15);
    const [rebalanceReward, setRebalanceReward] = useState(50);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [rebalanceBlock, setRebalanceBlock] = useState(0);
    const [usdRebalanceByDebit, setUsdRebalanceByDebit] = useState(0);
    const [selectedUsdn, setSelectedUsdn] = useState("");
    const [totalSupply, setTotalSupply] = useState(0);
    const [wusdContract, setWusdContract] = useState(null);
    const [x2USDContract, setx2USDContract] = useState(null);
    const [x5USDContract, setx5USDContract] = useState(null);
    const [x2USDNoteControllerContract, setx2USDNoteControllerContract] = useState(null);
    const [x5USDNoteControllerContract, setx5USDNoteControllerContract] = useState(null);
    const [x2USDSupply, setx2USDSupply] = useState(0);
    const [x2USDTreasury, setx2USDTreasury] = useState(0);
    const [x5USDSupply, setx5USDSupply] = useState(0);
    const [x5USDTreasury, setx5USDTreasury] = useState(0);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [collateralData, setCollateralData] = useState([]);

    // TODO add health calc
    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        setLoading(true);
        try {
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
            const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
            setWusdContract(wusdContract);
            const supply = await wusdContract.methods.totalSupply().call();
            const decimals = await wusdContract.methods.decimals().call();
            setTotalSupply(supply);
            const differences = await contract.methods.differences().call();
            
            setCredit(props.dfoCore.toDecimals(differences.credit, decimals));
            setDebit(props.dfoCore.toDecimals(differences.debt, decimals));

            const wusdNote2Info = await contract.methods.wusdNote2Info().call();
            const wusdNote5Info = await contract.methods.wusdNote5Info().call();
            const x2USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IEthItemInteroperableInterfaceABI"), wusdNote2Info[2]);
            const x5USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IEthItemInteroperableInterfaceABI"), wusdNote5Info[2]);
            const x2USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote2Info[3]);
            const x5USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote5Info[3]);
            
            setx2USDContract(x2USDcontract);
            setx2USDContract(x5USDcontract);
            setx2USDNoteControllerContract(x2USDNoteController);
            setx5USDNoteControllerContract(x5USDNoteController);

            setx2USDSupply(props.dfoCore.toDecimals(await x2USDcontract.methods.totalSupply().call(), decimals));
            setx5USDSupply(props.dfoCore.toDecimals(await x5USDcontract.methods.totalSupply().call(), decimals));
            setx2USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x2USDNoteController.options.address).call(), decimals));
            setx5USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x5USDNoteController.options.address).call(), decimals));
            
            const info = await contract.methods.rebalanceByCreditReceiversInfo().call();
            setUnifiTreasury(props.dfoCore.toDecimals(info[2], decimals));
            const lastRebalanceBlock = await contract.methods.lastRebalanceByCreditBlock().call();
            const interval = await contract.methods.rebalanceByCreditBlockInterval().call();
            setCurrentBlock(await props.dfoCore.getBlockNumber());
            if (lastRebalanceBlock === "0") {
                setRebalanceBlock(await props.dfoCore.getBlockNumber());
            } else {
                setRebalanceBlock(parseInt(lastRebalanceBlock) * parseInt(interval));
            }
            await getCollateralData(contract, supply);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getCollateralData = async (contract, supply) => {
        const ammAggregatorContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
        const allowedAMMs = await contract.methods.allowedAMMs().call();
        const data = {
            collateral: {},
            liquidity: {},
            total: 0,
        };
        const extensionAddress = await contract.methods.extension().call();
        await Promise.all(allowedAMMs.map(async (allowedAMM) => {
            const ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMABI'), allowedAMM.ammAddress);
            const info = await ammContract.methods.info().call();
            const basePool = { ammAddress: allowedAMM.ammAddress, info: { name: info[0], version: info[1] } };
            await Promise.all(allowedAMM.liquidityPools.map(async (liquidityPool) => {
                const balanceOf = await ammAggregatorContract.methods.balanceOf(liquidityPool, extensionAddress).call();
                
                await Promise.all(balanceOf['1'].map(async (balance, index) => {
                    const address = balanceOf['2'][index];
                    
                    const currentToken = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
                    const symbol = await currentToken.methods.symbol().call();
                    const decimals = await currentToken.methods.decimals().call();
                    const value = props.dfoCore.normalizeValue(balance, decimals);
                    data.total += value;
                    if (!data.liquidity[basePool.info.name]) {
                        data.liquidity[basePool.info.name] = value;
                    } else {
                        data.liquidity[basePool.info.name] += value;
                    }
                    if (!data.collateral[symbol]) {
                        data.collateral[symbol] = value;
                    } else {
                        data.collateral[symbol] += value;
                    }
                }))
            }))
        }))
        setCollateralData(data);
        await getHealth(data, supply);
    }

    const getHealth = async (data, supply) => {
        const ratio = data.total / parseInt(supply);
        setHealth(props.dfoCore.toDecimals(100 * ratio, 0, 2));
    }

    const rebalanceByCredit = async () => {
        try {
            const gasLimit = await wusdExtensionController.methods.rebalanceByCredit().estimateGas({ from: props.dfoCore.address });
            await wusdExtensionController.methods.rebalanceByCredit().send({ from: props.dfoCore.address, gasLimit });
            await getStats();
        } catch (error) {
            console.error(error);
        }
    }

    const getHealthBarStatus = () => {
        return {
            border: `1px ${health > 90 ? "#1abc9c" : health > 50 ? "#f1c40f" : "#e74c3c"} solid`,
            background: `linear-gradient(90deg, ${health > 90 ? "#1abc9c" : health > 50 ? "#f1c40f" : "#e74c3c"} 65%, #fff 35%)`
        }
    }

    const getFirstCol = () => {
        return (
            <div className="col-3 text-left StatsBro">
                {/*}<div className="row">
                    <div className="col-12">
                        <p><b>Price:</b></p>
                        <p>$1</p>
                    </div>
                </div>{*/}
                <div className="row">
                    <div className="col-12">
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Supply</b>
                            </div>
                            <div className="col-12 infoList">
                                { totalSupply ? props.dfoCore.toDecimals(props.dfoCore.toFixed(totalSupply), 18) : totalSupply } WUSD
                            </div>
                        </div>
                        <hr />
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Collateral</b>
                            </div>
                            <div className="col-12 infoList">
                                {
                                    (collateralData && collateralData.collateral) ?
                                        Object.entries(collateralData.collateral).map((entry, i) => {
                                            return <p>{props.dfoCore.toDecimals(props.dfoCore.toFixed(entry[1]).toString())} {entry[0]}</p>
                                        })
                                    : <div/>
                                }
                            </div>
                        </div>
                        <hr />
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Liquidity</b>
                            </div>
                            <div className="col-12 infoList">
                                {
                                    (collateralData && collateralData.liquidity) ?
                                        Object.entries(collateralData.liquidity).map((entry, i) => {
                                            return <p>{entry[0]}: {(entry[1]/collateralData.total) * 100}%</p>
                                        })
                                    : <div/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const getSecondCol = () => {
        return (
            <div className="col-9 text-left">
                <div className="row mb-4">
                    <div className="col-12 health-bar" style={getHealthBarStatus()}>
                        Health: {health}%
                    </div>
                </div>
                <div className="my-4" />
                <div className="row mb-4">
                    <div className="col-6">
                        <b>Credit</b>
                        <br/>
                        {credit} uSD
                    </div>
                    <div className="col-6">
                        <b>Debit</b>
                        <br/>
                        {debit} uSD
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-6">
                        <b>x2USD supply</b>
                        <br/>
                        {x2USDSupply}
                    </div>
                    <div className="col-6">
                        <b>x2USD treasury</b>
                        <br/>
                        {x2USDTreasury}
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-6">
                        <b>x5USD supply</b>
                        <br/>
                        {x5USDSupply}
                    </div>
                    <div className="col-6">
                        <b>x5USD treasury</b>
                        <br/>
                        {x5USDTreasury}
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-6">
                        <b>Farm treasury</b>
                        <br/>
                        {farmTreasury} uSD
                    </div>
                    <div className="col-6">
                        <b>Farm reward</b>
                        <br/>
                        {farmReward} uSD per block
                    </div>
                </div>
            </div>
        )
    }

    const getAdvancedCol = () => {
        return (
            <div className="col-12">
                <div className="row flex justify-content-center">
                    <p onClick={() => setShowAdvanced(!showAdvanced)} className="text-secondary wusd-stats-advanced">Advanced {showAdvanced ? <ChevronDownIcon /> : <ChevronUpIcon /> }</p>
                </div>
                {
                    showAdvanced ? 
                    <>
                        <div className="">
                            { getAdvancedRow() }
                            <div className="row">
                                <div className="col-12">
                                    <div className="row mb-2">
                                        <div className="col-12">
                                            <b>Farm Reward rebalance</b>
                                            <br/>
                                            next reward: {newFarmReward} uSD per block
                                        </div>
                                    </div>
                                    <div className="row justify-content-center">
                                        <button className="btn btn-outline-secondary">Rebalance</button>
                                    </div>
                                </div>
                            </div>   
                        </div>
                    </> : <div/>
                }
            </div>
        )
    } 

    const getAdvancedRow = () => {
        if (credit > debit) {
            return (
                <>
                    <div className="row mb-4">
                        <div className="col-6 text-left">
                            <b>Available credit</b>
                            <br/>
                            {farmTreasury} uSD Farm treasury
                            <br/>
                            {x2USDTreasury + x5USDTreasury} uSDN treasury
                            <br/>
                            {unifiTreasury} Unifi treasury
                            <br/>
                            {parseFloat(credit) - parseFloat(unifiTreasury) - parseFloat(x2USDTreasury) - parseFloat(x5USDTreasury) - parseFloat(farmTreasury)} uSD rebalance reward
                        </div>
                        <div className="col-6">
                            {
                                rebalanceBlock <= currentBlock ? <>
                                    <div className="row mb-2">
                                        <div className="col-12">
                                            <b>Rebalance by credit</b>
                                            <br/>
                                            Rebalance block: #{rebalanceBlock}
                                        </div>
                                    </div>
                                    <div className="row justify-content-center mb-2">
                                        <button className="btn btn-outline-secondary" onClick={() => rebalanceByCredit()} disabled={rebalanceBlock > currentBlock}>Rebalance</button>
                                    </div>
                                    <div className="row justify-content-center">
                                       Reward: {credit * (2/100)}
                                    </div>
                                </> : <div className="row mb-2">
                                    <div className="col-12">
                                        <b>Rebalance by credit</b>
                                        <br/>
                                        Next rebalance block: #{rebalanceBlock}
                                    </div>
                                </div>
                                
                            }
                            
                        </div>
                    </div>    
                    <hr/>
                </>
            );
        } else if (debit < credit) {
            return (
                <>
                <div className="row mb-4">
                    <div className="col-6 text-left">
                        <b>Rebalance by debit</b>
                        <div className="input-group mt-4">
                            <div className="input-group-prepend">
                                <button className="btn btn-secondary" type="button">MAX</button>
                            </div>
                            <input type="number" className="form-control" value={usdRebalanceByDebit} min={0} onChange={(e) => setUsdRebalanceByDebit(parseFloat(e.target.value))} />
                            <div className="input-group-append">
                                <span className="input-group-text" id=""> uSD</span>
                            </div>
                        </div>
                        <small className="form-text text-muted">Balance: 0 uSD</small>
                    </div>
                    <div className="col-6">
                        <div className="row mb-2">
                            <div className="col-12">
                                <select className="custom-select wusd-pair-select" value={selectedUsdn} onChange={(e) => setSelectedUsdn(e.target.value)}>
                                    <option value="">Choose uSD..</option>
                                    <option value="x2">x2USD</option>
                                    <option value="x5">x5USD</option>
                                </select>
                                {
                                    selectedUsdn ? 
                                    <div className="mt-2">
                                        For
                                        <br/>
                                        { selectedUsdn === 'x2' ? "700 x2USD" : "500 x5USD"}
                                    </div> : <div/>
                                }
                                
                            </div>
                        </div>
                        {
                            selectedUsdn ? 
                            <div className="row justify-content-center">
                                <button className="btn btn-outline-secondary" disabled={usdRebalanceByDebit === 0}>Rebalance</button>
                            </div> : <div/>
                        }
                    </div>
                </div>   
                <hr/>
                </>
            );
        } else {
            return <div/>
        }
    }

    if (loading) {
        return (
            <div className="col-12 justify-content-center">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden"></span>
                </div>
            </div>
        )
    }

    return (
        <div className="stats-container">
            <div className="row">
                { getFirstCol() }
                { getSecondCol() }
            </div>
            <hr />
            <div className="row">
                { getAdvancedCol() }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Stats);