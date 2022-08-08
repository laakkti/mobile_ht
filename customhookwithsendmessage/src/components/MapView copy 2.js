import React from "react";
import GoogleMapReact from "google-map-react";

//const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Marker = ({ text }) => (
  <div
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
  </div>
);

export default function MapView({loc, zoom, text}) {

  console.log("loc=" + loc);
  const defaultProps = {
    center: {
      lat: 62.897968,
      lng: 27.678171,
    },
    zoom: 11,
  };

  // center={defaultProps.center
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDRBKyQQaMHt4LOiJQDdTnIQ0_FfUmLRFM" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <Marker
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
          text="Kuopio"
        />

  {/*      <AnyReactComponent
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
          text="My Marker"
  />*/}
      </GoogleMapReact>
    </div>
  );
}
