import { useState, useReducer, useEffect } from "react";
import GroupFilters from "../Filters/GroupFilters.js";
import "./find-groups-styles.css";
import { firestore } from "../FirebaseDb/Firebase";
import { doc, collection, query, where, getDocs } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { dispatch, useStoreState } from "../../App";
import { useNavigate } from "react-router-dom";

function GroupsListCard(group) {
  console.log("group:");
  console.log(group.id);
  const groupId = group.id;
  const navigate = useNavigate();

  const handleViewGroup = () => {
    navigate("ViewGroup/" + groupId);
  };

  return (
    <div className="group-list-card">
      <div className="group-list-img">
        <div className="crop">
          <img src={group.groupImageURL} />
        </div>
      </div>
      <div className="group-card-desc">
        <h1 className="group-list-name">{group.groupname}</h1>
        <p className="group-list-date">formed on {group.dateFormed}</p>
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
      <h1 style={{ marginTop: "0px", position: "relative", right: "330px" }}>
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

function GroupsListList({ groups, handleFilters }) {
  return (
    <div className="groups-list-list">
      <div style={{ position: "relative", left: "-350px" }}>
        <Searchbar handleFilters={handleFilters} searchText="Search group..." />
      </div>
      {groups.map((group) => GroupsListCard(group))}
    </div>
  );
}

export default function FindGroups() {
  let groupsdb = [
    {
      name: "tekong bois",
      dateFormed: "2023-01-05",
      category: "Jogging",
      difficulty: "Intermediate",
      description: "wgt wadio ord loh",
      members: 10,
    },
    {
      name: "naruto bois",
      dateFormed: "2022-01-05",
      category: "Running",
      difficulty: "Intermediate",
      description: "waaaaa",
      members: 5,
    },
    {
      name: "bois",
      dateFormed: "2022-01-05",
      category: "Other",
      difficulty: "Beginner",
      description: "test",
      members: 50,
    },
  ];

  //const [groups, setgroups] = useState(groupsdb);

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
      if (group.groupmembers.length < 10) memberCnt = "<10";
      else if (group.groupmembers.length > 30) memberCnt = ">30";
      else memberCnt = "10-30";
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
      <GroupListInfo groups={filteredGroups} handleFilters={handleFilters} />
    </div>
  );
}

function GroupListInfo({ groups, handleFilters }) {
  return (
    <div className="group-list-info">
      <GroupFilters groups={groups} handleFilters={handleFilters} />
      <GroupsListList groups={groups} handleFilters={handleFilters} />
    </div>
  );
}
