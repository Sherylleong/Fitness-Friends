import { useState, useRef, createContext, useContext, useEffect } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { dispatch, useStoreState } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../FirebaseDb/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./CreateGroup.css";
import "../Create.css"
import { v4 as uuidv4 } from "uuid";
import Filter from 'bad-words';
import { ImageController } from "../../Controller/ImageController";
import { GroupController } from "../../Controller/GroupController";

function EditGroup() {
  const [groupname, setGroupname] = useState("");
  const [groupdesc, setGroupdesc] = useState("");
  const [difficulty, setDifficulty] = useState("")
  const [groupActivity, setActivity] = useState("")
  const [pic, setPic] = useState("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");

  const navigate = useNavigate();

  const difficultyChoices = ["Beginner", "Intermediate", "Advanced"]
  const activityChoices = ["Walking", "Jogging", "Running", "Climbing","Biking","Sports","Others"]

  const [showMissingName, setShowMissingName] = useState(false);
  const [showMissingDesc, setShowMissingDesc] = useState(false);

  const gc = new GroupController();

  const { groupId: urlGroupId } = useParams();

  const getGroupDetails = async () => {
    gc.getGroup(urlGroupId, setPic, setGroupname, setGroupdesc, setDifficulty, setActivity)
  }

  const [userFile, setUserFile] = useState(null);
	const acceptFile = event => {
		var fileUploaded = event.target.files[0];
		setUserFile(fileUploaded);
		setPic(URL.createObjectURL(fileUploaded));
	};

  const updateGroup = async () => {
    var url
    if (userFile != null) {
        const ic = new ImageController();
        url = await ic.uploadFile(userFile, urlGroupId, "group");
    }else {
        url = pic;
    }
    console.log(url);
    const badFilter = new Filter();

    let nameChange=groupname, descChange=groupdesc;
		try {nameChange = badFilter.clean(groupname)} catch(e) {}
		try {descChange = badFilter.clean(groupdesc)} catch(e) {}

    await gc.updateGroup(urlGroupId, {
      groupname: nameChange,
      groupdesc: descChange,
      groupdifficulty: difficulty,
      groupcategory: groupActivity,
      groupImageURL: url
    });
    navigate("/ViewProfile");
  }

  function validateGroupForm() {
    let incorrect = false;
    setShowMissingName(false);
    setShowMissingDesc(false);
    if (!groupname) {
        setShowMissingName(true);
        incorrect = true;
    }
    if (!groupdesc) {
        setShowMissingDesc(true);  
        incorrect = true;}
    if (!incorrect) {updateGroup(); alert("Group successfully edited!")}

  }

  const removeImage = () => {
    setUserFile(null);
		setPic("https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/defaultPFP.png?alt=media&token=93a30cef-5994-4701-9fab-9ad9fdec913c");
	}

    useEffect(() => {
       getGroupDetails();
    }, []);

  return (
<div className="createDiv">
  <div className ="header">
    <h1>Edit Group</h1>
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
              <div style={{display: showMissingName ? 'block' : 'none'}} id="missing-title" className="account-form-incorrect">Group name is required.</div>
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
              <div style={{display: showMissingDesc ? 'block' : 'none'}} id="missing-desc" className="account-form-incorrect">Group description is required.</div>
            </form>
        </div>
      </div>
      <div className="right-div">
        <div className="button-align-from-left">
            <button onClick={()=>validateGroupForm()}>Update Group</button>
            <button className="dull-button" onClick={()=>{navigate("/ViewProfile");}}>Cancel</button>
        </div>
      </div>
  </div>
</div>
  );
}

export default EditGroup;
