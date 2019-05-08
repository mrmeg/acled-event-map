import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

let map;
   
let mapData = {
  markerArr: [],
  userCoords: {},
  userMarker: [],
  value: 'Click to Search'
}

class Map extends Component {

  componentWillMount() {
    this.getAcled()
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = process.env.REACT_APP_GOOGLE_URL;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(script, x);
    script.addEventListener('load', e => {
      this.initMap()
    })
  } // end componentDidMount()

  componentWillUpdate(newProps) {
    if(mapData.acledData && newProps.value !== this.props.value) {
      mapData.value = newProps.value
      this.handleEventType(newProps.value)
    }
    if(mapData.acledData && newProps.value === 'fatalities') {
      console.log(newProps.value)
      this.handleFatalities(newProps.value)
    }
  }

  getAcled = () => {
    axios.get('https://api.acleddata.com/acled/read?terms=accept&limit=2000')
      .then((response) => {
        console.log(response.data.data)
        mapData.acledData = response.data.data
      })
      .catch(error => {console.log(error)})
  }

  // Initializes the map and map functions
  initMap() {

  let options = {
    zoom: 6,
    center: {lat: 33.5177, lng: 36.2519},
    gestureHandling: 'greedy',
    minZoom: 3
  }

  map = new window.google.maps.Map(
    document.getElementById(this.props.id),
    options);

  map.addListener('click', function(event) {
    if(mapData.acledData && mapData.value === 'Click to Search') {
      handleUserClick(event.latLng)
      processAcled(event)
    }
  })

  const handleUserClick = (location) => {
    this.clearMarkers()

    let userMarker = []
    let marker = new window.google.maps.Marker({
      position: location,
      map: map,
      visible: false
    })

    userMarker.push(marker)

    let userCoords = {
      lat: marker.getPosition().lat().toFixed(4),
      lng: marker.getPosition().lng().toFixed(4)
    }
    console.log(`Lat: ${userCoords.lat} Lng: ${userCoords.lng}`)

    mapData.userCoords = userCoords
    mapData.userMarker = userMarker
  } // close handleUserClick()

  const processAcled = (event) => {
    this.clearMarkers()
    
    let infoWindow = new window.google.maps.InfoWindow({});
    let markerArr = [];
    mapData.acledData.forEach((acledData) => {

      let acledLat = Number(acledData.latitude);
      let acledLng = Number(acledData.longitude);
  
      // Places markers on the map
      var marker = new window.google.maps.Marker({
        position: {lat: acledLat, lng: acledLng},
        map: map,
        clickable: true,
        visible: false,
      });

      let contentString = '<div class="infoWindow">' +
        `<p class="eventType">Event Type: ${acledData.event_type}</p>` +
        `<p class="eventDate">Date: ${acledData.event_date}</p>` +
        `<p class="description">Description: ${acledData.notes}</p>` +
        `<p class="source">Source: ${acledData.source}</p>` +
        `<p class="fatalities">Fatalities: ${acledData.fatalities}</p>` +
        `</div>`;

        infoWindow.setContent(contentString);
        this.bindInfoWindow(marker, map, infoWindow, infoWindow.content);

        let acledCoords = new window.google.maps.LatLng(acledData.latitude, acledData.longitude)

        let distance = Number(this.findDistance(event.latLng, acledCoords))

        if(distance < 250) {
          markerArr.push(marker)
          marker.visible = true;
          mapData.markerArr = markerArr
        }
    })
  } // close processAcled()

  } // close initMap()

  handleEventType = (value) => {
    this.clearMarkers()
    let markerArr = []
    let infoWindow = new window.google.maps.InfoWindow({})

    mapData.acledData.forEach((acledData) => {
      if(acledData.event_type === value) {
        
        let acledLat = Number(acledData.latitude);
        let acledLng = Number(acledData.longitude);

        let marker = new window.google.maps.Marker({
          position: {lat: acledLat, lng: acledLng},
          map: map,
          clickable: true,
          visible: true,
        });

        markerArr.push(marker)
        mapData.markerArr = markerArr;

        let contentString = '<div class="infoWindow">' +
        `<p class="eventType">Event Type: ${acledData.event_type}</p>` +
        `<p class="eventDate">Date: ${acledData.event_date}</p>` +
        `<p class="description">Description: ${acledData.notes}</p>` +
        `<p class="source">Source: ${acledData.source}</p>` +
        `<p class="fatalities">Fatalities: ${acledData.fatalities}</p>` +
        `</div>`;

          infoWindow.setContent(contentString);
          this.bindInfoWindow(marker, window.map, infoWindow, infoWindow.content);
      }
    })

  } // Close handleSelect()

  handleFatalities = () => {
    this.clearMarkers()
    let markerArr = []
    let infoWindow = new window.google.maps.InfoWindow({})    
    
    mapData.acledData.forEach((acledData) => {
      if(acledData.fatalities !== "0") {
        
        let acledLat = Number(acledData.latitude);
        let acledLng = Number(acledData.longitude);

        let marker = new window.google.maps.Marker({
          position: {lat: acledLat, lng: acledLng},
          map: map,
          clickable: true,
          visible: true,
        });

        markerArr.push(marker)
        mapData.markerArr = markerArr;

        let contentString = '<div class="infoWindow">' +
        `<p class="eventType">Event Type: ${acledData.event_type}</p>` +
        `<p class="eventDate">Date: ${acledData.event_date}</p>` +
        `<p class="description">Description: ${acledData.notes}</p>` +
        `<p class="source">Source: ${acledData.source}</p>` +
        `<p class="fatalities">Fatalities: ${acledData.fatalities}</p>` +
        `</div>`;

          infoWindow.setContent(contentString);
          this.bindInfoWindow(marker, window.map, infoWindow, infoWindow.content);
      }
    })
  } // Close handleFatalities()

  // Attach InfoWindows to markers
  bindInfoWindow = (marker, map, infoWindow, content) => {
    window.google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    });
  };

  clearMarkers = () => {
    mapData.markerArr.forEach((marker) => {
      marker.setMap(null)
    });
  }

  //  Finds distance for radial search  
  findDistance = (userCoords, acledCoords) => {
    let distance = (window.google.maps.geometry.spherical.computeDistanceBetween(userCoords, acledCoords) / 1000).toFixed(2);

    return distance;
  }; // Close findDistance()

  render() {
    return (
      <div style={this.props.style} id={this.props.id}></div>
    );
  }
}

export default Map