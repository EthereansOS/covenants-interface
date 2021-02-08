import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageContainer = (props) => {
    return (
            <div className="page-container IndexRegular">
                <div className="IndexRegularContents">
                    <div className="IndexRegularText">
                        { props.title ? <h3><b>{props.title}</b></h3> : '' }
                        { props.text ? <p>{props.text}</p> : props.children }
                    </div>
                    { props.image ? 
                        <div className="IndexRegularImg">
                            <img src={props.image} height={props.imageHeight || 350} />
                        </div> : '' 
                    }
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