import fs from "fs";
import path from "path";
import readline from "readline";

// Create a readable stream from the file
const file = path.join(__dirname, "input.txt");
const fileStream = fs.createReadStream(file);
// Create an interface to read the file line by line
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity, // recognizes all instances of CR LF ('\r\n') as a single line break
});

// RegExp
const cardGameRegex = /Card\s+(\d+):\s*([\d\s]+)\s*\|\s*([\d\s]+)/;

// Global variables
let totalPoints = 0;

// Event handler for each line
rl.on("line", (line) => {
  const match = line.match(cardGameRegex);

  if (match) {
    const gameNumber = match[1];
    const winningNumbers = match[2].trim().split(/\s+/).map(Number);
    const playingNumbers = match[3].trim().split(/\s+/).map(Number);
    const wonNumbers = extractWonNumbers(playingNumbers, winningNumbers);

    totalPoints += wonNumbers.reduce(
      (acc, _, index) => (index === 0 ? 1 : acc * 2),
      0
    );
  }
});

// Event handler for the end of the file
rl.on("close", () => {
  console.log(totalPoints);
});

// Event handler for errors
rl.on("error", (err) => console.error(`Error: ${err}`));

// Helper Functions

function extractWonNumbers(playingNumbers: number[], winningNumbers: number[]) {
  const wonNumbers = [];

  for (const playingNumber of playingNumbers) {
    if (winningNumbers.includes(playingNumber)) wonNumbers.push(playingNumber);
  }

  return wonNumbers;
}
