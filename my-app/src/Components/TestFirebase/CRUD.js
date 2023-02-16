import { useState, useRef } from "react";
import { firestore } from "../FirebaseDb/Firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CRUD() {
    const [item, setItem] = useState("");
    const createItem = (e) => {
        console.log(item);
        addDoc(collection(firestore, 'testData'), {
            i: item
        });
        console.log("Adding");
    }

    const updateItem = (e) =>  {
        
    }

    const deleteItem = (e) =>  {

    }

    const retrieveItem = (e) =>  {

    }
	return (
        <div>
            <input type="text" placeholder="Enter item" onChange={(e) => setItem(e.target.value)}/>
            <button type="Submit" onClick={createItem}>Create</button>
            <button type="Submit" onClick={retrieveItem}>Retrieve</button>
            <button type="Submit" onClick={updateItem}>Update</button>
            <button type="Submit" onClick={deleteItem}>Delete</button>
            <div id="textBox1">

            </div>
        </div>
	)
}