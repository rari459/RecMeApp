import { Modal } from 'bootstrap';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { getlorDatabyDocID } from '../Student/models/Org_Lors';

const recPortalStyle = {
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
 
export const RecLoginPortal = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [lorID, setLorID] = useState("");

  const handleRecLogin = async (e) => {
      e.preventDefault();

      try {
        const lors = await getlorDatabyDocID(lorID);
        
        console.log(lors)
        if (lors.uid && lors.recEmail == email){
            navigate("/recdashboard", {state: {data: lors, docID: lorID}})
        }
        
      } catch(err) {
          console.log(err)
      }



  }


  return(
    <>
    <div style = {recPortalStyle.container}>
    <div style = {recPortalStyle.box}>
      <h1>Recommender Portal</h1>
    
      <div>
        <label>
          <input type="text"
          placeholder="E-mail Address"
          style = {recPortalStyle.textBox}
          onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <p></p>
          <input type="password"
          placeholder="Unique ID"
          style = {recPortalStyle.textBox}
          onChange={(e) => setLorID(e.target.value)}
          />
        </label>
        <div>
        <button style = {recPortalStyle.button} onClick={handleRecLogin}>
            Login</button>
        </div>
      </div>
    </div>
    
    </div>
    </>
  )
};

