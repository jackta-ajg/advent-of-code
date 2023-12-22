import fs from "fs";
import path from "path";
import readline from "readline";

import type { FoundNumber, char } from "./types";

// Enums
const SYMBOLS = ["@", "#", "$", "%", "&", "*", "-", "=", "+", "/"];

// Global variables
const foundNumbers: FoundNumber[][] = [];
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
  // Incrementally extract out all numbers per line,
  // along with the position of its last digit.
  foundNumbers.push(extractNumbers(line));

  // Incrementally build out matrix
  inputMatrix.push(line.split(""));
});

// Event handler for the end of the file
rl.on("close", () => {
  const partNumbers = findPartNumbers(foundNumbers, inputMatrix);
  const sumOfPartNumbers = partNumbers.reduce((acc, curr) => acc + curr);
  console.log(sumOfPartNumbers);
});

// Event handler for errors
rl.on("error", (err) => console.error(`Error: ${err}`));

// Helper Functions

// Extract all found numbers along with
// the index position of its last digit
// and the row of the input matrix it's in.
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

function findPartNumbers(
  numbers: FoundNumber[][],
  inputMatrix: char[][]
): number[] {
  const partNumbers = [];

  for (let row = 0; row < numbers.length; row++) {
    for (let col = 0; col < numbers[row].length; col++) {
      const number = numbers[row][col];

      for (let digitIndex = 0; digitIndex < number.value.length; digitIndex++) {
        const digitIndexInInputMatrix = number.startIndex + digitIndex;

        if (hasAdjacentSymbol(row, digitIndexInInputMatrix, inputMatrix)) {
          partNumbers.push(+number.value);
          break;
        }
      }
    }
  }

  return partNumbers;
}

function hasAdjacentSymbol(
  row: number,
  lastDigitIndex: number,
  inputMatrix: char[][]
): boolean {
  const col = lastDigitIndex;

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

  const adjacentChars = [
    topLeft,
    top,
    topRight,
    left,
    right,
    bottomLeft,
    bottom,
    bottomRight,
  ];
  return adjacentChars.some((char) => SYMBOLS.includes(char));
}
