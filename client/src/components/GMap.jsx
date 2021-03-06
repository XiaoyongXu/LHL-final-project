import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

require('dotenv').config();

const API_KEY = process.env.REACT_APP_API_KEY

const AnyReactComponent = ({ text }) =>
  (<div>
    <i className="material-icons">
      gps_fixed
    </i>
    <span>{text}</span>
  </div>


  );

class GMap extends Component {
  render() {

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '14rem', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={this.props.lat}
            lng={this.props.lng}
            text={''}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default GMap;