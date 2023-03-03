import { Component, useMemo } from "react"
import { GoogleMap, useLoadScript, Marker, MarkerClusterer} from '@react-google-maps/api';
import "./event-map-styles.css"
export default function MapContainer(){
	const {isLoaded} = useLoadScript({
		googleMapsApiKey: "AIzaSyCGCznAwZAFJ8qMQY1ckg6EfDwuczmepWI",
	});

	if (!isLoaded) return <div>..Loading</div>
	return <Map />
}

function Map() {
	const markers = [
		{position: useMemo(() => ({lat: 1.348578045634617, lng: 103.6831722481014}))},
		{position: useMemo(() => ({lat: 1.3485887714987213, lng: 103.68382670706136}))},
		{position: useMemo(() => ({lat: 1.3458889951752477, lng: 103.69933201581368}))},
		{position: useMemo(() => ({lat: 1.3451843416350524, lng: 103.69917596458055}))}
	]
	/*
	const ntu = useMemo(() => ({lat: 1.348578045634617, lng: 103.6831722481014}), [])
	const mark1 = useMemo(() => ({lat: 1.3485887714987213, lng: 103.68382670706136}))
	const mark2 = useMemo(() => ({lat: 1.3458889951752477, lng: 103.69933201581368}))
	const mark3 = useMemo(() => ({lat: 1.3451843416350524, lng: 103.69917596458055}))
	*/
	// const markerLoc: Array<LatLngLiteral> = [];
	// markerLoc.push({lat: 1.348578045634617, lng: 103.6831722481014});
	// markerLoc.push({lat: 1.3485887714987213, lng: 103.68382670706136});
	// markerLoc.push({lat: 1.3458889951752477, lng: 103.69933201581368});
	// markerLoc.push({lat: 1.3451843416350524, lng: 103.69917596458055});
	return (
		
		<>
			<GoogleMap zoom={18} 
			center={markers[1].position} 
			mapContainerClassName="map-container">
				{/* <Marker icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
				position={{lat: 1.348578045634617, lng: 103.6831722481014}} /> */}
				{/* <Marker position={ntu} />
				<Marker position={mark1} />
				<Marker position={mark2} />
				<Marker position={mark3} /> */}
				
				<MarkerClusterer>
					{(clusterer) => (
						<>
							{markers.map(marker => <Marker position={marker.position} clusterer={clusterer}/>)}
						</>
					)}
				</MarkerClusterer>
			</GoogleMap>
		</>
	)
}