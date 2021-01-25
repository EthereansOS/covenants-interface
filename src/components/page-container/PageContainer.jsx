import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageContainer = (props) => {
    return (
        <div className="page-container-wrapper">
            <div className="page-container">
                <div className="page-container-row">
                    <div className="page-container-col">
                        { props.title ? <h2>{props.title}</h2> : '' }
                        { props.text ? <p>{props.text}</p> : props.children }
                    </div>
                    { props.image ? 
                        <div className="page-container-col">
                            <img src={props.image} height={props.imageHeight || 350} />
                        </div> : '' 
                    }
                </div>
                {
                    props.launchDapp ? 
                    <div className="page-container-row">
                        <Link to={props.link}>
                            <button className="btn btn-primary">DAPP</button>
                        </Link>
                    </div> : <div/>
                }
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