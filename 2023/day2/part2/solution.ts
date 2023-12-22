import fs from "fs";
import path from "path";
import readline from "readline";

import type { GameInfo, MaxCubesPerColor } from "./types";

// Global variables
const cubeSets: Array<MaxCubesPerColor> = [];

// Create a readable stream from the file
const file = path.join(__dirname, "input.txt");
const fileStream = fs.createReadStream(file);

// Create an interface to read the file line by line
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity, // recognizes all instances of CR LF ('\r\n') as a single line break
});

// Event handler for each line
rl.on("line", (line) => {
  const gameInfo = extractGameInfo(line);

  const maxCubesPerColor = getMaxCubesPerColor(gameInfo);

  cubeSets.push(maxCubesPerColor);
});

// Event handler for the end of the file
rl.on("close", () => {
  // Calculate the power of the sets of cubes
  const powerOfSetsOfCubes = cubeSets
    .map(({ maxRedCubes: r, maxGreenCubes: g, maxBlueCubes: b }) => r * g * b)
    .reduce((acc, curr) => acc + curr);
  console.log(powerOfSetsOfCubes);
});

// Event handler for errors
rl.on("error", (err) => console.error(`Error: ${err}`));

// Helper functions

// Extract game number and number of RGB cubes (per game)
function extractGameInfo(game: string): GameInfo {
  const parts = game.split(":");

  // Extract game number
  const gameNumber = +parts[0].split(" ")[1];

  // Extract number of red, green, and blue cubes
  const redCubes = [];
  const greenCubes = [];
  const blueCubes = [];
  const handfulsOfColorCubes = parts[1].split(";");

  for (const handful of handfulsOfColorCubes) {
    const colorCubes = handful.split(",");

    for (const colorCube of colorCubes) {
      const regex = /^\s*(\d+)\s+(\w+)\s*$/gm;
      const match = regex.exec(colorCube);

      const matchedColor = match![2];
      const numberOfCubes = +match![1];
      switch (matchedColor) {
        case "red":
          redCubes.push(numberOfCubes);
          break;

        case "green":
          greenCubes.push(numberOfCubes);
          break;

        case "blue":
          blueCubes.push(numberOfCubes);
          break;
      }
    }
  }

  return {
    gameNumber,
    redCubes,
    greenCubes,
    blueCubes,
  };
}

function getMaxCubesPerColor({
  redCubes,
  greenCubes,
  blueCubes,
}: GameInfo): MaxCubesPerColor {
  let maxRedCubes = Math.max(...redCubes);
  let maxGreenCubes = Math.max(...greenCubes);
  let maxBlueCubes = Math.max(...blueCubes);

  return { maxRedCubes, maxGreenCubes, maxBlueCubes };
}
