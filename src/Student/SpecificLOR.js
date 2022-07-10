import {NavBar} from "./components/NavBar"
import { useLocation, useNavigate } from "react-router-dom";
import {useEffect, useState} from 'react'
import { Button, Modal } from "react-bootstrap";
import {updateDoc, doc, deleteDoc, addDoc, collection, DocumentReference, setDoc} from "firebase/firestore"
import { auth, db, storage } from "../firebase";
import { getlorDatabyDocID, swapFiles } from "./models/Org_Lors";
import { useAuthState } from "react-firebase-hooks/auth";
import emailjs from '@emailjs/browser';
import { getUserData } from './models/User';
import {FaTrashAlt } from 'react-icons/fa'
import { ref, deleteObject, getDownloadURL } from "firebase/storage";

const LORStyle = {
    container : {
        display : 'flex',
        flexDirection: 'column',
        flex: 1,
        
        //backgroundColor: 'yellow'
    },
    box : {
        display : 'flex',
        flexDirection: 'column',
        //justifyContent: 'space-between',
        border: 'solid black',
        marginLeft: 50,
        marginRight: 50,
        borderRadius: 5,
        paddingBottom: 50
    },
    welcome : {
        marginLeft: 'auto',
        marginRight: 70,
        fontSize: 25
    },
    lor : {
        border : 'solid #A50035',
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        paddingLeft: 50,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F4DFE6',
        borderRadius: 5
    },
    button : {
        textDecoration:  'none', 
        color: 'black', 
        display: 'flex', 
        flexDirection: 'row', 
        backgroundColor: 'transparent',
        border: ' solid black'
    }
}

