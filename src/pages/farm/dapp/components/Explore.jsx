import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components';

const contracts = [{address: '0xc3BE549499f1e504c793a6c89371Bd7A98229500'}, {address: '0x761E02FEC5A21C6d3F284bd536dB2D2d33d5540B'}];

const Explore = (props) => {
    const [tokenFilter, setTokenFilter] = useState("");
    const [farmingContracts, setFarmingContracts] = useState([]);
    const [startingContracts, setStartingContracts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.dfoCore) {
            getDeployedContracts();
        }
    }, []);

    const getDeployedContracts = async () => {
        setLoading(true);
        try {
            await props.dfoCore.loadDeployedLiquidityMiningContracts();
            const mappedContracts = await Promise.all(
                props.dfoCore.deployedLiquidityMiningContracts.map(async (contract) => { 
                    return props.dfoCore.getContract(props.dfoCore.getContextElement('liquidityMiningABI'), contract.address);
                })
            );
            setFarmingContracts(mappedContracts);
            setStartingContracts(mappedContracts);
        } catch (error) {
            console.error(error);
            setFarmingContracts([]);
            setStartingContracts([]);
        } finally {
            setLoading(false);
        }
    }

    const onChangeTokenFilter = (value) => {
        if (!value) {
            setTokenFilter("");
            setFarmingContracts(startingContracts);
            return;
        }
        setTokenFilter(value);
        const filteredFarmingContracts = startingContracts.filter((contract) => contract.address.toLowerCase().includes(value.toLowerCase()));
        setFarmingContracts(filteredFarmingContracts);
    }

    return (
        <div className="explore-component">
            <div className="row mb-4">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <select className="custom-select wusd-pair-select">
                        <option value="">Sort by..</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <input type="text" class="form-control token-filter-input" placeholder="Reward token address.." value={tokenFilter} onChange={(e) => onChangeTokenFilter(e.target.value)} />
                </div>
            </div>
            <div className="row">
                {
                    farmingContracts.length === 0 && <div className="col-12 text-left">
                        <h6><b>No farming contract available!</b></h6>
                    </div>
                }
                {
                    farmingContracts.length > 0 && farmingContracts.map((farmingContract) => {
                        return (
                            <FarmingComponent className="col-12 mb-4" dfoCore={props.dfoCore} contract={farmingContract} hasBorder />
                        )
                    })
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Explore);