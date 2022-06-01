import { db } from '../../firebase'
import {collection, query, orderBy, 
    onSnapshot, where, doc, getDocs, updateDoc} from "firebase/firestore"


export async function getUserData(uid){

  let users = collection(db, "users");
  let l = []
  const q = query(users, where("uid", "==", uid));
 
  const querySnapshot = await getDocs(q);
 
  querySnapshot.forEach((doc) => {
    let book = doc.data();
    l.push(book);
    console.log("Get User Data Read")
  });
 
  return Promise.resolve(l[0])

}

export async function getuserDoc(uid){
  let users = collection(db, "users");
  let l = []
  const q = query(users, where("uid", "==", uid));
 
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
      l.push(doc);
      console.log("Get User Doc Read")
    });
  
    
    return Promise.resolve(l[0].id)
} 