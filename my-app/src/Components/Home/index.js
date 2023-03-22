import { useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"
function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="home-page">
            <div className="home-page-top">
                <div className="home-page-top-left">
                    <div className="home-page-text">
                        Get Fit<br/>Together
                    </div>
                    <button className="home-page-button">Find Events</button>
                </div>
                <div className="home-page-top-right">
                    <img className="home-page-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/home-page-image.jpg?alt=media&token=b955c904-02d6-452e-8e47-6f1f0897bb1a"/>
                </div>
            </div>
            <div className="home-page-bottom">
                <div className="home-page-activity-text">Check out popular activities</div>
                <div className="home-page-activity-cards">
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Walking"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/walk.png?alt=media&token=744f3101-df11-44d5-acca-e12e97c81966"/>
                        <div className="home-page-activity-card-text">Walking</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Jogging"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/jogging.png?alt=media&token=b8166c29-0161-4832-a1a3-c96578caf2d2"/>
                        <div className="home-page-activity-card-text">Jogging</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Running"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/running.png?alt=media&token=b77b1417-caf3-464e-b87c-10433d352596"/>
                        <div className="home-page-activity-card-text">Running</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Climbing"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/climb.png?alt=media&token=13b45286-9ac8-410d-af9f-386b9a3b9529"/>
                        <div className="home-page-activity-card-text">Climbing</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Biking"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/bike.png?alt=media&token=00876cec-299b-4980-b8de-b3503ba644a4"/>
                        <div className="home-page-activity-card-text">Biking</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Sports"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/sports.png?alt=media&token=223e5fb3-830b-4cd1-8e0f-1401b7acf78e"/>
                        <div className="home-page-activity-card-text">Sports</div>
                    </div>
                    <div className="home-page-activity-card" onClick={()=>navigate("/Events", {state:{category:"Others"}})}>
                        <img className="home-page-activity-card-img" src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/more-information.png?alt=media&token=2c3489ba-77f2-46c8-a19f-fdbb4cf31f56"/>
                        <div className="home-page-activity-card-text">Others</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;