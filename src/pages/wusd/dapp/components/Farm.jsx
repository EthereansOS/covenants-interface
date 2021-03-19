import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components'; 

const Farm = (props) => {
    const { dfoCore } = props;
    const [loading, setLoading] = useState(false);
    const [farmingContracts, setFarmingContracts] = useState([]);

    
    useEffect(() => {
        getFarmingSetups();
    }, []);

    const getFarmingSetups = async () => {
        setLoading(true);
        try {
            const contracts = await dfoCore.loadWUSDFarmingContracts();
            const mappedContracts = await Promise.all(
                contracts.map(async (c) => { 
                    try {
                        const contract = await dfoCore.getContract(dfoCore.getContextElement('FarmMainABI'), c.address)
                        const rewardTokenAddress = await contract.methods._rewardTokenAddress().call();
                        const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), rewardTokenAddress);
                        const symbol = await rewardToken.methods.symbol().call();
                        const decimals = await rewardToken.methods.decimals().call();
                        const extensionAddress = await contract.methods._extension().call();
                        const extensionContract = await dfoCore.getContract(dfoCore.getContextElement('FarmExtensionABI'), extensionAddress);
                        const { host, byMint } = await extensionContract.methods.data().call();
                        const blockNumber = await dfoCore.getBlockNumber();
                        const setups = await contract.methods.setups().call();
                        const freeSetups = [];
                        const lockedSetups = [];
                        let totalFreeSetups = 0;
                        let totalLockedSetups = 0;
                
                        let rewardPerBlock = 0;
                        let canActivateSetup = false;
                        await Promise.all(setups.map(async (setup, i) => {
                            const {'0': s, '1': setupInfo} = await contract.methods.setup(i).call();
                            if (!canActivateSetup) {
                                canActivateSetup = parseInt(setupInfo.renewTimes) > 0 && !setup.active && parseInt(setupInfo.lastSetupIndex) === parseInt(i);
                            }
                            if (setup.active && (parseInt(setup.endBlock) > blockNumber)) {
                                setupInfo.free ? freeSetups.push(setup) : lockedSetups.push(setup);
                                rewardPerBlock += parseInt(setup.rewardPerBlock);
                            }
                            if (setup.rewardPerBlock !== "0") {
                                setupInfo.free ? totalFreeSetups += 1 : totalLockedSetups += 1;
                            }
                        }))
                
                        const metadata = {
                            name: `Farm ${symbol}`,
                            contractAddress: contract.options.address,
                            rewardTokenAddress: rewardToken.options.address,
                            rewardPerBlock: dfoCore.toDecimals(dfoCore.toFixed(rewardPerBlock).toString(), decimals),
                            byMint,
                            extension: `${extensionAddress.substring(0, 5)}...${extensionAddress.substring(extensionAddress.length - 3, extensionAddress.length)}`,
                            fullExtension: `${extensionAddress}`,
                            farmAddress: `${contract.options.address.substring(0, 5)}...${contract.options.address.substring(contract.options.address.length - 3, contract.options.address.length)}`,
                            freeSetups,
                            lockedSetups,
                            totalFreeSetups,
                            totalLockedSetups,
                            canActivateSetup,
                            host: `${host.substring(0, 5)}...${host.substring(host.length - 3, host.length)}`,
                            fullhost: `${host}`,
                        };
                        return { contract, metadata, isActive: freeSetups.length + lockedSetups.length > 0 || canActivateSetup };
                    } catch (error) {
                        console.error(error);
                    }
                })
            );
            setFarmingContracts(mappedContracts);
        } catch (error) {
            console.error(error);
            setFarmingContracts([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="explore-component">
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="MainExploration">
            {
                loading ? 
                <div className="row mt-4">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div> : 
                <div className="ListOfThings">
                    {
                        farmingContracts.length === 0 && <div className="col-12 text-left">
                            <h6><b>No farming contract available!</b></h6>
                        </div>
                    }
                    {
                        farmingContracts.length > 0 && farmingContracts.map((farmingContract, index) => {
                            return (
                                <FarmingComponent key={farmingContract.contract.options.address} className="FarmContract" dfoCore={props.dfoCore} metadata={farmingContract.metadata} hasBorder />
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Farm);