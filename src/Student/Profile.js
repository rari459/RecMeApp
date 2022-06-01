import React, {useEffect, useState} from 'react';
import { NavBar } from './components/NavBar';
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from 'react-router-dom';
import { getUserData, getuserDoc } from './models/User';
import { UserDetails } from './components/UserDetails';


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
 
export const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({ authProvider: "", name: "", email: "", uid : "", statement: ""});
  const [userDoc, setUserDoc] = useState();
  const navigate = useNavigate();

  

  useEffect(() => {
    async function checkUserExists() {
      if (user.uid) {
        const result = await getUserData(user.uid);
        const userDoc = await getuserDoc(user.uid);
        setUserData(result);
        setUserDoc(userDoc);
      } else {
        console.log('error')
      }
    }
    checkUserExists();
  }, [user]);


  return(
    
    <>
    <NavBar/>
    {user && <UserDetails {...userData}/>}
    
    {!user && <div>
    <div style = {loginStyle.container}>
    <div style = {loginStyle.box}>
    <button style = {loginStyle.button} onClick={navigate('/login')}>
            Login</button></div>
    </div>
    </div>
    }
    </>
  )
};

