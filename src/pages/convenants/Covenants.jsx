import { PageContainer } from "../../components";

const Covenants = () => {
    return (
<div className="page-container IndexRegular">
    <div className="IndexRegularContents">
        <div className="CoveExpl">
            <div className="CovDesc">
                <h3>AMMs Aggregator</h3>
                <p>At the heart of every Covenant is The Aggregator. Equipped with AMM-standardizing APIs, it allows any wallet, DAPP, DFO, DAO or customized smart contract to farm, arbitrage and so much more across multiple AMMs at the same time.</p>
                <div className="CovLinks">
                    <h5>Governance</h5>
                    <a target="blank">Covenants DFO</a>
                    <a target="blank">Covenants Treasury</a>
                    <a target="blank">UniFi Token</a>
                    <a target="blank">Farm UniFi</a>
                    <a target="blank">UniFi Inflation</a>
                    <h5>Footer</h5>
                    <a target="blank">EthOS</a>
                    <a target="blank">On-Chain Organizations</a>
                    <a target="blank">Programmable Equities</a>
                    <a target="blank">Github</a>
                    <a target="blank">Farm Factory</a>
                    <a target="blank">Inflation Factory</a>
                    <a target="blank">WUSD Factory</a>
                    <a target="blank">Index Factory</a>
                    <a target="blank">Aggregator Factory</a>
                </div>
            </div>
            <div className="CovAMMs">
                <h5>Supported AMMs</h5>
                <a target="blank">UniSwapV2</a>
                <a target="blank">BalancerV1</a>
                <a target="blank">MooniSwapV1</a>
                <a target="blank">SushiSwapV1</a>
            </div>
        </div>
    </div>
</div>
    )
}

export default Covenants;