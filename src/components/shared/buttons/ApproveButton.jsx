import PropTypes from 'prop-types';

const ApproveButton = (props) => {
    const { contract, spender, from, text, onApproval, isERC1155, onError, disabled } = props;

    const approveContract = async () => {
        console.log(spender, from);
        if (!isERC1155) {
            try {
                const approval = await contract.methods.allowance(from, spender).call();
                if (parseInt(approval) > 0) {
                    onApproval(approve);
                    return;
                } 
                const totalSupply = await contract.methods.totalSupply().call();
                const gas = await contract.methods.approve(spender, totalSupply).estimateGas({ from });
                const approve = await contract.methods.approve(spender, totalSupply).send({ from, gas });
                onApproval(approve);
            } catch (error) {
                onError(error);
            }
        } else {
            try {
                const gas = await contract.methods.setApprovalForAll(spender, true).estimateGas({ from });
                const approve = await contract.methods.setApprovalForAll(spender, true).send({ from, gas });
                onApproval(approve);
            } catch (error) {
                onError(error);
            }
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