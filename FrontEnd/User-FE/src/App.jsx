import AboutUs from "./pages/AboutUs";
import { BrowserRouter,Routes,Route } from "react-router";
import Home from "./components/Home";
import FarmHub from "./components/FarmHub";
import ChatAI from "./components/ChatAI";
import New from "./components/New";
import ProductType from "./components/ProductType";
 import AboutUs from "./pages/AboutUs"; 
import Register from "./pages/Register";
import Evaluation from "./components/Evaluation";

function App() {
  return (
    <>
       <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<Home/>}/>
                    <Route path="/aboutUs" exact element={<AboutUs/>}/>
                    <Route path="/farmHub" exact element={<FarmHub/>}/>
                    <Route path="/chatAI" exact element={<ChatAI/>}/>
                    <Route path="/new" exact element={<New/>}/>
                    <Route path="/farmHub/product/type" exact element={<ProductType/>}/>
                    <Route path="/register" exact element={<Register/>}/>
                    <Route path="/aboutUs" exact element={<AboutUs/>}/>
                    <Route path="/evaluation" exact element={<Evaluation/>}/>
                </Routes>
            </BrowserRouter>
        </div>
      
    </>
  );
}
export default App;
