import { Coin } from '../';
import { Link } from 'react-router-dom';
import defaultLogoImage from '../../../assets/images/default-logo.png';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const BazaarComponent = (props) => {
    const { hasBorder, className, indexToken } = props;

    return (
        <div className={className}>
                {
                    indexToken ? <>
                    <figure className="IndexLogo">
                            <img src={indexToken.ipfsInfo.image || defaultLogoImage} />
                    </figure>
                    <div className="IndexInfo">
                            <h6><b>{indexToken.name}</b></h6>
                            <div className="IndexTokens">
                                <p> {
                                    indexToken.info._tokens.map((token, index) => {
                                        return (
                                            <><p>{indexToken.amounts[token]} <Coin address={token} /> { index !== indexToken.info._tokens.length - 1 && " " }</p></>
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