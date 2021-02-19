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

    useEffect(() => {
        getContractMetadata()
    }, []);

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
            const valueLocked = 0;
            await Promise.all(info._amounts.map(async (amount, index) => {
                try {
                    const token = info._tokens[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    const decimal = await tokenContract.methods.decimals().call();
                    const res = await axios.get(props.dfoCore.getContextElement('coingeckoCoinPriceURL') + token);
                    const data = res.data();
                    const tokenPrice = data[token].usd;
                    const value = parseFloat(props.dfoCore.toDecimals(amount, decimal)) * tokenPrice;
                    total += value;
                    valueLocked += value * parseFloat(props.dfoCore.toDecimals(totalSupply, indexDecimals));
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
                        const data = res.data();
                        const tokenPrice = data[token].usd;
                        percentages[token] = ((parseFloat(amountDecimals) * tokenPrice) / parseInt(total)) * 100;
                    } catch (error) {
                        console.error(error);
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

    const onMintUpdate = async (value) => {
        if (!value || parseFloat(value) === 0) {
            setMintValue(0);
            return;
        }
        const info = await metadata.indexContract.methods.info(metadata.objectId, props.dfoCore.toFixed(parseFloat(value) * 10**metadata.indexDecimals).toString()).call();
        setMintResult(info);
        setMintValue(value);
    }

    const mint = async () => {
        const tkns = metadata.info._tokens.map((token, index) => { return { approval: metadata.approvals[token], index, token } });
        const unapproved = tkns.filter((tkn) => !tkn.approval);
        if (mintValue === 0 || unapproved.length > 0 || !mintValue) return;
        setLoading(true);
        try {
            const gas = await metadata.indexContract.methods.mint(metadata.objectId, props.dfoCore.toFixed(parseFloat(mintValue) * 10**metadata.indexDecimals).toString(), props.dfoCore.address).estimateGas({ from: props.dfoCore.address });
            const result = await metadata.indexContract.methods.mint(metadata.objectId, props.dfoCore.toFixed(parseFloat(mintValue) * 10**metadata.indexDecimals).toString(), props.dfoCore.address).send({ from: props.dfoCore.address, gas })
            props.addTransaction(result);
        } catch (error) {
            console.error(error)
        } finally {
            await getContractMetadata();
            setLoading(false);
        }
    }

    const getMint = () => {
        const tkns = metadata.info._tokens.map((token, index) => { return { approval: metadata.approvals[token], index, token } });
        const unapproved = tkns.filter((tkn) => !tkn.approval);
        return <div className="InputTokensRegular">
                <div className="InputTokenRegular">
                <Input step={0.0001} showBalance={false} balance={balance} address={address} min={0} value={mintValue} onChange={(e) => onMintUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />
            </div>
                {
                    mintValue > 0 && <div className="ShowCollateralNeededBal"><h6>Needed:</h6> {mintResult._tokens.map((token, index) => <p>{window.formatMoney(props.dfoCore.toDecimals(mintResult._amounts[index], metadata.decimals[token], 2))} {metadata.symbols[token]}</p>)}</div>
                }
            <div className="ShowCollateralNeededBal">
            <h6>Balances:</h6>
            {
                metadata.info._tokens.map((token, index) => {
                    return (
                            <p>{window.formatMoney(metadata.balances[token], 4)} {metadata.symbols[token]}</p>
                    )
                })
            }
            </div>
            <div className="Web3BTNs">
                {
                    unapproved.length > 0 && <ApproveButton contract={metadata.contracts[unapproved[0].token]} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("indexAddress")} onError={(error) => console.error(error)} onApproval={(res) => getContractMetadata()} text={`Approve ${metadata.symbols[unapproved[0].token]}`}  /> 
                }
                    <a className="Web3ActionBTN" disabled={mintValue === 0 || unapproved.length > 0} onClick={() => mint()}>Mint</a> 
            </div>
        </div>
    }

    const burn = async () => {
        if (burnValue === 0 || !burnValue) return;
        setLoading(true);
        try {
            const gas = await metadata.contract.methods.safeBatchTransferFrom(props.dfoCore.address, metadata.indexContract.options.address, [metadata.objectId], [props.dfoCore.toFixed(parseFloat(burnValue) * 10**metadata.indexDecimals).toString()], abi.encode(["address[]"], [[props.dfoCore.address]])).estimateGas({ from: props.dfoCore.address });
            const result = await metadata.contract.methods.safeBatchTransferFrom(props.dfoCore.address, metadata.indexContract.options.address, [metadata.objectId], [props.dfoCore.toFixed(parseFloat(burnValue) * 10**metadata.indexDecimals).toString()], abi.encode(["address[]"], [[props.dfoCore.address]])).send({ from: props.dfoCore.address, gas })
            props.addTransaction(result);
        } catch (error) {
            console.error(error)
        } finally {
            await getContractMetadata();
            setLoading(false);
        }
    }

    const onBurnUpdate = async (value) => {
        if (!value || parseFloat(value) === 0) {
            setBurnValue(0);
            return;
        }
        const info = await metadata.indexContract.methods.info(metadata.objectId, props.dfoCore.toFixed(parseFloat(value) * 10**metadata.indexDecimals).toString()).call();
        setBurnResult(info);
        setBurnValue(value);
    }

    const getBurn = () => {
        return <div className="InputTokensRegular">
        <div className="InputTokenRegular">
                <Input address={address} step={0.0001} showBalance={true} balance={balance} min={0} showMax={true} value={burnValue} onChange={(e) => onBurnUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />

            </div>
                {
                    burnValue > 0 && <div className="ShowCollateralNeededBal"><h6>for</h6> {burnResult._tokens.map((token, index) => <p>{window.formatMoney(props.dfoCore.toDecimals(burnResult._amounts[index], metadata.decimals[token], 2))} {metadata.symbols[token]}</p>)}</div>
                }
            <div className="Web3BTNs">

                    <a className="Web3ActionBTN" disabled={parseFloat(burnValue) === 0} onClick={() => burn()}>Burn</a> 
            </div>
        </div>
    }

    const getContent = () => {
        
        return (
            <>
            <div className="IndexContractOpenInfo">
                <Link to={"/bazaar/dapp"} className="web2ActionBTN">Close</Link>
                <figure className="IndexLogoL">
                    <img src={metadata.ipfsInfo.image || defaultLogoImage}/>
                </figure>
                <div className="IndexThings">
                        <h3><b>{ metadata.name} ({metadata.symbol})</b></h3>
                        <p>{ metadata.ipfsInfo.description }</p> 
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
                <p><b>Supply:</b> {window.formatMoney(props.dfoCore.toDecimals(metadata.totalSupply, metadata.indexDecimals), 2)} { metadata.symbol }</p>
                <p><b>Total Value Locked:</b> ${window.formatMoney(metadata.valueLocked, 2)}</p>
            </div>
            <div className="IndexContractOpenCollateral">
                <h6>1 { metadata.symbol } is mintable by:</h6>
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
                                                <aside style={{width: metadata.percentages[token] + "%"}} >
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
                {
                    action === "mint" && getMint()
                }
                {
                    action === "burn" && getBurn()
                }
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
        {
            metadata ? getContent() :
            <div className="row">
                <div className="col-12 justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                </div>
            </div>
        }
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