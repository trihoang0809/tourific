import path from "path";
import { activityData } from "./schedule/prepareData";

let schedule = '{ "route": [0], "cost": 0 }';

async function getSchedule(activity: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");

    // Example path to your algorithm file
    let algorithmFilePath = path.join(__dirname, "../../../algorithm/generateSchedule.py");
    algorithmFilePath = algorithmFilePath.replaceAll("\\", "/");
    let result = "";
    const pythonProcess = spawn("python", [String(algorithmFilePath)]);

    // Send the matrix as a JSON string
    pythonProcess.stdin.write(JSON.stringify(activity));
    pythonProcess.stdin.end();

    // Handling output from Python
    pythonProcess.stdout.on("data", (data: Buffer) => {
      result = data + "";
    });

    // Error handling
    pythonProcess.stderr.on("data", (data: Buffer) => {
      console.error(`Python Error: ${data.toString()}`);
    });

    // Process exit event
    pythonProcess.on("close", (code: number) => {
      if (code === 0) {
        try {
          resolve(result);
        } catch (error) {
          reject("Error parsing JSON: " + error);
        }
      } else {
        reject("Python process exited with code " + code);
      }
    });
  });
}

export const generateSchedule = async (activity: any) => {
  let activityJSON = JSON.parse(activity);
  let activityDistance = await activityData(activityJSON);
  await getSchedule(activityDistance)
    .then((result) => {
      schedule = result;
    })
    .catch((error) => console.error("Error creating schedule:", error));
  let itinerary = [];
  let data = JSON.parse(schedule);
  // console.log(data.route);
  for (let i = 0; i < data.route.length; ++i) itinerary.push(activityJSON[data.route[i]]);

  return { route: itinerary, cost: data.cost };
  // return schedule;
};
