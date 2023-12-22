import fs from "fs";
import path from "path";
import readline from "readline";

import type { GameInfo } from "./types";

enum CUBE_THRESHOLD {
  RED = 12,
  GREEN = 13,
  BLUE = 14,
}

// Global variables
const validGames: Array<number> = [];

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

  if (isValidGame(gameInfo)) {
    validGames.push(gameInfo.gameNumber);
  }
});

// Event handler for the end of the file
rl.on("close", () => {
  // Sum the valid game numbers
  const sumOfValidGameNumbers = validGames.reduce((acc, curr) => acc + curr, 0);
  console.log(sumOfValidGameNumbers);
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

// A game is valid if the sum of the handfuls of red, green, or blue cubes
// do not exceed the threshold of its respective color
function isValidGame({ redCubes, greenCubes, blueCubes }: GameInfo): boolean {
  if (redCubes.length > 0) {
    const isValid =
      redCubes.filter((handful) => handful <= CUBE_THRESHOLD.RED).length ===
      redCubes.length;
    if (!isValid) return false;
  }

  if (greenCubes.length > 0) {
    const isValid =
      greenCubes.filter((handful) => handful <= CUBE_THRESHOLD.GREEN).length ===
      greenCubes.length;
    if (!isValid) return false;
  }

  if (blueCubes.length > 0) {
    const isValid =
      blueCubes.filter((handful) => handful <= CUBE_THRESHOLD.BLUE).length ===
      blueCubes.length;
    if (!isValid) return false;
  }

  return true;
}
