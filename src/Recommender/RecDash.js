import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import { db, storage } from '../firebase';
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage"
import 'firebase/storage'
import { Modal, } from 'react-bootstrap';
import { getUserData } from '../Student/models/User';
import emailjs from '@emailjs/browser';
import { doc, updateDoc } from 'firebase/firestore';

const recDashStyle = {
    container : {
      display: 'flex',
      flexDirection: 'column',
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
      alignItems: ''
    },
    button : {
      padding: 10,
      fontSize: 18,
      marginBottom : 10,
      border: 'none',
      color : 'white',
      backgroundColor: 'black',
      width: '100%',
      marginTop: 20
    },
    
}
 
export const RecDash = () => {
  const [file, setFile] = useState("");
  const [url, setURL] = useState("");
  const location = useLocation();
  const [show, setShow] = useState(false)
  const [userData, setUserData] = useState("");
  const handleClose = () => setShow(false);


  const params = location.state
  useEffect(() => {
    async function checkUserExists() {
      if (params.data.uid) {
        const result = await getUserData(params.data.uid);
        setUserData(result);
        console.log(userData)
      } else {
        console.log('error')
      }
    }
    checkUserExists();
  }, []);


  const uploadFile = () => {
      if (file == null) console.log('No file found');

      const storageRef = ref(storage, `/lors/${params.docID}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setURL(downloadURL)
      handleSend(downloadURL)
    });
    
    setShow(true)
  }
);

const handleSend = async (downloadURL) => {
    
    const details = {
      userName: userData.name,
      userEmail: userData.email,
      recName: params.data.recName,
      recEmail: params.data.recEmail,
      orgName: params.data.orgName,
      orgEmail: params.data.orgEmail,
      lorURL: downloadURL
      }
      const lorDocRef = doc(db, 'lors', params.docID)
    try{
      await updateDoc(lorDocRef, {
        status: "Completed"
      })
    } catch (err) {
      console.log(err)
    } 

      console.log(details)
      emailjs.send("service_f56wfq5","template_cngkffi", 
      details,
       "PwdejfwUZQz_8PZLq");
      
  };



  }

  return(
    <>
    <div style = {recDashStyle.container}>
      <h1>Recommender Dashboard</h1>
      <div style = {recDashStyle.box}>
        <p style = {{fontSize:20}}>Choose and upload a PDF file of your letter of recommendation.</p>
        <p style = {{fontSize:12}}> <i>Note that you should only upload once as an email containing the letter will 
        automatically be sent to the requesting organization upon sucessful upload</i></p>
    
      <input
      
      type = 'file'
      onChange = {(e) => {setFile(e.target.files[0])}}
      />
      <button style = {recDashStyle.button} onClick={uploadFile}>Upload</button>

      </div>
      
    </div>

    <Modal 
        centered = {true}
        show={show} 
        onHide={handleClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Upload Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <b>File URL:</b> <br/> {url}
        </Modal.Body>
        </Modal>
    
    
    </>
  )
};

