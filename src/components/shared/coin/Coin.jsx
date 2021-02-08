import PropTypes from 'prop-types';
import { useState } from 'react';
import defaultLogoImage from '../../../assets/images/default-logo.png';

const Coin = (props) => {
    const [image, setImage] = useState(`https://assets.trustwalletapp.com/blockchains/ethereum/assets/${props.address}/logo.png`)
    const { icons } = require('../../../data/context.json').default;

    const onImageError = () => {
        if (icons[props.address.toLowerCase()]) {
            setImage(icons[props.address.toLowerCase()]);
        } else {
            setImage(defaultLogoImage);
        }
    }

    return <img className={props.className || "mr-2"} src={image} onError={(e) => onImageError()} height={props.height || 24} />
}

Coin.propTypes = {
    className: PropTypes.string,
    address: PropTypes.string,
    height: PropTypes.number
}

export default Coin;