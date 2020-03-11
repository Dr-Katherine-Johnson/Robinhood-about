import React from "react";
import ReactDOM from "react-dom";
import CompanyFundamentals from "./components/companyFundamentals.jsx";
import CompanyDescription from "./components/companyDescription.jsx";

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        ticker: "ABCDE",
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
    console.log(process.env.REACT_APP_API)
    // fetch( `ec2-3-135-182-136.us-east-2.compute.amazonaws.com:3333/about/${ticker}`,
    fetch(`/about/${ticker}`,
      {
        method: "GET"
      }
    )
      .then(result => {
        return result.json();
      })
      .then(data => { // from christian's chart
        // fetch(`ec2-3-135-182-136.us-east-2.compute.amazonaws.com:3333/about/${ticker}`)
          fetch(`/about/${ticker}`)
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
    const open = 132.58//data.prices[0].open; 
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
