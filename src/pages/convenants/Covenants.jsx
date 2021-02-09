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
                    <a target="blank" href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a>
                    <a target="blank" href="https://etherscan.io/tokenHoldings?a=0x7ab2263e529A3D06745b32Dc35a22391d7e9f9B7">Covenants Treasury</a>
                    <a target="blank" href="https://etherscan.io/token/0x9E78b8274e1D6a76a0dBbf90418894DF27cBCEb5">UniFi Token</a>
                    <a target="blank">Farm UniFi</a>
                    <a target="blank">UniFi Inflation</a>
                    <h5>Footer</h5>
                    <a target="blank" href="https://ethereansos.eth.link">EthOS</a>
                    <a target="blank" href="https://ethereansos.eth.link/organizations.html">On-Chain Organizations</a>
                    <a target="blank" href="https://ethereansos.eth.link/equities.html">Programmable Equities</a>
                    <a target="blank" href="https://github.com/b-u-i-d-l">Github</a>
                    <a target="blank">Farm Factory</a>
                    <a target="blank">Inflation Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0xc6749132243dA6B174BF502E7a85f5cEdD74A753">WUSD Factory</a>
                    <a target="blank">Index Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0x81391d117a03A6368005e447197739D06550D4CD">Aggregator Factory</a>
                </div>
            </div>
            <div className="CovAMMs">
                <h5>Supported AMMs</h5>
                <a target="blank">&#129412; UniSwapV2</a>
                <a target="blank">&#9878;&#65039; BalancerV1</a>
                <a target="blank">&#127769; MooniSwapV1</a>
                <a target="blank">&#127843; SushiSwapV1</a>
            </div>
        </div>
    </div>
</div>
    )
}

export default Covenants;