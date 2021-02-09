import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { Input } from '../../../../components';
import { ethers } from 'ethers';

const abi = new ethers.utils.AbiCoder();

const Stats = (props) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [health, setHealth] = useState(100);
    const [credit, setCredit] = useState(0);
    const [debit, setDebit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [farmTreasury, setFarmTreasury] = useState(0);
    const [farmReward, setFarmReward] = useState(0);
    const [newFarmReward, setNewFarmReward] = useState(0);
    const [rebalanceReward, setRebalanceReward] = useState(0);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [rebalanceBlock, setRebalanceBlock] = useState(0);
    const [usdRebalanceByDebit, setUsdRebalanceByDebit] = useState({ value: 0, full: 0});
    const [selectedUsdn, setSelectedUsdn] = useState("");
    const [totalSupply, setTotalSupply] = useState(0);
    const [wusdContract, setWusdContract] = useState(null);
    const [wusdBalance, setWusdBalance] = useState(0);
    const [wusdDecimals, setWusdDecimals] = useState(0);
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
    const [percentages, setPercentages] = useState([]);
    const [multipliers, setMultipliers] = useState([2, 5]);
    const [minimumRebalanceByDebtAmount, setMinimumRebalanceByDebtAmount] = useState(0);
    const [showCredit, setShowCredit] = useState(false);
    const [showDebt, setShowDebt] = useState(false);

    // TODO add health calc
    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        setLoading(true);
        try {
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
            const rbda = await contract.methods.minimumRebalanceByDebtAmount().call();
            setMinimumRebalanceByDebtAmount(rbda);
            const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
            setWusdContract(wusdContract);
            const supply = await wusdContract.methods.totalSupply().call();
            const decimals = await wusdContract.methods.decimals().call();
            const balance = await wusdContract.methods.balanceOf(props.dfoCore.address).call();
            setWusdDecimals(decimals);
            setTotalSupply(supply);
            setWusdBalance(balance);
            const differences = await contract.methods.differences().call();
            
            setCredit(differences.credit);
            setDebit(differences.debt);

            setShowDebt(parseInt(differences.debt) > parseInt(rbda));
            setShowCredit(parseInt(differences.credit) > 0);

            const perc = [];

            const wusdNote2Info = await contract.methods.wusdNote2Info().call();
            perc[0] = props.dfoCore.toDecimals(wusdNote2Info[4]);
            const wusdNote5Info = await contract.methods.wusdNote5Info().call();
            perc[1] = props.dfoCore.toDecimals(wusdNote5Info[4]);
            const x2USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IEthItemInteroperableInterfaceABI"), wusdNote2Info[2]);
            const x5USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IEthItemInteroperableInterfaceABI"), wusdNote5Info[2]);
            const x2USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote2Info[3]);
            const x5USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote5Info[3]);

            const mul = [parseInt(await x2USDNoteController.methods.multiplier().call()), parseInt(await x5USDNoteController.methods.multiplier().call())];
            setMultipliers(mul);
            
            setx2USDContract(x2USDcontract);
            setx2USDContract(x5USDcontract);
            setx2USDNoteControllerContract(x2USDNoteController);
            setx5USDNoteControllerContract(x5USDNoteController);

            setx2USDSupply(props.dfoCore.toDecimals(await x2USDcontract.methods.totalSupply().call(), decimals, 2));
            setx5USDSupply(props.dfoCore.toDecimals(await x5USDcontract.methods.totalSupply().call(), decimals, 2));
            setx2USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x2USDNoteController.options.address).call(), decimals, 2));
            setx5USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x5USDNoteController.options.address).call(), decimals, 2));
            
            const info = await contract.methods.rebalanceByCreditReceiversInfo().call();
            let farmTotalPercentage = 0;
            await Promise.all(info[1].map(async (p) => {
                farmTotalPercentage += parseInt(p);
            }))
            farmTotalPercentage = props.dfoCore.toDecimals(props.dfoCore.toFixed(farmTotalPercentage));
            perc[2] = props.dfoCore.toDecimals(info[2]);
            perc[3] = farmTotalPercentage;
            
            setPercentages(perc);

            const lastRebalanceBlock = await contract.methods.lastRebalanceByCreditBlock().call();
            const interval = await contract.methods.rebalanceByCreditBlockInterval().call();
            setCurrentBlock(await props.dfoCore.getBlockNumber());
            if (lastRebalanceBlock === "0") {
                setRebalanceBlock(await props.dfoCore.getBlockNumber());
            } else {
                setRebalanceBlock(parseInt(lastRebalanceBlock) + parseInt(interval));
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
                    data.total = window.web3.utils.toBN(data.total).add(window.web3.utils.toBN(value)).toString();
                    data.liquidity[basePool.info.name] = window.web3.utils.toBN(data.liquidity[basePool.info.name] || '0').add(window.web3.utils.toBN(value)).toString();
                    data.collateral[symbol] = window.web3.utils.toBN(data.collateral[symbol] || '0').add(window.web3.utils.toBN(value)).toString();
                }))
            }))
        }))
        setCollateralData(data);
        await getHealth(data, supply);
    }

    const getHealth = async (data, supply) => {
        const ratio = data.total / parseInt(supply);
        setHealth(props.dfoCore.formatMoney(100 * ratio, 1));
    }

    const onUpdateUsdRebalanceByDebit = (value) => {
        setUsdRebalanceByDebit({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", wusdDecimals)});
    }

    const rebalanceByCredit = async () => {
        setLoading(true);
        try {
            const gasLimit = await wusdExtensionController.methods.rebalanceByCredit().estimateGas({ from: props.dfoCore.address });
            await wusdExtensionController.methods.rebalanceByCredit().send({ from: props.dfoCore.address, gasLimit });
            await getStats();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const rebalanceByDebit = async () => {
        setLoading(true);
        try {
            const info = await wusdExtensionController.methods.wusdInfo().call();
            const collectionAddress = info['0'];
            const wusdObjectId = info['1'];

            const wusdCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), collectionAddress);
            
            const byDebtData = abi.encode(["uint256"], [selectedUsdn === "x2" ? 2 : 5]);
            
            const data = abi.encode(["uint256", "bytes"], [1, byDebtData]);
            
            
            const amount = props.dfoCore.web3.utils.toBN(props.dfoCore.toFixed(usdRebalanceByDebit.full)).toString();
            
            const gasLimit = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [amount], abi.encode(["bytes[]"], [[data]])).estimateGas({ from: props.dfoCore.address});
            const res = await wusdCollection.methods.safeBatchTransferFrom(props.dfoCore.address, wusdExtensionController.options.address, [wusdObjectId], [amount], abi.encode(["bytes[]"], [[data]])).send({ from: props.dfoCore.address, gasLimit });
            await getStats();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
                                { totalSupply ? props.dfoCore.formatMoney(props.dfoCore.toDecimals(props.dfoCore.toFixed(totalSupply), 18), 2) : totalSupply } WUSD
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
                                            return <p key={entry[0]}>{props.dfoCore.formatMoney(props.dfoCore.toDecimals(props.dfoCore.toFixed(entry[1]).toString()), 2)} {entry[0]}</p>
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
                                            return <p key={entry[0]}>{entry[0]}: {props.dfoCore.formatMoney((parseInt(entry[1]) / parseInt(collateralData.total))*100)}%</p>
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
                <div className="row mb-4 StatsBroO">
                    <div className="col-6">
                        <b>Credit</b>
                        <br/>
                        {props.dfoCore.toDecimals(credit, wusdDecimals, 2)} uSD
                    </div>
                    <div className="col-6">
                        <b>Debt</b>
                        <br/>
                        {props.dfoCore.toDecimals(debit, wusdDecimals, 2)} uSD
                    </div>
                </div>
                <div className="row mb-4 StatsBroO">
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
                <div className="row mb-4 StatsBroO">
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
                {/*
                    <div className="row mb-4 StatsBroO">
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
                    </div>*/
                }
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
                        <div className="StatsBroO">
                            { getAdvancedRow() }
                            { /*
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
                            </div>  */
                            } 
                        </div>
                    </> : <div/>
                }
            </div>
        )
    } 

    const getAdvancedRow = () => {
        if (showCredit) {
            return (
                <>
                    <div className="row mb-4">
                        <div className="col-6 text-left">
                            <b>Available credit</b>
                            {
                                /* 
                                    <br/>
                                    {props.dfoCore.formatMoney(farmTreasury * percentages[2], 2)} uSD Farm treasury
                             */
                            }
                            <br/>
                            {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[0], wusdDecimals), 2)} x2USD treasury
                            <br/>
                            {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[1], wusdDecimals), 2)} x5USD treasury
                            <br/>
                            {
                            props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit, wusdDecimals) 
                                - props.dfoCore.toDecimals(credit * percentages[0], wusdDecimals) 
                                - props.dfoCore.toDecimals(credit * percentages[1], wusdDecimals) 
                                - props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals), 2)} Unifi treasury
                            <br/>
                            {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals), 2)} uSD rebalance reward
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
                                       Reward: {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals), 2)}
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
                    { /* <hr/> */ }
                </>
            );
        } else if (showDebt) {
            return (
                <>
                <div className="row mb-4">
                    <div className="col-12 mb-4">
                        <Input showMax={true} label={"Rebalance by debit"} value={usdRebalanceByDebit.value} balance={props.dfoCore.toDecimals(wusdBalance, wusdDecimals)} min={0} onChange={(e) => onUpdateUsdRebalanceByDebit(e.target.value)} address={props.dfoCore.getContextElement("WUSDAddress")} showCoin={true} showBalance={true} name="uSD" />
                    </div>
                    <div className="col-12">
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
                                        {`${usdRebalanceByDebit.value || 0} ${selectedUsdn}USD`}
                                    </div> : <div/>
                                }
                                
                            </div>
                        </div>
                        {
                            selectedUsdn ? 
                            <div className="row justify-content-center">
                                <button className="btn btn-outline-secondary" onClick={() => rebalanceByDebit()} disabled={!usdRebalanceByDebit.value || !usdRebalanceByDebit.full}>Rebalance</button>
                            </div> : <div/>
                        }
                    </div>
                </div>   
                { /* <hr/> */ }
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
            {
                (showCredit || showDebt) && <>
                    <hr />
                    <div className="row">
                        { getAdvancedCol() }
                    </div>
                </>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Stats);