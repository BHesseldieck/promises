/**
 * Implement these functions following the node style callback pattern
 */

var fs = require('fs');
var request = require('request');
var Promise = require('bluebird');

// This function should retrieve the first line of the file at `filePath`
var pluckFirstLineFromFile = function (filePath, cb) {
  var result = '';
  fs.readFile(filePath, (err, data) => {
    if (err) { cb(err); }
    result += data;
    var newResult = result.split('\n');
    cb(null, newResult[0]);
  });
};

// This function should retrieve the status code of a GET request to `url`
var getStatusCode = function (url, callback) {
  request(url, (error, response) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, response.statusCode);// Show the HTML for the Google homepage. 
    }
  });
};

// Export these functions so we can test them and reuse them in later exercises
module.exports = {
  getStatusCode: getStatusCode,
  pluckFirstLineFromFile: pluckFirstLineFromFile
};
