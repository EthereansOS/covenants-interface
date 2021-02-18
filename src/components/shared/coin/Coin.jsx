import PropTypes from 'prop-types';
import { useState } from 'react';
import defaultLogoImage from '../../../assets/images/default-logo.png';
import ethereumLogoImage from '../../../assets/images/ethereum.png';
import { connect } from 'react-redux';

const Coin = (props) => {
    const [image, setImage] = useState(`https://assets.trustwalletapp.com/blockchains/ethereum/assets/${props.address}/logo.png`)
    const { icons } = require('../../../data/context.json').default;

    var imageLink = props.address === window.voidEthereumAddress ? ethereumLogoImage : image;

    var addr = props.dfoCore.web3.utils.toChecksumAddress(props.address);
    var token = props.dfoCore.itemsTokens.filter(it => it.address === addr)[0];
    if(token) {
        imageLink = token.logoURI;
    }

    console.log(imageLink);

    const onImageError = () => {
        if (icons[props.address.toLowerCase()]) {
            setImage(icons[props.address.toLowerCase()]);
        } else {
            setImage(defaultLogoImage);
        }
    }

    return <img className={props.className} src={imageLink} onError={(e) => onImageError()} />
}

Coin.propTypes = {
    className: PropTypes.string,
    address: PropTypes.string,
    height: PropTypes.number
}

const mapStateToProps = (state) => {
    const { core, session } = state;
    const { dfoCore } = core;
    const { inflationSetups } = session;
    return { dfoCore, inflationSetups };
}

export default connect(mapStateToProps)(Coin);