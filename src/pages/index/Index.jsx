import dragonImage from '../../assets/images/index.png';

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Index = () => {
    return (
        <div className="page-container-wrapper">
            <div className="page-container">
                <div className="page-container-row index-container-row">
                    <div className="page-container-col index-container-col">
                        <img src={dragonImage} className="index-image" />
                        <h2 className="index-title">COVENANTS</h2>
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