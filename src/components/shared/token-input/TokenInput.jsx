import PropTypes from 'prop-types';
import { useState } from 'react';

const TokenInput = (props) => {
    const { onClick, placeholder, text, width, label } = props;
    const [tokenAddress, setTokenAddress] = useState(props.tokenAddress || "");

    return <div className={`row mb-3 w-${width || 100}`}>
        { label && <div className="col-12"><h6><b>{label}</b></h6></div> }
        <div className="col-12 flex">
            <input type="text" className="form-control mr-4" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder={placeholder} aria-label={placeholder}/>
            <button className="btn btn-secondary" onClick={() => onClick(tokenAddress) } type="button">{text}</button>
        </div>
    </div>
}

TokenInput.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    text: PropTypes.string.isRequired,
    width: PropTypes.number,
}

export default TokenInput;