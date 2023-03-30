import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Signup/Signup";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import FindEventsMap from "./Components/FindEventsMap/FindEventsMap";
import FindGroups from "./Components/FindGroups/FindGroups";
import ViewGroup from "./Components/ViewGroup";
import ViewEvent from "./Components/ViewEvent";
import EditEvent from "./Components/EditEvent/Editevent";
import ViewProfile from "./Components/ViewProfile";
import EditProfile from "./Components/EditProfile/Editprofile";
import EditGroup from "./Components/EditGroup/Editgroup";
import CreateGroup from "./Components/CreateGroup";
import CreateEvent from "./Components/CreateEvent/Create_event";
import ViewMembersEvent from "./Components/ViewMembersEvent";
import ViewMembersGroup from "./Components/ViewMembersGroup";
import Home from "./Components/Home";
import { createStore } from "react-hooks-global-state";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ViewMemberProfile from "./Components/ViewMemberProfile";

const setUserId = (state, action) => {
  return { ...state, userId: action.newId };
};
// Global State
const { dispatch, useStoreState } = createStore(setUserId, { userId: "" });

export { dispatch, useStoreState };

function App() {
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
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/Events" element={<FindEventsMap />} />
        <Route path="/Groups" element={<FindGroups />} />
        <Route path="/ViewGroup/:groupId" element={<ViewGroup />} />
        <Route path="/ViewMembersGroup/:groupId/" element={<ViewMembersGroup />} />
        <Route path="/ViewEvent/:eventId" element={<ViewEvent />} />
        <Route path="/EditEvent/:eventId" element={<EditEvent />} />
        <Route path="/EditGroup/:groupId" element={<EditGroup />} />
        <Route path="/ViewMembersEvent/:eventId" element={<ViewMembersEvent />} />
        <Route path="/ViewMemberProfile/:memberId" element={<ViewMemberProfile />} />
        <Route path="/ViewProfile" element={<ViewProfile />} />
        <Route path="/CreateGroup" element={<CreateGroup />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />
        <Route path="/" element={<Home />} />
        <Route path="/EditProfile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