export const SpecificLOR = () => {
const [personalShow, setPersonalShow] = useState(false);
const handlePersonalClose = () => setPersonalShow(false);
const handlePersonalShow = () => setPersonalShow(true);
const [sendModal, setsendModal] = useState(false);
const handleSendClose = () => setsendModal(false);
const handleSendShow = () => setsendModal(true);
const [deleteModal, setDeleteModal] = useState(false);
const handleDeleteClose = () => setDeleteModal(false);
const handleDeleteShow = () => setDeleteModal(true);
const [saveModal, setSaveModal] = useState(false);
const handleSaveClose = () => setSaveModal(false);
const handleSaveShow = () => setSaveModal(true);
const [recName, setRecName] = useState("");
const [recEmail, setRecEmail] = useState("");
const [updateLor, setUpdateLor] = useState(0);
const [user, loading, error] = useAuthState(auth);
const [userData, setUserData] = useState();
const location = useLocation();
const data = location.state;
const [description, setDescription] = useState({});
const [greeting, setGreeting] = useState("");
const [body, setBody] = useState("");
const [farewell, setFarewell] = useState("");
const [lorURL, setURL] = useState("");
const [saveName, setSaveName] = useState("");
const [resume, setResume] = useState("None Provided");
const navigate = useNavigate();

useEffect(() => {
    async function checkUserExists() {
      if (user){
        const lors = await getlorDatabyDocID(data.docID);
        const udata = await getUserData(user.uid);
        setUserData(udata);
        if (udata.resume){
          setResume(udata.resume)
        }
        if (lors) {
            setRecEmail(lors.recEmail);
            setRecName(lors.recName);
            if (lors.description){
                setDescription(lors.description)
                setGreeting(description.greeting)
                setBody(description.body)
                setFarewell(description.farewell)
            }
            if (lors.url){
              setURL(lors.url)
            }
        }

      }
       else {
        console.log('error')
      }
    }
    checkUserExists();
  }, [user, updateLor]);

const handleUpdate = async (e) => {
    e.preventDefault()
    const lorDocRef = doc(db, 'lors', data.docID)
    
    try{
      await updateDoc(lorDocRef, {
        recName: recName,
        recEmail: recEmail,
        'description.greeting': greeting,
        'description.body': body,
        'description.farewell': farewell,
      })
      handlePersonalClose()
      setUpdateLor(updateLor+1)
    } catch (err) {
      console.log(err)
    }    
  }
  
  const handleSend = async (e) => {
    e.preventDefault();
    const params = {
      subject: userData.name + " Recommendation Request",
      greeting: description.greeting,
      body: description.body,
      farewell: description.farewell,
      recommender_email: recEmail,
      uid: data.docID,
      reply_to: userData.email,
      userName: userData.name,
      userEmail: userData.email,
      resume: resume
      }
      

    const lorDocRef = doc(db, 'lors', data.docID)
    try{
      await updateDoc(lorDocRef, {
        status: "Sent"
      })
      setUpdateLor(updateLor+1)
    } catch (err) {
      console.log(err)
    }    

      emailjs.send("service_f56wfq5","template_0a07lmv", 
      params,
       "PwdejfwUZQz_8PZLq");
      handleSendClose()
  };

  const deleteLOR = async (e) => {
      e.preventDefault()
      const deleteRef = ref(storage, `/lors/${data.docID}`);
      deleteObject(deleteRef)
      
      await deleteDoc(doc(db, 'lors', data.docID))
      handleDeleteClose()
      navigate('/dashboard')
  }

    const savedAdd = async () => {
      try {
        swapFiles(`/lors/${data.docID}`, `/saved/${user.uid + saveName}`).then(() => {
          const savedRef = ref(storage, `/saved/${user.uid + saveName}`);
          getDownloadURL(savedRef).then((url) => {
            setDoc(doc(db, "saved", saveName), { 
              uid: user.uid,
              recName: recName,
              recEmail: recEmail,
              downloadURL: url
            })
          })
        })
        
      } catch (err) {
        alert(err)
      }

      handleSaveClose()
    }

    console.log(userData)

  return (
    <>
    <NavBar/>
    <div style = {LORStyle.container}>
        <h1 style = {LORStyle.welcome}></h1>
        <div style = {LORStyle.box}>
        <h1 
        style = {{fontSize: 25, paddingLeft: 50, paddingTop: 20, marginBottom: 0}}>
            Letter of Recommendation</h1>
        <div style = {LORStyle.lor}>
            <div style = {{display: 'flex', flexDirection: 'row', justifyItems: 'center', marginTop: 15}}>
                <p style = {{paddingRight: 20}}><b>Recommender Name: </b> </p>{recName}
                <Button onClick={handleDeleteShow} style = {{backgroundColor: 'transparent', marginLeft:'auto', border: 'none', padding: 'none'}}>
                  <FaTrashAlt style = {{paddingRight: 10, color: 'black', fontSize: 25, marginTop: 5}}/>
                </Button>
            </div>
            <div style = {{display: 'flex', flexDirection: 'row', justifyItems: 'center'}}>
                <p style = {{paddingRight: 20}}><b>Recommender Email: </b> </p>{recEmail}
            </div>
            
            <div style = {{display: 'flex', flexDirection: 'row', justifyItems: 'center', whiteSpace: 'pre-wrap'}}>
                <p style = {{paddingRight: 20}}><b>Email Message: </b> </p>
                {description.body && 
                <div style = {{backgroundColor: 'white', border: 'solid black', padding: 20, marginRight: 20, borderRadius: 10, width: '100%'}}>
                {description.greeting} <br></br><br></br>
                {description.body} <br></br><br></br>
                {description.farewell} <br></br>
                {userData.name}
                </div>}
            </div>
            <div style = {{display: 'flex', flexDirection: 'row', justifyItems: 'center', marginTop: 20}}>
                <p style = {{paddingRight: 20}}><b>Resume: </b> {resume} </p>
            </div>
        </div>  
        <div style = {{display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', marginRight: 50}}>
            <Button onClick={handleSaveShow} style = {LORStyle.button}>
                  <p> <b><i>Save Letter</i></b></p>
            </Button>
            <Button onClick={handlePersonalShow} style = {LORStyle.button}>
                  <p> <b><i>Edit Letter</i></b></p>
            </Button>
            <Button onClick={handleSendShow} style = {LORStyle.button}>
                  <p> <b><i>Send Letter to Recommender</i></b></p>
            </Button>
        </div>
        
        </div>
    </div>

    <Modal 
        centered = {true}
        show={saveModal} 
        onHide={handleSaveClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Save LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Specify Name for Saved LOR:
          <input 
            type = 'text'
            value = {saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder= 'Enter Unique Save Name'
            style = {{width : '100%', padding: 10, marginBottom: 20}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveClose}>
            Close
          </Button>
          <Button variant="primary" onClick={savedAdd} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Save Letter
          </Button>
        </Modal.Footer>
        </Modal>

        <Modal 
        centered = {true}
        show={deleteModal} 
        onHide={handleDeleteClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Delete LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteLOR} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Delete Letter
          </Button>
        </Modal.Footer>
        </Modal>

    <Modal 
        centered = {true}
        show={personalShow} 
        onHide={handlePersonalClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Edit LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Recommender Name:
          <input 
            type = 'text'
            value = {recName}
            onChange={(e) => setRecName(e.target.value)}
            placeholder= 'Enter Recommender Name'
            style = {{width : '100%', padding: 10, marginBottom: 20}}/>
            Recommender Email: <><br></br></>
            <input 
            type = 'text'
            value = {recEmail}
            onChange={(e) => setRecEmail(e.target.value)}
            placeholder= 'Enter Recommender Email'
            style = {{width : '100%', padding: 10, marginBottom: 20}}/>
            Email Greeting:
            <input 
            type = 'text'
            value = {greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder= 'Enter Greeting'
            style = {{width : '100%', padding: 10, marginBottom: 20}}/>
            Email Body:
            <textarea
            value = {body}
            onChange={(e) => setBody(e.target.value)}
            placeholder= 'Enter Email Message'
            style = {{width : '100%', padding: 10, marginBottom: 20, whiteSpace: 'pre-wrap'}}/>
            Email Closing
            <input 
            type = 'text'
            value = {farewell}
            onChange={(e) => setFarewell(e.target.value)}
            placeholder= 'Enter Closing'
            style = {{width : '100%', padding: 10, marginBottom: 20}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePersonalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Save Letter Details
          </Button>
        </Modal.Footer>
        </Modal>

    <Modal 
        centered = {true}
        show={sendModal} 
        onHide={handleSendClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Send LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you are ready to send?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSendClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSend} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Send Letter
          </Button>
        </Modal.Footer>
        </Modal>

        <Modal 
        centered = {true}
        show={deleteModal} 
        onHide={handleDeleteClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Delete LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteLOR} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Delete Letter
          </Button>
        </Modal.Footer>
        </Modal>
    </>

    
  );
};
