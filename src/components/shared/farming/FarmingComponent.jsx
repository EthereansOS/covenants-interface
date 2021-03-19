import Coin from '../coin/Coin';
import { Link } from 'react-router-dom';

const FarmingComponent = (props) => {
    const { className, goBack, metadata, dfoCore } = props;
    const symbol = metadata.name.replace("Farm ", "");

    return (
        <div className={className}>
            {
                metadata ? <>
                <div className="FarmTitle">
                    <figure>
                        { metadata.rewardTokenAddress !== dfoCore.voidEthereumAddress ? <a target="_blank" href={`https://etherscan.io/address/${metadata.rewardTokenAddress}`} ><Coin height={45} address={metadata.rewardTokenAddress} /></a> : <Coin height={45} address={metadata.rewardTokenAddress} />}
                    </figure>
                    <aside>
                        <h6><b>{metadata.name}</b> {(metadata.freeSetups.length + metadata.lockedSetups.length === 0 && !metadata.canActivateSetup) ? <span className="text-danger"><b>(inactive)</b></span> : <></> }</h6>
                        <Link to={ goBack ? `/farm/dapp/` : `/farm/dapp/${metadata.contractAddress}`} className={ goBack ? "backActionBTN" : "web2ActionBTN" }>{ goBack ? "Back" : "Open" }</Link>
                    </aside>
                </div>
                <div className="FarmThings">
                        <p><b>Tot Rewards/Day</b>: {metadata.rewardPerBlock * 6400} {symbol}</p>
                        {/*<p><b>APY</b>: 20%</p> If 0 (no coingecko Info) insert "Not Available"*/}
                        <p><b>Active Setups</b>: {metadata.freeSetups.length + metadata.lockedSetups.length} </p>
                        {goBack && <>
                            <p><b>Contract</b>: <a target="_blank" href={`https://etherscan.io/address/${metadata.contractAddress}`}>{metadata.farmAddress}</a></p>
                            <p><b>Host</b>: <a target="_blank" href={`https://etherscan.io/address/${metadata.fullhost}`}>{metadata.host}</a></p>
                            <p><b>Extension</b>: <a target="_blank" href={`https://etherscan.io/address/${metadata.fullExtension}`}>{metadata.extension}</a></p>
                        </>}
                        {/*(Deprecated)<p><b>Setups</b>: {metadata.totalFreeSetups} free | {metadata.totalLockedSetups} locked</p>*/}
                        {/*<p><b>Host</b>: <a target="_blank" href={"https://etherscan.io/address/" + metadata.fullhost}>{metadata.host}</a></p>*/}
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