import { connect } from 'react-redux';
import { removeTransaction } from '../../../store/actions';

const Transactions = (props) => {
    const { etherscanURL } = require('../../../data/context.json').default;

    return <div>
        {
            props.transactions.map((transaction, index) => {
                console.log(transaction);
                setTimeout(() => {
                    props.removeTransaction(index);
                }, 8000);

                return <div key={transaction.transactionHash} className="success">
                    <p>Transaction Done! | <a href={`${etherscanURL}tx/${transaction.transactionHash}`} rel="noopener noreferrer" target="blank" className="link">View on Etherscan</a></p>
                    <a onClick={() => props.removeTransaction(index)} className="close">X</a>
                </div>
            })
        }
    </div>
}

const mapStateToProps = (state) => {
    const { core } = state;
    const { transactions } = core;
    return { transactions };
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeTransaction: (index) => dispatch(removeTransaction(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);