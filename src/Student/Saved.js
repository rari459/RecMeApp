import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import {NavBar} from "./components/NavBar"
import { SaveCard } from "./components/SaveCard";
import { getSaveData } from "./models/Org_Lors";

const savedStyle = {
    container : {
        display : 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    box : {
        display : 'flex',
        flexDirection: 'column',
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
}



export const Saved = () => {

    const [savedList, setSavedList] = useState();
    const [user, loading, error] = useAuthState(auth);
    const [count, setCount] = useState(0); 

    const handleCount = ()=>{ 
        setCount(count + 1); 
    } 

    useEffect(() => {
        async function populateSaved() {
        if (user) {
            const saved = await getSaveData(user.uid);
            setSavedList(saved);
        } else {
            console.log('error')
        }
        }

        populateSaved();
    }, [user, count]);

    console.log(savedList)
    return (
        <>
        <NavBar/>

        <div style = {savedStyle.container}>
        <h1 style = {savedStyle.welcome}>Saved LORs</h1>
        <div style = {savedStyle.box}>
        
        {savedList?.map((data, index) => {
                return (
                <SaveCard key = {index} name = {data.docID} recName = {data.recName} recEmail = {data.recEmail}
                handler = {handleCount}/>
                )
        })}

        </div> 
        </div>
        </>
    )

}