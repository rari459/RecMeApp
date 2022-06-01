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
      marginBottom: '10%'
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
 
export const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  return(
    <>
    <NavBar/>
    <div style = {loginStyle.container}>
    <div style = {loginStyle.box}>
      <h1>Reset Password</h1>
    
      <form>
        <div className="reset">
      <div style = {{display: 'flex', flexDirection: 'column'}}>
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
          style = {loginStyle.textBox}
        />
        <button
          className="reset__btn"
          onClick={() => sendPasswordReset(email)}
          style = {loginStyle.button}
        >
          Send Reset Email
        </button>
      </div>
    </div>
      </form>
    </div>
    
    </div>
    </>
  )
};

