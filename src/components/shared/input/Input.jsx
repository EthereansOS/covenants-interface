import Coin from '../coin/Coin';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react/cjs/react.development';

const Input = (props) => {
    const { label, min, max, value, onChange, showBalance, balance, showMax, showCoin, address, name, step, extra } = props;
    const [val, setVal] = useState(value);

    useEffect(() => {
        setVal(value);
        //onChange && onChange(value);
    }, [value])

    const onDetectedChange = (value) => {
        if (!value) return { target: { value: balance }};
        return parseFloat(value) > parseFloat(balance) ? { target: { value: balance }} : { target: { value } };
    } 

    return (
        <>
            { label && <h6><b>{label}</b></h6> }
            <div className="input-group" onBlur={() => onChange(onDetectedChange(val))}  tabIndex={0}>
                {
                    showMax && <div className="input-group-prepend">
                        <button className="btn btn-secondary" onClick={() => onChange(onDetectedChange())} type="button">MAX</button>
                    </div>
                }
                <input type="number" className={`form-control input-form-field ${parseFloat(val) > parseFloat(balance) ? 'is-invalid' : ''}`} value={val} min={min} max={max || balance} onChange={(e) => setVal(e.target.value)}/>
                {
                    showCoin && <div className={`input-group-append no-border-right`}>
                        <span className={`input-group-text ${parseFloat(val) > parseFloat(balance) ? 'is-invalid' : ''}`} id=""><Coin address={address} /> {name}</span>
                    </div>
                }
            </div>
            { showBalance && <small className="form-text text-muted">Balance: {balance} {name} {extra ? extra : ''}</small> }
        </>
    )
}

export default Input;