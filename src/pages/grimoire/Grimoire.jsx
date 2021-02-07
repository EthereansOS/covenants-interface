import { PageContainer } from "../../components";
import homeInflationImage from '../../assets/images/1.png';
import { Route, Switch } from "react-router-dom";
import { useState } from "react/cjs/react.development";

const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque quia consequuntur id magnam tempore animi eveniet quod dolor ipsa illo? Iure illo alias rem sapiente illum error laborum voluptatum quasi!';

const Grimoire = () => {
    const [showGrimoire, setShowGrimoire] = useState(false);


    return (
        <>
            <PageContainer image={homeInflationImage} onClick={() => setShowGrimoire(!showGrimoire)} imageHeight={300} text={lorem} title={"Grimoire"}  buttonText={!showGrimoire ? "Read" : "Hide"} />
            {
                showGrimoire && <div style={{width: 400, height: 400, backgroundColor: 'white'}}>
                    Dio porco 
                </div>
            }
        </>
    )
}

export default Grimoire;