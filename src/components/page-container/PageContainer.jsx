import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const PageContainer = (props) => {
    return (
        <div className="page-container-wrapper mt-4 mt-md-0">
            <div className="page-container">
                <div className="page-container-row">
                    <div className="col-md-6 col-12 flex flex-column mb-4 mb-md-0" style={{justifyContent: 'space-evenly'}}>
                        { props.title ? <h3><b>{props.title}</b></h3> : '' }
                        { props.text ? <p>{props.text}</p> : props.children }
                    </div>
                    { props.image ? 
                        <div className="col-md-6 col-12 flex justify-content-center align-items-center my-4 my-md-0">
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