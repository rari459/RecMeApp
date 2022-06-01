import React, {useEffect, useState} from 'react';
import { NavBar } from '../components/NavBar';
import { auth, logInWithEmailAndPassword, sendPasswordReset } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {Link, useNavigate} from 'react-router-dom';

const loginStyle = {
    container : {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      height: '100vh',
      alignItems: 'center',
      backgroundColor: 'white'
 
    },
    box : {
      display: 'flex',
      backgroundColor: '#A50035',
      flexDirection: 'column',
      padding: '2%',
      borderRadius: 10,
      color: 'white',
      marginBottom: '10%',
      alignItems: 'center'
    },
    button : {
      padding: 10,
      fontSize: 18,
      marginBottom : 10,
      border: 'none',
      color : 'white',
      backgroundColor: 'black',
      width: '100%'
    },
    textBox : {
      padding: 10,
      fontSize: 18,
      marginBottom: 10,
    }
}
 
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return(
    <>
    <NavBar/>
    <div style = {loginStyle.container}>
    <div style = {loginStyle.box}>
      <h1>Welcome!</h1>
    
      <div>
        <label>
          <input type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
          style = {loginStyle.textBox}/>
        </label>
        <label>
          <p></p>
          <input type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style = {loginStyle.textBox}/>
        </label>
        <div>
          <button style = {loginStyle.button} onClick={() => logInWithEmailAndPassword(email, password)}>
            Login</button>
        </div>
        <div style = {{fontSize: 18}}>
          Don't have an account? <br/>
          <Link to="/register" style = {{textDecoration: 'none', color: 'white'}}
          > <u><b>Register</b></u></Link> now.
        </div>
        <div style = {{marginTop: 30, alignContent: 'center'}}>
        <Link to="/reset" style = {{textDecoration: 'none', color: 'white',}}
          > <i><b>Forgot Password?</b></i></Link>
        </div>
      </div>
    </div>
    
    </div>
    </>
  )
};

