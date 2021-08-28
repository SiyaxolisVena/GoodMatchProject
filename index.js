const readline = require("readline");
const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

var secondOutput = "";
const csvFilePath = "match_names.csv";
const csv = require("csvtojson");

const countNumberOfChar = (myCharacter, myArray) => {
  var count = 0;
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i] == myCharacter) {
      count++;
    }
  }

  return count;
};

const displayMessage = (nameOne, nameTwo, match) => {
  if (match > 80) {
    console.log(`\n${nameOne} matches ${nameTwo} ${match}%, good match`);
  } else {
    console.log(`\n${nameOne} matches ${nameTwo} ${match}%`);
  }
  readLine.close();
};

const computeMatch = (inputString, nameOne, nameTwo) => {
  if (inputString.length > 0 && isNumeric(inputString)) {
    var myInputAsArray = inputString.split("");
    var first = myInputAsArray.shift();
    var last = myInputAsArray.pop();

    var sum = parseInt(first) + parseInt(last);
    secondOutput = secondOutput + sum;

    if (myInputAsArray.length > 1) {
      computeMatch(myInputAsArray.join(""), nameOne, nameTwo);
    } else if (myInputAsArray.length > 0) {
      var tempStore = secondOutput + myInputAsArray[0];

      if (tempStore.length == 2) {
        displayMessage(nameOne, nameTwo, parseInt(tempStore));
      } else {
        secondOutput = "";
        computeMatch(tempStore, nameOne, nameTwo);
      }
    } else {
      var tmpString = "";
      tmpString = secondOutput;
      secondOutput = "";
      computeMatch(tmpString, nameOne, nameTwo);
    }
  }
};

const findMatch = (sentence) => {
  var mySentenceAsArray = sentence.split("");
  var mySentenceAsSet = new Set(mySentenceAsArray);
  var firstOutput = "";

  return new Promise((resolve, reject) => {
    var index = 0;
    mySentenceAsSet.forEach((element) => {
      var count = countNumberOfChar(element, mySentenceAsArray);
      firstOutput = firstOutput + count;
      if (index == mySentenceAsSet.size - 1) {
        resolve(firstOutput);
      }
      index++;
    });
  });
};

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const proccesMatch = (nameOne, nameTwo) => {
  let sentence = nameOne.toLowerCase() + "matches" + nameTwo.toLowerCase();

  findMatch(sentence).then((firstOutput) => {
    computeMatch(firstOutput, nameOne, nameTwo);
  });
};

const checkIfNotEmpty = (inputText) => {
  return inputText.length > 0;
};

const allLetters = (inputText) => {
  var letters = /^[A-Za-z]+$/;
  if (inputText.match(letters)) {
    return true;
  } else {
    return false;
  }
};

readLine.question("Please enter name number 1: ", function (nameOne) {
  readLine.question("Please enter name number 2: ", function (nameTwo) {
    //validation
    if (!checkIfNotEmpty(nameOne)) {
      console.error("An error encountered, name one is empty!");
    } else if (!checkIfNotEmpty(nameTwo)) {
      console.error("An error encountered, name two is empty!");
    } else if (!allLetters(nameOne)) {
      console.error(
        "An error encountered, name one is not containing only alphabets!"
      );
    } else if (!allLetters(nameTwo)) {
      console.error(
        "An error encountered, name two is not containing only alphabets!"
      );
    } else {
      //all good proccess
      proccesMatch(nameOne, nameTwo);
    }
  });
});

/*
  Reading Match from CSV files -- STARTS
*/

const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

try {
  csv({ noheader: true })
    .fromFile(csvFilePath)
    .then((users) => {
      var males = users.filter((person) => person.field2 == "m");
      var females = users.filter((person) => person.field2 == "f");

      var malesWithNoDuplicates = getUniqueListBy(males, "field1");
      var femalesWithNoDuplicates = getUniqueListBy(females, "field1");

      if (malesWithNoDuplicates.length > femalesWithNoDuplicates.length) {
        for (var i = 0; i < malesWithNoDuplicates.length; i++) {
          console.log(
            "\nWill find mathc for",
            malesWithNoDuplicates[i].field1,
            femalesWithNoDuplicates[i].field1
          );

          proccesMatch(
            malesWithNoDuplicates[i + 1].field1,
            femalesWithNoDuplicates[i + 1].field1
          );

          console.log(i);

          if (i == femalesWithNoDuplicates.length - 1) {
            break;
          }
        }
      } else {
        for (var i = 0; i < array.length; i++) {
          console.log(
            "\nWill find mathc for",
            malesWithNoDuplicates[i].field1,
            femalesWithNoDuplicates[i].field1
          );
          proccesMatch(
            malesWithNoDuplicates[i].field1,
            femalesWithNoDuplicates[i].field1
          );
          if (i == malesWithNoDuplicates.length - 1) {
            break;
          }
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
} catch (e) {
  console.log(e);
}
/*
  Reading Match from CSV files -- ENDS
*/

readLine.on("close", function () {
  process.exit(0);
});

// app.get("/countMatch", (req, res) => {
//   const { nameOne, nameTwo } = req.body;
//   proccesMatch(nameOne, nameTwo);
// });
