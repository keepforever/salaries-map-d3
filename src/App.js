import React, { Component } from "react";
import * as d3 from "d3";
// import _ from "lodash";
// locals
import Preloader from "./comps/Preloader";
// import CountyMap from "./components/CountyMap";
// utils
import { loadAllData } from "./utils/dataHandling";

class App extends Component {
  state = {
    techSalaries: [],
    medianIncomes: [],
    countyNames: []
  };

  componentDidMount() {
    loadAllData(data => this.setState(data));
  }

  // In the App class itself, we add a countyValue method. It takes a county entry and a map of tech salaries, and it returns the delta between median household income and a single tech salary.

  countyValue(county, techSalariesMap) {
    const medianHousehold = this.state.medianIncomes[county.id],
      salaries = techSalariesMap[county.name];

    if (!medianHousehold || !salaries) {
      return null;
    }

    const median = d3.median(salaries, d => d.base_salary);

    return {
      countyID: county.id,
      value: median - medianHousehold.medianIncome
    };
  }

  render() {
    const { techSalaries } = this.state;
    console.log("this.state = ", this.state, "\n");

    if (techSalaries.length < 1) return <Preloader />;

    return (
      <div className="App container">
        <h1>Loaded {techSalaries.length} salaries</h1>
      </div>
    );
  }
}

export default App;
