import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FarmingComponent } from '../../../../components'; 
import { ExploreFarmingContract } from '../../../farm/dapp/components';

const Farm = (props) => {
    const { dfoCore } = props;

    return (
        <ExploreFarmingContract dfoCore={dfoCore} farmAddress={dfoCore.getContextElement("WUSDFarmMainAddress")} withoutBack={true} />
    )
}

const mapStateToProps = (state) => {
    const { core } = state;
    return { dfoCore: core.dfoCore };
}

export default connect(mapStateToProps)(Farm);