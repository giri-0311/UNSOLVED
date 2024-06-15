import React,{useState} from 'react'
import "./SignUpPage.css"

export default function SignUpPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

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
              localStorage.setItem("token",result.token);
            }
          } catch (error) {
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
          <button onClick={()=>{runSignup()}}>SignUp</button>
        </div>
      </div>
  )
}
