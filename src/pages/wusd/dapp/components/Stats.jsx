import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@primer/octicons-react';

const Stats = (props) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [health, setHealth] = useState(45);
    const [credit, setCredit] = useState(0);
    const [debit, setDebit] = useState(1000.15);
    const [redUsdnSupply, setRedUsdnSupply] = useState(1000);
    const [redUsdnTreasury, setRedUsdnTreasury] = useState(500);
    const [blueUsdnSupply, setBlueUsdnSupply] = useState(1000);
    const [blueUsdnTreasury, setBlueUsdnTreasury] = useState(500);
    const [farmTreasury, setFarmTreasury] = useState(1000.15);
    const [farmReward, setFarmReward] = useState(10);
    const [newFarmReward, setNewFarmReward] = useState(20);
    const [unifiTreasury, setUnifiTreasury] = useState(1000.15);
    const [rebalanceReward, setRebalanceReward] = useState(50);
    const [rebalanceBlock, setRebalanceBlock] = useState(565444664);
    const [usdRebalanceByDebit, setUsdRebalanceByDebit] = useState(0);
    const [selectedUsdn, setSelectedUsdn] = useState("");

    // TODO add health calc

    const getHealthBarStatus = () => {
        return {
            border: `1px ${health > 90 ? "#1abc9c" : health > 50 ? "#f1c40f" : "#e74c3c"} solid`,
            background: `linear-gradient(90deg, ${health > 90 ? "#1abc9c" : health > 50 ? "#f1c40f" : "#e74c3c"} 65%, #fff 35%)`
        }
    }

    const getFirstCol = () => {
        return (
            <div className="col-3 text-left">
                <div className="row">
                    <div className="col-12">
                        <p><b>uSD: $1</b></p>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12">
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Supply</b>
                            </div>
                            <div className="col-12">
                                1,000,0000
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Collateral</b>
                            </div>
                            <div className="col-12">
                                1,000,0000 PAX
                                <br/>
                                1,000,0000 PAX
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-12">
                                <b>Liquidity</b>
                            </div>
                            <div className="col-12">
                                UniswapV2: 50%
                                <br/>
                                Balancer: 50%
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
                        <b>Red uSDN supply</b>
                        <br/>
                        {redUsdnSupply}
                    </div>
                    <div className="col-6">
                        <b>Red uSDN treasury</b>
                        <br/>
                        {redUsdnTreasury}
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-6">
                        <b>Blue uSDN supply</b>
                        <br/>
                        {blueUsdnSupply}
                    </div>
                    <div className="col-6">
                        <b>Blue uSDN treasury</b>
                        <br/>
                        {blueUsdnTreasury}
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
                        <hr/>
                        <div className="container">
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
                            {redUsdnTreasury + blueUsdnTreasury} uSDN treasury
                            <br/>
                            {unifiTreasury} Unifi treasury
                            <br/>
                            {rebalanceReward} uSD rebalance reward
                        </div>
                        <div className="col-6">
                            <div className="row mb-2">
                                <div className="col-12">
                                    <b>Rebalance by credit</b>
                                    <br/>
                                    Rebalance block: #{rebalanceBlock}
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <button className="btn btn-outline-secondary">Rebalance</button>
                            </div>
                        </div>
                    </div>    
                </>
            );
        } else {
            return (
                <>
                <div className="row mb-4">
                    <div className="col-6 text-left">
                        <b>Rebalance by debit</b>
                        <div class="input-group mt-4">
                            <div class="input-group-prepend">
                                <button class="btn btn-secondary" type="button">MAX</button>
                            </div>
                            <input type="number" class="form-control" value={usdRebalanceByDebit} min={0} onChange={(e) => setUsdRebalanceByDebit(parseFloat(e.target.value))} />
                            <div class="input-group-append">
                                <span class="input-group-text" id=""> uSD</span>
                            </div>
                        </div>
                        <small class="form-text text-muted">Balance: 0 uSD</small>
                    </div>
                    <div className="col-6">
                        <div className="row mb-2">
                            <div className="col-12">
                                <select className="custom-select wusd-pair-select" value={selectedUsdn} onChange={(e) => setSelectedUsdn(e.target.value)}>
                                    <option value="">Choose uSDN..</option>
                                    <option value="red">Red uSDN</option>
                                    <option value="blue">Blue uSDN</option>
                                </select>
                                {
                                    selectedUsdn ? 
                                    <div className="mt-2">
                                        For
                                        <br/>
                                        { selectedUsdn === 'red' ? "700 red uSDN" : "500 blue uSDN"}
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
                </>
            );
        }
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