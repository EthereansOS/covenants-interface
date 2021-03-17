import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components';

const Explore = (props) => {
    const { dfoCore } = props;
    const [tokenFilter, setTokenFilter] = useState("");
    const [farmingContracts, setFarmingContracts] = useState([]);
    const [startingContracts, setStartingContracts] = useState([]);
    const [activeOnly, setActiveOnly] = useState(false);
    const [selectFilter, setSelectFilter] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dfoCore) {
            getDeployedContracts();
        }
    }, []);

    const getDeployedContracts = async () => {
        setLoading(true);
        try {
            await dfoCore.loadDeployedFarmingContracts();
            const mappedContracts = await Promise.all(
                dfoCore.deployedFarmingContracts.map(async (c) => { 
                    try {
                        const contract = await dfoCore.getContract(dfoCore.getContextElement('FarmMainABI'), c.address)
                        const rewardTokenAddress = await contract.methods._rewardTokenAddress().call();
                        const rewardToken = await dfoCore.getContract(dfoCore.getContextElement('ERC20ABI'), rewardTokenAddress);
                        const symbol = await rewardToken.methods.symbol().call();
                        const extensionAddress = await contract.methods._extension().call();
                        const extensionContract = await dfoCore.getContract(dfoCore.getContextElement('FarmExtensionABI'), extensionAddress);
                        const { host, byMint } = await extensionContract.methods.data().call();
                        
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
                            if (setup.active) {
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
                            rewardPerBlock: `${(dfoCore.toDecimals(dfoCore.toFixed(rewardPerBlock).toString()))} ${symbol}`,
                            byMint,
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
            setFarmingContracts(mappedContracts.filter((c) => c).sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1));
            setStartingContracts(mappedContracts.filter((c) => c).sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1));
        } catch (error) {
            console.log(error);
            setFarmingContracts([]);
            setStartingContracts([]);
        } finally {
            setLoading(false);
        }
    }

    const onChangeTokenFilter = async (value) => {
        if (!value) {
            setTokenFilter("");
            setFarmingContracts(startingContracts);
            return;
        }
        setLoading(true);
        try {
            setTokenFilter(value);
            const filteredFarmingContracts = [];
            await Promise.all(startingContracts.map(async (contract) => {
                const rewardTokenAddress = await contract.methods._rewardTokenAddress().call();
                if (rewardTokenAddress.toLowerCase().includes(value.toLowerCase())) {
                    filteredFarmingContracts.push(contract);
                }
            }));
            setFarmingContracts(filteredFarmingContracts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onChangeSelectFilter = async (value) => {
        setSelectFilter(value);
        let filteredFarmingContracts = tokenFilter ? [] : startingContracts;
        if (tokenFilter) {
            await Promise.all(startingContracts.map(async (contract) => {
                const rewardTokenAddress = await contract.methods._rewardTokenAddress().call();
                if (rewardTokenAddress.toLowerCase().includes(value.toLowerCase())) {
                    filteredFarmingContracts.push(contract);
                }
            }));
        }
        switch (value) {
            case "":
                setFarmingContracts(filteredFarmingContracts);
                break;
            case "1":
                setFarmingContracts(filteredFarmingContracts.sort((a, b) => parseInt(b.metadata.rewardPerBlock) - parseInt(a.metadata.rewardPerBlock)));
                break;
            case "2":
                setFarmingContracts(filteredFarmingContracts.sort((a, b) => parseInt(a.metadata.rewardPerBlock) - parseInt(b.metadata.rewardPerBlock)));
                break;
            case "5":
                setFarmingContracts(filteredFarmingContracts.sort((a, b) => parseInt(b.metadata.freeSetups.length + b.metadata.lockedSetups.length) - parseInt(a.metadata.freeSetups.length + a.metadata.lockedSetups.length)));
                break
            case "6":
                setFarmingContracts(filteredFarmingContracts.sort((a, b) => parseInt(a.metadata.freeSetups.length + a.metadata.lockedSetups.length) > parseInt(b.metadata.freeSetups.length + b.metadata.lockedSetups.length)));
                break
            default:
                break
        }
    }

    return (
        <div className="MainExploration">
            <div className="SortBox">
                <input type="text" className="TextRegular" placeholder="Sort by token address.." value={tokenFilter} onChange={(e) => onChangeTokenFilter(e.target.value)} />
                <div className="SortOptions">
                    <select className="SelectRegular" value={selectFilter} onChange={(e) => onChangeSelectFilter(e.target.value)}>
                        <option value="">Sort by..</option>
                        <option value="1">Higher Rewards per day</option>
                        <option value="2">Lower Rewards per day</option>
                        {
                            /*
                            <option value="3">Higher APY</option>
                            <option value="4">Lower APY</option>
                            */
                        }
                        <option value="5">More Setups</option>
                        <option value="6">Less Setups</option>
                    </select>
                <label>
                    <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)}></input><p>Only Active</p>
                </label>
                </div>
            </div>
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
                        farmingContracts.length > 0 && farmingContracts.map((farmingContract) => {
                            if ((activeOnly && (farmingContract.metadata.freeSetups.length > 0 || farmingContract.metadata.lockedSetups.length > 0) || farmingContract.metadata.canActivateSetup) || !activeOnly) {
                                return (
                                    <FarmingComponent className="FarmContract" dfoCore={props.dfoCore} contract={farmingContract.contract} metadata={farmingContract.metadata} hasBorder />
                                )
                            }
                            return <div/>
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

export default connect(mapStateToProps)(Explore);