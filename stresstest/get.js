import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  // rps: 1000,
  // rps: 100,
  // rps: 10,
  rps: 1,
  vus: 200,
  duration: "30s"
};

//Get test
export default function() {
  let iterationStart = new Date().getTime();
  let res = http.get("http://localhost:3333/");
  check(res, {
   "status was 200": (r) => r.status == 200
  });
  let iterationDuration = (new Date().getTime() - iterationStart) / 1000;
  let sleepTime = 1 - iterationDuration;  // 1 second minus time spent on request execution

  if(sleepTime > 0){
    sleep(sleepTime);
  }
};