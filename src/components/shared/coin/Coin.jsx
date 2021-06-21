import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import defaultLogoImage from '../../../assets/images/default-logo.png';
import ethereumLogoImage from '../../../assets/images/eth.png';
import { connect } from 'react-redux';

const Coin = (props) => {
    const { forcedImage, height, address } = props;
    const [image, setImage] = useState(props.dfoCore.getContextElement('trustwalletImgURLTemplate').split('{0}').join(window.web3.utils.toChecksumAddress(props.address)));
    const { icons } = require('../../../data/context.json').default;
    const [isItem, setIsItem] = useState(false);

    isItem && console.log(address, "is item");

    useEffect(() => {
        //window.dfoCore.isItem(address).then(setIsItem);
    }, [address]);

    var wellKnownTokenImage = props.dfoCore.tryRetrieveWellKnownTokenImage(address);

    var imageLink = props.address === window.voidEthereumAddress ? ethereumLogoImage : image;

    var addr = props.dfoCore.web3.utils.toChecksumAddress(props.address);
    var token = props.dfoCore.itemsTokens.filter(it => it.address === addr)[0];
    if(token) {
        imageLink = token.logoURI;
    }

    const onImageError = () => {
        if(wellKnownTokenImage) {
            return setImage(wellKnownTokenImage);
        }
        if (icons[props.address.toLowerCase()]) {
            setImage(icons[props.address.toLowerCase()]);
        } else {
            setImage(defaultLogoImage);
        }
    }
    return (image === defaultLogoImage ? <span className="TokenCoolFancy"><span>YYTFJ</span></span>
    : 
    <img className={props.className} src={forcedImage || imageLink} onError={(e) => onImageError()} />); 
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