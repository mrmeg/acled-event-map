import React, { Component, Fragment } from 'react';
import Map from './Map'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline';

import { Tabs, Tab } from '@material-ui/core'

class App extends Component {

  state = {
    id: 'map',
    value: 'Click to Search'
  } 

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <Fragment>
        <CssBaseline>
          <Tabs
            id='appBar'
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Events Within 250km of Mouse Click"
                 value="Click to Search" />
            <Tab label="Protests"
                 value="Protests" />
            <Tab label="Riots"
                 value="Riots" />
            <Tab label="Violence against civilians"
                 value="Violence against civilians" />   
            <Tab label="Explosions/Remote violence"
                 value="Explosions/Remote violence" />
            <Tab label="Strategic developments" 
                 value="Strategic developments" />
            <Tab label="Incidents with Fatalities"
                 value="fatalities" />
            <Tab label="Battles" 
                 value="Battles"/>
          </Tabs>
        <Map value={this.state.value} 
             id={this.state.id}
        />
      </CssBaseline>
      </Fragment>
    );
  }
}

export default App;