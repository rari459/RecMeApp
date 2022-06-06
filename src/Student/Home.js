import { useState } from "react";
import {NavBar} from "./components/NavBar"
import LOR from "./assets/LOR.png"


const homeStyle = {
    container : {
        //backgroundImage: 'linear-gradient(to bottom right, #F65151, #F65151)',
        backgroundColor: 'white'
    },
    welcome : {
        display: 'flex',
        fontSize : 40,
        alignItems : 'center',
        justifyContent: '',
        paddingLeft: '5%',
        height: 600,
        width: '50%',
        flexDirection: 'row',
        marginTop: -50,
        lineHeight: 1.8,
    }, 
    mainText :{
        paddingLeft: 40,
        paddingRight : 30,
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: '#A50035',
        color: 'white',
        borderRadius: 10,

    },
    img : {
        width: '100%',
        height: 'auto',
        position: 'absolute',
        marginRight: 10,
    }
}


export const Home = () => {
  return (
    <>
    <NavBar/>

    <div style = {homeStyle.container}>
    <div style = {homeStyle.welcome}>
        <div style = {homeStyle.mainText}>
        <p>Meet <b>RecMe App</b>, a new way <br></br> to send, store, and receive <br></br>
        letters of recommendation. <br></br> 
        {/*Secure, automated, and convenient,*/} </p>

        </div>
        {/*<img 
        src= {LOR}
        alt="new"
        />*/}
    </div>
    </div>
    </>
  );
};
