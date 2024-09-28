import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import running from "../Resources/runningimage.png";
import jogging from "../Resources/joggingimage.png";
import walking from "../Resources/walkingimage.png";
import climbing from "../Resources/climbingimage.png";
import sports from "../Resources/sportsimage.png";
import others from "../Resources/othersimage.png";
import homepage from "../Resources/Homepage.png";
import "./Home.css";

function HomePage() {
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const textOptions = ["Fit", "Sporty", "Healthy"];

  useEffect(() => {
    if (charIndex < textOptions[textIndex].length) {
      const timeoutId = setTimeout(() => {
        setCharIndex(charIndex + 1);
      }, 100); // add a new character every 100 milliseconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [charIndex, textIndex, textOptions]);

  useEffect(() => {
    setCharIndex(0);
  }, [textIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((textIndex + 1) % textOptions.length);
    }, 3000); // change text every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [textIndex, textOptions.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((textIndex + 1) % textOptions.length);
    }, 2000); // change text every 3 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [textIndex, textOptions.length]);

  return (
    <div className="home-page">
      <div className="home-page-top">
        <div className="home-page-top-left">
          <div className="home-page-text">
            Get
            <br />
            <div
              className="changing"
              style={{
                backgroundImage: "linear-gradient(45deg, #ee6b6e, #77c9d4)",
                backgroundClip: "text",
                color: "#fc3d03",
              }}
            >
              {textOptions[textIndex]}
            </div>
            Together
          </div>
          <button
            className="home-page-button "
            onClick={() => navigate("/Events")}
          >
            Find Events
          </button>
        </div>
        <div className="home-page-top-right">
          <img className="home-page-img" src={homepage} />
        </div>
      </div>
      <div className="home-page-bottom">
        <div className="home-page-activity-text">
          Check out popular activities
        </div>
        <div className="home-page-activity-cards">
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Walking" } })
            }
          >
            <img className="home-page-activity-card-img" src={walking} />
            <div className="home-page-activity-card-text">Walking</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Jogging" } })
            }
          >
            <img className="home-page-activity-card-img" src={jogging} />
            <div className="home-page-activity-card-text">Jogging</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Running" } })
            }
          >
            <img className="home-page-activity-card-img" src={running} />
            <div className="home-page-activity-card-text">Running</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Climbing" } })
            }
          >
            <img className="home-page-activity-card-img" src={climbing} />
            <div className="home-page-activity-card-text">Climbing</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Biking" } })
            }
          >
            <img
              className="home-page-activity-card-img"
              src="https://firebasestorage.googleapis.com/v0/b/sc2006-fitnessfriends-66854.appspot.com/o/bike.png?alt=media&token=00876cec-299b-4980-b8de-b3503ba644a4"
            />
            <div className="home-page-activity-card-text">Biking</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Sports" } })
            }
          >
            <img className="home-page-activity-card-img" src={sports} />
            <div className="home-page-activity-card-text">Sports</div>
          </div>
          <div
            className="home-page-activity-card"
            onClick={() =>
              navigate("/Events", { state: { category: "Other" } })
            }
          >
            <img className="home-page-activity-card-img" src={others} />
            <div className="home-page-activity-card-text">Others</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
