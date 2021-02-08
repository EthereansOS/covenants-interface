import dragonImage from '../../assets/images/index.png';

const lorem = 'Whether you are an ape, a penguin or a wizard, you can call this place home. We offer a haven for all Ethereans seeking freedom and prosperity';
const lorem2 = 'Here you will find Covenants. Empowered by The Aggregator, these contracts allow anyone to create, control and customize their own DeFi experience like never before.';

const Index = () => {
    return (
        <div className="page-container-wrapper">
            <div className="page-container">
                <div className="page-container-row index-container-row">
                    <div className="page-container-col index-container-col CovTITLE">
                        <figure>
                            <img src={dragonImage} className="index-image" />
                        </figure>
                    </div>
                    <div className="page-container-col DescCov">
                        <p className="index-paragraph">{lorem}</p>
                        <h5 className="welcome">Welcome</h5>
                        <p className="index-paragraph">{lorem2}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;