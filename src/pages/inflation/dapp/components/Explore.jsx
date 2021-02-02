import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FixedInflationComponent, FarmingComponent } from '../../../../components';

const extFixedInflationContracts = [{address: '0xc3BE549499f1e504c793a6c89371Bd7A98229500'}, {address: '0x761E02FEC5A21C6d3F284bd536dB2D2d33d5540B'}];

const Explore = (props) => {
    const [executable, setExecutable] = useState(false);
    const [fixedInflationContracts, setFixedInflationContracts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.dfoCore) {
            getEntries();
        }
    }, []);

    const getEntries = async () => {
        setLoading(true);
        try {
            setFixedInflationContracts(extFixedInflationContracts);
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
                        <input class="form-check-input" type="checkbox" value={executable} onChange={(e) => setExecutable(e.target.checked)} id="setExecutable" />
                        <label class="form-check-label" for="setExecutable">
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
                    fixedInflationContracts.map((entry) => {
                        return (
                            <FixedInflationComponent className={"col-12 mb-4"} showButton={true} hasBorder={true} />
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