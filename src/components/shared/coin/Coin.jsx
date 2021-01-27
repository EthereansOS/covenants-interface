import PropTypes from 'prop-types';

const Coin = (props) => {
    return <img className={props.className || "mr-2"} src={`https://assets.trustwalletapp.com/blockchains/ethereum/assets/${props.address || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }/logo.png`} height={props.height || 24} />
}

Coin.propTypes = {
    className: PropTypes.string,
    address: PropTypes.string,
    height: PropTypes.number
}

export default Coin;