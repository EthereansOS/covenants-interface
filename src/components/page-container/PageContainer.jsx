import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageContainer = (props) => {
    return (
        <div className="DappBox IndexRegular">
                { props.image ? 
                        <div className="IndexRegularImg">
                            <img src={props.image} height={props.imageHeight || 350} />
                        </div> : '' 
                    }
                    <div className="IndexRegularText">
                        { props.title ? <h3><b>{props.title}</b></h3> : '' }
                        { props.text ? <p>{props.text}</p> : props.children } 
                    </div>
                {
                    props.launchDapp ? 
                    <div className="IndexRegularBTN">
                        <Link to={props.link}>
                            <button className="btn btn-Fantasy">DAPP</button>
                        </Link>
                    </div> : !props.hideButton ?
                    <div className="IndexRegularBTN">
                        <button className="btn btn-Fantasy" disabled={!props.buttonEnabled} onClick={() => props.onClick ? props.onClick() : console.log('Coming soon.')}>{ props.buttonText}</button>
                    </div> : <div/>
                }
                <div className="FooterP">
                <p>Covenants is an <a href="https://ethereansos.eth.link">EthOS</a> research and development project. <b>Use it at your own risk!</b> This protocol is ruled by the <a href="https://dapp.dfohub.com/?addr=0xeFAa6370A2ebdC47B12DBfB5a07F91A3182B5684">Covenants DFO</a>  a fully decentralized organization that operates 100% on-chain without the involvement of any legal entity. If you find a bug, please notify us on our <a href="https://github.com/b-u-i-d-l">Github</a></p>
                </div>
            </div>
    )
}

PageContainer.propTypes = {
    image: PropTypes.string,
    imageHeight: PropTypes.number,
    launchDapp: PropTypes.bool,
    link: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
}

export default PageContainer;