import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import defaultLogoImage from '../../../../assets/images/default-logo.png';
import { ApproveButton, Coin, Input, TokenInput } from '../../../../components/shared';
import { addTransaction } from '../../../../store/actions';
import { ethers } from 'ethers';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../../../components/shared/Loading';

const abi = new ethers.utils.AbiCoder();

const ExploreIndexToken = (props) => {
    const { address } = useParams();
    const [metadata, setMetadata] = useState(null);
    const [action, setAction] = useState('mint');
    const [mintValue, setMintValue] = useState(0);
    const [burnValue, setBurnValue] = useState(0);
    const [mintResult, setMintResult] = useState(null);
    const [burnResult, setBurnResult] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mintLoading, setMintLoading] = useState(false);
    const [burnLoading, setBurnLoading] = useState(false);
    const [mintByEth, setMintByEth] = useState(false);
    const [swapForEthValues, setSwapForEthValues] = useState([]);
    const [amms, setAmms] = useState([]);
    const [selectedAmmIndex, setSelectedAmmIndex] = useState(null);
    const [mintByEthLoading, setMintByEthLoading] = useState(false);
    const [mintByEthError, setMintByEthError] = useState(false);
    const [indexPresto, setIndexPresto] = useState(null);

    useEffect(async () => {
        getContractMetadata();
        setIndexPresto(await props.dfoCore.getContract(props.dfoCore.getContextElement("IndexPrestoABI"), props.dfoCore.getContextElement("indexPrestoAddress")));
        var amms = [];
        const ammAggregator = await props.dfoCore.getContract(props.dfoCore.getContextElement('AMMAggregatorABI'), props.dfoCore.getContextElement('ammAggregatorAddress'));
        var ammAddresses = await ammAggregator.methods.amms().call();
        for (var address of ammAddresses) {
            var contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("AMMABI"), address);
            var amm = {
                address,
                contract,
                info: await contract.methods.info().call(),
                data: await contract.methods.data().call()
            }
            amm.data[2] && amms.push(amm);
        }
        setSelectedAmmIndex(0);
        var uniswap = amms.filter(it => it.info[0] === 'UniswapV2')[0];
        var index = amms.indexOf(uniswap);
        amms.splice(index, 1);
        amms.unshift(uniswap);
        setAmms(amms);
    }, []);

    useEffect(() => {
        mintByEth && calculateByEth(selectedAmmIndex);
    }, [mintResult]);

    const getContractMetadata = async () => {
        setLoading(true);
        try {
            const indexContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IndexABI'), props.dfoCore.getContextElement('indexAddress'));
            const interoperableContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IEthItemInteroperableInterfaceABI'), address);
            const objectId = await interoperableContract.methods.objectId().call();
            const mainInterface = await interoperableContract.methods.mainInterface().call();
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IEthItemABI'), mainInterface);
            const info = await indexContract.methods.info(objectId, 0).call();
            const name = await contract.methods.name(objectId).call();
            const symbol = await contract.methods.symbol(objectId).call();
            const indexDecimals = await contract.methods.decimals(objectId).call();
            const balanceOf = await contract.methods.balanceOf(props.dfoCore.address, objectId).call();
            const totalSupply = await contract.methods.totalSupply(objectId).call();
            setBalance(window.formatMoney(props.dfoCore.toDecimals(balanceOf, indexDecimals), 4));
            const uri = await contract.methods.uri(objectId).call();
            let res = { data: { description: '', image: '' } };
            try {
                res = await axios.get(uri);
            } catch (error) {
                console.log('error while reading metadata from ipfs..')
            }
            let total = 0;
            let valueLocked = 0;
            await Promise.all(info._amounts.map(async (amount, index) => {
                try {
                    const token = info._tokens[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    const decimal = await tokenContract.methods.decimals().call();
                    try {
                        const res = await axios.get(props.dfoCore.getContextElement('coingeckoCoinPriceURL') + token);
                        const { data } = res;
                        const tokenPrice = data[token.toLowerCase()].usd;
                        let value = parseFloat(props.dfoCore.toDecimals(amount, decimal)) * tokenPrice;
                        total += value;
                        valueLocked += value * parseFloat(props.dfoCore.toDecimals(totalSupply, indexDecimals));
                    } catch (err) {
                        let val = parseFloat(props.dfoCore.toDecimals(amount, decimal));
                        total += val;
                        valueLocked += val * parseFloat(props.dfoCore.toDecimals(totalSupply, indexDecimals));
                    }
                } catch (error) {
                    console.error(error);
                }
            }))
            const percentages = {};
            const symbols = {};
            const decimals = {};
            const approvals = {};
            const contracts = {};
            const balances = {};
            await Promise.all(info._tokens.map(async (token, index) => {
                try {
                    const amount = info._amounts[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    const symbol = await tokenContract.methods.symbol().call();
                    const decimal = await tokenContract.methods.decimals().call();
                    const approval = await tokenContract.methods.allowance(props.dfoCore.address, indexContract.options.address).call();
                    const balance = await tokenContract.methods.balanceOf(props.dfoCore.address).call();
                    const amountDecimals = props.dfoCore.toDecimals(amount.toString(), decimal);
                    try {
                        const res = await axios.get(props.dfoCore.getContextElement('coingeckoCoinPriceURL') + token);
                        const { data } = res;
                        const tokenPrice = data[token.toLowerCase()].usd;
                        percentages[token] = ((parseFloat(amountDecimals) * tokenPrice) / parseInt(total)) * 100;
                    } catch (error) {
                        // percentages[token] = ((parseFloat(amountDecimals)) / parseInt(total)) * 100;
                        percentages[token] = 0;
                    }
                    symbols[token] = symbol;
                    decimals[token] = decimal;
                    approvals[token] = parseInt(approval) > 0;
                    contracts[token] = tokenContract;
                    balances[token] = balance;
                } catch (error) {
                    console.error(error);
                }
            }));
            setMetadata({ name, symbol, symbols, mainInterface, uri, valueLocked, totalSupply, balances, ipfsInfo: res.data, info, objectId, interoperableContract, indexDecimals, percentages, contract, indexContract, decimals, approvals, contracts });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onTokenApproval = (token) => {
        setMetadata({
            ...metadata,
            approvals: {
                ...metadata.approvals,
                token: true,
            }
        })
    }

    const onMintUpdate = async (value) => {
        if (!value || parseFloat(value) === 0) {
            setMintValue(0);
            return;
        }
        const info = await metadata.indexContract.methods.info(metadata.objectId, props.dfoCore.toFixed(parseFloat(value) * 10 ** metadata.indexDecimals).toString()).call();
        var infoData = { ...info, symbols: [] };
        for (var tokenAddress of info[0]) {
            var contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), tokenAddress);
            infoData.symbols.push(await contract.methods.symbol().call());
        }
        setMintResult(infoData);
        setMintValue(value);
    }

    const mint = async () => {
        const tkns = metadata.info._tokens.map((token, index) => { return { approval: metadata.approvals[token], index, token } });
        const unapproved = tkns.filter((tkn) => !tkn.approval);
        if (!mintByEth && (mintValue === 0 || unapproved.length > 0 || !mintValue)) return;
        setMintLoading(true);
        try {
            if (!mintByEth) {
                console.log(`minting ${props.dfoCore.toFixed(parseFloat(mintValue) * 10 ** metadata.indexDecimals).toString()}`)
                const gas = await metadata.indexContract.methods.mint(metadata.objectId, props.dfoCore.toFixed(parseFloat(mintValue) * 10 ** metadata.indexDecimals).toString(), props.dfoCore.address).estimateGas({ from: props.dfoCore.address });
                const result = await metadata.indexContract.methods.mint(metadata.objectId, props.dfoCore.toFixed(parseFloat(mintValue) * 10 ** metadata.indexDecimals).toString(), props.dfoCore.address).send({ from: props.dfoCore.address, gas })
                props.addTransaction(result);
            } else {
                var ethValue = "0";
                var operations = [];
                var amm = amms[selectedAmmIndex];
                var ethereumAddress = amm.data[0];
                for (var i in swapForEthValues) {
                    var data = swapForEthValues[i];
                    operations.push({
                        inputTokenAddress: ethereumAddress,
                        inputTokenAmount: data.ethereumValue,
                        ammPlugin: amm.contract.options.address,
                        liquidityPoolAddresses: [data.liquidityPoolAddress],
                        swapPath: [data.tokenAddress],
                        enterInETH: true,
                        exitInETH: false,
                        receivers: [indexPresto.options.address],
                        receiversPercentages: []
                    });
                    ethValue = props.dfoCore.web3.utils.toBN(ethValue).add(props.dfoCore.web3.utils.toBN(data.ethereumValue)).toString();
                }
                var sendingOptions = { from: props.dfoCore.address, value: ethValue };
                var method = indexPresto.methods.mint(
                    props.dfoCore.getContextElement("prestoAddress"),
                    operations,
                    metadata.indexContract.options.address,
                    metadata.objectId,
                    props.dfoCore.toFixed(parseFloat(mintValue) * 10 ** metadata.indexDecimals).toString(),
                    props.dfoCore.address
                );
                sendingOptions.gasLimit = await method.estimateGas(sendingOptions);
                var result = await method.send(sendingOptions);
                props.addTransaction(result);
            }
        } catch (error) {
            console.error(error)
        } finally {
            await getContractMetadata();
            setMintLoading(false);
        }
    }

    async function onByEth(e) {
        setMintByEth(e.target.checked);
        e.target.checked && onMintUpdate(mintValue || 0);
        e.target.checked && calculateByEth(selectedAmmIndex);
    }

    function onAmmChange(e) {
        setSelectedAmmIndex(parseInt(e.target.value));
        calculateByEth(e.target.value);
    }

    async function calculateByEth(ammIndex) {
        window.inputTimeout && clearTimeout(window.inputTimeout);
        setSwapForEthValues([]);
        setMintByEthError(false);
        setMintByEthLoading(false);
        if (!mintResult) {
            return;
        }
        window.inputTimeout = setTimeout(async () => {
            setSwapForEthValues([]);
            setMintByEthError(false);
            setMintByEthLoading(true);
            var amm = amms[ammIndex];
            var ethereumAddress = amm.data[0];
            async function calculateEthereumPrices(tokenAddress, tokenValue) {
                var liquidityPoolAddress = (await amm.contract.methods.byTokens([ethereumAddress, tokenAddress]).call())[2];
                var data = await amm.contract.methods.getSwapOutput(tokenAddress, tokenValue, [liquidityPoolAddress], [ethereumAddress]).call();
                data = await amm.contract.methods.getSwapOutput(ethereumAddress, data[1], [liquidityPoolAddress], [tokenAddress]).call();
                var ethereumValue;
                var multiplier = parseInt(tokenValue) / parseInt(data[1]);
                while (props.dfoCore.web3.utils.toBN(tokenValue).gt(props.dfoCore.web3.utils.toBN(data[1]))) {
                    var oldEthereumValue = ethereumValue;
                    ethereumValue = window.numberToString(parseInt(ethereumValue || data[0]) * multiplier).split('.')[0].split(',').join('');
                    if (multiplier === 1 || (oldEthereumValue && props.dfoCore.web3.utils.toBN(oldEthereumValue).gte(props.dfoCore.web3.utils.toBN(ethereumValue)))) {
                        ethereumValue = props.dfoCore.web3.utils.toBN(oldEthereumValue || ethereumValue).add(props.dfoCore.web3.utils.toBN(10000)).toString();
                    }
                    data = await amm.contract.methods.getSwapOutput(ethereumAddress, ethereumValue, [liquidityPoolAddress], [tokenAddress]).call();
                    multiplier = parseInt(tokenValue) / parseInt(data[1]);
                    console.log(ethereumValue, tokenValue, data[1]);
                }
                return { ethereumValue, liquidityPoolAddress, tokenAddress };
            }
            var swapForEthValues = [];
            try {
                for (var i in mintResult[0]) {
                    swapForEthValues.push(await calculateEthereumPrices(mintResult[0][i], mintResult[1][i]));
                }
                setSwapForEthValues(swapForEthValues);
            } catch (e) {
                console.error(e);
                setMintByEthError(true);
            } finally {
                setMintByEthLoading(false);
            }
        }, 350);
    }

    const getMint = () => {
        const tkns = metadata.info._tokens.map((token, index) => { return { approval: metadata.approvals[token], index, token } });
        const unapproved = tkns.filter((tkn) => !tkn.approval);
        return <div className="InputTokensRegular">
            <div className="InputTokenRegular">
                <Input step={0.0001} showBalance={false} tokenImage={metadata.ipfsInfo.image} address={address} min={0} value={mintValue} onChange={(e) => onMintUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />
            </div>
            <div className="QuestionRegular">
            <label className="PrestoSelector">
            <span>From ETH</span>
                <input type="checkbox" checked={mintByEth} onChange={onByEth} />
            </label>
            </div>
            {mintByEth && <div className="QuestionRegular">
                {amms.length > 0 && <select className="SelectRegular" value={selectedAmmIndex.toString()} onChange={onAmmChange}>
                    {amms.map((it, i) => <option key={it.address} value={i}>{it.info[0]}</option>)}
                </select>}
            </div>}
            {mintByEth && mintByEthLoading && <Loading />}
            {mintByEth && <div className="FromETHPrestoDesc">
                {swapForEthValues.map((it, i) => <div key={it.tokenAddress}>
                <p>Swapping for {window.fromDecimals(it.ethereumValue, 18)} ETH <Coin address={window.voidEthereumAddress} /> for {window.fromDecimals(mintResult[1][i], 18)} {mintResult.symbols[i]} <Coin address={mintResult[0][i]} />
                </p></div>)}
                {mintByEthError && <h6>Insufficient liquidity in the selected AMM</h6>}
            </div>}
            {!mintByEth && mintValue > 0 && <div className="ShowCollateralNeededBal"><h6>Needed:</h6> {mintResult._tokens.map((token, index) => <p>{window.formatMoney(props.dfoCore.toDecimals(mintResult._amounts[index], metadata.decimals[token], 2))} {metadata.symbols[token]}</p>)}</div>}
            {!mintByEth && <div className="ShowCollateralNeededBal">
                <h6>Balances:</h6>
                {
                    metadata.info._tokens.map((token, index) => {
                        return (
                            <p>{window.formatMoney(props.dfoCore.toDecimals(metadata.balances[token], metadata.decimals[token]), 4)} {metadata.symbols[token]}</p>
                        )
                    })
                }
            </div>}
            <div className="Web3BTNs">
                {
                    !mintByEth && unapproved.length > 0 && <ApproveButton contract={metadata.contracts[unapproved[0].token]} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("indexAddress")} onError={(error) => console.error(error)} onApproval={(res) => onTokenApproval(unapproved[0].token)} text={`Approve ${metadata.symbols[unapproved[0].token]}`} />
                }
                {
                    mintLoading ? <a className="Web3ActionBTN" disabled={mintLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a> : <a className="Web3ActionBTN" disabled={!mintByEth && (mintValue === 0 || unapproved.length > 0)} onClick={() => mint()}>Mint</a>
                }
            </div>
        </div>
    }

    const burn = async () => {
        if (burnValue === 0 || !burnValue) return;
        setBurnLoading(true);
        var value = window.toDecimals(burnValue, metadata.indexDecimals);
        console.log(burnValue, value, metadata.decimals);
        var payload = "0x";
        payload = window.web3.eth.abi.encodeParameter("address", props.dfoCore.address);
        payload = abi.encode(["bytes[]"], [[payload]]);
        try {
            const indexCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), props.dfoCore.getContextElement('indexCollectionAddress'));
            var indexAddress = props.dfoCore.getContextElement("indexAddress");
            var sendingOptions = { from: props.dfoCore.address };
            var method = indexCollection.methods.safeBatchTransferFrom(props.dfoCore.address, indexAddress, [metadata.objectId], [value], payload);
            sendingOptions.gasLimit = await method.estimateGas({ from: props.dfoCore.address });
            const result = await method.send(sendingOptions);
            props.addTransaction(result);
        } catch (error) {
            console.error(error)
            alert(error.message || error);
        } finally {
            await getContractMetadata();
            setBurnLoading(false);
        }
    }

    const onBurnUpdate = async (value) => {
        if (!value || parseFloat(value) === 0) {
            setBurnValue(0);
            return;
        }
        const info = await metadata.indexContract.methods.info(metadata.objectId, props.dfoCore.toFixed(parseFloat(value) * 10 ** metadata.indexDecimals).toString()).call();
        setBurnResult(info);
        setBurnValue(value);
    }

    const getBurn = () => {
        return <div className="InputTokensRegular">
            <div className="InputTokenRegular">
                <Input address={address} tokenImage={metadata.ipfsInfo.image} step={0.0001} showBalance={true} balance={balance} min={0} showMax={true} value={burnValue} onChange={(e) => onBurnUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />
            </div>
            {burnValue > 0 && <div className="ShowCollateralNeededBal"><h6>for</h6> {burnResult._tokens.map((token, index) => <p>{window.formatMoney(props.dfoCore.toDecimals(burnResult._amounts[index], metadata.decimals[token], 2))} {metadata.symbols[token]}</p>)}</div>}
            <div className="Web3BTNs">
                {
                    burnLoading ? <a className="Web3ActionBTN" disabled={burnLoading}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </a> : <a className="Web3ActionBTN" disabled={parseFloat(burnValue) === 0} onClick={() => burn()}>Burn</a>
                }
            </div>
        </div>
    }

    const getContent = () => {

        return (
            <>
                <div className="IndexContractOpenInfo">
                    <Link to={"/bazaar/dapp"} className="web2ActionBTN">Close</Link>
                    <figure className="IndexLogoL">
                        <img src={metadata.ipfsInfo.image || defaultLogoImage} />
                    </figure>
                    <div className="IndexThings">
                        <h3><b>{metadata.name} ({metadata.symbol})</b></h3>
                        <p>{metadata.ipfsInfo.description}</p>
                        <div className="StatsLink">
                            <a target="_blank" href={`https://etherscan.io/token/${metadata.mainInterface}`}>Etherscan</a>
                            <a target="_blank" href={`https://ethitem.com/?interoperable=${address}`}>ITEM</a>
                            <a target="_blank" href={`https://info.uniswap.org/token/${address}`}>Uniswap</a>
                            <a target="_blank" href={`https://mooniswap.info/token/${address}`}>Mooniswap</a>
                            <a target="_blank" href={`https://sushiswap.fi/token/${address}`}>Sushiswap</a>
                        </div>
                    </div>
                </div>
                <div className="IndexContractOpenStatistic">
                    <p><b>Supply:</b> {window.formatMoney(props.dfoCore.toDecimals(metadata.totalSupply, metadata.indexDecimals), 2)} {metadata.symbol}</p>
                    <p><b>Total Value Locked:</b> ${window.formatMoney(metadata.valueLocked, 2)}</p>
                </div>
                <div className="IndexContractOpenCollateral">
                    <h6>1 {metadata.symbol} is mintable by:</h6>
                    <div className="IndexContractOpenCollateralALL">
                        {/*@todoB - Allocation % logic based on coingecko prices */}
                        {
                            metadata.info._tokens.map((token, index) => {
                                return (
                                    <div className="IndexContractOpenCollateralSingle">
                                        <div className="IndexContractOpenCollateralSingleTITLE">
                                            <p>{window.formatMoney(props.dfoCore.toDecimals(metadata.info._amounts[index], metadata.decimals[token]), 2)} {metadata.symbols[token]} </p>
                                            <Coin address={token} />
                                            <div className="IndexSinglePerchBar">
                                                <aside style={{ width: metadata.percentages[token] + "%" }} >
                                                    <span>{window.formatMoney(metadata.percentages[token], 0)}%</span>
                                                </aside>
                                            </div>
                                        </div>
                                        <div className="StatsLink">
                                            <a target="_blank" href={"https://etherscan.io/token/" + [token]}>Etherscan</a>
                                            <a target="_blank" href={"https://info.uniswap.org/token/" + [token]}>Uniswap</a>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="IndexManageMB">
                    <select className="SelectRegular" onChange={(e) => setAction(e.target.value)}>
                        <option value="mint">Mint</option>
                        <option value="burn">Burn</option>
                    </select>
                    {action === "mint" && getMint()}
                    {action === "burn" && getBurn()}
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <div className="explore-index-token-component">
                <div className="col-12 justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="explore-index-token-component">
            {metadata ? getContent() :
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTransaction: (index) => dispatch(addTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreIndexToken);