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
let totalScratchcards = 0;
const scratchCardsToProcess: Array<number> = [];

// gameNumber: numberOfWonNumbers
const memo: Record<number, number> = {};

// Event handler for each line
rl.on("line", (line) => {
  const match = line.match(cardGameRegex);

  // Extract all card game results
  if (match) {
    const gameNumber = +match[1];
    const winningNumbers = match[2].trim().split(/\s+/).map(Number);
    const playingNumbers = match[3].trim().split(/\s+/).map(Number);
    const wonNumbers = extractWonNumbers(playingNumbers, winningNumbers);

    // Memoize this card game's results
    // to make it easier to obtain number
    // of subsequent copies to process
    memo[gameNumber] = wonNumbers.length;

    scratchCardsToProcess.push(gameNumber);
  }
});

// Event handler for the end of the file
rl.on("close", () => {
  // Process each scratch card and add to process queue
  // if there are more copies to process
  let currentIndex = 0;
  while (currentIndex < scratchCardsToProcess.length) {
    const cardGameNumber = scratchCardsToProcess[currentIndex];
    const numberOfWonNumbers = memo[cardGameNumber];
    const hasWonNumbers = numberOfWonNumbers > 0;

    if (hasWonNumbers) {
      for (let i = 1; i <= numberOfWonNumbers; i++) {
        scratchCardsToProcess.push(cardGameNumber + i);
      }
    }

    totalScratchcards++;
    currentIndex++;
  }

  console.log(totalScratchcards);
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
