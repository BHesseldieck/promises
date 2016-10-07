/**
 * Using Promise.all, write a function, combineFirstLineOfManyFiles, that:
 *    1. Reads each file at the path in the `filePaths` array
 *    2. Plucks the first line of each file
 *    3. Joins each first line into a new file
 *      - The lines should be in the same order with respect to the input array
 *      - i.e. the second line in the new file should be the first line of `filePaths[1]`
 *    4. Writes the new file to the file located at `writePath`
 */
var Promise = require('bluebird');
var fs = require('fs');
var Path = require('path');
var promiseConstructor = require(Path.join(__dirname, '../bare_minimum/promiseConstructor'));
var promisificator = require(Path.join(__dirname, '../bare_minimum/promisification'));

var combineFirstLineOfManyFiles = function(filePaths, writePath) {
  return Promise.all(filePaths)
    .then(() => {
      filePaths.forEach(path => {
        console.log(path);
        promiseConstructor.pluckFirstLineFromFileAsync(path);
      });
    })
    .then((firstLines) => {
      fs.writeFile(writePath, JSON.stringify(firstLines), (err) => {
        if (err) { console.log(err); }
      });
    });
};

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};