import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { FarmingComponent, SetupComponent } from '../../../../components';
import Create from './Create';
import CreateOrEditFarmingSetups from './CreateOrEditFarmingSetups';


const ExploreFarmingContract = (props) => {
    const { dfoCore, farmAddress } = props;
    let { address } = useParams();
    if (!address) {
        address = farmAddress;
    }
    const [farmingSetups, setFarmingSetups] = useState([]);
    const [contract, setContract] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [extension, setExtension] = useState(null);
    const [setupsLoading, setSetupsLoading] = useState(false);
    const [token, setToken] = useState(null);
    const [newFarmingSetups, setNewFarmingSetups] = useState([]);

    useEffect(() => {
        if (dfoCore) {
            getContractMetadata();
        }
    }, []);

   
    const getContractMetadata = async () => {
        setLoading(true);
        try {
            const lmContract = await dfoCore.getContract(dfoCore.getContextElement('FarmMainABI'), address);
            setContract(lmContract);
            const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
            const rewardToken = await dfoCore.getContract(dfoCore.getContextElement("ERC20ABI"), rewardTokenAddress);
            const rewardTokenSymbol = await rewardToken.methods.symbol().call();
            const rewardTokenDecimals = await rewardToken.methods.decimals().call();
            setToken({ symbol: rewardTokenSymbol, address: rewardTokenAddress, decimals: rewardTokenDecimals });
            const extensionAddress = await lmContract.methods._extension().call();
            const extensionContract = await dfoCore.getContract(dfoCore.getContextElement('FarmExtensionABI'), extensionAddress);
            setExtension(extensionContract);
            const { host, byMint } = await extensionContract.methods.data().call();
            const isHost = host.toLowerCase() === dfoCore.address.toLowerCase();
            setIsHost(isHost);
            const setups = await lmContract.methods.setups().call();
            const blockNumber = await dfoCore.getBlockNumber();
            const freeSetups = [];
            const lockedSetups = [];
            let totalFreeSetups = 0;
            let totalLockedSetups = 0;
            let rewardPerBlock = 0;
            let canActivateSetup = false;

            const res = [];
            for (let i = 0; i < setups.length; i++) {
                const { '0': setup, '1': setupInfo } = await lmContract.methods.setup(i).call();
                if (!canActivateSetup) {
                    canActivateSetup = parseInt(setupInfo.renewTimes) > 0 && !setup.active && parseInt(setupInfo.lastSetupIndex) === parseInt(i);
                }
                if (setup.rewardPerBlock !== "0") {
                    setupInfo.free ? totalFreeSetups += 1 : totalLockedSetups += 1;
                    res.push({...setup, setupInfo, rewardTokenAddress, setupIndex: i })
                }
                if (setup.active && (parseInt(setup.endBlock) > blockNumber)) {
                    setupInfo.free ? freeSetups.push(setup) : lockedSetups.push(setup);
                    rewardPerBlock += parseInt(setup.rewardPerBlock);
                }
            }
            const sortedRes = res.sort((a, b) => b.active - a.active);
            console.log(sortedRes);
            setFarmingSetups(sortedRes);
    
            const metadata = {
                name: `Farm ${rewardTokenSymbol}`,
                contractAddress: lmContract.options.address,
                rewardTokenAddress: rewardToken.options.address,
                rewardPerBlock: dfoCore.toDecimals(dfoCore.toFixed(rewardPerBlock).toString(), rewardTokenDecimals),
                byMint,
                freeSetups,
                lockedSetups,
                totalFreeSetups,
                totalLockedSetups,
                canActivateSetup,
                extension: `${extensionAddress.substring(0, 5)}...${extensionAddress.substring(extensionAddress.length - 3, extensionAddress.length)}`,
                fullExtension: `${extensionAddress}`,
                farmAddress: `${lmContract.options.address.substring(0, 5)}...${lmContract.options.address.substring(lmContract.options.address.length - 3, lmContract.options.address.length)}`,
                host: `${host.substring(0, 5)}...${host.substring(host.length - 3, host.length)}`,
                fullhost: `${host}`,
            };
            setMetadata({ contract: lmContract, metadata, isActive: freeSetups + lockedSetups > 0 || canActivateSetup });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const isWeth = (address) => {
        return (address.toLowerCase() === dfoCore.getContextElement('wethTokenAddress').toLowerCase()) || (address === dfoCore.voidEthereumAddress);
    }
    
    const addFarmingSetup = (setup) => {
        setNewFarmingSetups(newFarmingSetups.concat(setup));
    }

    const editFarmingSetup = (setup, index) => {
        const updatedSetups = newFarmingSetups.map((s, i) => {
            return i !== index ? s : setup;
        })
        setNewFarmingSetups(updatedSetups);
    }

    const removeFarmingSetup = (i) => {
        const updatedSetups = newFarmingSetups.filter((_, index) => index !== i);
        setNewFarmingSetups(updatedSetups);
    }

    const updateSetups = async () => {
        console.log(newFarmingSetups);
        setSetupsLoading(true);
        try {
            const newSetupsInfo = [];
            const ammAggregator = await dfoCore.getContract(dfoCore.getContextElement('AMMAggregatorABI'), dfoCore.getContextElement('ammAggregatorAddress'));
            await Promise.all(newFarmingSetups.map(async (_, i) => {
                const setup = newFarmingSetups[i];
                const isFree = !setup.maxLiquidity;
                const result = await ammAggregator.methods.findByLiquidityPool(isFree ? setup.data.address : setup.secondaryToken.address).call();
                const { amm } = result;
                const ammContract = await dfoCore.getContract(dfoCore.getContextElement('AMMABI'), amm);
                const res = await ammContract.methods.byLiquidityPool(isFree ? setup.data.address : setup.secondaryToken.address).call();
                const involvingETH = res['2'].filter((address) => isWeth(address)).length > 0;
                const setupInfo = 
                {
                    add: true,
                    disable: false,
                    index: 0,
                    info: {
                        free: isFree,
                        blockDuration: parseInt(setup.period),
                        originalRewardPerBlock: dfoCore.fromDecimals(setup.rewardPerBlock),
                        minStakeable: dfoCore.fromDecimals(setup.minStakeable),
                        maxStakeable: !isFree ? dfoCore.fromDecimals(setup.maxLiquidity) : 0,
                        renewTimes: setup.renewTimes,
                        ammPlugin:  amm,
                        liquidityPoolTokenAddress: isFree ? setup.data.address : setup.secondaryToken.address,
                        mainTokenAddress: result[2][0],
                        ethereumAddress: dfoCore.voidEthereumAddress,
                        involvingETH,
                        penaltyFee: isFree ? 0 : dfoCore.fromDecimals(parseFloat(parseFloat(setup.penaltyFee) / 100).toString()),
                        setupsCount: 0,
                        lastSetupIndex: 0,
                    }
                };
                newSetupsInfo.push(setupInfo);
            }));
            const gas = await extension.methods.setFarmingSetups(newSetupsInfo).estimateGas({ from: dfoCore.address });
            console.log(`gas ${gas}`);
            const result = await extension.methods.setFarmingSetups(newSetupsInfo).send({ from: dfoCore.address, gas });
        } catch (error) {
            console.error(error);
        } finally {
            setSetupsLoading(false);
            setIsAdd(false);
            setNewFarmingSetups([]);
            await getContractMetadata();
        }
    }


    if (loading) {
        return (
            <div className="ListOfThings">
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const lockedSetups = farmingSetups.filter((s) => !s.setupInfo.free);
    const freeSetups = farmingSetups.filter((s) => s.setupInfo.free);

    return (
        <div className="ListOfThings">
            {
                (contract && metadata) ? 
                <div className="row">
                    <FarmingComponent className="FarmContractOpen" dfoCore={dfoCore} contract={metadata.contract} metadata={metadata.metadata} goBack={true} hostedBy={isHost} />
                </div> : <div/>
            }
            {
                isHost && <>
                    { !isAdd && <button className="btn btn-primary" onClick={() => setIsAdd(true)}>Add new setups</button> }
                </>
            }
            <div className="ListOfThings">
                {
                    (!isAdd && farmingSetups.length > 0) && <div>
                        { freeSetups.length > 0 && <h3>Free setups</h3> }
                        {
                            freeSetups.map((farmingSetup, setupIndex) => {
                                return (
                                    <SetupComponent key={setupIndex} className="FarmSetup" setupIndex={farmingSetup.setupIndex} setupInfo={farmingSetup.setupInfo} lmContract={contract} dfoCore={dfoCore} setup={farmingSetup} hostedBy={isHost} hasBorder />
                                )
                            })
                        }
                        { lockedSetups.length > 0 && <h3>Locked setups</h3> }
                        { 
                            lockedSetups.map((farmingSetup, setupIndex) => {
                                return (
                                    <SetupComponent key={setupIndex} className="FarmSetup" setupIndex={farmingSetup.setupIndex} setupInfo={farmingSetup.setupInfo} lmContract={contract} dfoCore={dfoCore} setup={farmingSetup} hostedBy={isHost} hasBorder />
                                )
                            })
                        }
                    </div>
                }
                {
                    (isAdd && !isFinished) && <CreateOrEditFarmingSetups 
                        rewardToken={token} 
                        farmingSetups={newFarmingSetups} 
                        onAddFarmingSetup={(setup) => addFarmingSetup(setup)} 
                        onRemoveFarmingSetup={(i) => removeFarmingSetup(i)} 
                        onEditFarmingSetup={(setup, i) => editFarmingSetup(setup, i)} 
                        onCancel={() => { setNewFarmingSetups([]); setIsAdd(false);}} 
                        onFinish={() => setIsFinished(true)} 
                    />
                }
                {
                    (isAdd && isFinished && !setupsLoading) && <button className="btn btn-primary" onClick={() => updateSetups()}>Update setups</button>
                }
                {
                    (isAdd && isFinished && setupsLoading) && <button className="btn btn-primary" disabled={setupsLoading}><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(ExploreFarmingContract);