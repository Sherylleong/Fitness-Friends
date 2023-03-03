import logo from "./logo.svg";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Signup/Signup";
import FindEventsMap from "./Components/FindEventsMap/FindEventsMap";
import CRUD from "./Components/TestFirebase/CRUD";
import ViewGroup from "./Components/ViewGroup";
import ViewEvent from "./Components/ViewEvent";
import ViewProfile from "./Components/ViewProfile";

function App() {
  let component;
  switch (window.location.pathname) {
    case "/Events":
      component = <FindEventsMap />;
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
      break;
    case "/ViewProfile":
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
