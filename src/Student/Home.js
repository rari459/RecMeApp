import { useState } from "react";
import {NavBar} from "./components/NavBar"
import Image from "./assets/recommendation-contract.png"
import Dashboard from "./assets/Dashboard.png"
import { useSpring, animated } from 'react-spring'
import ReactCardFlip from 'react-card-flip';
import { BallFlipCard } from "./components/BallFlipCard";


const homeStyle = {
    container : {
        //backgroundImage: 'linear-gradient(to bottom right, #F65151, #F65151)',
        backgroundColor: 'white',
        width: '100vw',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'row',
        height: '100vh'
    },
    welcome : {
        display: 'flex',
        flexDirection: 'row',
        fontSize : 40,
        alignItems : 'center',
        paddingLeft: '5%',
        height: '100vh',
        marginTop: -50,
        lineHeight: 1.8,
       //backgroundColor: 'yellow',
        maxWidth: '100%',
    }, 
    mainText :{
        paddingLeft: 40,
        paddingRight : 30,
        paddingTop: 50,
        paddingBottom: 50,
        backgroundColor: '#A50035',
        color: 'white',
        borderRadius: 10,
        diplay: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        marginRight: '10vw'
    },
    sideText : {
        paddingLeft: 40,
        paddingRight : 30,
        paddingTop: 50,
        paddingBottom: 50,
        color: 'black',
        borderRadius: 10,
        diplay: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        backgroundColor: 'yellow'
    },

    imgContainer : {
        marginTop: -30,
        paddingLeft: 50,
        paddingTop: 50,
        height: '100vh',
        width: '45%',
        objectFit: 'contain',
        backgroundColor: 'green',
        marginLeft: 'auto',
        alignSelf: 'center',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    img : {
        height: '100%',
        //width: '100%',
        marginLeft: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
    },

    ball : {
        height: 100,
        width: 100,
        backgroundColor: '#A50035',
        borderRadius: '50%',
        left: 100,
        position: 'relative',  
    },
    ballback : {
        height: 100,
        width: 100,
        backgroundColor: '#6c757d',
        borderRadius: '50%',
        left: 100,
        position: 'relative',
    }

}


export const Home = () => {
    const [hover, setHover] = useState(false);
    const [isFlipped, setFlipped] = useState(false);

    const handleMouseEnter = e => {
        setFlipped(!isFlipped)
        console.log("enter")
      }
      const handleMouseLeave = e => {
        setFlipped(false)
        console.log("leave")
      }
  return (
    <>
    <NavBar/>

    <div style = {homeStyle.container}>
    <div style = {homeStyle.welcome}>
        <div style = {homeStyle.mainText}>
        <p>Meet <b>RecMe</b>, a new way <br></br> to send, store, and receive <br></br>
        letters of recommendation. <br></br> 
         </p>

        </div> 
        <div style = {{display: 'flex', flexDirection: 'row'}}>
        {/*<div style = {{marginRight: 10}}> {[...Array(4)].map((e, i) => <BallFlipCard cardZIndex = {i.toString} key = {i}/>)} </div>*/}

       </div>

      
    </div>
    </div>
    
    </>
  );
};
