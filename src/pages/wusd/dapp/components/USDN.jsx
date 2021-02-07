import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ApproveButton, Input } from '../../../../components';

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

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const contract = await props.dfoCore.getContract(props.dfoCore.getContextElement("WUSDExtensionControllerABI"), props.dfoCore.getContextElement("WUSDExtensionControllerAddress"));
        setWusdExtensionController(contract);

        const wusdContract = await props.dfoCore.getContract(props.dfoCore.getContextElement("ERC20ABI"), props.dfoCore.getContextElement("WUSDAddress"));
        setWusdContract(wusdContract);
        const decimals = await wusdContract.methods.decimals().call();

        const wusdNote2Info = await contract.methods.wusdNote2Info().call();
        const wusdNote5Info = await contract.methods.wusdNote5Info().call();
        setx2USDNoteInfo(wusdNote2Info);
        setx2USDNoteInfo(wusdNote5Info);
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
        setx2Balance(x2balance);
        setx5Balance(x5balance);

        const allowance0 = await x2USDcontract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
        const allowance1 = await x5USDcontract.methods.allowance(props.dfoCore.address, props.dfoCore.getContextElement("WUSDExtensionControllerAddress")).call();
 
        setx2Approved(parseInt(allowance0) !== 0);
        setx5Approved(parseInt(allowance1) !== 0);
    }

    const redeemX2 = async () => {
        if (x2Amount > x2USDTreasury) return;
        const x2USDCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), x2USDNoteInfo['0']);
        const x2WeiAmount = props.dfoCore.fromDecimals(x2Amount, 18).toString();
        await x2USDCollection.methods.safeBatchTransferFrom(props.dfoCore.address, x2USDNoteControllerContract.options.address, [x2USDNoteInfo['1']], [x2WeiAmount], "");
        await getData();
    }

    const redeemX5 = async () => {
        if (x5Amount > x5USDTreasury) return;
        const x5USDCollection = await props.dfoCore.getContract(props.dfoCore.getContextElement('INativeV1ABI'), x2USDNoteInfo['0']);
        await x5USDCollection.methods.safeBatchTransferFrom(props.dfoCore.address, x5USDNoteControllerContract.options.address, [x5USDNoteInfo['1']], [props.dfoCore.fromDecimals(x5Amount, 18).toString()], "");
        await getData();
    }

    const onUpdateX2Value = (value) => {
        console.log({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)});
        setx2Amount({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)})
    }

    const onUpdateX5Value = (value) => {
        console.log({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)});
        setx5Amount({ value, full: props.dfoCore.fromDecimals(parseFloat(value).toString() || "0", decimals)})
    }

    const onTokenApproval = (type) => {
        switch (type) {
            case 'x2':
                setx2Approved(true);
            case 'x5':
                setx5Approved(true);
            default:
                return;
        }
    }

    const getx2Input = () => {
        return (
            <>
            <div className="col-12 mb-4">
                <Input showMax={true} value={x2Amount.value} balance={x2Balance} extra={`| Treasury ${x2USDTreasury} WUSD`} min={0} onChange={(e) => onUpdateX2Value(e.target.value)} showCoin={true} showBalance={true} name="x2USD" />
            </div>
            {
                x2Amount ? 
                <div className="col-12 mb-4">
                    <div className="row justify-content-center">
                        For
                    </div>
                    <div className="row justify-content-center">
                        {x2Amount.value * multipliers[0]} uSD
                    </div>
                </div> : <div/>
            }
            </>
        )
    }

    const getx2Buttons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row">
                    {
                        /*
                        !x2Approved ? 
                        <div className="col">
                            <ApproveButton contract={x2USDContract} isERC1155={true} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")}  onError={(error) => console.log(error)} onApproval={() => onTokenApproval('x2')} text={"Approve x2USD"} />
                        </div> : <></>
                        */
                    }
                    <div className="col">
                        <button onClick={() => redeemX2()} disabled={!x2Amount} className="btn btn-secondary">Redeem</button>
                    </div>
                </div>
            </div>
        )
    }

    const getx5Input = () => {
        return (
            <>
                <div className="col-12 mb-4">
                    <Input showMax={true} value={x5Amount.value} balance={x5Balance} extra={`| Treasury ${x5USDTreasury} WUSD`} min={0} onChange={(e) => onUpdateX5Value(e.target.value)} showCoin={true} showBalance={true} name="x5USD" />
                </div>
                {
                    x5Amount ?
                    <div className="col-12 mb-4">
                        <div className="row justify-content-center">
                            For
                        </div>
                        <div className="row justify-content-center">
                            {x5Amount.value * multipliers[1]} uSD
                        </div>
                    </div> : <div/>
                }
            </>
        )
    }

    const getx5Buttons = () => {
        return (
            <div className="col-12 mb-4">
                <div className="row">
                    {
                        /*
                        !x5Approved ? 
                        <div className="col">
                            <ApproveButton contract={x5USDContract} isERC1155={true} from={props.dfoCore.address} spender={props.dfoCore.getContextElement("WUSDExtensionControllerAddress")}  onError={(error) => console.log(error)} onApproval={() => onTokenApproval('x5')} text={"Approve x5USD"} />
                        </div> : <></>
                        */
                    }
                    <div className="col">
                        <button onClick={() => redeemX5()} disabled={!x5Amount} className="btn btn-secondary">Redeem</button>
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

export default connect(mapStateToProps)(USDN);