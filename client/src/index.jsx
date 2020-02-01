import React from "react";
import ReactDOM from "react-dom";
import CompanyFundamentals from "./components/companyFundamentals.jsx";
import CompanyDescription from "./components/companyDescription.jsx";
import config from "../../env.config.js";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        ticker: "ABCD",
        about: "",
        CEO: "",
        open: 0,
        high: 0,
        low: 0,
        marketCap: 0,
        yearHigh: 0,
        employees: 0,
        priceEarnings: 0,
        yearLow: 0,
        headquarters: "",
        dividendYield: "",
        founded: 0,
        averageVolume: 0,
        volume: 0
      }
    };
  }

  componentDidMount() {
    const ticker = this.state.data.ticker;
    fetch(
      // `http://ec2-54-215-175-243.us-west-1.compute.amazonaws.com:3333/about/ABCD`,
      "/about/ABCD",
      {
        method: "GET"
      }
    )
      .then(result => {
        return result.json();
      })
      .then(data => {
        fetch("http://ec2-54-88-251-88.compute-1.amazonaws.com:4444/price/ABCD")
          .then(result => {
            return result.json();
          })
          .then(result => {
            let obj = this.getValues(result);
            data = Object.assign(data, obj);
            this.setState({ data });
          });
      });
  }

  getValues(data) {
    let stateObj = {};
    const open = data.prices[0].open;
    stateObj = {
      high: `$${(open + open * 0.1).toFixed(2)}`,
      low: `$${(open - open * 0.1).toFixed(2)}`,
      open: `$${open}`,
      yearHigh: `$${(open + open * 0.2).toFixed(2)}`,
      yearLow: `$${(open - open * 0.2).toFixed(2)}`
    };
    return stateObj;
  }

  render() {
    return (
      <div>
        <h1 className="banner">About</h1>
        <div>
          <CompanyDescription about={this.state.data.about} />
        </div>
        <CompanyFundamentals data={this.state.data} />
      </div>
    );
  }
}

ReactDOM.render(<About />, document.getElementById("about"));

export default About;
