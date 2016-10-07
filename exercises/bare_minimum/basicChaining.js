/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var promiseConstructor = require('./promiseConstructor');
var promisificator = require('./promisification');



var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return promiseConstructor.pluckFirstLineFromFileAsync(readFilePath)
    .then((user) => {
      promisificator.getGitHubProfileAsync(user)
        .then((body) => {
          fs.writeFile(writeFilePath, JSON.stringify(body), (err) => {
            if (err) { console.log(err); }
          });
        })
        .catch((err) => { console.log('Oops, caught an error in inner: ', err); });
    })
    .catch((err) => { console.log('Oops, caught an error in outer: ', err); });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
