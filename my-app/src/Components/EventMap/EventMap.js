import { Component, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import "./event-map-styles.css";

export default function MapContainer({events, setFilters}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCGCznAwZAFJ8qMQY1ckg6EfDwuczmepWI",
  });
  if (!isLoaded) return <div>..Loading</div>;
  return <Map events={events} setFilters={setFilters}/>;
}

function Map({events, setFilters}) {
  console.log(events);
  if (events == undefined) {
    events = [];
  }
  console.log("running");
  const onMarkerClick = (event) => {
    setFilters({search: event.eventLocation});
  }
  return (
    <>
      <GoogleMap
        zoom={12}
        center={{lat:1.3573334951328686,lng:103.80911341579483}}
        mapContainerClassName="map-container"
      >
        {events.map((marker, index) => (
              <Marker key={"marker-" + index} id={index} position={marker.eventPosition}  onClick={()=>onMarkerClick(marker)}/>
        ))}
        {/* <MarkerClusterer>
                {clusterer => 
                    events.map((marker, index) => (
                        <Marker key={"marker-" + index} id={index} position={marker.eventPosition} clusterer={clusterer} onClick={()=>onMarkerClick(marker)}/>
                    ))
                }
        </MarkerClusterer> */}
      </GoogleMap>
    </>
  );
}
