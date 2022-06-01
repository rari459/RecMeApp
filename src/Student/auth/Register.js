import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "../../firebase";
import { NavBar } from "../components/NavBar";


const regStyle = {
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
      width: '100%',
      
    },
    textBox : {
      padding: 10,
      fontSize: 18,
      marginBottom: 10,
    }
}

export const Register = ()  =>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useNavigate();

const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };
  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/dashboard");
  }, [user, loading]);
  return (
    <>
    <NavBar/>
    <div style = {regStyle.container}>
      <div style = {regStyle.box}>
        <h1>Register</h1>
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          style = {regStyle.textBox}
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
          style = {regStyle.textBox}
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style = {regStyle.textBox}
        />
        <button className="register__btn" onClick={register} style = {regStyle.button}>
          Register
        </button>
        <div style = {{fontSize: 18, marginRight: 'auto'}}>
          Already have an account? <br/>
          <Link to="/login" style = {{textDecoration: 'none', color: 'white'}}
          > <u><b>Login</b></u></Link> now.
        </div>
        
      </div>
    </div>
    </>
  );
}