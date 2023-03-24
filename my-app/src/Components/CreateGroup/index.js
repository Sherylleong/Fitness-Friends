import { useState, useRef, createContext, useContext } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { dispatch, useStoreState } from "../../App";
import { Link, redirect, useNavigate } from "react-router-dom";
import { firestore } from "../FirebaseDb/Firebase";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./CreateGroup.css";
import "../Create.css"
import { v4 as uuidv4 } from "uuid";

function CreateGroup() {
  const [groupname, setGroupname] = useState("");
  const [groupdesc, setGroupdesc] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner")
  const [groupActivity, setActivity] = useState("Walking")
  const [pic, setPic] = useState("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");

  const navigate = useNavigate();
  const storage = getStorage();
  const groupId = uuidv4();

  const difficultyChoices = ["Beginner", "Intermediate", "Advanced"]
  const activityChoices = ["Walking", "Jogging", "Running", "Climbing","Biking","Sports","Others"]

  //   const submitgroup = (e) => {
  //     e.preventDefault(); //Prevent Reload on Form Submit

  //     addDoc(collection(firestore, "group"), {
  //       groupname: groupname,
  //       groupdesc: groupdesc,
  //       groupdifficulty: groupdifficulty,
  //       groupcategory: groupcategory,
  //       groupmembers: groupmembers,
  //       groupevents: groupevents,
  //       //   groupImageURL: imageURL,
  //     });

  //   };

  const [userFile, setUserFile] = useState(null);
	const acceptFile = event => {
		var fileUploaded = event.target.files[0];
		setUserFile(fileUploaded);
		setPic(URL.createObjectURL(fileUploaded));
	};

	const createGroup = async() => {
		const imageRef = ref(storage, groupId+"-grouppic");
		await uploadBytes(imageRef, userFile);

      getDownloadURL(imageRef).then((url)=> {     
        addDoc(collection(firestore, "group"), {
          groupname: groupname,
          groupdesc: groupdesc,
          groupdifficulty: difficulty,
          groupcategory: groupActivity,
          groupmembers: [],
          groupevents: [],
          groupId: groupId,
          groupImageURL: url
        });
      });
    }

  const removeImage = () => {
		setPic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	}

  return (
<div className="createDiv">
  <div className ="header">
    <h1>Create Group</h1>
    <p><b></b></p>
    </div>
    <div className="body">
      <div className="left-div">
        <div className="button-align-center">
          <img className="editprofile-img" src={pic}/>
          <label className="button-upload-file">Change Image
              <input type="file" accept="image/png, image/jpeg" onChange={acceptFile}></input>
          </label>
          <button className="dull-button" onClick={()=>removeImage()}>Remove Image</button>
        </div>
        <div className="form-items">
            <form>
              <b>Group Name</b>
              <input lassName="default-input" type="text" value={groupname} onChange={(e)=>setGroupname(e.target.value)}></input>
              <div className="user-inputs">
                  <div>
                    <b>Select Group Difficulty</b>
                    <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
                        {difficultyChoices.map(item=> <option value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div>
                    <b>Select Group Activitiy</b>
                    <select value={groupActivity} onChange={(e)=>setActivity(e.target.value)}>
                        {activityChoices.map(item=> <option value={item}>{item}</option>)}
                    </select>
                  </div>
              </div>
              <b>Group Description</b>
              <textarea className="bio-input" value={groupdesc} onChange={(e)=>setGroupdesc(e.target.value)}></textarea>
            </form>
        </div>
      </div>
      <div className="right-div">
        <div className="button-align-from-left">
            <button onClick={()=>createGroup()}>Create Group</button>
            <button className="dull-button" onClick={()=>{}}>Cancel</button>
        </div>
      </div>
  </div>
</div>
  );
}

export default CreateGroup;
