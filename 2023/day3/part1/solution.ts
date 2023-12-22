/**
 * PLAN
 *
 * 1) Look for all part numbers adjacent to an asterisk
 *    and note down the position of the asterisk adjacent to it.
 * 2) For every part number, loop through the whole part numbers
 *    array and find all other part numbers the same asterisk position
 * 3) If the number of found part numbers is 1 (not including the target
 *    part number), then multiply and add to sum.
 *
 */

import fs from "fs";
import path from "path";
import readline from "readline";

import type { FoundNumber, char } from "./types";

// Global variables
const foundNumbers: FoundNumber[][] = [];
const asterisks: { row: number; col: number }[] = [];
const inputMatrix: char[][] = [];

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
  // Find all numbers
  foundNumbers.push(extractNumbers(line));

  // Incrementally build out matrix
  inputMatrix.push(line.split(""));
});

// Event handler for the end of the file
rl.on("close", () => {
  const numbersAdjacentToAsterisk = findNumbersAdjacentToAsterisk(
    foundNumbers,
    inputMatrix
  );

  // Find all asterisk positions
  for (let i = 0; i < inputMatrix.length; i++) {
    for (let j = 0; j < inputMatrix[i].length; j++) {
      const char = inputMatrix[i][j];

      if (char === "*") {
        asterisks.push({ row: i, col: j });
      }
    }
  }

  // Loop through every asterisk and if it is adjacent
  // to exactly two part numbers, multiply and add to sum.
  let sum = 0;
  for (const asterisk of asterisks) {
    const numbersAdjacentToThisAsterisk = [];

    for (const numberAdjacentToAsterisk of numbersAdjacentToAsterisk) {
      for (const adjacentAsterisk of numberAdjacentToAsterisk.adjacentAsterisks) {
        const [row, col] = adjacentAsterisk;

        if (row === asterisk.row && col === asterisk.col) {
          numbersAdjacentToThisAsterisk.push(numberAdjacentToAsterisk.value);
        }
      }
    }

    // A gear is a asterisk that is adjacent to exactly two part numbers.
    if (numbersAdjacentToThisAsterisk.length === 2) {
      sum += numbersAdjacentToThisAsterisk.reduce((acc, curr) => acc * curr);
    }
  }

  // console.log(JSON.stringify(numbersAdjacentToAsterisk));
  console.log(sum);

  // const sumOfPartNumbers = partNumbers.reduce((acc, curr) => acc + curr);
  // console.log(sumOfPartNumbers);
});

// Event handler for errors
rl.on("error", (err) => console.error(`Error: ${err}`));

// Helper Functions

// Extract all numbers adjacent to an asterisk
// along with the asterisk position.
function extractNumbers(line: string): FoundNumber[] {
  const numberRegex = /\d+/g;
  const numbers = [];

  let match;
  while ((match = numberRegex.exec(line)) !== null) {
    const value = match[0];
    const startIndex = match.index;

    numbers.push({
      value,
      startIndex,
    });
  }

  return numbers;
}

function findNumbersAdjacentToAsterisk(
  numbers: FoundNumber[][],
  inputMatrix: char[][]
): {
  value: number;
  adjacentAsterisks: [number, number][];
}[] {
  const numbersAdjacentToAsterisk: {
    value: number;
    adjacentAsterisks: [number, number][];
  }[] = [];

  for (let row = 0; row < numbers.length; row++) {
    for (let col = 0; col < numbers[row].length; col++) {
      const number = numbers[row][col];

      for (let digitIndex = 0; digitIndex < number.value.length; digitIndex++) {
        const digitIndexInInputMatrix = number.startIndex + digitIndex;

        const _ = hasAdjacentAsterisk(
          row,
          digitIndexInInputMatrix,
          inputMatrix
        );
        if (_.hasAdjacentAsterisk) {
          numbersAdjacentToAsterisk.push({
            value: +number.value,
            adjacentAsterisks: _.asteriskPositions,
          });
          break;
        }
      }
    }
  }

  return numbersAdjacentToAsterisk;
}

function hasAdjacentAsterisk(
  row: number,
  digitIndex: number,
  inputMatrix: char[][]
): {
  hasAdjacentAsterisk: boolean;
  asteriskPositions: [number, number][];
} {
  const col = digitIndex;

  // These characters are adjacent to the
  // last digit of this instance's number
  let topLeft = inputMatrix?.[row - 1]?.[col - 1];
  let top = inputMatrix?.[row - 1]?.[col];
  let topRight = inputMatrix?.[row - 1]?.[col + 1];
  let left = inputMatrix?.[row]?.[col - 1];
  let right = inputMatrix?.[row]?.[col + 1];
  let bottomLeft = inputMatrix?.[row + 1]?.[col - 1];
  let bottom = inputMatrix?.[row + 1]?.[col];
  let bottomRight = inputMatrix?.[row + 1]?.[col + 1];

  // Account for edge cases:
  // First row can't check row - 1
  // Last row can't check row + 1
  // First column can't check column - 1
  // Last column can't check column + 1
  // (treat out of bounds as ".")
  const maxNumRows = inputMatrix.length;
  const maxNumCols = inputMatrix[0].length;
  const isFirstRow = row - 1 < 0;
  const isLastRow = row + 1 === maxNumRows;
  const isFirstCol = col - 1 < 0;
  const isLastCol = col + 1 === maxNumCols;
  if (isFirstRow) topLeft = top = topRight = ".";
  if (isLastRow) bottomLeft = bottom = bottomRight = ".";
  if (isFirstCol) topLeft = left = bottomLeft = ".";
  if (isLastCol) topRight = right = bottomRight = ".";

  const asteriskPositions = [];
  if (topLeft === "*")
    asteriskPositions.push([row - 1, col - 1] as [number, number]);
  if (top === "*") asteriskPositions.push([row - 1, col] as [number, number]);
  if (topRight === "*")
    asteriskPositions.push([row - 1, col + 1] as [number, number]);
  if (left === "*") asteriskPositions.push([row, col - 1] as [number, number]);
  if (right === "*") asteriskPositions.push([row, col + 1] as [number, number]);
  if (bottomLeft === "*")
    asteriskPositions.push([row + 1, col - 1] as [number, number]);
  if (bottom === "*")
    asteriskPositions.push([row + 1, col] as [number, number]);
  if (bottomRight === "*")
    asteriskPositions.push([row + 1, col + 1] as [number, number]);

  return {
    hasAdjacentAsterisk: asteriskPositions.length > 0,
    asteriskPositions,
  };
}
