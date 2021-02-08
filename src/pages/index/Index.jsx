import dragonImage from '../../assets/images/index.png';

const lorem = 'Here you will find Covenants. Empowered by The Aggregator, these contracts allow anyone to create, control and customize their own DeFi experience.';

const Index = () => {
    return (
        <div className="page-container-wrapper">
            <div className="page-container">
                <div className="page-container-row index-container-row">
                    <div className="page-container-col index-container-col">
                        <img src={dragonImage} className="index-image" />
                        <h2 className="index-title">Covenants</h2>
                    </div>
                    <div className="page-container-col">
                        <p className="index-paragraph">{lorem}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;