import { db, storage } from '../../firebase'
import {collection, query, getDoc, where, doc, getDocs, updateDoc} from "firebase/firestore"
import { ref, getBytes, uploadBytes, getDownloadURL, updateMetadata, uploadBytesResumable } from 'firebase/storage';


export async function getOrgData(uid){
  let orgs = collection(db, "org");
  let l = []
  const q = query(orgs, where("uid", "==", uid));
 
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let book = doc.data();
    book.orgDocID = doc.id;
    l.push(book);
    console.log("Get Org Data Read")
  });
  return Promise.resolve(l)
}

export async function getLorData(uid, orgName){
  let lors = collection(db, "lors");
  let l = []
  const q = query(lors, where("uid", "==", uid), where("orgName", "==", orgName));
 
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let book = doc.data();
    book.docID = doc.id;
    l.push(book);
    console.log("Get Lor Data Read")
  });
  return Promise.resolve(l)
}

export async function getlorDatabyDocID(docID){
  let lor = doc(db, "lors", docID)
  const docSnap = await getDoc(lor);
  let l = {}
  if (docSnap.exists()) {
    l = docSnap.data()
  } else {
    console.log("No such document!");
  }

  return Promise.resolve(l)
}

export async function swapFiles(path1, path2){
  const metaData = {
    contentType: 'application/pdf'
  }

  console.log(path1)
  console.log(path2)

  const storageRef1 = ref(storage, path1)
  const storageRef2 = ref(storage, path2)
  const FIVE_MEGABYTES = 1024 * 1024 * 5
  getBytes(storageRef1, FIVE_MEGABYTES).then((file1) => {
    const uploadTask = uploadBytesResumable(storageRef2, file1).then(() => {
      updateMetadata(storageRef2, metaData)
      
    })    
    
  }
  )
}

export async function getSaveData(uid){
  let saved = collection(db, "saved");
  let l = []
  const q = query(saved, where("uid", "==", uid));
 
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let book = doc.data();
    book.docID = doc.id;
    l.push(book);
    console.log("Get Saved Data Read")
  });
  return Promise.resolve(l)
}

export async function getSaveDatabyDocID(docID){
  let saved = doc(db, "saved", docID)
  const docSnap = await getDoc(saved);
  let l = {}
  if (docSnap.exists()) {
    l = docSnap.data()
  } else {
    console.log("No such document!");
  }

  return Promise.resolve(l)
}
