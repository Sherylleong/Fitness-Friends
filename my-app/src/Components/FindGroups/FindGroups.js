import { useState, useReducer, useEffect } from "react";
import GroupFilters from "../Filters/GroupFilters.js";
import "./find-groups-styles.css";
import { firestore } from "../FirebaseDb/Firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { dispatch, useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";

function GroupsListCard(group, userId,navigate, users) {
  console.log("group:");
  console.log(group.id);
  const groupId = group.id;

  let owner = users.filter((user) => {return user.userId == group.groupOwner})[0]
  console.log(owner)
  const eventId = group.id;
  let joined = (group.groupmembers.includes(userId) || group.groupOwner==userId)
  const handleViewGroup = () => {
    navigate("/ViewGroup/" + groupId);
  };

  return (
    <div className="group-list-card" style={{backgroundColor:joined ? "#C0C0C0" : "white", opacity:joined ? "0.5" : "1", paddingLeft:"15px"}}>
      <div className="group-list-img">
        <div className="crop">
          <img src={group.groupImageURL} />
        </div>
      </div>
      <div className="group-card-desc">
        <h1 className="group-list-name">{group.groupname}</h1>
        <p className="group-list-date">Created by {owner.displayName}</p>
        <p className="group-list-location">{group.grouplocation}</p>
        <p className="group-list-attendees">
          {group.groupmembers.length} member(s)
        </p>
      </div>
      <div className="group-card-tags">
        <p className="group-list-category">{group.groupcategory}</p>
        <p className="group-list-difficulty">{group.groupdifficulty}</p>
      </div>
      <div>
        <button className="join-group-find" onClick={handleViewGroup}>
          View
        </button>
      </div>
    </div>
  );
}

function Searchbar({ handleFilters }) {
  return (
    <input
      id="locationsearch"
      name="search"
      type="text"
      className="searchbar"
      placeholder="Search..."
      onChange={(e) => handleFilters(e)}
    />
  );
}
function GroupsHeader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <h1 style={{ marginTop: "0px", position: "relative", right: "270px" }}>
        Filters
      </h1>
      <h1
        style={{
          marginTop: "0px",
          position: "relative",
          right: "500px",
          fontSize: "50px",
        }}
      >
        Search Groups
      </h1>
    </div>
  );
}

function GroupsListList({ groups, handleFilters, userId,navigate, users}) {
  return (
    <div className="groups-list-list">
      <div style={{ position: "relative", left: "-350px" }}>
        <Searchbar handleFilters={handleFilters} searchText="Search group..." />
      </div>
      {groups.map((group) => GroupsListCard(group,userId,navigate, users))}
    </div>
  );
}

export default function FindGroups() {
  const navigate = useNavigate();
  const userId = useStoreState("userId");

  //const [groups, setgroups] = useState(groupsdb);
  const [users, setUsers] =  useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      const groupsRef = collection(firestore, "group");

      const q = query(groupsRef);
      const querySnapshot = await getDocs(q).catch((error) => {
        console.log("Error getting documents: ", error);
      });
      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        const fetchedGroups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(querySnapshot);
        setGroups(fetchedGroups);
      }
    };

    const fetchUsers = async () => {
      const usersRef = collection(firestore, "users");

      const q = query(usersRef);
      const querySnapshot = await getDocs(q).catch((error) => {
        console.log("Error getting documents: ", error);
      });
      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(querySnapshot);
        setUsers(fetchedUsers);
      }
    };

    fetchUsers();
    fetchGroups();
  }, []); // re-fetch the events whenever anything changes

  const [filters, setFilters] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      search: "",
      difficulty: [],
      category: [],
      members: [],
    }
  );

  let filteredGroups = filterGroups(groups, filters);

  function handleFilters(group) {
    const name = group.target.name;
    const newValue = group.target.value;
    if (group.target.type === "checkbox") {
      // checkboxes need multiple values ie array
      if (group.target.checked) {
        // box checked, add to filter
        let newFiltersList = [...filters[name]];
        newFiltersList.push(newValue);
        setFilters({ [name]: newFiltersList });
      } else {
        // box unchecked, remove from filter
        let newFiltersList = [...filters[name]];
        newFiltersList = newFiltersList.filter((v) => v !== newValue);
        setFilters({ [name]: newFiltersList });
      }
    } else {
      setFilters({ [name]: newValue });
    }
  }

  function filterGroups(groups, filters) {
    let filteredGroups = groups.filter((group) => {
      if (
        filters.difficulty.length !== 0 &&
        !filters.difficulty.includes(group.groupdifficulty)
      )
        return false;
      if (
        filters.category.length !== 0 &&
        !filters.category.includes(group.groupcategory)
      )
        return false;
      let memberCnt;
      if (group.groupmembers.length <= 5) memberCnt = "<=5";
      else if (group.groupmembers.length <= 10) memberCnt = "6-10";
      else if (group.groupmembers.length <= 15) memberCnt = "11-15";
      else if (group.groupmembers.length <= 20) memberCnt = "16-20";
      else memberCnt = ">20";
      if (filters.members.length !== 0 && !filters.members.includes(memberCnt))
        return false;
      return (
        group.groupname.toLowerCase().indexOf(filters.search.toLowerCase()) !==
        -1
      );
    });
    return filteredGroups;
  }

  return (
    <div className="find-groups-page">
      {/*col*/}
      <GroupsHeader />
      {/*row*/}
      <GroupListInfo groups={filteredGroups} handleFilters={handleFilters} userId={userId} navigate={navigate} users={users}/>
    </div>
  );
}

function GroupListInfo({ groups, handleFilters, userId,navigate, users}) {
  return (
    <div className="group-list-info">
      <GroupFilters groups={groups} handleFilters={handleFilters} />
      <GroupsListList groups={groups} handleFilters={handleFilters} userId={userId} navigate={navigate} users={users} />
    </div>
  );
}
