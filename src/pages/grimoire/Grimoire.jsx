import { PageContainer } from "../../components";
import homeInflationImage from '../../assets/images/1.png';
import { Route, Switch } from "react-router-dom";
import { useState } from "react/cjs/react.development";

const lorem = 'Issued by the School of Responsible Wizardry, the official Covenant spellbook will teach you how to cast Covenant magic correctly.';

const Grimoire = () => {
    const [showGrimoire, setShowGrimoire] = useState(false);


    return (
        <>
            <PageContainer image={homeInflationImage} buttonEnabled={true} onClick={() => setShowGrimoire(!showGrimoire)} imageHeight={300} text={lorem} title={"Grimoire"}  buttonText={!showGrimoire ? "Read" : "Hide"} />
            {
                showGrimoire && <div style={{width: 400, height: 400, backgroundColor: 'white'}}>
                    Dio porco 
                </div>
            }
        </>
    )
}

export default Grimoire;