import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { FarmingComponent, SetupComponent } from '../../../../components';


const ExploreFarmingContract = (props) => {
    const { address } = useParams();
    const [farmingSetups, setFarmingSetups] = useState([]);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        getContractMetadata()
    }, []);

    const getContractMetadata = async () => {
        const lmContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('LiquidityMiningABI'), address);
        const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
        setContract(lmContract);
        const setups = await lmContract.methods.setups().call();
        console.log(rewardTokenAddress);
        setFarmingSetups(setups.map((setup) => { return {...setup, rewardTokenAddress }}));
    }

    return (
        <div className="ListOfThings">
            {
                contract ? 
                <div className="row">
                    <FarmingComponent className="FarmContractOpen" dfoCore={props.dfoCore} contract={contract} goBack={true} hostedBy={true} />
                </div> : <div/>
            }
            <div className="row">
                {
                    farmingSetups.length > 0 ? farmingSetups.map((farmingSetup, setupIndex) => {
                        return (
                            <SetupComponent className="col-12 mb-4" setupIndex={setupIndex} lmContract={contract} dfoCore={props.dfoCore} setup={farmingSetup} hostedBy={true} hasBorder />
                        )
                    }) : <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
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