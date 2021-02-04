import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components'; 

const Farm = (props) => {
    const [farmingContracts, setFarmingContracts] = useState([]);

    useEffect(() => {
        getFarmingSetups();
    }, []);

    const getFarmingSetups = async () => {
        await props.dfoCore.loadDeployedLiquidityMiningContracts();
    }

    return (
        <div className="container bg-white dapp-container">
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

export default connect(mapStateToProps)(Farm);