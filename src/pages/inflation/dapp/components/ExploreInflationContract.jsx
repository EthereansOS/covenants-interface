import { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { FixedInflationComponent } from '../../../../components';
import { useLocation } from "react-router-dom";
import Loading from '../../../../components/shared/Loading';
import { Coin } from '../../../../components/shared';

const ExploreInflationContract = (props) => {

    const { dfoCore } = props;

    const [entries, setEntries] = useState([]);
    const [contract, setContract] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [executing, setExecuting] = useState(false);
    const [earnByInput, setEarnByInput] = useState(false);

    var paths = useLocation().pathname.split('/');

    useEffect(() => {
        getContractMetadata();
    }, []);

    const getContractMetadata = async () => {
        try {
            var contractAddress = paths[paths.length - 2];
            var entryId = paths[paths.length - 1];
            var contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("FixedInflationABI"), contractAddress);
            setContract(contract);
            var result = await contract.methods.entry(entryId).call();
            var entry = result[0];
            var operations = result[1].map(it => {
                var copy = {};
                Object.entries(it).forEach(entry => copy[entry[0]] = entry[1]);
                return copy;
            });
            for (var operation of operations) {
                if (operation.ammPlugin !== window.voidEthereumAddress) {
                    var ammContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), operation.ammPlugin);
                    operation.amm = {
                        contract: ammContract,
                        info: await ammContract.methods.info().call(),
                        data : await ammContract.methods.data().call()
                    }
                }
                var inputTokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), operation.inputTokenAddress);
                operation.inputToken = {
                    contract: inputTokenContract,
                    symbol: operation.amm && operation.enterInETH && operation.inputTokenAddress === operation.amm.data[0] ? "ETH" : await inputTokenContract.methods.symbol().call(),
                    decimals: operation.amm && operation.enterInETH && operation.inputTokenAddress === operation.amm.data[0] ? "18" : await inputTokenContract.methods.decimals().call(),
                    address: operation.amm && operation.enterInETH && operation.inputTokenAddress === operation.amm.data[0] ? window.voidEthereumAddress : operation.inputTokenAddress
                }
                for (var swapTokenIndex in operation.swapPath) {
                    var swapToken = operation.swapPath[swapTokenIndex = parseInt(swapTokenIndex)];
                    var tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), swapToken);
                    var data = {
                        contract: tokenContract,
                        symbol: await tokenContract.methods.symbol().call(),
                        decimals: await tokenContract.methods.decimals().call(),
                        address: swapToken
                    };
                    if(operation.amm && operation.exitInETH && swapTokenIndex === operation.swapPath.length - 1) {
                        data = {
                            contract: tokenContract,
                            symbol: swapToken === operation.amm.data[0] ? "ETH" : await tokenContract.methods.symbol().call(),
                            decimals: swapToken === operation.amm.data[0] ? "18" : await tokenContract.methods.decimals().call(),
                            address: swapToken === operation.amm.data[0] ? window.voidEthereumAddress : swapToken
                        }
                    }
                    (operation.swapTokens = operation.swapTokens || []).push(data);
                }
            }
            const period = Object.entries(dfoCore.getContextElement("blockIntervals")).filter(([key, value]) => value === entry.blockInterval);
            const oneHundred = await contract.methods.ONE_HUNDRED().call();
            const executorReward = (entry.callerRewardPercentage / oneHundred) * 100;
            var blockNumber = parseInt(await window.web3.eth.getBlockNumber());
            var nextBlock = parseInt(entry.lastBlock) + parseInt(entry.blockInterval);
            var extensionContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("FixedInflationExtensionABI"), await contract.methods.extension().call());
            var active = await extensionContract.methods.active().call();
            setMetadata({
                entry,
                name: entry.name,
                period: period[0],
                executorReward,
                operations,
                extension: await contract.methods.extension().call(),
                contractAddress: contract.options.address,
                executable: active && blockNumber >= nextBlock,
                active,
                contract,
                oneHundred
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function execute() {
        setExecuting(true);
        var error;
        try {
            var sendingOptions = { from: props.dfoCore.address };
            var method = contract.methods.execute([metadata.entry.id], [earnByInput]);
            var gasLimit = await method.estimateGas(sendingOptions);
            sendingOptions.gasLimit = gasLimit;
            await method.send(sendingOptions);
        } catch (e) {
            error = e;
        }
        setExecuting(false);
        error && alert(error.message);
    }

    return !metadata ? <Loading /> : <div className="explore-inflation-component">
        <div className="row mb-4 align-items-center">
            <div className="col-12">
                <h6>{metadata.entry.name}</h6>
            </div>
        </div>
        {metadata.executorReward !== "0%" && <div className="row">
            <div className="col-12">
                <b style={{ fontSize: 14 }} className="text-secondary mr-1">Executor reward: {window.formatMoney(metadata.executorReward)}% </b>
            </div>
        </div>}
        <div className="row mb-4 align-items-center">
            <div className="col-12">
                <h6>{metadata.operations.length} operations:</h6>
            </div>
        </div>
        {metadata.operations.map((operation, i) => {
            var amount = window.fromDecimals(operation.inputTokenAmount, operation.inputTokenAmountIsPercentage ? "18" : operation.inputToken.decimals, true);
            amount = !operation.inputTokenAmountIsPercentage ? amount : (parseFloat(amount) * 100);
            return <Fragment key={i}>
                <div className="row mb-4">
                    <div className="col-12">
                        {(i + 1)})
                        {"\u00a0"}
                        {operation.inputTokenAmountIsByMint ? "Mint" : "Transfer"}
                        {"\u00a0"}
                        {window.formatMoney(amount)}
                        {operation.inputTokenAmountIsPercentage ? "\u00a0% of " : ""}
                        {"\u00a0"}
                        {operation.inputToken.symbol}
                        <Coin address={operation.inputToken.address} className="ml-2" />
                        {operation.inputTokenAmountIsPercentage ? "\u00a0Supply" : ""}
                        {operation.ammPlugin !== window.voidEthereumAddress && <>
                            {"\u00a0"}
                            and swap for
                            {operation.swapTokens.map((swapToken, i) => <>
                                {swapToken.symbol}
                                <Coin address={swapToken.address} className="ml-2" />
                                {i !== operation.swapTokens.length - 1 && "\u00a0>\u00a0"}
                            </>)}
                        </>}
                    </div>
                </div>
                <div className="row mb-4">
                    <div className="col-4">
                        Sender: <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${metadata.extension}`}>{window.shortenWord(metadata.extension, 8)}</a>
                    </div>
                    <div className="col-4">
                        Receiver:
                        {operation.receivers.map((it, i) => {
                        var percentage = i === operation.receiversPercentages.length ? metadata.oneHundred : operation.receiversPercentages[i];
                        if (i === operation.receiversPercentages.length) {
                            for (var perc of operation.receiversPercentages) {
                                percentage = window.web3.utils.toBN(percentage).sub(window.web3.utils.toBN(perc)).toString();
                            }
                        }
                        return <Fragment key={it}>
                            {"\u00a0"}
                            <span>{window.formatMoney(parseFloat(window.fromDecimals(percentage, 18, true)) * 100)}%</span>
                            {"\u00a0"}
                            <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${it}`}>{window.shortenWord(it, 8)}</a>
                        </Fragment>
                    })}
                    </div>
                    {operation.ammPlugin !== window.voidEthereumAddress && <div className="col-2">
                        AMM: <a target="_blank" href={`${props.dfoCore.getContextElement("etherscanURL")}address/${operation.ammPlugin}`}>{operation.amm.info[0]} {operation.amm.info[1]}</a>
                    </div>}
                </div>
            </Fragment>
        })}
        <div className="row mb-4 align-items-center">
            <div className="col-12">
                {metadata.executable && <label>
                    Earn by input
                    <input type="checkbox" onChange={e => setEarnByInput(e.currentTarget.checked)} />
                </label>}
                {metadata.executable && !executing && <button className="btn btn-secondary btn-sm" onClick={execute}>Execute</button>}
                {executing && <Loading />}
            </div>
        </div>
    </div>;
}

const mapStateToProps = (state) => {
    return { dfoCore: state.core.dfoCore };
}

export default connect(mapStateToProps)(ExploreInflationContract);