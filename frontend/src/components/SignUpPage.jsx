import React,{useState} from 'react'
import "./SignUpPage.css"
import { ToastContainer, toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignUpPage() {
    const {userToken,setUserToken} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    if(userToken){
      return <Navigate to="/" replace={true} />
    }
    async function runSignup(){
        try {
            const response = await fetch('http://localhost:3000/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                email: email,
                password: password,
                username: username
               }) 
            });
            const result = await response.json();
            console.log(result.message);
            if(result.message === "User created successfully"){
              toast.success("User created successfully")
              localStorage.setItem("token",result.token);
              setUserToken(result.token);
            }
            else{
              toast.error(result.message)
            }
          } catch (error) {
            toast.error(error);
            console.error('Error:', error);
          }
    }

  return (
    <div className="signUpform">
        <div className="signupform roboto-mono">
          Sign Up Here..
        </div>
        <div className="signupformelements roboto-mono">
          <div className="signupitem">
            <label htmlFor="emailAddress">Enter Email address</label>
            <input type="email" required  onChange={(e)=>{setEmail(e.target.value)}}/>
          </div>
          <div className="signupitem">
            <label htmlFor="userName">Enter Username </label>
            <input type="text" required onChange={(e)=>{setUsername(e.target.value)}}/>
          </div>
          <div className="signupitem">
            <label htmlFor="password">Password </label>
            <input type="password" required onChange={(e)=>{setPassword(e.target.value)}}/>
          </div>
          <Link to="/signin">Already have an account</Link>
          <button onClick={()=>{runSignup()}}>SignUp</button>
        </div>
      </div>
  )
}
