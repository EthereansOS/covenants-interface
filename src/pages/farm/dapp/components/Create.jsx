import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Coin, Input, TokenInput } from '../../../../components/shared';
import { setFarmingContractStep, updateFarmingContract, addFarmingSetup, removeFarmingSetup  } from '../../../../store/actions';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-solidity';

const code = `function add(a, b) {
    return a + b;
}`;

const Create = (props) => {
    const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
    const [selectedRewardToken, setSelectedRewardToken] = useState(null);
    const [selectedFarmingType, setSelectedFarmingType] = useState(null);
    const [selectedHost, setSelectedHost] = useState(null);
    const [hostWalletAddress, setHostWalletAddress] = useState(null);
    const [hostDeployedContract, setHostDeployedContract] = useState(null);
    const [deployContractCode, setDeployContractCode] = useState("");
    const [hasLoadBalancer, setHasLoadBalancer] = useState(false);
    const [pinnedSetupIndex, setPinnedSetupIndex] = useState(null);
    const [byMint, setByMint] = useState(false);
    const [freeLiquidityPoolToken, setFreeLiquidityPoolToken] = useState(null);
    const [freeRewardPerBlock, setFreeRewardPerBlock] = useState(0);
    const [lockedPeriod, setLockedPeriod] = useState(null);
    const [lockedStartBlock, setLockedStartBlock] = useState(0);
    const [lockedMainToken, setLockedMainToken] = useState(null);
    const [lockedMaxLiquidity, setLockedMaxLiquidity] = useState(0);
    const [lockedRewardPerBlock, setLockedRewardPerBlock] = useState(0);
    const [lockedSecondaryToken, setLockedSecondaryToken] = useState(null);
    const [lockedHasPenaltyFee, setLockedHasPenaltyFee] = useState(false);
    const [lockedPenaltyFee, setLockedPenaltyFee] = useState(0);
    const [lockedIsRenewable, setLockedIsRenewable] = useState(false);
    const [lockedRenewTimes, setLockedRenewTimes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isAddLoadBalancer, setIsAddLoadBalancer] = useState(false);
    const [isDeploy, setIsDeploy] = useState(false);

    useEffect(() => {
        if (props.farmingContract?.rewardToken) {
            setSelectedRewardToken(props.farmingContract.rewardToken);
        }
        if (currentBlockNumber === 0) {
            props.dfoCore.getBlockNumber().then((blockNumber) => {
                setCurrentBlockNumber(blockNumber);
                setLockedStartBlock(blockNumber);
            });
        }
    }, []);

    const isWeth = (address) => {
        return address.toLowerCase() === props.dfoCore.getContextElement('wethTokenAddress').toLowerCase();
    }

    const isValidAddress = (address) => {
        // TODO update check
        return address.length === 42;
    }

    const onSelectRewardToken = async (address) => {
        if (!address) address = "0x7b123f53421b1bF8533339BFBdc7C98aA94163db";
        setLoading(true);
        const rewardToken = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
        console.log(rewardToken);
        const symbol = await rewardToken.methods.symbol().call();
        setSelectedRewardToken({ symbol, address });
        setLoading(false);
    }

    const getCreationComponent = () => {
        return <div className="col-12">
            <div className="row justify-content-center mb-4">
                <div className="col-9">
                    <TokenInput placeholder={"Reward token"} onClick={(address) => onSelectRewardToken(address)} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden"></span>
                    </div>
                </div> : <>  
                <div className="row mb-4">
                    { selectedRewardToken && <div className="col-12">
                            <Coin address={selectedRewardToken.address} /> {selectedRewardToken.symbol}    
                        </div>
                    }
                </div>
                {
                    selectedRewardToken && <div className="col-12">
                        <p style={{fontSize: 14}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                }
                {
                    selectedRewardToken && <div className="form-check my-4">
                        <input class="form-check-input" type="checkbox" value={byMint} onChange={(e) => setByMint(e.target.checked)} id="setByMint" />
                        <label class="form-check-label" for="setByMint">
                            By mint
                        </label>
                    </div>
                }
                {
                    selectedRewardToken && <div className="col-12">
                        <button className="btn btn-secondary" onClick={() => props.updateFarmingContract({ rewardToken: { ...selectedRewardToken, byMint } })}>Start</button>
                    </div>
                }
                </>
            }
           
        </div>
    }

    const getFarmingSetups = () => {
        return <div className="col-12 p-0">
            {
                props.farmingSetups.map((setup, i) => {
                    return (
                        <div key={i} className="row align-items-center text-left mb-md-0 mb-4">
                            <div className="col-md-9 col-12">
                                <b style={{fontSize: 14}}>{ !setup.startBlock ? "Free setup" : "Locked setup" } { setup.data.name }{ setup.startBlock ? `${setup.data.symbol}` : ` | ${ setup.data.symbol1} ${ setup.data.symbol2 }` } - Reward: {setup.rewardPerBlock} {props.farmingContract.rewardToken.symbol}/block</b>
                            </div>
                            <div className="col-md-3 col-12 flex">
                                <button className="btn btn-sm btn-outline-danger mr-1" onClick={() => props.removeFarmingSetup(i)}><b>X</b></button> <button className="btn btn-sm btn-danger ml-1"><b>EDIT</b></button>
                            </div>
                        </div>
                    )
                })
            }
            <div className="row justify-content-between mt-4">
                <div className="col-12 flex justify-content-start mb-4">
                    <button onClick={() => setIsAdd(true)} className="btn btn-light">Add setup</button>
                </div>
                <div className="col-12 mt-4">
                    <button onClick={() => {
                        setSelectedRewardToken(null);
                        props.farmingSetups.forEach((_, index) => props.removeFarmingSetup(index));
                        props.updateFarmingContract(null);
                    }} className="btn btn-light mr-4">Cancel</button> <button onClick={() => setIsAddLoadBalancer(true)} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        </div>
    }

    const getEmptyFarmingSetups = () => {
        if (props.creationStep === 0) {
            return (
                <div className="col-12">
                    <div className="row justify-content-center mb-4">
                        <h6><b>Select farming type</b></h6>
                    </div>
                    <div className="row justify-content-center mb-4">
                        <button onClick={() => setSelectedFarmingType(selectedFarmingType !== 'free' ? 'free' : null)} className={`btn ${selectedFarmingType === 'free' ? "btn-secondary" : "btn-outline-secondary"} mr-4`}>Free Farming</button>
                        <button onClick={() => setSelectedFarmingType(selectedFarmingType !== 'locked' ? 'locked' : null)} className={`btn ${selectedFarmingType === 'locked' ? "btn-secondary" : "btn-outline-secondary"}`}>Locked</button>
                    </div>
                    <div className="row mb-4">
                        <p style={{fontSize: 14}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat animi ipsam nemo at nobis odit temporibus autem possimus quae vel, ratione numquam modi rem accusamus, veniam neque voluptates necessitatibus enim!</p>
                    </div>
                    <div className="row justify-content-center">
                        <button onClick={() => props.setFarmingContractStep(1)} disabled={!selectedFarmingType} className="btn btn-primary">Next</button>
                    </div>
                </div>
            );
        } else if (props.creationStep === 1) {
            if (!selectedFarmingType) {
                props.setFarmingContractStep(0);
                return <div/>;
            }
            return selectedFarmingType === 'free' ? getFreeFirstStep() : getLockedFirstStep();
        } else if (props.creationStep === 2) {
            return getLockedSecondStep();
        }
        return <div/>
    }

    const onSelectFreeLiquidityPoolToken = async (address) => {
        if (!address) address = "0xb0fb35cc576034b01bed6f4d0333b1bd3859615c";
        try {
            setLoading(true);
            const liquidityPoolToken = await props.dfoCore.getContract(props.dfoCore.getContextElement('uniswapV2PairABI'), address);
            const name = await liquidityPoolToken.methods.name().call();
            const token0 = await liquidityPoolToken.methods.token0().call();
            const token1 = await liquidityPoolToken.methods.token1().call();
            const token0Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token0);
            const token1Contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token1);
            const symbol1 = await token0Contract.methods.symbol().call();
            const symbol2 = await token1Contract.methods.symbol().call();
            setFreeLiquidityPoolToken({ 
                address, 
                name,
                token0: isWeth(token0) ? props.dfoCore.voidEthereumAddress : token0, 
                token1: isWeth(token1) ? props.dfoCore.voidEthereumAddress : token1, 
                symbol1: isWeth(token0) ? 'ETH' : symbol1,
                symbol2: isWeth(token1) ? 'ETH' : symbol2 
            });
        } catch (error) {
            setFreeLiquidityPoolToken(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onSelectMainToken = async (address) => {
        if (!address) address = "0x7b123f53421b1bF8533339BFBdc7C98aA94163db";
        setLoading(true);
        const mainTokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), address);
        const symbol = await mainTokenContract.methods.symbol().call();
        setLockedMainToken({ symbol, address });
        setLoading(false);
    }

    const goToFirstStep = () => {
        setFreeLiquidityPoolToken(null);
        setFreeRewardPerBlock(0);
        setLockedPeriod(null);
        setLockedStartBlock(0);
        setLockedMainToken(null);
        setLockedMaxLiquidity(0);
        setLockedRewardPerBlock(0);
        setLockedHasPenaltyFee(false);
        setLockedPenaltyFee(0);
        setLockedIsRenewable(false);
        setLockedRenewTimes(0);
        setLockedSecondaryToken(null);
        props.setFarmingContractStep(0);
    }

    const addFreeFarmingSetup = () => {
        const setup = {
            rewardPerBlock: freeRewardPerBlock,
            data: freeLiquidityPoolToken,
        }
        props.addFarmingSetup(setup);
        console.log(props.farmingSetups);
        setFreeLiquidityPoolToken(null);
        setFreeRewardPerBlock(0);
        setSelectedFarmingType(null);
        setIsAdd(false);
    }

    const addLockedFarmingSetup = () => {
        const setup = {
            period: lockedPeriod,
            startBlock: lockedStartBlock,
            endBlock: lockedStartBlock + lockedPeriod,
            data: lockedMainToken,
            maxLiquidity: lockedMaxLiquidity,
            rewardPerBlock: lockedRewardPerBlock,
            penaltyFee: lockedPenaltyFee,
            renewTimes: lockedRenewTimes,
            secondaryToken: lockedSecondaryToken,
        }
        props.addFarmingSetup(setup);
        console.log(props.farmingSetups);
        setLockedPeriod(null);
        setLockedStartBlock(0);
        setLockedMainToken(null);
        setLockedMaxLiquidity(0);
        setLockedRewardPerBlock(0);
        setLockedHasPenaltyFee(false);
        setLockedPenaltyFee(0);
        setLockedIsRenewable(false);
        setLockedRenewTimes(0);
        setLockedSecondaryToken(null);
        setSelectedFarmingType(null);
        setIsAdd(false);
        props.setFarmingContractStep(0);
    }

    const getFreeFirstStep = () => {
        return <div className="col-12">
            <div className="row justify-content-center mb-4">
                <div className="col-9">
                    <TokenInput label={"Liquidity pool address"} placeholder={"Liquidity pool address"} width={60} onClick={(address) => onSelectFreeLiquidityPoolToken(address)} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden"></span>
                    </div>
                </div> :  <>
                    <div className="row mb-4">
                        { freeLiquidityPoolToken && <div className="col-12">
                                <b>{freeLiquidityPoolToken.name} | {freeLiquidityPoolToken.symbol0} {freeLiquidityPoolToken.symbol1}</b> <Coin address={freeLiquidityPoolToken.token0} className="mr-2" /> <Coin address={freeLiquidityPoolToken.token1} />
                            </div>
                        }
                    </div>
                    {
                        freeLiquidityPoolToken && <>
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input min={0} showCoin={true} address={selectedRewardToken.address} value={freeRewardPerBlock} name={selectedRewardToken.symbol} onChange={(e) => setFreeRewardPerBlock(e.target.value)} />
                                </div>
                            </div>
                            <div className="row justify-content-center align-items-center flex-column mb-2">
                                <p className="text-center"><b>Monthly*: {freeRewardPerBlock * 3000} {selectedRewardToken.symbol}</b></p>
                                <p className="text-center"><b>Yearly*: {freeRewardPerBlock * 36000} {selectedRewardToken.symbol}</b></p>
                            </div>
                            <div className="row mb-4">
                                <p className="text-center">*Monthly/yearly reward are calculated in a forecast based on 3000 Blocks/m and 36000/y.</p>
                            </div>
                            <div className="row justify-content-center mb-4">
                                <button onClick={() => goToFirstStep() } className="btn btn-light mr-4">Cancel</button>
                                <button onClick={() => addFreeFarmingSetup() } disabled={!freeLiquidityPoolToken || freeRewardPerBlock <= 0} className="btn btn-secondary ml-4">Add</button>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    }

    const getLockedFirstStep = () => {
        return <div className="col-12">
            <div className="row mb-4">
                <div className="col-12">
                    <select className="custom-select wusd-pair-select" value={lockedPeriod} onChange={(e) => setLockedPeriod(e.target.value)}>
                        <option value={0}>Choose locked period</option>
                        <option value={750}>1 week</option>
                        <option value={1500}>2 weeks</option>
                        <option value={2250}>3 weeks</option>
                        <option value={3000}>1 month</option>
                        <option value={6000}>2 months</option>
                        <option value={9000}>3 months</option>
                        <option value={18000}>6 months</option>
                        <option value={36000}>1 year</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-6">
                    <Input label={"Start block"} min={currentBlockNumber} value={lockedStartBlock || currentBlockNumber} onChange={(e) => setLockedStartBlock(e.target.value)} />
                </div>
            </div>
            <div className="row mb-4">
                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-9">
                    <TokenInput label={"Main token"} placeholder={"Main token address"} width={60} onClick={(address) => onSelectMainToken(address)} text={"Load"} />
                </div>
            </div>
            {
                loading ? <div className="row justify-content-center">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden"></span>
                    </div>
                </div> :  <>
                    <div className="row mb-4">
                        { lockedMainToken && <div className="col-12">
                                <b>{lockedMainToken.symbol}</b> <Coin address={lockedMainToken.address} className="ml-2" />
                            </div>
                        }
                    </div>
                    {
                        lockedMainToken && <>
                            <hr/>
                            <div className="row justify-content-center my-4">
                                <div className="col-9">
                                    <TokenInput label={"Liquidity pool token"} placeholder={"Liquidity pool token address"} width={60} onClick={(address) => setLockedSecondaryToken(address !== lockedMainToken.address ? address : lockedSecondaryToken)} text={"Load"} />
                                </div>
                            </div>
                            {
                                lockedSecondaryToken && <div key={lockedSecondaryToken} className="row align-items-center justify-content-around mb-2">
                                    { /* <Coin address={secondaryToken} className="mr-2" />  */ } <p>{lockedSecondaryToken}</p> <button className="btn btn-outline-danger btn-sm" onClick={() => setLockedSecondaryToken(null)}>Remove</button>
                                </div>
                            }
                            <div className="row justify-content-center mt-4 mb-4">
                                <div className="col-6">
                                    <Input label={"Max stakeable"} min={0} showCoin={true} address={lockedMainToken.address} value={lockedMaxLiquidity} name={lockedMainToken.symbol} onChange={(e) => setLockedMaxLiquidity(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                            </div>
                            <div className="row justify-content-center mb-4">
                                <div className="col-6">
                                    <Input label={"Reward per block"} min={0} showCoin={true} address={lockedMainToken.address} value={lockedRewardPerBlock} name={lockedMainToken.symbol} onChange={(e) => setLockedRewardPerBlock(e.target.value)} />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                            </div>
                            <div className="row justify-content-center align-items-center flex-column mb-2">
                                <p className="text-center"><b>Reward/block per {lockedMainToken.symbol}: {!lockedMaxLiquidity ? 0 : parseFloat((lockedRewardPerBlock * (1 / lockedMaxLiquidity)).toPrecision(4))} {lockedMainToken.symbol}</b></p>
                            </div>
                        </>
                    }
                    <div className="row justify-content-center mb-4">
                        <button onClick={() => goToFirstStep() } className="btn btn-light mr-4">Cancel</button>
                        <button onClick={() => props.setFarmingContractStep(2) } disabled={!lockedMainToken || lockedRewardPerBlock <= 0 || !lockedMaxLiquidity || !lockedSecondaryToken || !lockedStartBlock || !lockedPeriod} className="btn btn-secondary ml-4">Next</button>
                    </div>
                </>
            }
        </div>
    }

    const getLockedSecondStep = () => {
        return (
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input class="form-check-input" type="checkbox" value={lockedHasPenaltyFee} onChange={(e) => setLockedHasPenaltyFee(e.target.checked)} id="penaltyFee" />
                        <label class="form-check-label" for="penaltyFee">
                            Penalty fee
                        </label>
                    </div>
                </div>
                {
                    lockedHasPenaltyFee && <div className="row mb-4 justify-content-center">
                        <div className="col-md-6 col-12">
                            <Input step={0.001} max={100} min={0} showCoin={true} address={lockedMainToken.address} value={lockedPenaltyFee} name={lockedMainToken.symbol} onChange={(e) => setLockedPenaltyFee(e.target.value)} />
                        </div>
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input class="form-check-input" type="checkbox" value={lockedIsRenewable} onChange={(e) => setLockedIsRenewable(e.target.checked)} id="repeat" />
                        <label class="form-check-label" for="repeat">
                            Repeat
                        </label>
                    </div>
                </div>
                {
                    lockedIsRenewable && <div className="row mb-4 justify-content-center">
                        <div className="col-md-6 col-12">
                            <Input min={0} width={50} address={lockedMainToken.address} value={lockedRenewTimes} onChange={(e) => setLockedRenewTimes(e.target.value)} />
                        </div>
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center mb-4">
                    <button onClick={() => goToFirstStep() } className="btn btn-light mr-4">Cancel</button>
                    <button onClick={() => addLockedFarmingSetup() } disabled={(lockedIsRenewable && lockedRenewTimes === 0) || (lockedHasPenaltyFee && lockedPenaltyFee === 0)} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        )
    }

    const getLockedThirdStep = () => {
        return (
            <div className="col-12">
                <div className="row justify-content-center">
                    <div className="form-check my-4">
                        <input class="form-check-input" type="checkbox" value={hasLoadBalancer} onChange={(e) => setHasLoadBalancer(e.target.checked)} id="penaltyFee" />
                        <label class="form-check-label" for="penaltyFee">
                            Load balancer
                        </label>
                    </div>
                </div>
                {
                    hasLoadBalancer && <div className="row mb-4 justify-content-center">
                        <div className="col-md-9 col-12">
                            <select className="custom-select wusd-pair-select" value={pinnedSetupIndex} onChange={(e) => setPinnedSetupIndex(e.target.value)}>
                                <option value={null}>Choose setup..</option>
                                {
                                    props.farmingSetups.map((setup, index) => {
                                        
                                        return <option key={index} value={index} disabled={setup.startBlock}>
                                            { !setup.startBlock ? "Free setup" : "Locked setup" } { setup.data.name }{ setup.startBlock ? `${setup.data.symbol}` : ` | ${ setup.data.symbol1} ${ setup.data.symbol2 }` } - Reward: {setup.rewardPerBlock} {props.farmingContract.rewardToken.symbol}/block
                                        </option>;
                                    })
                                }
                            </select>
                        </div>
                    </div>
                }
                <div className="row mb-4">
                    <p className="text-center text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row justify-content-center mb-4">
                    <button onClick={() => {
                        setHasLoadBalancer(false);
                        setPinnedSetupIndex(null);
                        setIsAddLoadBalancer(false);
                    } } className="btn btn-light mr-4">Cancel</button>
                    <button onClick={() => {
                        setIsAddLoadBalancer(false);
                        setIsDeploy(true);
                    }} className="btn btn-secondary ml-4">Next</button>
                </div>
            </div>
        )
    }

    const getLockedFourthStep = () => {
        return (
            <div className="col-12">
                <div className="row">
                    <h6><b>Host</b></h6>
                </div>
                <div className="row mb-2">
                    <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                </div>
                <div className="row mb-4">
                    <div className="col-12 p-0">
                        <select className="custom-select wusd-pair-select" value={selectedHost} onChange={(e) => setSelectedHost(e.target.value)}>
                            <option value="">Choose an host..</option>
                            <option value="deployed-contract">Deployed Contract</option>
                            <option value="wallet">Wallet</option>
                            <option value="deploy-contract">Deploy Contract</option>
                            <option value="no-host">No host</option>
                        </select>
                    </div>
                </div>
                {
                    selectedHost === 'wallet' ? <>
                        <div className="row mb-2">
                            <input type="text" className="form-control" value={hostWalletAddress} onChange={(e) => setHostWalletAddress(e.target.value.toString())} placeholder={"Wallet address"} aria-label={"Wallet address"}/>
                        </div>
                        <div className="row mb-4">
                            <p className="text-left text-small">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis delectus incidunt laudantium distinctio velit reprehenderit quaerat, deserunt sint fugit ex consectetur voluptas suscipit numquam. Officiis maiores quaerat quod necessitatibus perspiciatis!</p>
                        </div>
                    </> : selectedHost === 'deployed-contract' ? <>
                        <div className="row mb-2">
                            <input type="text" className="form-control" value={hostDeployedContract} onChange={(e) => setHostDeployedContract(e.target.value.toString())} placeholder={"Deployed contract address"} aria-label={"Deployed contract address"}/>
                        </div>
                        <div className="row mb-4 justify-content-between">
                            <button className="btn btn-sm btn-dark">Choose file</button>
                            <button className="btn btn-sm btn-secondary">VERIFY</button>
                        </div>
                    </> : selectedHost === 'deploy-contract' ? <>
                        <Editor
                            className="deploy-contract-editor"
                            value={deployContractCode}
                            onValueChange={code => setDeployContractCode(code)}
                            highlight={code => highlight(code, languages.sol)}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 14,
                                minHeight: 500
                            }}
                        />
                    </> : <div/>
                }
                <div className="row justify-content-center my-4">
                    <button onClick={() => {
                        setSelectedHost(null);
                        setIsAddLoadBalancer(true);
                        setIsDeploy(false);
                    } } className="btn btn-light mr-4">Cancel</button>
                    <button onClick={() => {
                        setIsDeploy(false);
                        // TODO add deploy contract
                    }} className="btn btn-secondary ml-4" disabled={!selectedHost || (selectedHost === 'wallet' && (!hostWalletAddress || !isValidAddress(hostWalletAddress))) || (selectedHost === 'deployed-contract' && (!hostDeployedContract || !isValidAddress(hostDeployedContract)))}>Deploy</button>
                </div>
            </div>
        )
    }

    const getFarmingContractStatus = () => {
        return (
            <div className="col-12">
                <div className="row flex-column align-items-start mb-4">
                    <h5 className="text-secondary"><b>Farm {props.farmingContract.rewardToken.symbol}</b></h5>
                    <b>{isAddLoadBalancer || isDeploy ? "Advanced setup" : "Setups list"}</b>
                </div>
                {
                    isAddLoadBalancer ? getLockedThirdStep() : isDeploy ? getLockedFourthStep() : <div className="col-12">
                        {
                            (props.farmingSetups.length > 0 && !isAdd) && getFarmingSetups()
                        }
                        {
                            (props.farmingSetups.length === 0 || isAdd) && getEmptyFarmingSetups()
                        }
                    </div>
                }
            </div>
        )
    }

    return (
        <div className="create-component">
            <div className="row mb-4">
                { !props.farmingContract && getCreationComponent() }
                { props.farmingContract && getFarmingContractStatus() }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { farmingContract, farmingSetups, creationStep } = session;
    return { dfoCore: core.dfoCore, farmingContract, farmingSetups, creationStep };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFarmingContractStep: (index) => dispatch(setFarmingContractStep(index)),
        updateFarmingContract: (contract) => dispatch(updateFarmingContract(contract)),
        addFarmingSetup: (setup) => dispatch(addFarmingSetup(setup)), 
        removeFarmingSetup: (index) => dispatch(removeFarmingSetup(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Create);