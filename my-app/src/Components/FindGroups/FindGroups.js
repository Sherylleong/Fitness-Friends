import { useState,useReducer, useEffect  } from "react";
import GroupFilters from "../Filters/GroupFilters.js"
import "./find-groups-styles.css";


function groupsListCard(group){
    return (
        <div className="group-list-card">
        <div className="group-list-img">
        <div className="crop">
            <img src="http://i.stack.imgur.com/wPh0S.jpg"/>
        </div>
        </div>
        <div className="group-card-desc">
            <h1 className="group-list-name">{group.name}</h1>
            <p className="group-list-date">formed on {group.dateFormed}</p>
            <p className="group-list-location">{group.location}</p>
            <p className="group-list-attendees">{group.members} members</p>

        </div>
        <div className="group-card-tags">
            <p className="group-list-category">{group.category}</p>
            <p className="group-list-difficulty">{group.difficulty}</p>
        </div>
        <div>
            
            <button className="join-group">Join</button>
        </div>
        </div>
        
    )
}

function Searchbar({handleFilters}){
    return (
        <input 
        id="locationsearch"
        name="search"
        type="text"
        className="searchbar"
        placeholder="Search..."
        onChange={(e) => handleFilters(e)}
    />
    )
}
function GroupsHeader(){
    return (
            <div style={{ display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                <h1 style={{marginTop:"0px", position:"relative", right:"277px"}}>Filters</h1>
                <h1 style={{marginTop:"0px", position:"relative", fontSize:"50px"}}>Search Groups</h1>
            </div>
    )
}

function GroupsListList({groups, handleFilters}){
    return (
        <div className="groups-list-list">
            <div style={{ position: "relative", left:"-350px"}}>
            <Searchbar handleFilters={handleFilters}  searchText="Search group..."/>
            </div>
            {
                groups.map((group) => groupsListCard(group))
            }
        </div>
    )
}

export default function FindGroups(){

    let groupsdb = [
        {
            name: "tekong bois",
            dateFormed: "2023-01-05",
            category: "Jogging",
            difficulty: "Intermediate",
            description: "wgt wadio ord loh",
            members: 10
        },
        {
            name: "naruto bois",
            dateFormed: "2022-01-05",
            category: "Running",
            difficulty: "Intermediate",
            description: "waaaaa",
            members: 5
        },
        {
            name: "bois",
            dateFormed: "2022-01-05",
            category: "Other",
            difficulty: "Beginner",
            description: "test",
            members: 50
        },

    ]

    //const [groups, setgroups] = useState(groupsdb);
   
    let groups = groupsdb;
    const [filters, setFilters] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            search: "",
            difficulty: [],
            category: [],
            members: []
        }
      );

      groups = (filterGroups(groupsdb, filters));

  

    function handleFilters(group){
        const name = group.target.name;
        const newValue = group.target.value;
        if (group.target.type === "checkbox"){ // checkboxes need multiple values ie array
            if (group.target.checked){ // box checked, add to filter
                let newFiltersList = [...filters[name]];
                newFiltersList.push(newValue);
                setFilters({ [name]: newFiltersList });
            }
            else { // box unchecked, remove from filter
                let newFiltersList = [...filters[name]];
                newFiltersList = newFiltersList.filter(v => v !== newValue);
                setFilters({ [name]: newFiltersList });
            }
        }
        else {
            setFilters({ [name]: newValue });
        }
    }

    function filterGroups(groups, filters){
        let filteredGroups = groups.filter((group) => {
            if (filters.difficulty.length !==0 && !(filters.difficulty.includes(group.difficulty))) return false;
            if (filters.category.length !==0 && !(filters.category.includes(group.category))) return false;
            let memberCnt;
            if (group.members < 10) memberCnt = "<10";
            else if (group.members > 30) memberCnt = ">30";
            else memberCnt = "10-30";
            if (filters.members.length !==0 && !(filters.members.includes(memberCnt))) return false;
            return group.name.toLowerCase().indexOf(filters.search.toLowerCase()) !==-1;
        })
        return filteredGroups;
    }


    return(
        <div className="find-groups-page" >{/*col*/}
            <GroupsHeader />{/*row*/}
            <GroupListInfo groups={groups} handleFilters={handleFilters}/>
        </div>

    )
}


function GroupListInfo({groups, handleFilters}){
    return (
        <div className="group-list-info">
        <GroupFilters groups={groups} handleFilters={handleFilters}/>
        <GroupsListList groups={groups} handleFilters={handleFilters}/>    
    </div>
    )
}