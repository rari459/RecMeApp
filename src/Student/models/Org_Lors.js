import { db } from '../../firebase'
import {collection, query, getDoc, where, doc, getDocs, updateDoc} from "firebase/firestore"


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