import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Signup/Signup";
import MapContainer from "./Components/EventMap/EventMap";
import CRUD from "./Components/TestFirebase/CRUD";
import ViewGroup from "./Components/ViewGroup";
import ViewEvent from "./Components/ViewEvent";
import ViewProfile from "./Components/ViewProfile";

function App() {
  let component;
  switch (window.location.pathname) {
    case "/Events":
      component = <MapContainer />;
      break;
    case "/Login":
      component = <Login />;
      break;
    case "/Signup":
      component = <SignUp />;
      break;
    case "/CRUD":
      component = <CRUD />;
      break;
    case "/ViewGroup":
      component = <ViewGroup />;
      break;

    case "/ViewEvent":
      component = <ViewEvent />;
    case "/ViewEProfile":
      component = <ViewProfile />;
      break;
    default:
      break;
  }
  return (
    <>
      <Navbar />
      {component}
    </>
  );
}

export default App;
