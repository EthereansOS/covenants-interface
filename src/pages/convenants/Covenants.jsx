import { PageContainer } from "../../components";
import dragonImage from '../../assets/images/index.png';

const Covenants = () => {
    return (
<div className="DappBox IndexRegular">
    <div className="IndexRegularContents">
        <div className="CoveExpl">
            <div className="CovSide">
                <figure className="CovDiversity">
                    <img src={dragonImage}></img>
                </figure>
                <div className="CovAMMs">
                    <h5>Supported AMMs</h5>
                    <a target="blank" href="https://uniswap.org/">&#129412; UniSwapV2</a>
                    <a target="blank" href="https://balancer.finance/">&#9878;&#65039; BalancerV1</a>
                    <a target="blank" href="https://mooniswap.info/home">&#127769; MooniSwapV1</a>
                    <a target="blank" href="https://sushiswap.fi/">&#127843; SushiSwapV1</a>
                </div>
            </div>
            <div className="CovDesc">
                <h3>The Aggregator</h3>
                <p>At the heart of every Covenant is the Aggregator. By liberating on-chain AMM aggregation, it allows any wallet, DAPP, DFO, DAO or customized smart contract to farm, inflate, multi-swap, arbitrage, craft liquidity, collateralize stablecoins and more across multiple AMMs at the same time.</p>
                <div className="CovLinks">
                    <h5>Governance</h5>
                    <a target="blank" href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a>
                    <a target="blank" href="https://etherscan.io/tokenHoldings?a=0x7ab2263e529A3D06745b32Dc35a22391d7e9f9B7">Covenants Treasury</a>
                    <a target="blank" href="https://etherscan.io/token/0x9E78b8274e1D6a76a0dBbf90418894DF27cBCEb5">UniFi Token</a>
                    <a target="blank" href="https://covenants.eth.link/#/farm/dapp/0x37Bc927d6aa94F1d3E4441CF7368e4C3df72241B">Farm UniFi</a>
                    <a target="blank" href="https://covenants.eth.link/#/inflation/dapp/0xBCc4b93914142891b20568B3c50ed050570C5124">UniFi Inflation</a>
                    <h5>More</h5>
                    <a target="blank" href="https://ethereansos.eth.link">EthOS</a>
                    <a target="blank" href="https://ethereansos.eth.link/organizations.html">On-Chain Organizations</a>
                    <a target="blank" href="https://ethereansos.eth.link/equities.html">Programmable Equities</a>
                    <a target="blank" href="https://github.com/ethereansos">Github</a>
                    <a target="blank" href="https://etherscan.io/address/0x6bc8530fecc0001b9fc0bf5daa17873e847616ed">Farm Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0x285427916a9d2e991039A8F1611F575D0a6cf237">Inflation Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0xc6749132243dA6B174BF502E7a85f5cEdD74A753">WUSD Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0x3a6a5fcce56fa57eeb4b24aeb8d13a2e3197b333">Index Factory</a>
                    <a target="blank" href="https://etherscan.io/address/0x81391d117a03A6368005e447197739D06550D4CD">Aggregator Factory</a>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}

export default Covenants;