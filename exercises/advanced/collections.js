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
  var result = [];
  filePaths.forEach(path => {
    result.push(promiseConstructor.pluckFirstLineFromFileAsync(path));
  });
  return Promise.all(result) // Promise all waits until all data is received and then starts to execute the then
    .then((result) => result.join('\n'))
    .then((file) => { fs.writeFile(writePath, file); });
};

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};

