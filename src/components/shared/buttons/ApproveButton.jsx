import PropTypes from 'prop-types';

const ApproveButton = (props) => {
    const { contract, spender, from, text, onApproval, onError, disabled } = props;

    const approveContract = async () => {
        try {
            const totalSupply = await contract.methods.totalSupply().call();
            const gas = await contract.methods.approve(spender, totalSupply).estimateGas();
            const approve = await contract.methods.approve(spender, totalSupply).send({ from, gas });
            onApproval(approve);
        } catch (error) {
            onError(error);
        }
    }

    return (
        <button onClick={() => approveContract()} disabled={disabled} className="btn btn-primary approve-btn">{ text || "Approve" }</button>
    )
}

ApproveButton.propTypes = {
    from: PropTypes.string,
    contract: PropTypes.any,
    spender: PropTypes.string,
    text: PropTypes.string,
    onApproval: PropTypes.func,
    onError: PropTypes.func,
}

export default ApproveButton;