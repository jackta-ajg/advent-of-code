import fs from "fs";
import path from "path";

const mergedNumberWordsDict: Record<string, string> = {
  oneight: "oneeight",
  threeight: "threeeight",
  fiveight: "fiveeight",
  nineight: "nineeight",
  twone: "twoone",
  sevenine: "sevennine",
  eightwo: "eighttwo",
};

const numberWordDict: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
};

const filePath = path.join(__dirname, "input.txt");
fs.readFile(filePath, (_, _data) => {
  let data = _data.toString();

  // Seeming oversight from puzzle creator:
  // There are instances of "eighthree" === 83
  // and for "sevenine" === 79. This was not
  // mentioned in the puzzle description.
  // This snippet normalizes those strings.
  for (const mergedNumberWord in mergedNumberWordsDict) {
    data = data.replaceAll(
      mergedNumberWord,
      mergedNumberWordsDict[mergedNumberWord]
    );
  }

  // Replace all instances of number words with its
  // integer string representation adjacent
  for (let i = 1; i <= 9; i++) {
    data = data.replaceAll(numberWordDict[i], String(i));
  }

  const extractedNumbers = [];

  const lines = data.split("\n");
  for (const line of lines) {
    const extractedNumbersPerLine = [];

    for (const char of line) {
      if (isNumber(char)) {
        extractedNumbersPerLine.push(char);
      }
    }

    let number;
    if (extractedNumbersPerLine.length === 1) {
      // Only one number was extracted from this line,
      // so append it with itself.
      number = extractedNumbersPerLine[0] + extractedNumbersPerLine[0];
    } else {
      // Otherwise, append the first found number and the
      // last found number.
      number =
        extractedNumbersPerLine[0] +
        extractedNumbersPerLine[extractedNumbersPerLine.length - 1];
    }

    extractedNumbers.push(number);
  }

  const sum = extractedNumbers.reduce((acc, curr) => acc + +curr, 0);

  console.log(`This is the sum of all extracted numbers: ${sum}`);
});

function isNumber(char: string) {
  // You can tell if a string representation of an
  // integer is a number by explicitly coercing it
  // into a `number` via the `Number()` function and
  // if it results in `NaN`, then it is not a number.
  return !Number.isNaN(+char);
}
