import { connect } from 'react-redux';
import { updateFarmingContract  } from '../../../../store/actions';

const CreateOrEditFarmingSetup = (props) => {
    return (
        <div />
    )
}


const mapStateToProps = (state) => {
    const { core, session } = state;
    const { farmingContract, farmingSetups } = session;
    return { dfoCore: core.dfoCore, farmingContract, farmingSetups };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFarmingContract: (contract) => dispatch(updateFarmingContract(contract)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrEditFarmingSetup);