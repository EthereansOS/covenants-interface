import PropTypes from 'prop-types';

const ApproveButton = (props) => {
    const { contract, spender, text, onApproval, onError } = props;

    const approveContract = async () => {
        try {
            const totalSupply = await contract.methods.totalSupply().call();
            const gas = await contract.methods.approve(spender, totalSupply).estimateGas();
            const approve = await contract.methods.approve(spender, totalSupply).send({ gas });
            onApproval(approve);
        } catch (error) {
            onError(error);
        }
    }

    return (
        <button onClick={() => approveContract()} className="btn btn-primary approve-btn">{ text || "Approve" }</button>
    )
}

ApproveButton.propTypes = {
    contract: PropTypes.any.isRequired,
    spender: PropTypes.string.isRequired,
    text: PropTypes.string,
    onApproval: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
}

export default ApproveButton;