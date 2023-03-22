import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import CompleteRegistration from "./Components/CompleteRegistration/CompleteRegistration";
import SignUp from "./Components/Signup/Signup";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import FindEventsMap from "./Components/FindEventsMap/FindEventsMap";
import FindGroups from "./Components/FindGroups/FindGroups";
import CRUD from "./Components/TestFirebase/CRUD";
import ViewGroup from "./Components/ViewGroup";
import ViewEvent from "./Components/ViewEvent";
import ViewProfile from "./Components/ViewProfile";
import EditProfile from "./Components/EditProfile";
import CreateGroup from "./Components/CreateGroup";
import CreateEvent from "./Components/CreateEvent";
import Home from "./Components/Home";
import { createStore } from "react-hooks-global-state";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
// import { withRouter } from "react-router";

const setUserId = (state, action) => {
  return { ...state, userId: action.newId };
};
// Global State
const { dispatch, useStoreState } = createStore(setUserId, { userId: "" });

export { dispatch, useStoreState };

function App() {
  // let component;
  // let navBarDisplay = true;

  // const location = useLocation().pathname;
  // console.log(location);
  // switch (location) {
  //   case "/Events":
  //     component = <FindEventsMap />;
  //     break;
  //   case "/Login":
  //     component = <Login />;
  //     navBarDisplay = false;
  //     break;
  //   case "/Signup":
  //     component = <SignUp />;
  //     navBarDisplay = false;
  //     break;
  //   case "/ForgetPassword":
  //       component = <ForgetPassword />;
  //       navBarDisplay = false;
  //       break;
  //   case "/CRUD":
  //     component = <CRUD />;
  //     break;
  //   case "/Groups":
  //     component = <ViewGroup />;
  //     break;
  //   case "/ViewEvent":
  //     component = <ViewEvent />;
  //     break;
  //   case "/ViewProfile":
  //     component = <ViewProfile />;
  //     break;

  //   default:
  //     break;
  // }

  // const [showNavBar, setShowNavBar] = useState(navBarDisplay); //Best solution I found

  return (
    <>
      {![
        "/Login",
        "/CompleteRegistration",
        "/Signup",
        "/ForgetPassword",
      ].includes(useLocation().pathname) && <Navbar />}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route
          path="/CompleteRegistration"
          element={<CompleteRegistration />}
        />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/Events" element={<FindEventsMap />} />
        <Route path="/Groups" element={<FindGroups />} />
        <Route path="/CRUD" element={<CRUD />} />
        <Route path="Groups/ViewGroup/:groupId" element={<ViewGroup />} />
        <Route path="/Events/ViewEvent/:eventId" element={<ViewEvent />} />
        <Route path="/ViewProfile" element={<ViewProfile />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/EditProfile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
