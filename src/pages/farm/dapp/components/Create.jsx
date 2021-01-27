import { connect } from 'react-redux';


const Create = (props) => {

    return (
        <div className="create-component">
            <div className="row mb-4">
                {
                    farmingContracts.map((farmingContract) => {
                        return (
                            <FarmingComponent className="col-12 mb-4" contract={farmingContract} hasBorder />
                        )
                    })
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Hosted);