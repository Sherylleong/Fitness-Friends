import {GoogleMap,useLoadScript,Marker} from "@react-google-maps/api";
import "./event-map-styles.css";

export default function MapContainer({events, setFilters}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GMAP_APIKEY,
  });
  if (!isLoaded) return <div>..Loading</div>;
  return <Map events={events} setFilters={setFilters}/>;
}

function Map({events, setFilters}) {
  var mapPos;
  console.log(events);
  if (events == undefined) {
    events = [];
  }
  var checkingSame = null;
  events.forEach((item) => {
      if (checkingSame == null) {
          checkingSame = item.eventLocation;
          mapPos = item.position;
      }else if (checkingSame != item.eventPosition) {
          mapPos = {lat:1.3573334951328686,lng:103.80911341579483};
      } 
  })
  console.log("running");
  const onMarkerClick = (event) => {
    console.log(event);
    setFilters({search: event.eventLocation});
  }


  return (
    <>
      <GoogleMap
        zoom={12}
        center={mapPos}
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
