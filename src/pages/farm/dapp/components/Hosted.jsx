import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components';

const contracts = [{address: '0xc3BE549499f1e504c793a6c89371Bd7A98229500'}, {address: '0x761E02FEC5A21C6d3F284bd536dB2D2d33d5540B'}];

const Hosted = (props) => {
    const { dfoCore } = props;
    const [tokenFilter, setTokenFilter] = useState("");
    const [farmingContracts, setFarmingContracts] = useState([]);
    const [startingContracts, setStartingContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (dfoCore) {
            getContracts();
        }
    }, [])

    const getContracts = async () => {
        setLoading(true);
        try {
            const hostedContracts = dfoCore.getHostedFarmingContracts();
            const mappedContracts = await Promise.all(
                hostedContracts.map(async (c) => { 
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
                        return { contract, metadata };
                    } catch (error) {
                        console.error(error);
                    }
                })
            );
            setFarmingContracts(mappedContracts.filter((c) => c));
            setStartingContracts(mappedContracts.filter((c) => c));
        } catch (error) {
            console.error(error);
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

    return (
        <div className="MainExploration">
            <h6><b>Reward token address</b></h6>
            <input type="text" className="TextRegular" placeholder="Reward token address.." value={tokenFilter} onChange={(e) => onChangeTokenFilter(e.target.value)} />
            {
                loading ? 
                <div className="row mt-4">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div> : <div className="ListOfThings">
                    {
                        farmingContracts.length === 0 && <div className="col-12 text-left">
                            <h6><b>No farming contract available!</b></h6>
                        </div>
                    }
                    {
                        farmingContracts.length > 0 && farmingContracts.map((farmingContract) => {
                            return (
                                <FarmingComponent className="FarmContract" dfoCore={dfoCore} contract={farmingContract.contract} metadata={farmingContract.metadata} hostedBy={true} hasBorder />
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

export default connect(mapStateToProps)(Hosted);