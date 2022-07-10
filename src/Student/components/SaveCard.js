import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap"
import { useAuthState } from "react-firebase-hooks/auth";
import { FaTrashAlt } from "react-icons/fa"
import { auth, db, storage } from "../../firebase";
import {useNavigate} from 'react-router-dom';

const savedCardStyles = {
    container : {
        border : 'solid #00A570',
        marginTop: 30,
        marginLeft: 50,
        marginRight: 50,
        paddingLeft: 50,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#BFE8DB',
        borderRadius: 5,
        paddingTop: 20
    }
}

export const SaveCard = (props) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const handleDeleteClose = () => setDeleteModal(false);
    const handleDeleteShow = () => setDeleteModal(true);
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();



    const deleteSaved = async (e) => {
        e.preventDefault()
        const deleteRef = ref(storage, `/saved/${user.uid + props.name}`);
        deleteObject(deleteRef)
        
        await deleteDoc(doc(db, 'saved', props.name))
        handleDeleteClose()
        props.handler()
        navigate('/saved')
    }
    return (
    <>
      <div style = {savedCardStyles.container}>
      <div style = {{display: 'flex', flexDirection: 'row', flex: 1, paddingRight: 40}}>
          <div>
            <p> <b>Name: </b> <br></br>{props.name}</p>
            <p> <b>Recommender Name: </b> {props.recName}</p>
            <p> <b>Recommender Email: </b> {props.recEmail}</p>
            
           </div>
           <div style = {{marginLeft: 'auto'}}>
                <Button onClick={handleDeleteShow} 
                style = {{backgroundColor: 'transparent', marginLeft: '50%', border: 'none', padding: 'none', marginBottom: 20}}>
                    <FaTrashAlt style = {{color: 'black', fontSize: 20}}/>
                </Button>
            </div>
       </div>
       </div>

       <Modal 
        centered = {true}
        show={deleteModal} 
        onHide={handleDeleteClose} 
        >
        <Modal.Header closeButton>
          <Modal.Title>Delete Saved LOR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="primary" onClick={deleteSaved} 
          style = {{backgroundColor: '#A50035', color : 'white', border: 'none'}}>
            Delete
          </Button>
        </Modal.Footer>
        </Modal>
    </> 
    )
}