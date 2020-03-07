import http from "k6/http";
import { check, sleep } from "k6";

let maxVU = 200;
// let maxRPS = 1;
// let maxRPS = 10;
let maxRPS = 100;
// let maxRPS = 1000;
let seconds = 30;
let maxIteration = seconds * maxRPS / maxVU * 1.25;

export let options = {
  rps: maxRPS,
  vus: maxVU,
  duration: `${seconds}s`,
  teardownTimeout: "250s"
};

export default function() {
  let iterationStart = new Date().getTime();
  let ticker = `V${__VU}I${__ITER}`
  const testObject = {
    ticker: ticker,
    about: "ABOUT",
    CEO: "CEO",
    open: "OPEN",
    employees: 1,
    headquarters: 'HQ'
  }
  let res = http.post("http://localhost:3333/about", testObject);
  check(res, {
   "status was 201": (r) => r.status == 201
  });
  let iterationDuration = (new Date().getTime() - iterationStart) / 1000;
  let sleepTime = 1 - iterationDuration;  // 1 second minus time spent on request execution

  if(sleepTime > 0){
    sleep(sleepTime);
  }
};

export function teardown() {
  for (let i = 1; i <= maxVU; i++) {
    for (let j = 0; j < maxIteration; j++) {
    http.del(`http://localhost:3333/about/V${i}I${Math.round(j)}`);
    console.log('TEARDOWN', `${i}I${Math.round(j)}`)
    }
  }
}