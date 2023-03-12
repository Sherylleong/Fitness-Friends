import { useState, useRef, useReducer } from "react";
import { firestore } from "../FirebaseDb/Firebase";
import { doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { collection, query, onSnapshot , where, getDoc} from 'firebase/firestore';
import { clear } from "@testing-library/user-event/dist/clear";

export default function CRUD() {
    const [item, setItem] = useState("");

	const resetItemList = (state , action) => {
		if (action.type == "reset") {
			return [];
		}
		
		const rtn = [...state, action.value];
		return rtn;
	}

	const [itemList, setItemList] = useReducer(resetItemList, [{id:"Press Retrieve To Start", item: "Press Retrieve To Start"}]);


    const createItem = (e) => {
        console.log(item);
        addDoc(collection(firestore, 'testData'), {
            i: item
        }).then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
		});
        console.log("Adding");
    }

    const updateItem = (e, msg) =>  {
        const updateQuery = doc(firestore, 'testData', e);
		updateDoc(updateQuery, {
			i: document.getElementById(e).value
		});
    }

    const deleteItem = (e) =>  {
		const deleteQuery = doc(firestore, 'testData', e);
		deleteDoc(deleteQuery);
    }

    function retrieveItem (e) {
		console.log(itemList);
		getByDocID();
		const queryDb = query(collection(firestore, 'testData'), where("i", "==", "no"));
		onSnapshot(queryDb, (querySnapshot) => {
			console.log(querySnapshot);
			setItemList({type: "reset"})
			querySnapshot.forEach((doc) => {
				setItemList({value:{
						id:doc.id , 
						item: doc.data().i
					}
			});
				console.log(itemList);
			})
		  });
    }

	const getByDocID = async() => {
		const docRef = doc(firestore, "events", "uLBa8YrgEcZ39d5ZWjmk")
		const docSnap = await getDoc(docRef);
		if(docSnap.exists()) {
			console.log(docSnap.data());
		} else {
			console.log("Document does not exist")
		}
	}
	
	return (
        <div>
            <input type="text" placeholder="Enter item" onChange={(e) => setItem(e.target.value)}/>
            <button type="Submit" onClick={createItem}>Create</button>
            <button type="Submit" onClick={retrieveItem}>Retrieve</button>
			<h1>Item List</h1>
            <div id="item-list">
				{itemList.map((item) => (
					<div>
						<h3>ID: {item.id}</h3>
						<h5>Item: {item.item}</h5>
						<input id={item.id} type="text"></input>
						<button onClick={() => updateItem(item.id)}>Update</button>
						<button onClick={() => deleteItem(item.id)}>Delete Item</button>
					</div>
				))}
            </div>
        </div>
	)
}