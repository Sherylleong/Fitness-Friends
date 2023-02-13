import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import MapContainer from './Components/EventMap/EventMap';

function App() {
	let component
	switch (window.location.pathname) {
		case "/Events":
			component = <MapContainer />
			break
		default:
			break
	}
	return (
		<>
		<Navbar />
		{component}
		</>
	);
}

export default App;
