import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FixedInflationComponent } from '../../../../components';

const ExploreInflationContract = (props) => {
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState([]);

    return (
        <div className="explore-inflation-component">
            <div className="row mb-4 align-items-center">
                <FixedInflationComponent className={"col-12 mb-4"} showButton={false} hasBorder={false} />
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
                           <div/>
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