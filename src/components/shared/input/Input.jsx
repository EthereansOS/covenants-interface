import Coin from '../coin/Coin';
import PropTypes from 'prop-types';

const Input = (props) => {
    const { label, value, min, max, onChange, showBalance, balance, showMax, showCoin, address, name, step } = props;

    return (
        <>
            { label && <h6><b>{label}</b></h6> }
            <div className="input-group">
                {
                    showMax && <div className="input-group-prepend">
                        <button className="btn btn-secondary" onClick={() => onChange({ target: { value: balance }})} type="button">MAX</button>
                    </div>
                }
                <input type="number" step={step || 1} className="form-control" value={value} min={min} max={max || balance} onChange={onChange} />
                {
                    showCoin && <div className="input-group-append">
                        <span className="input-group-text" id=""><Coin address={address} /> {name}</span>
                    </div>
                }
            </div>
            { showBalance && <small className="form-text text-muted">Balance: {balance} {name}</small> }
        </>
    )
}

Input.propTypes = {
    label: PropTypes.string,
    step: PropTypes.number,
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    showBalance: PropTypes.bool,
    showMax: PropTypes.bool,
    showCoin: PropTypes.bool,
    address: PropTypes.string,
    name: PropTypes.string,
    balance: PropTypes.number,
}

export default Input;