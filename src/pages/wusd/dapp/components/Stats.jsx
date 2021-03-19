import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';
import { Input } from '../../../../components';
import { ethers } from 'ethers';
import WUSDLogo from '../../../../assets/images/x1WUSD.png';
import x2USDLogo from '../../../../assets/images/x2WUSD.png';
import x5USDLogo from '../../../../assets/images/x5WUSD.png';

const abi = new ethers.utils.AbiCoder();

const Stats = (props) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [health, setHealth] = useState(100);
    const [credit, setCredit] = useState(0);
    const [debit, setDebit] = useState(0);
    const [loading, setLoading] = useState(true);
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

    const rebalanceByDebitDisabled = () => {
        return !usdRebalanceByDebit.value || parseInt(usdRebalanceByDebit.value) === 0 || !usdRebalanceByDebit.full || parseInt(usdRebalanceByDebit.full) === 0 || (parseInt(usdRebalanceByDebit.full) > (parseInt(debit)));
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

    const getTreasuryValue = (isFarm) => {
        const value = props.dfoCore.toDecimals(credit, wusdDecimals) -
                      props.dfoCore.toDecimals(credit * percentages[0], wusdDecimals) -
                      props.dfoCore.toDecimals(credit * percentages[1], wusdDecimals) -
                      props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals);
        return value * (isFarm ? 86.7 : 13.3) / 100;
    }

    const rebalanceByDebit = async () => {
        if (rebalanceByDebitDisabled()) return;
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
            background: `${health > 100 ? "#6aeac8" : health > 90 ? "#7474f7" : health > 50 ? "#9e6915" : "#e74c3c"}`,
            width: `${health / 2}%`
        }
    }

    const getZeroCol = () => {
        return (
        <div className="HealthContainer">
            <div className="health-bar">
                <aside style={getHealthBarStatus()}>
                    <span>Health: {health}%</span>
                </aside> 
            </div>
        </div>
        )
    }

    const getFirstCol = () => {
        return (
            <div className="StatsBro">
                <b>Collateral</b>
                <div className="infoList">
                    {
                        (collateralData && collateralData.collateral) ?
                            Object.entries(collateralData.collateral).map((entry, i) => {
                                return <p key={entry[0]}>{props.dfoCore.formatMoney(props.dfoCore.toDecimals(props.dfoCore.toFixed(entry[1]).toString()), 2)} {entry[0]}</p>
                            })
                        : <div/>
                    }
                </div>
                <hr />
                <b>Liquidity</b>
                <div className="infoList">
                    {
                        (collateralData && collateralData.liquidity) ?
                            Object.entries(collateralData.liquidity).map((entry, i) => {
                                return <p key={entry[0]}>{entry[0]}: {props.dfoCore.formatMoney((parseInt(entry[1]) / parseInt(collateralData.total))*100)}%</p>
                            })
                        : <div/>
                    }
                </div>
            </div>
        )
    }

    const getSecondCol = () => {
        return (
            <div className="StatsSis">
                <h5 className="xTitle"><img src={WUSDLogo}></img>WUSD</h5>
                <div className="StatsBroO">
                    <div className="StatsIndicator">
                        <h6><b>Supply</b></h6>
                        <p>{ totalSupply ? props.dfoCore.formatMoney(props.dfoCore.toDecimals(props.dfoCore.toFixed(totalSupply), 18), 2) : totalSupply } WUSD</p>
                    </div>
                    <div className="StatsIndicator">
                        <h6><b>Farm APY</b></h6>
                        <p>0%</p>
                    </div>
                    <div className="StatsIndicator">
                        <h6><b>System Credit</b></h6>
                        <p>{props.dfoCore.toDecimals(credit, wusdDecimals, 2)} WUSD</p>
                    </div>
                    <div className="StatsIndicator">
                        <h6><b>System Debt</b></h6>
                        <p>{props.dfoCore.toDecimals(debit, wusdDecimals, 2)} WUSD</p>
                    </div>
                    <div className="StatsLink">
                        <a target="_blank" href="https://etherscan.io/token/0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8">Etherscan</a>
                        <a target="_blank" href="https://etherscan.io/address/0x37bde7F133171A5B737506Cc402471Ce0e2b03ca">Collateral</a>
                        <a target="_blank" href="https://ethitem.com/?interoperable=0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8">ITEM</a>
                        <a target="_blank" href="https://info.uniswap.org/token/0x7C974104DF9dd7fb91205ab3D66d15AFf1049DE8">Uniswap</a>
                        <a target="_blank" href="https://mooniswap.info/token/0x7c974104df9dd7fb91205ab3d66d15aff1049de8">Mooniswap</a>
                        <a target="_blank" href="https://sushiswap.fi/token/0x7c974104df9dd7fb91205ab3d66d15aff1049de8">Sushiswap</a>
                        <a target="_blank" href="https://1inch.exchange/#/ETH/0x7c974104df9dd7fb91205ab3d66d15aff1049de8">1Inch</a>
                    </div>
                </div>
                <h5 className="xTitle"><img src={x2USDLogo}></img>x2USD</h5>
                <div className="StatsBroO">
                    <div className="StatsIndicator">
                        <h6><b>Supply</b></h6>
                        <p>{x2USDSupply} x2USD</p>
                    </div>
                    <div className="StatsIndicator">
                        <h6><b>Debt Treasury</b></h6>
                        <p target="_blank" href="">{x2USDTreasury} WUSD</p>
                    </div>
                    <div className="StatsLink">
                    <div className="StatsLink">
                        <a target="_blank" href="https://etherscan.io/token/0xA4d9C768E1c6cabB127a6326c0668b49235639e8">Etherscan</a>
                        <a target="_blank" href="https://etherscan.io/address/0x88a012e4d2b8600cf82e21f0685ec2ebcf643847">Treasury</a>
                        <a target="_blank" href="https://ethitem.com/?interoperable=0xA4d9C768E1c6cabB127a6326c0668b49235639e8">ITEM</a>
                        <a target="_blank" href="https://info.uniswap.org/token/0xA4d9C768E1c6cabB127a6326c0668b49235639e8">Uniswap</a>
                        <a target="_blank" href="https://mooniswap.info/token/0xA4d9C768E1c6cabB127a6326c0668b49235639e8">Mooniswap</a>
                        <a target="_blank" href="https://sushiswap.fi/token/0xA4d9C768E1c6cabB127a6326c0668b49235639e8">Sushiswap</a>
                        <a target="_blank" href="https://1inch.exchange/#/ETH/0xA4d9C768E1c6cabB127a6326c0668b49235639e8">1Inch</a>
                    </div>
                    </div>
                </div>
                <h5 className="xTitle"><img src={x5USDLogo}></img>x5USD</h5>
                <div className="StatsBroO">
                    <div className="StatsIndicator">
                        <h6><b>Supply</b></h6>
                        <p>{x5USDSupply} x5USD</p>
                    </div>
                    <div className="StatsIndicator">
                        <h6><b>Debt Treasury</b></h6>
                        <p target="_blank" href="">{x5USDTreasury} WUSD</p>
                    </div>
                    <div className="StatsLink">
                        <a target="_blank" href="https://etherscan.io/token/0x0473F6Ea742448ec9433b87aC410d79C08198abe">Etherscan</a>
                        <a target="_blank" href="https://etherscan.io/address/0x7fcb2c6bed43029e8a8a0d700539f47ecb6e0f4c">Treasury</a>
                        <a target="_blank" href="https://ethitem.com/?interoperable=0x0473F6Ea742448ec9433b87aC410d79C08198abe">ITEM</a>
                        <a target="_blank" href="https://info.uniswap.org/token/0x0473F6Ea742448ec9433b87aC410d79C08198abe">Uniswap</a>
                        <a target="_blank" href="https://mooniswap.info/token/0x0473F6Ea742448ec9433b87aC410d79C08198abe">Mooniswap</a>
                        <a target="_blank" href="https://sushiswap.fi/token/0x0473F6Ea742448ec9433b87aC410d79C08198abe">Sushiswap</a>
                        <a target="_blank" href="https://1inch.exchange/#/ETH/0x0473F6Ea742448ec9433b87aC410d79C08198abe">1Inch</a>
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
                    <div className="Rebalance">
                        <aside>
                            <h6><b>Rebalance Credit</b></h6>
                            <p>x2Treasury: {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[0], wusdDecimals), 2)} WUSD</p>
                            <p>x5Treasury: {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[1], wusdDecimals), 2)} WUSD</p>
                            <p>DFO Treasury: {props.dfoCore.formatMoney(getTreasuryValue(false), 2)} WUSD</p>
                            <p>Farm Treasury: {props.dfoCore.formatMoney(getTreasuryValue(true), 2)} WUSD</p>
                            <p>Executor: {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals), 2)} WUSD</p>
                        </aside>
                        <div className="CreditAction">
                            {
                                rebalanceBlock <= currentBlock ? <>
                                    
                                    <div className="row justify-content-center mb-2">
                                        <a className="Web3ActionBTN" onClick={() => rebalanceByCredit()} disabled={rebalanceBlock > currentBlock}>Rebalance</a>
                                    </div>
                                    <div className="Resultsregular">
                                    <p>Reward: <b> {props.dfoCore.formatMoney(props.dfoCore.toDecimals(credit * percentages[2], wusdDecimals), 2)} WUSD</b></p>
                                    </div>
                                </> : <div className="Resultsregular">
                                <p>Next rebalance block: <b><a target="_blank" href={"https://etherscan.io/block/" + rebalanceBlock}>#{rebalanceBlock}</a></b></p>
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
                <div className="Rebalance">
                <div className="InputTokensRegular">
                    <div className="InputTokenRegular">
                        <Input showMax={true} label={"Rebalance by debit"} value={usdRebalanceByDebit.value} balance={props.dfoCore.toDecimals(wusdBalance, wusdDecimals)} min={0} onChange={(e) => onUpdateUsdRebalanceByDebit(e.target.value)} address={props.dfoCore.getContextElement("WUSDAddress")} showCoin={true} showBalance={true} name="uSD" />       
                    </div>
                </div>
                <div className="PairSelector">
                                <select className="SelectRegular" value={selectedUsdn} onChange={(e) => setSelectedUsdn(e.target.value)}>
                                    <option value="">Select the Moltiplicator..</option>
                                    <option value="x2">x2USD</option>
                                    <option value="x5">x5USD</option>
                                </select>
                                {
                                    selectedUsdn ? 
                                    <div className="Resultsregular">
                                        <p>For <b>{`${usdRebalanceByDebit.value || 0} ${selectedUsdn}USD`}</b></p>
                                    </div> : <div/>
                                }
                        {
                            selectedUsdn ? 
                            <div className="Web3BTNs">
                                <a className="Web3ActionBTN" onClick={() => rebalanceByDebit()} disabled={rebalanceByDebitDisabled()}>Rebalance</a>
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
                { getZeroCol() }
                { getFirstCol() }
                { getSecondCol() }
            {
                (showCredit || showDebt) && <>
                    <hr />
                        { getAdvancedCol() }
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