import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const FixedInflationComponent = (props) => {
    const { className, dfoCore, entry, showButton, hasBorder } = props;
    const [metadata, setMetadata] = useState(null);

    const getContractMetadata = async () => {

        setMetadata({
            name: 'XXXXXXXXX',
            period: 'Weekly',
            executorReward: '5%',
            operations: [0, 0, 0],
            host: '0x0000',
            contractAddress: '0x0000'
        });
    }

    if (!metadata) {
        getContractMetadata();
    }

    return (
        <div className={className}>
            <div className={`card farming-card ${!hasBorder ? "no-border" : ""}`}>
                <div className="card-body">
                    <div className="row px-2 fixed-inflation-main-row">
                        {
                            metadata ? <>
                            <div className="col-12 col-md-6 flex flex-column justify-content-center">
                                <div className="row mb-2">
                                    <h4 className="mr-4"><b>{metadata.name}</b></h4> <b>({metadata.period})</b>
                                </div>
                                <div className="row">
                                    <b style={{fontSize: 14}} className="text-secondary mr-1">Executor reward: 5% </b> <b style={{fontSize: 14, marginBottom: 4}}>for {metadata.operations.length} operations</b> 
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row flex-column align-items-end">
                                    <p className="fixed-inflation-paragraph"><b>Host</b>: {metadata.host}</p>
                                    <p className="fixed-inflation-paragraph"><b>Contract</b>: {metadata.contractAddress}</p>
                                    { !showButton ? <div/> : <Link to={`/inflation/dapp/${metadata.contractAddress}`} className="btn btn-secondary btn-sm">Open</Link>}
                                </div>
                            </div>
                            </> : <div className="col-12 justify-content-center">
                                <div class="spinner-border text-secondary" role="status">
                                    <span class="visually-hidden"></span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

FixedInflationComponent.propTypes = {
    className: PropTypes.string,
    entry: PropTypes.any.isRequired,
    hasBorder: PropTypes.bool
};

export default FixedInflationComponent;