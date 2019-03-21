import React, { Component } from "react";
import { Container } from "./styled/app";
import Preloader from "./comps/Preloader";
import * as d3 from "d3";
import _ from "lodash";
import { loadAllData } from "./DataHandling";

class App extends Component {
  state = {
    techSalaries: [],
    medianIncomes: [],
    countyNames: []
  };

  componentDidMount() {
    loadAllData(data => this.setState(data));
  }

  render() {
    const { techSalaries } = this.state;
    console.log('this.state = ', this.state, '\n' )

    if (techSalaries.length < 1) return <Preloader />;

    return (
      <div className="App container">
        <h1>Loaded {techSalaries.length} salaries</h1>
      </div>
    );
  }
}

export default App;
