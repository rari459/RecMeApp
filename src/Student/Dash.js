import { useState, useEffect } from "react";
import {NavBar} from "./components/NavBar"
import LOR from "./assets/LOR.png"
import {DashCard} from "./components/DashCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { getUserData } from "./models/User";
import {FaPlus} from 'react-icons/fa'
import { Button, Modal } from 'react-bootstrap';
import {collection, addDoc,} from "firebase/firestore"
import { getOrgData } from "./models/Org_Lors";
import {useNavigate} from 'react-router-dom';

const dashStyle = {
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
    button : {
      textDecoration:  'none', 
      color: 'black', 
      display: 'flex', 
      flexDirection: 'row', 
      backgroundColor: 'transparent',
      border: 'none',
      marginLeft: 'auto',
      marginRight: 50,
  }

}

export const Dash = () => {
const [userData, setUserData] = useState({ authProvider: "", name: "", email: "", uid : ""});
const [user, loading, error] = useAuthState(auth);
const [orgName, setOrgName] = useState("");
const [orgEmail, setOrgEmail] = useState("");
const [deadline, setDeadline] = useState("");
const [personalShow, setPersonalShow] = useState(false);
const handlePersonalClose = () => setPersonalShow(false);
const handlePersonalShow = () => setPersonalShow(true);
const [orgData, setOrgData] = useState();
const navigate = useNavigate();
const [count, setCount] = useState(0); 

const handleCount = ()=>{ 
  setCount(count + 1); 
} 

const orgAdd = async (e) => {
  e.preventDefault()
  try {
    await addDoc(collection(db, 'org'), {
      uid: user.uid,
      name: orgName,
      email: orgEmail,
      deadline: deadline
    })
    handlePersonalClose()
    handleCount()
    setOrgName("")
    setOrgEmail("")
    setDeadline("")
  } catch (err) {
    alert(err)
  }
}

useEffect(() => {
    async function checkUserExists() {
      if (user) {
        const result = await getUserData(user.uid);
        const orgs = await getOrgData(user.uid);
        setUserData(result);
        setOrgData(orgs);
      } else {
        console.log('error')
      }
    }

    checkUserExists();
  }, [user, count]);



  return (
    <>

    {!user && navigate('/profile')}
    <NavBar/>
    <div style = {dashStyle.container}>
        <h1 style = {dashStyle.welcome}>Welcome {userData.name}</h1>
        <div style = {dashStyle.box}>
        <div style = {{display:'flex', flexDirection:'row', paddingTop: 20}}>
          <div style = {{paddingLeft: 50, marginBottom: 0}}>
            <h1 style = {{fontSize: 25,}}>
            Dashboard</h1> <hr/>
            <p style = {{fontSize: 12}}><i>
              ~ Note that organizations can only be added or deleted, they cannot be edited ~
              </i></p>
            
            </div>

            <Button onClick={handlePersonalShow} style = {dashStyle.button}>
              <FaPlus style = {{paddingRight: 10, color: 'green', fontSize: 20, marginTop: 5}}/>
                  <p> <b><i>Add Organization</i></b></p>
            </Button>
        </div>

        {orgData?.map((data, index) => {
                return (
                <DashCard key = {index} org = {data.name} deadline = {data.deadline} 
                sent = {data.sent} completed = {data.completed} orgEmail = {data.email} 
                orgdocID = {data.orgDocID} status = {data.status} handler = {handleCount}/>
                )
        })}
        </div>
    </div>
    
    <Modal 
        centered = {true}
        show={personalShow} 
        onHide={handlePersonalClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Add Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Organization Name:
            <input
            type = 'text'
            value = {orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder= "Name"
            style = {{width : '100%', padding: 10, marginTop: 10, marginBottom: 10}}/>

            Organization Email:
            <input
            type = 'text'
            value = {orgEmail}
            onChange={(e) => setOrgEmail(e.target.value)}
            placeholder= "Email"
            style = {{width : '100%', padding: 10, marginTop: 10, marginBottom: 10}}/>

            Deadline
            <input
            type = 'text'
            value = {deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder= "mm/dd/yyyy"
            style = {{width : '100%', padding: 10, marginTop: 10, marginBottom: 10}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePersonalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={orgAdd} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Add Organization
          </Button>
        </Modal.Footer>
        </Modal>
    </>
    
  );
};
