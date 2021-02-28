import dragonImage from '../../assets/images/index.png';

const lorem = 'Wizard, penguin, something else entirely—it does not matter who you are. This is a haven for all Ethereans seeking peace and prosperity in the DeFi universe.';
const lorem2 = 'Here you will find Covenants. Empowered by the Aggregator, these contracts free us to create, control and customize our experience like never before.';

const Index = () => {
    return (
        <div className="DappBox">
                    <div className="CovTITLE">
                        <figure>
                            <img src={dragonImage} className="index-image" />
                        </figure>
                    </div>
                    <div className="page-container-col DescCov">
                        <h5 className="welcome">Welcome</h5>
                        <p className="index-paragraph">{lorem}</p>
                        <p className="index-paragraph">{lorem2}</p>
                    </div>
                </div>
    )
}

export default Index; 