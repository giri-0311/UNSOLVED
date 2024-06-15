import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';  
import SignUpPage from "./components/SignUpPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
