import city from "../../../assets/images/city.png"
const Footer = () => {
    return (

        <div className="Footer">
            <p>Covenats is a protocol by <a href="https://ethereansos.eth.link">EthOS</a>. This is an R&D project <b>use it at your own risk!</b> This protocol is ruled by the <a href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a> A Fully On-Chain Organization, without any real world legal entity involved. If you find a bug, please help us to improve by our <a href="https://github.com/b-u-i-d-l">Github</a></p>
            <img src={city}></img>
        </div>
    )
}

export default Footer;