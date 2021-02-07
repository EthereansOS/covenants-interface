import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FixedInflationComponent, FarmingComponent } from '../../../../components';

const Explore = (props) => {
    const [executable, setExecutable] = useState(false);
    const [fixedInflationContracts, setFixedInflationContracts] = useState([]);
    const [startingContracts, setStartingContracts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.dfoCore) {
            getEntries();
        }
    }, []);

    const getEntries = async () => {
        setLoading(true);
        try {
            await props.dfoCore.loadDeployedFixedInflationContracts();
            const mappedEntries = [];
            await Promise.all(
                props.dfoCore.deployedFixedInflationContracts.map(async (contract) => { 
                    const fiContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('FixedInflationABI'), contract.address);
                    const events = await fiContract.getPastEvents('Entry', { fromBlock: 11806961 });
                    await Promise.all(events.map(async (event) => {
                        const { id } = event.returnValues;
                        const result = await fiContract.methods.entry(id).call();
                        const [entry, operations] = result;
                        mappedEntries.push({ contract: fiContract, entry, operations });
                    }))
                })
            );
            setFixedInflationContracts(mappedEntries);
            setStartingContracts(mappedEntries);
        } catch (error) {
            console.error(error);
            setFixedInflationContracts([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="explore-component">
            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <select className="custom-select wusd-pair-select">
                        <option value="">Sort by..</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div className="col-12 col-md-6 mb-4 mb-md-0">
                    <div className="form-check my-4">
                        <input className="form-check-input" type="checkbox" value={executable} onChange={(e) => setExecutable(e.target.checked)} id="setExecutable" />
                        <label className="form-check-label" htmlFor="setExecutable">
                            Executable
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                {
                    fixedInflationContracts.length === 0 && <div className="col-12 text-left">
                        <h6><b>No fixed inflation contracts!</b></h6>
                    </div>
                }
                {
                    fixedInflationContracts.map(({ contract, entry, operations }) => {
                        return (
                            <FixedInflationComponent className={"col-12 mb-4"} contract={contract} entry={entry} operations={operations} showButton={true} hasBorder={true} />
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