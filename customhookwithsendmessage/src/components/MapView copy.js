import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
//import Progress_ from './Progress_'
//import {Segment } from 'semantic-ui-react'


const Marker = ({ text }) => (
  <div style={{
    color: 'white',
    background: 'blue',
    padding: '8px 8px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {text}
  </div>
);

const progressStyle = {
  backgroundColor: '#C0E2E1',
  width: '50%'
}

class MapView extends Component {


  /*
  constructor(props) {
    super(props);
    this.state = {
      center:[62,27]
        };
        this.setState({center:[163,127]})
      }
*/
  /*
  static defaultProps = {
    center: {
      lat: 62.8376,
      lng: 27.6477      
    },
    zoom: 11
  };
  */

  /*
 static defaultProps = {
  center: [59.938043, 30.337157],
  */

  render() {

    const { center, zoom, text } = this.props;
    console.log("TEXT=" + text)
    //const zoom= 11
    /*const center= {
         lat: 62.8376,
         lng: 27.6477      
    }*/

    //const heippa=[this.props.lat, 30.337157]
// bootstrapURLKeys={{ key: 'AIzaSyDpjvOEJNziJ2fRzXv50Xsu_IAk9jeaLCM' }}
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '50vh', width: '100%' }}>
        <GoogleMapReact
          
          //defaultCenter={center}
          //center={center}
          //center={{center:{lat:this.props.lat,lng:this.props.lng}}}          
          center={center}
          defaultZoom={zoom}
        >
          <Marker
            center={center}
            text={text}
          />
          {/*<Marker
            lat={this.props.lat}
            lng={this.props.lng}
            center={{center:{lat:this.props.lat,lng:this.props.lng}}}
            text="Iot"
          />*/}
        </GoogleMapReact>
  
      </div>
    );
  }
}

export default MapView