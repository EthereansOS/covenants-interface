import { Coin } from '../';
import { Link } from 'react-router-dom';
import defaultLogoImage from '../../../assets/images/default-logo.png';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const BazaarComponent = (props) => {
    const { hasBorder, className, indexToken } = props;
    const [hasPrice, setHasPrice] = useState(true);
    const [loading, setLoading] = useState(true);
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        try {
            const indexContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IndexABI'), props.dfoCore.getContextElement('indexAddress'));
            const interoperableContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IEthItemInteroperableInterfaceABI'), indexToken.address);
            const objectId = await interoperableContract.methods.objectId().call();
            const mainInterface = await interoperableContract.methods.mainInterface().call();
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement('IEthItemABI'), mainInterface);
            const info = await indexContract.methods.info(objectId, 0).call();
            const uri = await contract.methods.uri(objectId).call();
            let res = { data: { description: '', image: '' } };
            try {
                res = await axios.get(uri);
            } catch (error) {
                console.log('error while reading metadata from ipfs..')
            }
            let total = 0;
            await Promise.all(info._amounts.map(async (amount, index) => {
                try {
                    const token = info._tokens[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    const decimal = await tokenContract.methods.decimals().call();
                    try {
                        const res = await window.getTokenPricesInDollarsOnCoingecko(token);
                        const { data } = res;
                        const tokenPrice = data[token.toLowerCase()].usd;
                        const value = parseFloat(props.dfoCore.toDecimals(amount, decimal)) * tokenPrice;
                        total += value;
                    } catch (err) {
                        setHasPrice(false);
                        const val = parseFloat(props.dfoCore.toDecimals(amount, decimal));
                        total += val;
                    }
                } catch (error) {
                    console.error(error);
                }
            }))
            const percentages = {};
            await Promise.all(info._tokens.map(async (token, index) => {
                try {
                    const amount = info._amounts[index];
                    const tokenContract = await props.dfoCore.getContract(props.dfoCore.getContextElement('ERC20ABI'), token);
                    const decimal = await tokenContract.methods.decimals().call();
                    const amountDecimals = props.dfoCore.toDecimals(amount.toString(), decimal);
                    try {
                        const res = await window.getTokenPricesInDollarsOnCoingecko(token);
                        const { data } = res;
                        const tokenPrice = data[token.toLowerCase()].usd;
                        percentages[token] = ((parseFloat(amountDecimals) * tokenPrice) / parseInt(total)) * 100;
                    } catch (error) {
                        percentages[token] = ((parseFloat(amountDecimals)) / parseInt(total)) * 100;
                    }
                } catch (error) {
                    console.error(error);
                }
            }));
            setMetadata({ percentages });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (<div className={className}>
            <div className="col-12 justify-content-center">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden"></span>
                </div>
            </div>
        </div>)
    }

    return (
        <div className={className}>
                {
                    indexToken ? <>
                    <figure className="IndexLogo">
                            <img src={indexToken.ipfsInfo.image ? window.formatLink(indexToken.ipfsInfo.image) : defaultLogoImage} />
                    </figure>
                    <div className="IndexInfo">
                            <h6><b>{indexToken.name}</b></h6>
                            <div className="IndexTokens">
                                <p> {
                                    indexToken.info._tokens.map((token, index) => {
                                        return (
                                            <><p>{!hasPrice ? indexToken.amounts[token] : `${window.formatMoney(metadata.percentages[token], 1)}%`} <Coin address={token} /> { index !== indexToken.info._tokens.length - 1 && " " }</p></>
                                        )
                                    })
                                }</p>
                                <div className="IndexContractBTN">
                                    <Link to={`/bazaar/dapp/${indexToken.address}`} className="web2ActionBTN">Open</Link>
                                </div>
                            </div>
                    </div>
                    </> : <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                }
        </div>
    )
}

export default BazaarComponent;