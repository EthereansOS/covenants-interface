import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const ExploreInflationContract = (props) => {
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);

    return (
        <div className="explore-inflation-component">
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
                    entries.length === 0 && <div className="col-12 text-left">
                        <h6><b>No entries available!</b></h6>
                    </div>
                }
                {
                    entries.map((entry) => {
                        return (
                            <FixedInflationComponent className={"col-12 mb-4"} hasBorder={true} />
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

export default connect(mapStateToProps)(ExploreInflationContract);