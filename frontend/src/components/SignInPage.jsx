import React,{useEffect, useState} from 'react'
import "./SignUpPage.css"
import { ToastContainer, toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignInPage() {
    const {userToken,setUserToken} = useAuth();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    if(userToken){
        return <Navigate to="/" replace={true} />
      }
    async function runSignup(){
        try {
            const response = await fetch('https://unsolved-vnfg.vercel.app//signin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                password: password,
                email:email
               }) 
            });
            const result = await response.json();
            if(result.message === "User logged in successfully"){
              localStorage.setItem("token",result.token);
              setUserToken(result.token)
              toast.success(result.message);
            }
            else{
                toast.error(result.message);
            }
          } catch (error) {
            toast.error(error);
          }
    }

  return (
    <div className="signUpform">
        <div className="signupform roboto-mono">
          Sign In Here..
        </div>
        <div className="signupformelements roboto-mono">
          <div className="signupitem">
            <label htmlFor="userName">Enter Email </label>
            <input type="text" required onChange={(e)=>{setEmail(e.target.value)}}/>
          </div>
          <div className="signupitem">
            <label htmlFor="password">Password </label>
            <input type="password" required onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>
          <button onClick={()=>{runSignup()}}>SignIn</button>
        </div>
      </div>
  )
}
