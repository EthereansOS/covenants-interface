import { Coin } from '../';
import { Link } from 'react-router-dom';
import defaultLogoImage from '../../../assets/images/default-logo.png';

const BazaarComponent = (props) => {
    const { hasBorder, className, indexToken } = props;

    return (
    <div className={className}>
        <div className={`card farming-card primary-farming-card ${!hasBorder ? "no-border" : ""}`}>
            <div className="card-body">
                <div className="row px-2 farming-component-main-row">
                    {
                        indexToken ? <>
                        <div className="col-12 col-md-3 p-0 text-left farming-component-main-col">
                            <div className="row mb-2">
                                <h6><b>{indexToken.name}</b></h6>
                            </div>
                            <div className="row mb-2">
                                <img src={indexToken.ipfsInfo.image || defaultLogoImage} width={100} />
                            </div>
                        </div>
                        <div className="col-12 col-md-5">
                            <div className="row">
                                <p>= {
                                    indexToken.info._tokens.map((token, index) => {
                                        return (
                                            <><b>{window.formatMoney(indexToken.percentages[token], 2)}%</b> <Coin address={token} /> { index !== indexToken.info._tokens.length - 1 && "+ " }</>
                                        )
                                    })
                                }</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="row">
                                <Link to={`/bazaar/dapp/${indexToken.address}`} className="btn btn-secondary btn-sm">Open</Link>
                            </div>
                        </div>
                        </> : <div className="col-12 justify-content-center">
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden"></span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>
    )
}

export default BazaarComponent;