import { PageContainer } from "../../components";
import homeInflationImage from '../../assets/images/1.png';
import { Route, Switch } from "react-router-dom";
import chap1 from '../../assets/images/sword.png';
import chap2 from '../../assets/images/wusd.png';
import chap3 from '../../assets/images/farm.png';
import chap4 from '../../assets/images/cloud.png';
import chap5 from '../../assets/images/bread.png';
import info1 from '../../assets/images/infographics/orchestrator.png';
import info2 from '../../assets/images/infographics/orchestrator_1.png';
import info3 from '../../assets/images/infographics/wusd.png';
import info4 from '../../assets/images/infographics/farming.png';
import info5 from '../../assets/images/infographics/inflation.png';
import info6 from '../../assets/images/infographics/indexes.png';
import { useState } from "react";

const lorem = 'Issued by the School of Responsible Wizardry, the official Covenant spellbook will teach you how to cast Covenant magic correctly.';

const Grimoire = () => {
    const [showGrimoire, setShowGrimoire] = useState(false);


    return (
        <>
            <PageContainer image={homeInflationImage} buttonEnabled={true} onClick={() => setShowGrimoire(!showGrimoire)} imageHeight={300} text={lorem} title={"Grimoire"}  buttonText={!showGrimoire ? "Read" : "Hide"} />
            {
                showGrimoire && <div className="grimoireBox">
                    <article className="grimoireAll">
                        <section className="GrimoureContent">
                            <h1>The Grimoire Vol 1</h1>
                            <article>
                                <span>
                                    <img src={chap1}></img>
                                </span>
                                <header>
                                    <h2>The Aggregator</h2>
                                    <p>At the heart of every Covenant is The Aggregator. Equipped with AMM-standardizing APIs, it allows any wallet, DAPP, DFO, DAO or customized smart contract to farm, arbitrage and so much more across multiple AMMs at the same time.</p>
                                </header>
                            </article>
                            <article>
                                <h2>On-Chain Aggregators vs Semi On-Chain Aggregators</h2>
                                <p>All other AMM aggregators—1inch, for example—operate semi on-chain. While excellent at finding the best prices for trades, they process all transactions via their off-chain frontends. Smart contracts cannot read frontends, so they can’t interact with these aggregators. Only human individual wallets and off-chain arbitration bots can, and only for basic token swaps.</p>
                                <p>The Covenant Aggregator is free from such limitations. It is equipped with AMM-standardizing Solidity APIs that smart contracts can read. This means that any wallet, dApp, DAO, DFO or customized smart contract can use it, and for much more than just token swaps. It unlocks multi-AMM farming, arbitrage, token inflation, liquidity crafting, stablecoin collateralization etc.</p>
                                <figure>
                                    <img src={info1}></img>
                                </figure>
                            </article>
                            <article>
                                <h2>AMM-Standardizing APIs</h2>
                                <p>All AMMs implement the same three basic functions—swap liquidity, add liquidity and remove liquidity—in different ways. Uniswap routes users to liquidity pools via hard-coded lists; Mooniswap connects users directly; Balancer allows for pools with more than two tokens; etc. </p>
                                <p>However, they all follow the same rules of behavior. The Aggregator is programmed with APIs encoded with the logic of these rules, which allows it to facilitate fully on-chain, standardized AMM aggregation. These not only dApps, DAOs etc. to integrate AMM aggregation, but also interact with all AMMs whitelisted by the Aggregator without having to account for unique logic.</p>
                                <p>The Covenants DFO, governed by $UniFi holders, is responsible for all listing.</p>
                                <figure>
                                    <img src={info2}></img>
                                </figure>
                            </article>
                            <article>
                                <h2>The Orchestrator</h2>
                                <p>This is the Aggregator’s extendible knowledge base. It keeps track of all listed AMMs and allows them to be upgraded / downgraded via a plugin system. Every AMM can have multiple plugins, and each plugin has its own version number plus associated features and bug fixes.</p>
                            </article>
                            <article>
                                <h2>API List</h2>
                                <p><b>Swap (single / batch)</b></p>
                                <p>Swap (or, if supported, batch-swap erc1155 / Item-based or ERC20 Batch) assets</p>
                                <p><b>add/remove Liquidity (single / batch)</b></p>
                                <p>add/remove liquidity to a single pool (or, if supported, batch-add a variety of erc1155 / Item-based or ERC20 Batch assets to multiple pools)</p>
                                <p><b>Get info by liquidity pool</b></p>
                                <p>Read pool info and amounts</p>
                                <p><b>Get info by tokens</b></p>
                                <p>Read pair info and amounts of a single token (not available for Balancer)</p>
                                <p><b>Get liquidity pool balance and token balance by percentage</b></p>
                                <p><b>Get token balances by liquidity pool amount</b></p>
                                <p><b>Get balances by single token</b></p>
                                <p>Read how many liquidity pool tokens correspond to the amount of a single token</p>
                            </article>
                            <article>
                                <h2>Integrate Your dApp With the Aggregator</h2>
                                <p>All Ethereum dApps can integrate the Aggregator, allowing them to interact with every AMM it has whitelisted, and automatically with any AMM whitelisted in the future. You can find guidelines on dApp-Aggregator integration in <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap2}></img>
                                </span>
                                <header>
                                    <h2>Wrapped USD</h2>
                                    <p>One stablecoin to pool them all. $WUSD is minted at the confluence of other stablecoins, which pool out as its collateral to AMMs everywhere. $WUSD is the most decentralized and resilient stablecoin.</p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics </h2>
                                <p>$WUSD is designed to be the most resilient stablecoin on Ethereum. Governed by a fully on-chain decentralized organization, no state, issuer or any other off-chain centralized intermediary can censor or manipulate it. $WUSD is as unstoppable as Ethereum itself.</p>
                            </article>
                            <article>
                                <h2>Minting & Burning </h2>
                                <p>Anyone can mint and burn $WUSD anytime using the Covenants frontend (or by calling the smart contracts themselves).</p>
                                <p><b>Minting</b></p>
                                <p>$WUSD is minted by collateralizing whitelisted stablecoins across multiple whitelisted AMM pools at a 1:1 ratio. The Covenants DFO, governed by $UniFi holders, is responsible for all whitelisting.</p>
                                <p>Example</p>
                                <p>Mint 2x $WUSD by adding 1x Stablecoin A and 1x Stablecoin B </p>
                                <p><b>Burning</b></p>
                                <p>$WUSD collateral can be retrieved by burning $WUSD at the same ratio.</p>
                                <p>Example</p>
                                <p>Burn 2x $WUSD and receive 1x Stablecoin A and 1x Stablecoin C </p>
                            </article>
                            <article>
                                <h2>Rebalancing</h2>
                                <p>In certain events, the $WUSD : collateral equilibrium can destabilize. When this happens, the $WUSD protocol can restore it using two secure rebalancing methods, profiting in the process.</p>
                                <p><b>Credit Rebalancing</b></p>
                                <p>The $WUSD protocol, by providing its stablecoin collateral to liquidity pools, earns additional stablecoins as trading fees; these increase the collateral supply relative to $WUSD supply.</p>
                                <p>To restore equilibrium, the $WUSD protocol can mint the equivalent amount of $WUSD. Called ‘Credit Rebalancing’, this can be manually executed by anyone via the DFO once a fortnight. The executor is rewarded with 2% of the newly minted $WUSD.</p>
                                <p>The rest is distributed as follows:</p>
                                <p>8% to the Covenants treasury, owned and ruled by $UniFi holders</p>
                                <p>60% to the FARM treasury (coming Soon), dedicated to rewarding $WUSD farming</p>
                                <p>20% to the $2XUSD treasury, reserved for Debit Rebalancing</p>
                                <p>10% to the $5XUSD treasury, also reserved for Debit Rebalancing</p>
                                <p><b>Debit Rebalancing</b></p>
                                <p>If one of the $WUSD protocol’s collateralized stablecoins fails and loses value, this will lead to  a lower collateral supply relative to the $WUSD supply. Such an event may trigger the $WUSD protocol to enable the burning of $WUSD to mint Multiplier Tokens until equilibrium is restored.</p>
                                <p>Here’s an example of how this would play out:</p>
                                <p>1. CZ rugs. The BUSD protocol dies. $BUSD’s price tanks and it loses all value. Nobody will be available to mint/burn $WUSD using $BUSD because the ration in pairs allowed becomes more than 1.1/0.9</p>
                                <p>2. $UniFi holders vote to remove pools that contain it from the collateral whitelist, resulting in a collateral supply that is less than ten or more units of the $WUSD supply.</p>
                                <p>3. Triggered by the imbalance, the protocol initiates Debit Rebalancing. Holders are now able to burn $WUSD to mint Multiplier Tokens at a 1:1 ratio:</p>
                                <p>1x burnt $WUSD mints 1x $2XUSD</p>
                                <p>1x burnt $WUSD mints 1x $5XUSD.</p>
                                <p>4. The $WUSD supply decreases via this burning until supply equilibrium with the collateral is within ten units, at which point Multiplier Token minting is no longer possible.</p>
                                <p><b>Multiplier Tokens</b></p>
                                <p>To incentivize a rapid return to equilibrium during a Debit Rebalancing event, Multiplier Tokens can be burnt when one is not happening to receive more $WUSD than was burnt to mint them. </p>
                                <p>They entitle holders to the amount of $WUSD denoted by their respective tickers:</p>
                                <p>1x $2XUSD can be burnt to receive 2x $WUSD (1:2)</p>
                                <p>1x $5XUSD can be burnt to receive 5x $WUSD (1:5)</p>
                                <p>This $WUSD comes from the $2XUSD and $5XUSD dedicated treasuries, accumulated there via Credit Rebalancing. The $2XUSD treasury accumulates 10% faster than the $5XUSD one. This causes a relative scarcity of $WUSD in the $5XUSD treasury that will affect how $WUSD holders act during a Debit Rebalancing event; it may in fact be more prudent to mint $2XUSD.</p>
                                <figure>
                                    <img src={info3}></img>
                                </figure>
                            </article>
                            <article>
                                <h2>$WUSD Security and Emergency Strategies</h2>
                                <p>1. $WUSD pool collateral is locked in an external smart contract that cannot be unlocked by anyone—not even the Covenants DFO, preventing voter fraud by bad-faith actors.</p>
                                <p>2. In the event of a bug, exploit or generally problematic update, $UniFi holders can vote via the Covenants DFO to pause the smart contract. This prevents the minting or rebalancing of $WUSD. Holders can still redeem $WUSD for pooled collateral.</p>
                                <p>3. In such an event, $UniFi holders can also vote to revert the smart contract to an earlier version with established security. Again, holders can still redeem $WUSD for collateral.</p>
                                <p>4. $UniFi holders cannot change the X2 and X5 treasuries in any way, nor the rate at which they accumulate $WUSD. This prevents any bad-faith governance attacks on the DFO.</p>
                            </article>
                            <article>
                                <h2>Farm $WUSD (coming Soon)</h2>
                                <p>$WUSD is the first ever farmable stablecoin. </p>
                                <p>It can be Free Farmed using Covenant farming contracts, and is rewarded exclusively in more $WUSD. This reward $WUSD comes from the otherwise locked FARM treasury, accumulated there via Credit Rebalancing. </p>
                                <p>The total $WUSD rewards available are calculated based on the amount of $WUSD is in the FARM treasury after each fortnightly Credit Rebalancing, using this formula:</p>
                                <p><b>(x/(y*1.5))/z</b></p>
                                <p>x = $WUSD in the Farm treasury</p>
                                <p>y = two weeks in blocks</p>
                                <p>z = $WUSD staked in Free Farming setups.</p>
                                <p>It is then distributed pro rata to all Free Farmers as per the Free Farming rules.</p>
                                <p>By distributing rewards based on a three week budget (y x 1.5), the FARM treasury ensures a surplus of $WUSD so that there’s always enough available to reward all $WUSD free farming.</p>
                            </article>
                            <article>
                                <h2>Implementing dApps With the $WUSD Protocol</h2>
                                <p>dApps can be implemented with $WUSD auto- wrap/unwrap and other functionalities. Guidelines for this can be found in the <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap3}></img>
                                </span>
                                <header>
                                    <h2>General Purpose Farming Contracts</h2>
                                    <p>Ethereans love to farm. They do it all day and night—apes, penguins and wizards alike. But farming in the State of DeFi is not so well-managed, and the hard-earned harvests of farmers are often at risk.</p>
                                    <p>Covenant farming contracts free Ethereans to farm safely and on their own terms. Anyone can host or participate in free and locked setups that access multiple AMMs at once, and The Aggregator secures integration with each.</p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics</h2>
                                <p>Covenant farming contracts have multi-AMM functionality and are designed to be used by anyone for a wide variety of purposes.</p>
                                <figure>
                                    <img src={info4}></img>
                                </figure>
                                <p><b>Hosting</b></p>
                                <p>Any DAO, DFO, individual wallet or customized smart contract can host a farming setup. They can even have no host at all. This architecture is tio make it easy for hosts to set rules for distributing reward tokens (i.e from a treasury or by mint) without being able to manage farmer tokens or manipulate rewards for locked positions. This secures farmers from exploitation.</p>
                                <p><b>Rewards</b></p>
                                <p>All Covenant farming contracts distribute one reward token. It is the centrepiece of the setup, around which the rest of the contract is customized. This architecture makes calculating the token’s total inflation (based on rewards per block) simple; anyone can easily call all of the farming contract(s) that are using the token as a reward to compute that inflation data. It also makes it easy to manage the customizable extension for the reward method (mint or transfer).</p>
                                <p><b>Setups</b></p>
                                <p>Contracts can be set up as either free (open-ended) or locked (term-fixed). They can also implement the Load Balancer, which allows for dynamic Free-Locked systems.</p>
                            </article>
                            <article>
                                <h2>Free Farming</h2>
                                <p><b>Duration</b></p>
                                <p>Open-ended; farmers can stake / un-stake liquidity anytime.</p>
                                <p><b>Position Availability</b></p>
                                <p>Any amount of farmers can participate anytime in a free farming setup.</p>
                                <p><b>Rewards</b></p>
                                <p>If rewards are not available the setup automatically reach the state "disactive".</p>
                                <p><b>Distribution</b></p>
                                <p>Block-to-block between active farmers pro rata to the % of total liquidity each provides.</p>
                                <p><b>Redeeming</b></p>
                                <p>Rewards can be redeemed anytime with no penalty.</p>
                                <p><b>Hosts</b></p>
                                <p>Hosts can alter the rewards per block anytime. This does not apply retroactively.</p>
                            </article>
                            <article>
                                <h2>Locked Farming</h2>
                                <p><b>Duration</b></p>
                                <p>Block-based fixed terms. Farmers can stake anytime after the setup term commences. Liiquidity is locked until the period’s end block—unless withdrawn prematurely, in which case all rewards already redeemed must be returned. There may be an additional penalty (see Hosting below).</p>
                                <p>Setups can be customized to automatically renew after the end block. However, this doesn’t automatically renew old positions; farmers wanting to open a new one must do so manually.</p>
                                <p><b>Position Availability</b></p>
                                <p>Limited by the amount of rewards still available.</p>
                                <p><b>Rewards</b></p>
                                <p>If rewards are not available the setup automatically reach the state "disactive".</p>
                                <p><b>Fixed Distribution</b></p>
                                <p>Block to block. Farmers receive a fixed, guaranteed % of the total rewards based on</p>
                                <p>1. How much liquidity they stake.</p>
                                <p>2. How many blocks are left in the term when they open the position</p>
                                <p>Rewards are minted and/or transferred and secured for a farmer when their position is staked.</p>
                                <p><b>Redeeming</b></p>
                                <p>Redeemable anytime (but must be returned if a farmer unstakes prematurely).</p>
                                <p><b>Hosts</b></p>
                                <p>Can alter the rewards per block anytime, but this doesn’t affect previously opened positions, only ones opened after the change is made. Hosts may apply an additional penalty fee to premature withdrawals.</p>
                            </article>
                            <article>
                                <h2>The Inflation Load Balancer</h2>
                                <p>The Load Balancer is an optional feature. It allows for dynamic farming systems that coordinate one “pinned” Free setup with multiple Locked setups, and make inflation predictable (even with active Locked setups) while opening up more earning opportunities for farmers.</p>
                                <p>When the Load Balancer is activated, rewards reserved for unfilled Locked setup positions are made available to the Free setup (on top of the other rewards for free farmers). As Locked positions open, rewards automatically reallocate back to them on a pro-rata basis.</p>
                            </article>
                            <article>
                                <h2>Farming Extensions</h2>
                                <p>Covenant farming contracts are extendible. Indeed, they must have extensions to work. These set the parameters for both basic and more advanced functionalities.</p>
                                <p><b>Treasury</b></p>
                                <p>This extension establishes a secure treasury for a setup’s reward token, and is programmed with the logic for how the token, via transfer or minting, will be received and dispensed.</p>
                                <p><b>Hosting</b></p>
                                <p>This extension ensures secure and resilient farming contracts that do not compromise farmer funds or rewards, and which are compliant with the ethOS team’s Responsible DeFi approach.</p>
                                <p>Hosts can alter rewards per block for ongoing free and locked contracts, but any alteration is only implemented with the following block. This ensures that rewards for free farmers up until this block are not affected, nor are rewards for farmers with already opened locked positions.</p>
                                <p>Hosts can also change which free contract is “pinned” to the Load Balancer, and they can also activate / deactivate the Load Balancer. Alterations are implemented with the following block.</p>
                                <p>Any DFO, DAO, smart contract or individual wallet can be a host. Farming setups can also have no host; in this case, its rules are immutable. </p>
                                <p>Guidelines on how to code farming extensions based on your needs can be found in <b>the Grimoire Volume 2: Developer’s Documentation (Coming Soon).</b></p>
                            </article>
                            <article>
                                <h2>Integrating Your dApp or Website With Covenant Farming</h2>
                                <p>Covenant farming contracts are designed for easy integration with external dApps. They greatly simplify reaching on-chain data for external websites and trackers.</p>
                                <p>Guidelines for this can be found in the <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap4}></img>
                                </span>
                                <header>
                                    <h2>General Purpose Fixed Inflation Contracts</h2>
                                    <p>Covenant inflation contracts allow Ethereans to fund projects in a fair and safe way. Anyone can set one up to inflate any variety of tokens at daily, weekly and monthly intervals via minting, swapping and transferring. Free yourself from dependence on ICOs and investors.</p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics</h2>
                                <p>Fixed inflation contracts can be used to automate token supply inflation, treasury management and any other financial operation that needs to be executed in precise, block-based intervals. Contracts are customizable with one or more entries that define these operations and intervals.</p>
                                <p><b>Operations</b></p>
                                <p>All operations are fixed, and involve any combination of the following:</p>
                                <p>1. The minting of token(s)</p>
                                <p>2. The transferral of token(s) from address(es) to address(es)</p>
                                <p>3. The swapping of token(s) within or among AMMs</p>
                                <p><b>Intervals</b></p>
                                <p>The minimum amount of block-based time that must pass between operation executions.</p>
                                <p><b>Rewards</b></p>
                                <p>Contracts can reward manual execution of operations. Rewards are customizable as a % of all tokens involved in the operation. In the case of swap entries, the executor can choose to be rewarded with either the input token or the output token.</p>
                                <p><b>Hosting</b></p>
                                <p>Like Covenant farming contracts, Covenant inflation contracts are designed to be hostable by any DAO, DFO or customized smart contract. </p>
                                <p>The hosting logic of a contract, embedded in an extension, defines the permissions for setting up and managing entries, operations and executor rewards, as well as managing inflation via transfer (if interacting with a treasury) or via mint.</p>
                                <figure>
                                    <img src={info5}></img>
                                </figure>
                            </article>
                            <article>
                                <h2>Integrating Your dApp, Website or Tracker with Covenant Fixed Inflation</h2>
                                <p>Covenant Fair Inflation contracts are designed for easy integration with external dApps.</p>
                                <p>Guidelines for this can be found in the <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <h2>Hosting a Covenant Fixed Inflation Contract</h2>
                                <p>Guidelines on how to code inflation extensions based on your needs can be found in the<b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap5}></img>
                                </span>
                                <header>
                                    <h2>Index Tokens</h2>
                                    <p>Covenant index tokens are Items. Anyone can mint them at the Covenant Bazar (or by calling the smart contracts themselves) by locking a fixed amount of set tokens as collateral, and anyone can burn them to unlock that collateral.</p>
                                    <p>Index tokens can also be set up to feature standard metadata, like an icon and a description. Once minted, no one can alter an index token’s rules, and it will always be available to mint.</p>
                                </header>
                            </article>
                            <article>
                                <figure>
                                    <img src={info6}></img>
                                </figure>
                                <h2>Integrate Your dApp or Website with Covenant Index Tokens</h2>
                                <p>Covenant index tokens are designed for easy integration with external dApps.</p>
                                <p>You can find guidelines for this in the <b>Grimoire Volume 2: Developer’s Documentation.</b></p>
                            </article>
                        </section>
                    </article> 
                </div>
            }
        </>
    )
}

export default Grimoire;