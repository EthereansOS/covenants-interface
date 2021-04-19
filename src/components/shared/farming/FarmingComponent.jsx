import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';

const FarmingComponent = (props) => {
    const { className, goBack, metadata, dfoCore, withoutBack } = props;
    const symbol = metadata.name.replace("Farm ", "");

    return (
        <div className={className}>
            {
                metadata ? <>
                <div className="FarmTitle">
                    <figure>
                        { metadata.rewardTokenAddress !== dfoCore.voidEthereumAddress ? <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}token/${metadata.rewardTokenAddress}`} ><Coin height={45} address={metadata.rewardTokenAddress} /></a> : <Coin height={45} address={metadata.rewardTokenAddress} />}
                    </figure>
                    <aside>
                        <h6>{window.dfoCore.isItemSync(metadata.rewardTokenAddress) && <b> {metadata.contractAddress}</b>} {!window.dfoCore.isItemSync(metadata.rewardTokenAddress) && <b> {metadata.name}</b>} {(metadata.freeSetups.length + metadata.lockedSetups.length === 0 && !metadata.canActivateSetup) ? <span className="text-danger"><b>(inactive)</b></span> : <></> }</h6>
                        { !withoutBack && <Link to={ goBack ? `/farm/dapp/` : `/farm/dapp/${metadata.contractAddress}`} className={ goBack ? "backActionBTN" : "web2ActionBTN" }>{ goBack ? "Back" : "Open" }</Link>}
                    </aside>
                </div>
                <div className="FarmThings">
                        <p><b>Daily Rate</b>: {metadata.rewardPerBlock * 6400} {symbol}</p>
                        <p><b>Active Setups</b>: {metadata.freeSetups.length + metadata.lockedSetups.length} </p>
                        <div className="StatsLink">
                            {window.dfoCore.isItemSync(metadata.rewardTokenAddress) && <a className="specialITEMlink" target="_blank" href={props.dfoCore.getContextElement("itemURLTemplate").format(metadata.rewardTokenAddress)}> ITEM</a> }
                            <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${metadata.contractAddress}`}>Contract</a>
                            <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${metadata.fullhost}`}>Host</a>
                            <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${metadata.fullExtension}`}>Extension</a>
                        </div>
                </div>
                {goBack && <>
                    <div className="FarmThings">
                        
                    </div>
                </>}
                </> : <div className="col-12 justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            }
        </div>
    )
}

export default FarmingComponent;