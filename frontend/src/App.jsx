import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';  
import SignUpPage from "./components/SignUpPage";
import Navbar from "./components/Navbar";
import SignInPage from "./components/SignInPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/signin" element={<SignInPage/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
