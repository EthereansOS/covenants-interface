import { useState } from "react";

const LockedPositionComponent = (props) => {
    const { position, dfoCore, blockNumber, setup, setupInfo, setupTokens, rewardTokenInfo, lockedPositionReward, lockedPositionStatus, lpTokenInfo, lmContract, onComplete } = props;
    // booleans
    const [showTransfer, setShowTransfer] = useState(false);
    const [showUnlock, setShowUnlock] = useState(false);
    const [unlockLoading, setUnlockLoading] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);
    const [transferAddress, setTransferAddress] = useState("");

    console.log("position", position);
    let mainTokenIndex = 0;
    
    setupTokens.forEach((token, i) => {
        if (token.address === setupInfo.mainTokenAddress) {
            mainTokenIndex = i;
        }
    });

    const transferPosition = async () => {
        if (!transferAddress) return;
        setTransferLoading(false);
        try {
            const gasLimit = await lmContract.methods.transfer(transferAddress, position.positionId).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.transfer(transferAddress, position.positionId).send({ from: dfoCore.address, gasLimit });
            onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setTransferLoading(false);
        }

    }

    const unlockPosition = async () => {
        setUnlockLoading(true);
        try {
            !rewardTokenInfo.approval && await rewardTokenInfo.contract.methods.approve(lmContract.options.address, await rewardTokenInfo.contract.methods.totalSupply().call()).send({ from: dfoCore.address });
            const gasLimit = await lmContract.methods.unlock(position.positionId, false).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.unlock(position.positionId, false).send({ from: dfoCore.address, gasLimit });
            onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setUnlockLoading(false);
        }
    }

    const withdrawReward = async () => {
        setClaimLoading(true);
        try {
            const gasLimit = await lmContract.methods.withdrawReward(position.positionId).estimateGas({ from: dfoCore.address });
            const result = await lmContract.methods.withdrawReward(position.positionId).send({ from: dfoCore.address, gasLimit });
            onComplete();
        } catch (error) {
            console.error(error);
        } finally {
            setClaimLoading(false);
        }
    }

    return (
        <div className="LockedFarmPositions">
            <div className="FarmYou">
                <p><b>Position Weight</b>: {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(position.mainTokenAmount), setupTokens[mainTokenIndex].decimals), 4)} {rewardTokenInfo.symbol}</p>
                {
                    (parseInt(blockNumber) < parseInt(setup.endBlock) && !showUnlock) && <a onClick={() => setShowUnlock(true)} className="web2ActionBTN">Unlock</a>
                }
                {
                    showUnlock && <a onClick={() => setShowUnlock(false)} className="web2ActionBTN">Close</a>
                }
                {
                    showUnlock && <div>
                        <p><b>Give back</b>: {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(parseFloat(parseInt(position.reward) * (parseInt(setupInfo.penaltyFee) / 1e18)) + parseInt(lockedPositionStatus.partiallyRedeemed)), rewardTokenInfo.decimals), 4)} {setupTokens[mainTokenIndex].symbol} - {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(position.liquidityPoolTokenAmount), lpTokenInfo.decimals), 4)} {/* farmTokenSymbol */"fLP"}</p>
                        <p><b>Balance</b>: {window.formatMoney(dfoCore.toDecimals(rewardTokenInfo.balance, rewardTokenInfo.decimals), 4)} {rewardTokenInfo.symbol}</p>
                        <p><b>LP tokens unlocked</b>: {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(position.liquidityPoolTokenAmount), lpTokenInfo.decimals), 4)} {lpTokenInfo.symbol}</p>
                        {
                            unlockLoading ? <a className="Web3ActionBTN" disabled={unlockLoading}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </a> : parseInt(blockNumber) < parseInt(setup.endBlock) ? <a onClick={() => unlockPosition()} className="Web3ActionBTN">Unlock</a> : <></>
                        }
                    </div>
                }
            </div>
            <div className="Farmed">
                <p><b>Unclaimed</b>: {window.formatMoney(dfoCore.toDecimals(dfoCore.toFixed(lockedPositionReward), rewardTokenInfo.decimals), 4)} {rewardTokenInfo.symbol}</p>
                {
                    !showTransfer ? <a onClick={() => setShowTransfer(true)} className="web2ActionBTN">Transfer</a> : <a onClick={() => setShowTransfer(false)} className="web2ActionBTN">Close</a>
                }
                {
                    claimLoading ? <a className="web2ActionBTN" disabled={claimLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a> : <a onClick={() => withdrawReward()} className="web2ActionBTN">Claim</a>
                }
                {
                    showTransfer && <div>
                        <input type="text" className="TextRegular" placeholder="Position receiver" value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} id="transferAddress" />
                        {
                            transferLoading ? <a className="Web3ActionBTN" disabled={transferLoading}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </a> : <a onClick={() => transferPosition()} className="Web3ActionBTN">Transfer</a>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default LockedPositionComponent;