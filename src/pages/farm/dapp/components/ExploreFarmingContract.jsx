import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { FarmingComponent, SetupComponent } from '../../../../components';
import Create from './Create';


const ExploreFarmingContract = (props) => {
    const { address } = useParams();
    const [farmingSetups, setFarmingSetups] = useState([]);
    const [contract, setContract] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [isExtensionActive, setIsExtensionActive] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getContractMetadata()
    }, []);

    const getContractMetadata = async () => {
        setLoading(true);
        try {
            const lmContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('FarmMainABI'), address);
            setContract(lmContract);
            const rewardTokenAddress = await lmContract.methods._rewardTokenAddress().call();
            const extensionAddress = await lmContract.methods._extension().call();
            const extensionContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('FarmExtensionABI'), extensionAddress);
            const host = await extensionContract.methods.data().call();
            const isActive = await extensionContract.methods.active().call();
            const isHost = host["host"].toLowerCase() === props.dfoCore.address.toLowerCase();
            setIsHost(isHost);
            setIsExtensionActive(isActive);
            const setups = await lmContract.methods.setups().call();
            const res = [];
            await Promise.all(setups.map(async (setup, i) => {
                const setupInfo = await lmContract.methods._setupsInfo(setup.infoIndex).call();
                if (setup.rewardPerBlock !== "0") {
                    res.push({...setup, setupInfo, rewardTokenAddress, setupIndex: i })
                }
            }))
            setFarmingSetups(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const toggleExtension = async () => {

        const extensionAddress = await contract.methods._extension().call();
        const extensionContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('FarmExtensionABI'), extensionAddress);
        const isActive = await extensionContract.methods.active().call();
        const gas =  await extensionContract.methods.setActive(!isActive).estimateGas({ from: props.dfoCore.address });
        const result = await extensionContract.methods.setActive(!isActive).send({ from: props.dfoCore.address, gas });
        await getContractMetadata();
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

    return (
        <div className="ListOfThings">
            {
                contract ? 
                <div className="row">
                    <FarmingComponent className="FarmContractOpen" dfoCore={props.dfoCore} contract={contract} goBack={true} hostedBy={isHost} />
                </div> : <div/>
            }
            {
                isHost && <>
                    <button className="btn btn-primary" onClick={() => toggleExtension()}>{isExtensionActive ? "Disable" : "Enable"} extension</button>
                    { !isAdd && <button className="btn btn-primary" onClick={() => setIsAdd(true)}>Add new setups</button> }
                    { isAdd && <button className="btn btn-transparent" onClick={() => setIsAdd(false)}>Cancel</button> }
                </>
            }
            <div className="ListOfThings">
                {
                    (!isAdd && farmingSetups.length > 0) && farmingSetups.map((farmingSetup, setupIndex) => {
                        return (
                            <SetupComponent className="FarmSetup" setupIndex={farmingSetup.setupIndex} setupInfo={farmingSetup.setupInfo} lmContract={contract} dfoCore={props.dfoCore} setup={farmingSetup} hostedBy={isHost} isExtensionActive={isExtensionActive} hasBorder />
                        )
                    })
                }
                {
                    isAdd && <Create />
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