import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';
import { addTransaction } from '../../../../store/actions';

const USDN = (props) => {
    const [x2Amount, setx2Amount] = useState(0);
    const [x5Amount, setx5Amount] = useState(0);
    const [wusdContract, setWusdContract] = useState(null);
    const [x2USDContract, setx2USDContract] = useState(null);
    const [x5USDContract, setx5USDContract] = useState(null);
    const [decimals, setDecimals] = useState(0);
    const [x2USDNoteControllerContract, setx2USDNoteControllerContract] = useState(null);
    const [x5USDNoteControllerContract, setx5USDNoteControllerContract] = useState(null);
    const [wusdExtensionController, setWusdExtensionController] = useState(null);
    const [x2Balance, setx2Balance] = useState(0);
    const [x5Balance, setx5Balance] = useState(0);
    const [x2Approved, setx2Approved] = useState(false);
    const [x5Approved, setx5Approved] = useState(false);
    const [x2USDSupply, setx2USDSupply] = useState(0);
    const [x2USDTreasury, setx2USDTreasury] = useState(0);
    const [x5USDSupply, setx5USDSupply] = useState(0);
    const [x5USDTreasury, setx5USDTreasury] = useState(0);
    const [x2USDNoteInfo, setx2USDNoteInfo] = useState(null);
    const [x5USDNoteInfo, setx5USDNoteInfo] = useState(null);
    const [multipliers, setMultipliers] = useState([2, 5]);
    const [x2Loading, setx2Loading] = useState(false);
    const [x5Loading, setx5Loading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true);
        try {
            const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
            setWusdExtensionController(contract);
    
            const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
            setWusdContract(wusdContract);
            const decimals = await wusdContract.methods.decimals().call();
    
            const wusdNote2Info = await contract.methods.wusdNote2Info().call();
            const wusdNote5Info = await contract.methods.wusdNote5Info().call();
            setx2USDNoteInfo(wusdNote2Info);
            setx5USDNoteInfo(wusdNote5Info);
            const wusdCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement("INativeV1ABI"), wusdNote2Info[0]);
            setDecimals(await wusdCollection.methods.decimals().call());
    
            const x2USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IERC1155ABI"), wusdNote2Info[2]);
            const x5USDcontract = await props.dfoCore.getContract(props.dfoCore.getContextElement("IERC1155ABI"), wusdNote5Info[2]);
            const x2USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote2Info[3]);
            const x5USDNoteController = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDNoteControllerABI"), wusdNote5Info[3]);
            
            setx2USDContract(x2USDcontract);
            setx5USDContract(x5USDcontract);
            setx2USDNoteControllerContract(x2USDNoteController);
            setx5USDNoteControllerContract(x5USDNoteController);
    
            const mul = [parseInt(await x2USDNoteController.methods.multiplier().call()), parseInt(await x5USDNoteController.methods.multiplier().call())];
            setMultipliers(mul);
    
            setx2USDSupply(props.dfoCore.toDecimals(await x2USDcontract.methods.totalSupply().call(), decimals));
            setx5USDSupply(props.dfoCore.toDecimals(await x5USDcontract.methods.totalSupply().call(), decimals));
            setx2USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x2USDNoteController.options.address).call(), decimals));
            setx5USDTreasury(props.dfoCore.toDecimals(await wusdContract.methods.balanceOf(x5USDNoteController.options.address).call(), decimals));
    
            const x2balance = await x2USDcontract.methods.balanceOf(props.dfoCore.address).call();
            const x5balance = await x5USDcontract.methods.balanceOf(props.dfoCore.address).call();
            console.log(x5balance);
            setx2Balance(x2balance);
            setx5Balance(x5balance);
    
            const allowance0 = await x2USDcontract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
            const allowance1 = await x5USDcontract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
     
            setx2Approved(parseInt(allowance0) !== 0);
            setx5Approved(parseInt(allowance1) !== 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const redeemX2 = async () => {
        if (x2Amount.full > parseFloat(props.dfoCore.toFixed(props.dfoCore.fromDecimals(x2USDTreasury)))) return;
        setx2Loading(true);
        try {
            const x2USDCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), x2USDNoteInfo['0']);
            const from = props.dfoCore.address;
            const to = x2USDNoteControllerContract.options.address;
            const objectId = x2USDNoteInfo['1'];
            const amount = props.dfoCore.toFixed(x2Amount.full).toString();
            console.log(`from ${from}`);
            console.log(`to ${to}`);
            console.log(`object id ${objectId}`);
            console.log(`amount ${amount}`);
            const gasLimit = await x2USDCollection.methods.safeBatchTransferFrom(from, to, [objectId], [amount], "0x").estimateGas({ from: props.dfoCore.address});
            const result = await x2USDCollection.methods.safeBatchTransferFrom(from, to, [objectId], [amount], "0x").send({ from: props.dfoCore.address, gasLimit });
            props.addTransaction(result);
            await getData();
        } catch (error) {
            console.error(error);
        } finally {
            setx2Loading(false);
        }
    }

    const redeemX5 = async () => {
        console.log(parseFloat(props.dfoCore.toFixed(props.dfoCore.fromDecimals(x5USDTreasury))));
        if (x5Amount.full > parseFloat(props.dfoCore.toFixed(props.dfoCore.fromDecimals(x5USDTreasury)))) return;
        setx5Loading(true);
        try {
            const x5USDCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), x5USDNoteInfo['0']);
            const from = props.dfoCore.address;
            const to = x5USDNoteControllerContract.options.address;
            const objectId = x5USDNoteInfo['1'];
            const amount = props.dfoCore.toFixed(x5Amount.full).toString();
            console.log(`from ${from}`);
            console.log(`to ${to}`);
            console.log(`object id ${objectId}`);
            console.log(`amount ${amount}`);
            const gasLimit = await x5USDCollection.methods.safeBatchTransferFrom(from, to, [objectId], [amount], "0x").estimateGas({ from: props.dfoCore.address })
            const result = await x5USDCollection.methods.safeBatchTransferFrom(from, to, [objectId], [amount], "0x").send({ from: props.dfoCore.address, gasLimit });
            props.addTransaction(result);
            await getData();
        } catch (error) {
            console.error(error);
        } finally {
            setx5Loading(false);
        }
    }

    const onUpdateX2Value = (value) => {
        setx2Amount({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)})
    }

    const onUpdateX5Value = (value) => {
        setx5Amount({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)})
    }

    const exceedsBalance = (type) => {
        switch (type) {
            case 'x2':
                return parseInt(x2Amount.full) * multipliers[0] > parseInt(props.dfoCore.toFixed(props.dfoCore.fromDecimals(x2USDTreasury)));
            case 'x5':
                return parseInt(x5Amount.full) * multipliers[1] > parseInt(props.dfoCore.toFixed(props.dfoCore.fromDecimals(x5USDTreasury)));
            default:
                return true;
        }
    }

    const getx2Input = () => {
        return (
            <>
            <div className="InputTokensRegular">
                <div className="InputTokenRegular">
                    <Input showMax={true} address={x2USDContract?.options.address} value={x2Amount.value || 0} balance={props.dfoCore.toDecimals(x2Balance, decimals)} extra={`| Available: ${props.dfoCore.formatMoney(x2USDTreasury, 2)} WUSD`} min={0} onChange={(e) => onUpdateX2Value(e.target.value)} showCoin={true} showBalance={true} name="x2USD" />           
                </div>
            </div>
            {
                x2Amount ? 
                <div className="Resultsregular">
                    <p>For <b>{x2Amount.value * multipliers[0]} WUSD</b></p>
                </div> : <div/>
            }
            </>
        )
    }

    const getx2Buttons = () => {
        return (
            <div className="Web3BTNs">
                    {
                        /*
                        !x2Approved ? 
                        <div className="col">
                            <ApproveButton contract={x2USDContract} isERC1155={true} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")}  onError={(error) => console.log(error)} onApproval={() => onTokenApproval('x2')} text={"Approve x2USD"} />
                        </div> : <></>
                        */
                    }
                        {
                            x2Loading ? <a className="Web3ActionBTN" disabled={x2Loading}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </a> : <a onClick={() => redeemX2()} disabled={!x2Amount.full || exceedsBalance('x2')} className="Web3ActionBTN">Redeem</a>
                        }
            </div>
        )
    }

    const getx5Input = () => {
        return (
            <>
                <div className="InputTokensRegular">
                    <div className="InputTokenRegular">
                        <Input showMax={true} address={x5USDContract?.options.address} value={x5Amount.value || 0} balance={props.dfoCore.toDecimals(x5Balance, decimals)} extra={`| Treasury ${props.dfoCore.formatMoney(x5USDTreasury, 2)} WUSD`} min={0} onChange={(e) => onUpdateX5Value(e.target.value)} showCoin={true} showBalance={true} name="x5USD" />
                    </div>
                </div>
                {
                    x5Amount ?
                    <div className="Resultsregular">
                        <p>For <b>{x5Amount.value * multipliers[1]} WUSD</b></p>
                    </div> : <div/>
                }
            </>
        )
    }

    const getx5Buttons = () => {
        return (
            <div className="Web3BTNs">
                    {
                        /*
                        !x5Approved ? 
                        <div className="col">
                            <ApproveButton contract={x5USDContract} isERC1155={true} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")}  onError={(error) => console.log(error)} onApproval={() => onTokenApproval('x5')} text={"Approve x5USD"} />
                        </div> : <></>
                        */
                    }
                        {
                            x5Loading ? <a className="Web3ActionBTN" disabled={x5Loading}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </a> : <a onClick={() => redeemX5()} disabled={!x5Amount.full || exceedsBalance('x5')} className="Web3ActionBTN">Redeem</a>
                        }
            </div>
        )
    }


    if (loading) {
        return (
            <div className="usdn-component">
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="usdn-component">
            <div className="row">
                { getx2Input() }
                { getx2Buttons() }
                <div className="col-12 my-4" />
                { getx5Input() }
                { getx5Buttons() }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTransaction: (index) => dispatch(addTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(USDN);