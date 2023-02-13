import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';
import MapContainer from './pages/EventMap';

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
