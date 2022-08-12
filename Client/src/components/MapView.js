import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { BroadcastPin,GeoAltFill} from 'react-bootstrap-icons';

//const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Marker = ({ text }) => (
  <div>
  <BroadcastPin color="teal" size={40}/>
  <GeoAltFill color="teal" size={40}/>
  {/*<div
    style={{
      color: "white",
      background: "blue",
      padding: "8px 8px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
  </div>*/}
  </div>
);

export default function MapView({ location, zoom, text }) {
  console.log("location=" + location);

  const [center, setCenter] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  /*
  const defaultProps = {
    center: {
      lat: 62.897968,
      lng: 27.678171,
    },
    zoom: 11,
  };*/

  // center={defaultProps.center

  useEffect(() => {

    if (location !== undefined) {
      console.log("location=" + (typeof location.lat));
      console.log("zoom=" + zoom);

      /*
      setCenter({
        lat: 61.50,
        lng: 23.76,
      });*/
      
      
      setCenter({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
      });
      

      console.log("location.lat="+location.lat);
      setZoomLevel(zoom);  
    }else{
      setCenter({
        lat: 65.6147,
        lng: 26.0673,        
      });
      setZoomLevel(5);
    }
    
    console.log("zoom=" + zoom);
    

  }, [location,zoom]);
  

/*
lat: 63.897968,
        lng: 27.678171,
*/

  /*let center;

  if (location !== undefined) {
    center = {
      lat: location.lat,
      lng: location.lon,
    };
  } else {
    center = {
      lat: 62.897968,
      lng: 21.678171,
    };
  }*/

  // defaultCenter={center}
  // zoom={zoom}

  //function handleChange({center, zoom}) {
    function handleChange(e) {
  //function handleChange({props}) {
    //setCurrentAddress(location.address)
    //if (location.address !== currentAddress) {
      //setZoom(e.zoom);
      //console.log("CHANGED map loc="+location);
      //console.log("CHANGED map zoom="+zoom);
      console.log("ZOOMLEVEL=" + zoomLevel);
      console.log("CENTER=" + JSON.stringify(e.center)+" ----   "+JSON.stringify(e.center));
      //if(e.center!==center){
        setZoomLevel(e.zoom);
        setCenter(e.center);
     // }
    //}
  }

  //defaultZoom={zoomLevel}
    //    defaultCenter={center}
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "60.5vh", width: "100%" }}>
      <GoogleMapReact        
        bootstrapURLKeys={{ key: "AIzaSyDRBKyQQaMHt4LOiJQDdTnIQ0_FfUmLRFM" }}                
        center={center}
        zoom={zoomLevel}
        onChange={handleChange}
      >
        {/*{location !== undefined && (*/}
          <Marker lat={center.lat} lng={center.lng} text={text} />
        {/*})}*/}
      </GoogleMapReact>
    </div>
  );
}
