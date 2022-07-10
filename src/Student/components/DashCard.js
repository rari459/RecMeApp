import {FaAngleDoubleDown, FaAngleDoubleUp, FaPen, FaPlus, FaTrashAlt} from 'react-icons/fa'
import useCollapse from 'react-collapsed';
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import {useEffect, useState} from 'react'
import {collection, addDoc, doc, deleteDoc,} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../firebase";
import { getLorData, getSaveData, getSaveDatabyDocID } from '../models/Org_Lors';
import { deleteObject, ref } from 'firebase/storage';
import { getUserData } from '../models/User';
import emailjs from '@emailjs/browser';

const dashCardStyles = {
    container : {
        border : 'solid #A50035',
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        paddingLeft: 50,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F4DFE6',
        borderRadius: 5,
        paddingTop: 20
    },
    leftText : {
        marginLeft: 'auto',
        
    },
    lor : {
        backgroundColor: '', display: 'flex', flexDirection: 'row',
        alignItems: 'center'

    },
    button : {
        textDecoration:  'none', 
        color: 'black', 
        display: 'flex', 
        flexDirection: 'row', 
        backgroundColor: 'transparent',
        border: 'none',
        alignItems: 'center'
    }

}

export const DashCard = (props) => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const [recName, setRecName] = useState("");
    const [recEmail, setRecEmail] = useState("");
    const [personalShow, setPersonalShow] = useState(false);
    const handlePersonalClose = () => setPersonalShow(false);
    const handlePersonalShow = () => setPersonalShow(true);
    const [user, loading, error] = useAuthState(auth);
    const [userData, setUserData] = useState({})
    const [lorData, setLorData] = useState();
    const [updateLor, setUpdateLor] = useState(0);
    const [deleteModal, setDeleteModal] = useState(false);
    const handleDeleteClose = () => setDeleteModal(false);
    const handleDeleteShow = () => setDeleteModal(true);
    const [total, setTotal] = useState(0)
    const [savePickModal, setsavePickModal] = useState(false);
    const handleSaveClose = () => {setsavePickModal(false); setChecked([])};
    const handleSaveShow = () => {handlePersonalClose(); setsavePickModal(true)};
    const [savedList, setSavedList] = useState();
    const [checked, setChecked] = useState([]);
    

    const lorAdd = async (e) => {
      e.preventDefault()
      try {
        await addDoc(collection(db, 'lors'), {
          uid: user.uid,
          orgName: props.org,
          orgEmail: props.orgEmail,
          recName: recName,
          recEmail: recEmail,
          status: "Not Sent"
        })
        handlePersonalClose()
        setUpdateLor(updateLor+1);
      } catch (err) {
        alert(err)
      }
    }

    useEffect(() => {
      async function checkUserExists() {
        if (user){
          const lors = await getLorData(user.uid, props.org);
          const saved = await getSaveData(user.uid);
          const userDetails = await getUserData(user.uid)
          setUserData(userDetails)
          setSavedList(saved);
          if (lors.length) {
            setLorData(lors)
          }
          setTotal(lors.length)
        }
         else {
          console.log('error')
        
        }
      }
      checkUserExists();
    }, [user, updateLor]);

    const deleteOrg = async (e) => {
      e.preventDefault()
      await lorData?.map((data)=> {
          deleteDoc(doc(db, 'lors', data.docID))
          const deleteRef = ref(storage, `/lors/${data.docID}`);
          deleteObject(deleteRef)
        }
       )
      setUpdateLor(updateLor+1)
      await deleteDoc(doc(db, 'org', props.orgdocID))
      handleDeleteClose()
      props.handler()
    }

    const handleCheck = (event) => {
      var updatedList = [...checked];
      if (event.target.checked) {
        updatedList = [...checked, event.target.value];
      } else {
        updatedList.splice(checked.indexOf(event.target.value), 1);
      }
      setChecked(updatedList);
    };

    const sendSave = async(e) => {
      e.preventDefault()
      checked?.map((data, index) => {
        getSaveDatabyDocID(data).then((data) => {
          try {
            addDoc(collection(db, 'lors'), {
              uid: user.uid,
              orgName: props.org,
              orgEmail: props.orgEmail,
              recName: data.recName,
              recEmail: data.recEmail,
              status: "Complete",
              lorURL: data.downloadURL
            }).then(()=> setUpdateLor(updateLor+1)).then(() => {
              const details = {
                userName: userData.name,
                userEmail: userData.email,
                recName: data.recName,
                recEmail: data.recEmail,
                orgName: props.orgName,
                orgEmail: props.orgEmail,
                lorURL: data.downloadURL
                }

                emailjs.send("service_f56wfq5","template_cngkffi", 
                details,
                "PwdejfwUZQz_8PZLq");
            }
            )
            
          } catch (err) {
            alert(err)
          }
        });

        
        
      })

      handleSaveClose()
    
  }

  //console.log(checked)
  return (
      <>
      <div style = {dashCardStyles.container}>
      <div style = {{display: 'flex', flexDirection: 'row', flex: 1}}>
          <div>
            <p> <b>Organization: </b> <br></br>{props.org}</p>
            <p> <b>Deadline: </b> {props.deadline}</p>
            <p> <b>Organization Email: </b> {props.orgEmail}</p>
            
            
            <br/>
            <div {...getToggleProps()} style = {{display:'flex', flexDirection: 'row', marginTop: -10}}>
            
            {!isExpanded && <div style = {{display:'flex', flexDirection: 'row'}}>
              <p><i>Click for more details</i></p>
              <FaAngleDoubleDown style = {{marginLeft: 10, marginTop: 5}}/>
            </div>}
            {isExpanded && <div style = {{display:'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <p><i>Collapse details</i></p>
              <FaAngleDoubleUp style = {{marginLeft: 10, marginTop: 5}}/>
            </div>}
            
            </div>
          </div> 
      <div style = {dashCardStyles.leftText}>
          <Button onClick={handleDeleteShow} 
          style = {{backgroundColor: 'transparent', marginLeft: '50%', border: 'none', padding: 'none', marginBottom: 20}}>
            <FaTrashAlt style = {{color: 'black', fontSize: 20}}/>
          </Button>
          <p style = {{marginRight: 50}}><b>Total Letters: </b> {total}</p>
          
      </div>
      </div>
      <div  {...getCollapseProps()} >
          <div style = {{paddingBottom: 40}}>

          <div style = {{display: 'flex', flex: 1,}}>
              <div>
              <p><b>Letters of Recommendation: </b></p>
            <ul>
                
              
                {lorData?.map((data, index) => {

                  return (
                    
                    <li key = {index} style = {{marginBottom: 10}}>
                    <div style = {dashCardStyles.lor}>
                    {data.recName} - {data.status}
                    <Link style = {{textDecoration:  'none', color: 'black', paddingLeft: 10}} 
                    to="lor" state = {data}>
                    <FaPen style = {{marginTop: 'auto', marginBottom: 'auto',}}/>
                    </Link>
                    </div>
                    </li>
                  )
                })}

            </ul>
              </div>
              <div style = {{display: 'flex', flexDirection: 'row', marginLeft: 'auto', paddingRight: 50, marginTop: 'auto'}}>
              <Button onClick={handlePersonalShow} style = {dashCardStyles.button}>
              <FaPlus style = {{paddingRight: 10, color: 'green', fontSize: 20, marginBottom: 15}}/>
                  <p> <b><i>Add Letters</i></b></p>
              </Button>

              </div>
          </div>
        
          </div>
    </div> 
      </div> 

      <Modal 
        centered = {true}
        show={personalShow} 
        onHide={handlePersonalClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Add Letter of Recommendation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Recommender Name:
            <input
            type = 'text'
            value = {recName}
            onChange={(e) => setRecName(e.target.value)}
            placeholder= "Name"
            style = {{width : '100%', padding: 10, marginTop: 10, marginBottom: 10}}/>

            Recommender Email:
            <input
            type = 'text'
            value = {recEmail}
            onChange={(e) => setRecEmail(e.target.value)}
            placeholder= "Email"
            style = {{width : '100%', padding: 10, marginTop: 10, marginBottom: 10}}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePersonalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveShow} 
          style = {{backgroundColor: '#00A570', color : 'white', border: 'none'}}>
            Use Saved Letter
          </Button>
          <Button variant="primary" onClick={lorAdd} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Add Letter
          </Button>
        </Modal.Footer>
        </Modal>

        <Modal 
        centered = {true}
        show={deleteModal} 
        onHide={handleDeleteClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Delete Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This will also delete all associated LORs. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteOrg} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Delete Organization
          </Button>
        </Modal.Footer>
        </Modal>

        <Modal 
        centered = {true}
        show={savePickModal} 
        onHide={handleSaveClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Chose Saved LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              {savedList?.map((data, index) => {
                return (
                  <>
                  <div key = {index}>  
                    <input
                      type = 'checkbox'
                      style = {{marginRight: 20}}
                      value = {data.docID}
                      onChange={handleCheck}
                      >
                    </input>
                      {data.docID}
                  </div>
                  </>
                )
              })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSaveClose}>
            Close
          </Button>
          <Button variant="primary" onClick={sendSave} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Send To Organization
          </Button>
        </Modal.Footer>
        </Modal>
      </>

  );
};

