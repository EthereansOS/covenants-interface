import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components'; 

const Farm = (props) => {
    const [loading, setLoading] = useState(false);
    const [farmingContracts, setFarmingContracts] = useState([]);

    /*
    useEffect(() => {
        getFarmingSetups();
    }, []);

    const getFarmingSetups = async () => {
        setLoading(true);
        try {
            await props.dfoCore.loadDeployedLiquidityMiningContracts();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    */

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
        <div className="wusd-farm-container">
            <div className="row">
                <div className="col-12 text-left">
                    <h6><b>No farming contract available!</b></h6>
                </div>
                {
                    /* 
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
                    */
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