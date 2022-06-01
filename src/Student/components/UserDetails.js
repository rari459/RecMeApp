import { auth, db, logout } from "../../firebase";
import {Modal, Button} from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {updateDoc, doc} from "firebase/firestore"
import { getuserDoc} from "../models/User";


const userStyle = {
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
        paddingBottom: 20
    },
    innerbox : {
        display : 'flex',
        flexDirection: 'column',
        border: 'solid #A50035',
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 5,
        paddingBottom: 50

    },
    button : {
        padding: 10,
        fontSize: 18,
        marginBottom : 10,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
        border: 'none',
        color : 'white',
        backgroundColor: 'black',
        width: '100%'
    },
    banner : {
        display : 'flex',
        flexDirection: 'row',
        paddingLeft: 50, 
        paddingTop: 10,
        alignContent: 'center'
    },
    text : {
        fontSize: 25,
        
    },
    

}

export const UserDetails = (props) => {
    const [statement, setStatement] = useState("");
    const [personalShow, setPersonalShow] = useState(false);
    const handlePersonalClose = () => setPersonalShow(false);
    const handlePersonalShow = () => setPersonalShow(true);
    const [user, loading, error] = useAuthState(auth);
    const [userDoc, setUserDoc] = useState("");
    const [resume, setResume] = useState("None Provided")

    useEffect(() => {
        async function checkStatement() {
          const userDoc = await getuserDoc(user.uid);
          if (user.uid) {
            setUserDoc(userDoc);
          } else {
            console.log('error')
          }
        }
        checkStatement();
      }, [user, props]);
    
      const handleUpdate = async (e) => {
        e.preventDefault()
        const taskDocRef = doc(db, 'users', userDoc)
        
        try{
          await updateDoc(taskDocRef, {
            statement: statement,
          })
          handlePersonalClose()
        } catch (err) {
          alert(err)
        }    
      }

      
    return (
    <>
    <div style = {userStyle.container}>
        <h1 style = {{marginLeft : "auto", marginRight: 'auto'}}>Profile</h1>
        <div style = {userStyle.box}>

        <div style = {userStyle.innerbox}>
        <div style = {userStyle.banner}>
            <p style = {userStyle.text}>
            <b>Name: </b> {props.name} </p> 
        </div>

        <div style = {userStyle.banner}><p style = {userStyle.text}> <b>Email: </b> {props.email}</p></div>
        <div style = {userStyle.banner}><p style = {userStyle.text}> <b>Number of Orgs: </b></p></div>
        <div style = {userStyle.banner}><p style = {userStyle.text}> <b>Number of LORs: </b> </p></div>
        <div style = {userStyle.banner}><p style = {userStyle.text}> <b>Personal Statement: </b> {props.statement}</p></div>
        <Button style = {{marginLeft: 50, width: 200, backgroundColor: 'black'}} onClick={handlePersonalShow}>
            Add Personal Statement
        </Button>

        <div style = {userStyle.banner}><p style = {userStyle.text}> <b>Resume: </b> {resume}</p></div>
        <input
        style = {{marginLeft: 50, marginBottom: 15}}
        type = 'file'
        onChange = {(e) => {setResume(e.target.files[0])}}
        />
        <Button style = {{marginLeft: 50, width: 200, backgroundColor: 'black'}}>Upload</Button>
        </div>
        
        <div style = {{display : 'flex', flexDirection: 'row'}}> 
        <button style = {userStyle.button} onClick={() => logout()}>
        Logout</button></div>
        </div>
    </div>

    <Modal 
        centered = {true}
        show={personalShow} 
        onHide={handlePersonalClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Personal Statement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <textarea
            value = {statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder= 'Enter Statement'
            style = {{width : '100%', padding: 10}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePersonalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
    
    
    </>
    
  );
};
