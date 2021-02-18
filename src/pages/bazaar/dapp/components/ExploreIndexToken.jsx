import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import defaultLogoImage from '../../../../assets/images/default-logo.png';
import { ApproveButton, Coin, Input, TokenInput } from '../../../../components/shared';
import { addTransaction } from '../../../../store/actions';
import { ethers } from 'ethers';
import axios from 'axios';

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
            setBalance(props.dfoCore.toDecimals(balanceOf, indexDecimals));
            const uri = await contract.methods.uri(objectId).call();
            let res = { data: { description: '', image: '' } };
            try {
                res = await axios.get(uri);
            } catch (error) {
                console.log('error while reading metadata from ipfs..')
            }
            let total = 0;
            await Promise.all(info._amounts.map(async (amount) => total += parseInt(amount)));
            const percentages = {};
            const symbols = {};
            const decimals = {};
            const approvals = {};
            const contracts = {};
            await Promise.all(info._tokens.map(async (token, index) => {
                try {
                    const amount = info._amounts[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    percentages[token] = (parseInt(amount) / parseInt(total)) * 100;
                    const symbol = await tokenContract.methods.symbol().call();
                    const decimal = await tokenContract.methods.decimals().call();
                    const approval = await tokenContract.methods.allowance(props.dfoCore.address, indexContract.options.address).call();
                    symbols[token] = symbol;
                    decimals[token] = decimal;
                    approvals[token] = parseInt(approval) > 0;
                    contracts[token] = tokenContract;
                } catch (error) {
                    console.error(error);
                }
            }));
            setMetadata({ name, symbol, symbols, uri, ipfsInfo: res.data, info, objectId, interoperableContract, indexDecimals, percentages, contract, indexContract, decimals, approvals, contracts });
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
        return <div className="col-md-9 col-12">
            <div className="row">
                <Input step={0.0001} address={address} min={0} value={mintValue} onChange={(e) => onMintUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />
            </div>
            <div className="row">
                {
                    mintValue > 0 && <p>by {mintResult._tokens.map((token, index) => `${window.formatMoney(props.dfoCore.toDecimals(mintResult._amounts[index], metadata.decimals[token], 2))} ${metadata.symbols[token]} `)}</p>
                }
            </div>
            <div className="row">
                {
                    unapproved.length > 0 && <ApproveButton contract={metadata.contracts[unapproved[0].token]} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("indexAddress")} onError={(error) => console.error(error)} onApproval={(res) => getContractMetadata()} text={`Approve ${metadata.symbols[unapproved[0].token]}`}  /> 
                }
                <div className="col">
                    <button className="btn btn-secondary" disabled={mintValue === 0 || unapproved.length > 0} onClick={() => mint()}>Mint</button> 
                </div>
            </div>
        </div>
    }

    const burn = async () => {
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
        return <div className="col-md-9 col-12">
            <div className="row">
                <Input address={address} step={0.0001} showBalance={true} min={0} showMax={true} value={burnValue} onChange={(e) => onBurnUpdate(e.target.value)} showCoin={true} name={metadata.symbol} />

            </div>
            <div className="row">
                {
                    burnValue > 0 && <p>for {burnResult._tokens.map((token, index) => `${window.formatMoney(props.dfoCore.toDecimals(burnResult._amounts[index], metadata.decimals[token], 2))} ${metadata.symbols[token]} `)}</p>
                }
            </div>
            <div className="row">
                <div className="col">
                    <button className="btn btn-secondary" disabled={parseFloat(burnValue) === 0} onClick={() => burn()}>Burn</button> 
                </div>
            </div>
        </div>
    }

    const getContent = () => {
        
        return (
            <>
            <div className="row">
                <div className="col-md-3 col-12">
                    <img src={metadata.ipfsInfo.image || defaultLogoImage} width={100} />
                </div>
                <div className="col-md-9 col-12">
                    <div className="row">
                        <h3><b>{ metadata.name} ({metadata.symbol})</b></h3>
                    </div>
                    <div className="row text-left">
                        <p>{ metadata.ipfsInfo.description }</p>  
                    </div>
                </div>
            </div>
            <div className="row text-left">
               <div className="col-12">
                1 { metadata.symbol }:
               </div>
            </div>
            <div className="row">
                <div className="col">
                    {
                        metadata.info._tokens.map((token, index) => {
                            return (
                                <><b>{window.formatMoney(props.dfoCore.toDecimals(metadata.info._amounts[index], metadata.decimals[token]), 2)} {metadata.symbols[token]} </b><Coin address={token} />({window.formatMoney(metadata.percentages[token], 2)}%) </>
                            )
                        })
                    }
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-3 col-12">
                    <select className="custom-select wusd-pair-select" onChange={(e) => setAction(e.target.value)}>
                        <option value="mint">Mint</option>
                        <option value="burn">Burn</option>
                    </select>
                </div>
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