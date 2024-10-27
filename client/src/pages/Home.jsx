import { useLoaderData } from "react-router-dom";
import Caurosel from "../components/Caurosel";
import TabCategories from "../components/TabCategories";



const Home = () => {


    return (
        <div>
           <Caurosel></Caurosel>
           <TabCategories/>
        </div>
    );
};

export default Home;