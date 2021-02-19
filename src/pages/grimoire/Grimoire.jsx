import { PageContainer } from "../../components";
import homeInflationImage from '../../assets/images/6.png';
import { Route, Switch } from "react-router-dom";
import chap1 from '../../assets/images/sword.png';
import chap2 from '../../assets/images/wusd.png';
import chap3 from '../../assets/images/farm.png';
import chap4 from '../../assets/images/cloud.png';
import chap5 from '../../assets/images/bread.png';
import chap6 from '../../assets/images/ethereum.png';
import info1 from '../../assets/images/infographics/orchestrator.png';
import info2 from '../../assets/images/infographics/orchestrator_1.png';
import info3 from '../../assets/images/infographics/wusd.png';
import info4 from '../../assets/images/infographics/farming.png';
import info5 from '../../assets/images/infographics/inflation.png';
import info6 from '../../assets/images/infographics/indexes.png';
import { useState } from "react";

const lorem = 'Issued by the School of Responsible Wizardry, the Grimoire is the official Covenant spellbook. It will teach you all about Covenant magic so that you can tap into its full potential.';

const Grimoire = () => {
    const [showGrimoire, setShowGrimoire] = useState(false);


    return (
        <>
            <PageContainer image={homeInflationImage} buttonEnabled={true} onClick={() => setShowGrimoire(!showGrimoire)} imageHeight={300} text={lorem} title={"Grimoire"}  buttonText={!showGrimoire ? "Read" : "Hide"} />
            {
                showGrimoire && <div className="grimoireBox">
                    <article className="grimoireAll">
                        <section className="GrimoureContent">
                            <h1>Grimoire Vol. 1 For General Users</h1>
                            <article>
                                <span>
                                    <img src={chap1}></img>
                                </span>
                                <header>
                                    <h2>The Aggregator</h2>
                                    <p>At the heart of every Covenant is the Aggregator. By liberating on-chain AMM aggregation, it allows any wallet, DAPP, DFO, DAO or customized smart contract to farm, inflate, multi-swap, arbitrage, craft liquidity, collateralize stablecoins and more across multiple AMMs at the same time.</p>
                                </header>
                            </article>
                            <article>
                                <h2>On-Chain Aggregators vs Semi On-Chain Aggregators</h2>
                                <p>The Aggregator is the first ever on-chain AMM aggregator.</p>
                                <p>All other aggregators—1inch, for example—operate semi on-chain. While excellent at finding the best prices for trades, they process all transactions via their off-chain frontends. Smart contracts cannot read frontends, so they can’t interact with these aggregators. Only human individual wallets and off-chain arbitration bots can, and only for basic token swaps.</p>
                                <p>The Covenant Aggregator is free from such limitations. It is equipped with AMM-standardizing Solidity APIs that smart contracts can read. This means that any wallet, dApp, DAO, DFO or customized smart contract can use it, and for much more than just token swaps. It unlocks multi-AMM farming, on-chain arbitrage, token inflation, liquidity crafting, stablecoin collateralization and more.</p>
                                <figure>
                                    <img src={info1}></img>
                                </figure>
                            </article>
                            <article>
                                <h2>AMM-Standardizing APIs</h2>
                                <p>All AMMs implement the same three basic functions—swap liquidity, add liquidity and remove liquidity—in different ways. Uniswap routes users to liquidity pools via hard-coded lists; Mooniswap connects users directly; Balancer allows for multi-token pools; and so on.</p>
                                <p>However, they all do this using the same standard logic. The Aggregator’s APIs interact with each AMM via the pathways of this logic, and this is how it can facilitate fully on-chain aggregation and the unprecedented possibilities instantiated by Covenant contracts.</p>
                                <p>The Covenants DFO, governed by $UniFi holders, is responsible for all listing.</p>
                                <figure>
                                    <img src={info2}></img>
                                </figure>
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
                                <h2>The Orchestrator</h2>
                                <p>This is the Aggregator’s extendible knowledge base. It keeps track of all whitelisted AMMs and allows them to be upgraded / downgraded via a plugin system. There are multiple plugins for each AMM, each with its own version number, upgradable features and previous bug fixes.</p>
                            </article>
                            <article>
                                <h2>Integrate Your dApp With the Aggregator</h2>
                                <p>All Ethereum dApps can be integrated with the Aggregator, a fully decentralized protocol. And whenever $UniFi holders—via governance of the Covenants DFO—whitelist the Aggregator with a new AMM, integrated dApps can interact with it immediately and automatically.</p> 
                                <p>You can find guidelines on how to do this in the <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap2}></img>
                                </span>
                                <header>
                                    <h2>Wrapped USD</h2>
                                    <p>One stablecoin to pool them all in all the pools of DeFi. $WUSD is minted at the confluence of other stablecoins, which stream out and collateralize it in the pools of AMMs everywhere. Free from any oracle or issuer, it is the most resilient and decentralized stablecoin out there—and the first you can farm.</p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics </h2>
                                <p>$WUSD is minted by collateralizing pairs of whitelisted stablecoins in the pools of whitelisted AMMs. By decentralizing the distribution of its collateral, and capable of rebalancing it for stability, $WUSD is not vulnerable to any single point of failure; it can only fail if the entire stablecoin industry collapses. The protocol is governed exclusively by $UniFi holders via the Covenants DFO, and cannot be censored or manipulated by any state, issuer or any other off-chain centralized intermediary.</p>
                                <p>$WUSD the most resilient stablecoin there is, and is unstoppable as Ethereum itself.</p>
                            </article>
                            <article>
                                <h2>Minting & Burning </h2>
                                <p>Anyone can mint and burn $WUSD anytime using the Covenants frontend (or by calling the smart contracts themselves).</p>
                                <p><b>Minting</b></p>
                                <p>$WUSD is minted by collateralizing stablecoins that have been whitelisted by the Covenants DFO across Aggregator-whitelisted AMM pools at a 1:1 ratio.</p>
                                <p>Example</p>
                                <p>Mint 2x $WUSD by adding 1x Stablecoin A and 1x Stablecoin B </p>
                                <p><b>Burning</b></p>
                                <p>$WUSD collateral can be retrieved by burning $WUSD at the same ratio.</p>
                                <p>Example</p>
                                <p>Burn 2x $WUSD and receive 1x Stablecoin A and 1x Stablecoin C </p>
                            </article>
                            <article>
                                <h2>Rebalancing</h2>
                                <p>Certain events can destabilize the $WUSD : collateral supply equilibrium. The protocol can restore it using two secure rebalancing methods, and profits in the process.</p>
                                <p><b>Credit Rebalancing</b></p>
                                <p>The $WUSD protocol, by providing its stablecoin collateral to liquidity pools, earns additional stablecoins from trading fees. These are equal to an excess in the collateral supply relative to the $WUSD supply.</p>
                                <p>To restore equilibrium, the $WUSD protocol can mint the equivalent amount of $WUSD. Called ‘Credit Rebalancing’, this can be manually executed by anyone via the DFO once a fortnight. The executor is rewarded with 2% of the newly minted $WUSD.</p>
                                <p>The rest is distributed as follows:</p>
                                <p>8% to the Covenants treasury, owned and ruled by $UniFi holders</p>
                                <p>60% to the FARM treasury (coming Soon), dedicated to rewarding $WUSD farming</p>
                                <p>20% to the $2XUSD treasury, reserved for Debit Rebalancing</p>
                                <p>10% to the $5XUSD treasury, also reserved for Debit Rebalancing</p>
                                <p><b>Debit Rebalancing</b></p>
                                <p>If one of the $WUSD protocol’s collateralized stablecoins fails and loses value, this will lead to  a lower collateral supply relative to the $WUSD supply. If it falls ten or more units lower, this will trigger the $WUSD protocol to enable the burning of $WUSD to mint Multiplier Tokens until equilibrium is restored.</p>
                                <p>Here’s an example of how this would play out:</p>
                                <p>1. CZ rugs. The $BUSD protocol fails. $BUSD’s price tanks and it loses all value.</p>
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
                                <h2>Other $WUSD Security and Emergency Strategies</h2>
                                <p>1. $WUSD pool collateral is locked in an external smart contract that cannot be unlocked by anyone—not even the Covenants DFO, preventing voter fraud by bad-faith actors.</p>
                                <p>2. In the event of a bug, exploit or generally problematic update, $UniFi holders can vote via the Covenants DFO to pause the smart contract. This prevents the minting or rebalancing of $WUSD. Holders can still redeem $WUSD for pooled collateral.</p>
                                <p>3. In such an event, $UniFi holders can also vote to revert the smart contract to an earlier version with established security. Again, holders can still redeem $WUSD for collateral.</p>
                                <p>4. $UniFi holders cannot change the X2 and X5 treasuries in any way, nor the rate at which they accumulate $WUSD. This prevents exploitative governance attacks on the DFO.</p>
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
                                <p>The calculated total is distributed to farmers in line with Free Farming rules.</p>
                                <p>By distributing rewards based on a three week budget (y x 1.5), the FARM treasury ensures a surplus of $WUSD so that there’s always enough available to reward all $WUSD free farming.</p>
                            </article>
                            <article>
                                <h2>Integrating dApps With the $WUSD Protocol</h2>
                                <p>ddApps can be implemented with $WUSD auto- wrap/unwrap and other functionalities.</p> 
                                <p>Guidelines for this can be found in the <b>Grimoire Volume 2: Developer’s Documentation (coming Soon)</b></p>
                            </article>
                            <article>
                                <span>
                                    <img src={chap3}></img>
                                </span>
                                <header>
                                    <h2>Covenant Farming</h2>
                                    <p>Ethereans love to farm. They do it all day and night—apes, penguins and wizards alike. But farming in DeFi is not always well-managed, and the hard-earned harvests of farmers are often at risk. </p>
                                    <p>Covenant farming contracts allow us to farm safely and on our own terms. Anyone can host or participate in Free and Locked setups that pool tokens across multiple AMMs at once, and even free-locked hybrids using the Load Balancer.</p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics</h2>
                                <p>Covenant farming contracts have multi-AMM functionality and are designed to be used by anyone for a wide variety of purposes.</p>
                                <figure>
                                    <img src={info4}></img>
                                </figure>
                                <p><b>Hosting</b></p>
                                <p>Any DAO, DFO, individual wallet or customized smart contract can host a farming setup. You can even set it up to have no host at all. This flexible design makes it easy to set rules for distributing rewards (from a treasury or via minting) while preventing hosts from touching farmer tokens or manipulating rewards for locked positions, securing farmers from exploitation.</p>
                                <p><b>Rewards</b></p>
                                <p>All setups reward farmers with one token. It is the centrepiece of the setup, around which the rest of the contract is customized. This simplifies managing the customizable extension for each setup’s reward method (Mint or Transfer) and makes it easy to calculate the total amount of the token being inflated via rewards. All anyone has to do is call the setup(s) using it as a reward and they will be provided with the relevant data.</p>
                                <p><b>Setups</b></p>
                                <p>Farming setups can be either Free or Locked, and can implement the inflation Load Balancer, which allows for dynamic Free-Locked systems (scroll down for more).</p>
                                <p>All setups can be customized to automatically renew immediately after they end. However, this does not automatically renew old positions; new ones must be opened manually.</p>
                            </article>
                            <article>
                                <h2>Free Farming</h2>
                                <p><b>Duration</b></p>
                                <p>Block-based fixed periods. Farmers can stake / un-stake liquidity anytime.</p>
                                <p><b>Position Availability</b></p>
                                <p>Any amount of farmers can participate anytime in a free farming setup.</p>
                                <p><b>Rewards</b></p>
                                <p>Availability</p>
                                <p>Provided by the host and locked in a treasury extension before the setup commences.</p>
                                <p>Distribution</p>
                                <p>Block-to-block among active farmers pro rata to the % of total liquidity each provides.</p>
                                <p>Redemption</p>
                                <p>Rewards can be redeemed anytime with no penalty.</p>
                                <p><b>Hosting</b></p>
                                <p>Hosts can alter the rewards per block anytime. This does not apply retroactively.</p>
                            </article>
                            <article>
                                <h2>Locked Farming</h2>
                                <p><b>Duration</b></p>
                                <p>Fixed block-based periods. Farmers can stake a position anytime after the period commences, but cannot unstake until it ends—at least not without incurring penalties (see below).</p>
                                <p>Setups can be customized to automatically renew immediately after the period ends. However, this does not automatically renew old positions. Farmers who wish to open new ones must do so manually.</p>
                                <p><b>Position Availability</b></p>
                                <p>A position can be opened only if enough rewards are still available.</p>
                                <p><b>Rewards</b></p>
                                <p>Availability</p>
                                <p>Provided by the host and locked a treasury extension before the setup commences.</p>
                                <p>Distribution</p>
                                <p>Block-to-block. Farmers receive guaranteed rewards based on:</p>
                                <p>1. How much liquidity they stake.</p>
                                <p>2. How many blocks are left when the position is staked before the period ends.</p>
                                <p>Before a setup can commence, all rewards must be sent by the host to the contract's treasury extension, which distributes them to farmers as per the fixed block-to-block terms.</p>
                                <p>Redemption</p>
                                <p>Redeemable as they become available from the block-to-block distribution. (but must be returned if a farmer unstakes prematurely).</p>
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
                                <p>Covenant farming contracts are extendible. Extensions set the parameters for both basic and more advanced functionalities.</p>
                                <p><b>Treasury</b></p>
                                <p>This extension establishes a secure treasury for a setup’s reward token, and is programmed with the logic for how the token—i.e, via transfer or mint—will be distributed.</p>
                                <p><b>Hosting</b></p>
                                <p>This extension establishes a secure treasury for a setup’s reward token, and is programmed with the logic for how the token—i.e, via transfer or mint—will be distributed.</p>
                                <p><b>Rewards</b></p>
                                <p>Hosts can alter the rewards distributed per block for active Free and Locked setups, but this is only implemented with the next block. This does not affect already staked locked positions.</p>
                                <p><b>Pinning</b></p>
                                <p>Hosts can change for active setups which free contract is “pinned” to the Load Balancer as well as activate / deactivate the Load Balancer.</p>
                                <p><b>Hosts</b></p>
                                <p>Any dApp, DAO, DFO, individual wallet or customized smart contract can be a host. Setups can even have no host at all, in which case its rules are immutable.</p>
                                <p>Guidelines on how to code farming extensions based on your needs can be found in the <b>the Grimoire Volume 2: Developer’s Documentation (Coming Soon).</b></p>
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
                                    <h2>Covenant Inflation</h2>
                                    <p>Covenant inflation contracts allow Ethereans to fund their magical projects in a fair and safe way. Anyone can set one up to inflate any variety of tokens at daily, weekly and monthly intervals via minting, swapping and transferring. Don’t depend on ICOs or worry about soliciting investors anymore.</p>
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
                            <article>
                                <span>
                                    <img src={chap6}></img>
                                </span>
                                <header>
                                    <h2>The Covenants Decentralized Flexible Organization (DFO)</h2>
                                    <p>Covenants is a DFO, dedicated to researching, developing and governing a responsible Decentralized Finance protocol on Ethereum. </p>
                                </header>
                            </article>
                            <article>
                                <h2>The Basics</h2>
                                <p>Built on the DFOhub standard, Covenants operates entirely on-chain and is completely independent from centralized entities. It is ruled by its on-chain equity $UniFi. $UniFi holders have full ownership of the protocol. They govern all of its assets and every line of code.</p>
                            </article>
                            <article>
                                <h2>Earnings</h2>
                                <p>The Covenants DFO earns from a few small fees. All are currently set to 0%, aside from the fee for $WUSD minting and burning. After DFOhub upgrades to v0.5, $UniFi holders will be able to increase and govern these fees using the subDAO system.</p>
                                <p><b>List of active Covenants Organization's fees</b></p>
                                <p>1. 8% of $WUSD Rebalance by Credit</p>
                                <p><b>List of (presently) inactive Covenants Organization's fees</b></p>
                                <p>1. 0.005% to 0.05% for unstaking farm positions</p>
                                <p>2. 0.005% to 0.05% Fixed Inflation operation execution</p>
                                <p>More fees will be introduced in the future as more functionalities are rolled out.</p>
                            </article>
                        </section>
                    </article> 
                </div>
            }
        </>
    )
}

export default Grimoire;