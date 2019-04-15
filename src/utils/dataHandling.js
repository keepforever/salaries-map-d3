import * as d3 from "d3";
import _ from "lodash";

const cleanIncome = d => ({
  countyName: d["Name"],
  USstate: d["State"],
  medianIncome: Number(d["Median Household Income"]),
  lowerBound: Number(d["90% CI Lower Bound"]),
  upperBound: Number(d["90% CI Upper Bound"])
});

const dateParse = d3.timeParse("%m/%d/%Y");

const cleanSalary = d => {
  if (!d["base salary"] || Number(d["base salary"]) > 300000) {
    return null;
  }

  return {
    employer: d.employer,
    submit_date: dateParse(d["submit date"]),
    start_date: dateParse(d["start date"]),
    case_status: d["case status"],
    job_title: d["job title"],
    clean_job_title: d["job title"],
    base_salary: Number(d["base salary"]),
    city: d["city"],
    USstate: d["state"],
    county: d["county"],
    countyID: d["countyID"]
  };
};

const cleanUSStateName = d => ({
  code: d.code,
  id: Number(d.id),
  name: d.name
});

const cleanCounty = d => ({
  id: Number(d.id),
  name: d.name
});
/*
Each d3.csv call makes a fetch request, parses the fetched
CSV file into an array of JavaScript dictionaries, and
passes each row through the provided cleanup function.
We pass all median incomes through cleanIncome,
salaries through cleanSalary, etc.


when we call "loadAllData()" in App.js, we pass in a function,
data => this.setState(data), this is the callback().
"data" gets passed in and, ultimatly, set to state.  Here, our data
looks like
  { usTopoJson: us,
  countyNames: countyNames,
  medianIncomes: medianIncomesMap,
  ...
  }
*/

export const loadAllData = (callback = _.noop) => {
  // callback is given a default of _.noop, which is short for "no operation", basically, if a callback isn't passed in, then callback will be nothing.

  Promise.all([
    d3.json("data/us.json"),
    d3.csv("data/us-county-names-normalized.csv", cleanCounty),
    d3.csv("data/county-median-incomes.csv", cleanIncome),
    d3.csv("data/h1bs-2012-2016-shortened.csv", cleanSalary),
    d3.tsv("data/us-state-names.tsv", cleanUSStateName)
  ]).then(([us, countyNames, medianIncomes, techSalaries, USstateNames]) => {
    let medianIncomesMap = {};

    medianIncomes
      .filter(d => _.find(countyNames, { name: d["countyName"] }))
      .forEach(d => {
        d["countyID"] = _.find(countyNames, { name: d["countyName"] }).id;
        medianIncomesMap[d.countyID] = d;
      });

    techSalaries = techSalaries.filter(d => !_.isNull(d));

    callback({
      usTopoJson: us,
      countyNames: countyNames,
      medianIncomes: medianIncomesMap,
      medianIncomesByCounty: _.groupBy(medianIncomes, "countyName"),
      medianIncomesByUSState: _.groupBy(medianIncomes, "USstate"),
      techSalaries: techSalaries,
      USstateNames: USstateNames
    });
  });
};
