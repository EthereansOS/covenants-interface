import PropTypes from 'prop-types';
import axios from 'axios';
import { useState, useEffect } from 'react';
import defaultLogoImage from '../../../assets/images/default-logo.png';

const Coin = (props) => {
    const [image, setImage] = useState(defaultLogoImage)
    const { icons } = require('../../../data/context.json').default;

    useEffect(() => {
        retrieveImage();
    }, []);

    const retrieveImage = async () => {
        try {
            const trustWalletUrl = `https://assets.trustwalletapp.com/blockchains/ethereum/assets/${props.address}/logo.png`;
            await fetch(trustWalletUrl, { method: 'HEAD', mode: 'no-cors' });
            setImage(trustWalletUrl);
        } catch (error) {
            if (icons[props.address]) {
                setImage(icons[props.address]);
            } else {}
        }
    }

    return <img className={props.className || "mr-2"} src={image} height={props.height || 24} />
}

Coin.propTypes = {
    className: PropTypes.string,
    address: PropTypes.string,
    height: PropTypes.number
}

export default Coin;