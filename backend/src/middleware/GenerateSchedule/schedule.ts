import path from "path";
import { activityData } from "../GenerateSchedule/scheduleData/prepareData";
import { funScore } from "./scheduleData/funScore";

let schedule = '{ "route": [], "cost": 0 }';
let itinerary = '{ "itinerary": [] }';
let officialItinerary = []; //Itinerary that we will return to the server

// Call TSP to calculate the most efficient route in a day
async function getRoute(activity: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");

    // Example path to your algorithm file
    let algorithmFilePath = path.join(__dirname, "../../../algorithm/tspAlgo.py");
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

// Cluster activities to days based on their funscore
async function clusterFunScore(funScore: any[], days: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");

    // Example path to your algorithm file
    let algorithmFilePath = path.join(__dirname, "../../../algorithm/partitionProblem.py");
    algorithmFilePath = algorithmFilePath.replaceAll("\\", "/");
    let result = "";
    const pythonProcess = spawn("python", [String(algorithmFilePath)]);

    // Send the matrix as a JSON string
    pythonProcess.stdin.write(JSON.stringify({ funScore: funScore, days: days }));
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

export const generateSchedule = async (activity: any, days: number, participant: number) => {
  officialItinerary = [];
  let activityJSON = JSON.parse(activity);
  let activityFunScore = await funScore(activityJSON, participant);

  // Divide activities into multiple
  await clusterFunScore(activityFunScore, days)
    .then((result) => {
      itinerary = result;
    })
    .catch((error) => console.error("Error creating schedule:", error));

  let initeraryData = JSON.parse(itinerary); // itinerar
  console.log(initeraryData.itinerary.length);
  // Find the route for each day
  for (let i = 0; i < days; ++i) {
    let filteredActivity = []; //filtered activities that only in a day
    for (let j = 0; j < initeraryData.itinerary[i].length; ++j)
      filteredActivity.push(activityJSON[initeraryData.itinerary[i][j]]);

    // Calculate the matrix distance of those activities in a day
    let filteredActivityDistance = await activityData(filteredActivity);

    //Get the  most efficient route in that day
    await getRoute(filteredActivityDistance)
      .then((result) => {
        schedule = result;
      })
      .catch((error) => console.error("Error creating schedule:", error));

    // Correct the index
    let data = JSON.parse(schedule);
    let remadeRoute = [];
    for (let j = 0; j < data.route.length; ++j) remadeRoute.push(initeraryData.itinerary[i][data.route[j]]);
    data.route = remadeRoute;

    // Push the result to the official itinerary
    officialItinerary.push(data);
  }
  console.log(officialItinerary);
  return officialItinerary;
};
