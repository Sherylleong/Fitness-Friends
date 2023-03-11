import { useState, useRef, createContext, useContext } from "react";
import { auth } from "../FirebaseDb/Firebase";
import { dispatch, useStoreState } from "../../App";
import { Link, redirect, useNavigate } from "react-router-dom";
import { firestore } from "../FirebaseDb/Firebase";
import { addDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./CreateGroup.css";
import { v4 as uuidv4 } from "uuid";

function CreateGroup() {
  const [groupname, setGroupname] = useState("");
  const [groupdesc, setGroupdesc] = useState("");
  const [groupdifficulty, setGroupdifficulty] = useState("");
  const [groupcategory, setGroupcategory] = useState("");
  const [groupmembers, setGroupmembers] = useState([]);
  const [groupevents, setGroupevents] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const storage = getStorage();
  const groupId = uuidv4();

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

  const submitGroup = async (e) => {
    e.preventDefault(); // Prevent Reload on Form Submit

    // Upload image to Firebase Storage
    if (selectedImage) {
      const imageRef = ref(storage, selectedImage.name);
      await uploadBytes(imageRef, selectedImage);

      // Get the download URL of the uploaded file
      const imageURL = await getDownloadURL(imageRef);

      // Store the URL in your database
      await addDoc(collection(firestore, "group"), {
        groupname: groupname,
        groupdesc: groupdesc,
        groupdifficulty: groupdifficulty,
        groupcategory: groupcategory,
        groupmembers: groupmembers,
        groupevents: groupevents,
        groupImageURL: imageURL,
        groupId: groupId,
      });
    }





    
  };
  return (
    <div className="creategroup-form">
      <div className="creategroup-form-container">
        <h1>Create Group Form </h1>
        <div> This information will be displayed on your group page</div>
        <form className="group-form" onSubmit={submitGroup}>
          <div className="grpimage">
            <label>Group image</label>
            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </div>

          <div className="grptitle">
            <label>Group Title</label>
            <input
              type="groupname"
              placeholder="Enter your group title"
              onChange={(e) => setGroupname(e.target.value)}
            />
          </div>

          <div className="grpdesc">
            <label>Group description</label>
            <textarea
              type="groupdesc"
              placeholder="Enter your group description (max 600 characters)"
              onChange={(e) => setGroupdesc(e.target.value)}
              maxlength="600"
            />
          </div>

          <div className="selection">
            <div className="grpdifficulty">
              <label>Group difficulty</label>
              <select onChange={(e) => setGroupdifficulty(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="grpcategory">
              <label>Group category</label>
              <select onChange={(e) => setGroupcategory(e.target.value)}>
                <option value="Walking">Walking</option>
                <option value="Jogging">Jogging</option>
                <option value="Running">Running</option>
                <option value="Climbing">Climbing</option>
                <option value="Biking">Biking</option>
                <option value="Sports">Sports</option>
                <option value="Other">Others</option>
              </select>
            </div>
          </div>

          <button type="submit">Submit </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
