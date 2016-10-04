var request = require('request');
var Promise = require('bluebird');

var CLARIFAI_CLIENT_ID = null;
var CLARIFAI_CLIENT_SECRET = null;

/**
 * setImageTaggerCredentials(id, secret) =>
 *   @param {String} id - A Clarifai user id
 *   @param {String} secret - A Clarifai secret 
 *   @return {undefined}
 */
var setImageTaggerCredentials = function(id, secret) {
  CLARIFAI_CLIENT_ID = id;
  CLARIFAI_CLIENT_SECRET = secret;
};

/*
 * getIntersection(arrays) =>
 *   @param {Array} arrays - an array of arrays, each containing a set of values
 *   @return {Array} - a single array with the intersection of values from all arrays
 */

var getIntersection = function(arrays) {
  return arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
      return a.indexOf(v) !== -1;
    });
  });
};


/*
 * authenticateImageTagger() =>
 *   @return {Promise} - resolves with the token required for tagImage()
 */

var authenticateImageTagger = function() {
  var options = {
    url: 'https://api.clarifai.com/v1/token/',
    qs: {
      grant_type: 'client_credentials', // eslint-disable-line camelcase
      client_id: CLARIFAI_CLIENT_ID, // eslint-disable-line camelcase
      client_secret: CLARIFAI_CLIENT_SECRET // eslint-disable-line camelcase
    },
    json: true
  };

  return new Promise(function(resolve, reject) {
    request.post(options, function(err, httpResponse, auth) {
      if (err) { return reject(err); }
      resolve(auth.access_token);
    });
  });
};


/**
 * getGitHubProfile(handle) =>
 *   @param {String} handle - the handle of a GitHub user
 *   @return {Promise} - resolves with the user's profile in the following format:
 *     {
 *       handle: 'danthareja',
 *       name: 'Dan Thareja', 
 *       avatarUrl: 'https://avatars.githubusercontent.com/u/6980359?v=3.jpg'
 *     }
 */

var getGitHubProfile = function(user) {
  var options = {
    url: 'https://api.github.com/users/' + user,
    headers: { 'User-Agent': 'request' },
    json: true  // will JSON.parse(body) for us
  };

  return new Promise(function(resolve, reject) {
    request.get(options, function(err, data, body) {
      if (err) { return reject(err); }
      
      var simpleProfile = {
        handle: body.login,
        name: body.name,
        avatarUrl: body.avatar_url + '.jpg', // extension necessary for image tagger
      };
      resolve(simpleProfile);
    });
  });
};


/**
 * tagImage(imageUrl, token) =>
 *   @param {String|Array} imageUrl - the url(s) of the image you want to tag
 *   @param {String} token - the authentication token
 *   @return {Promise} - resolves with an array of tags
 *      If imageUrl is a string, expect a single array of tags
 *      If imageUrl is an array, expect a nested array of tags
 */

var tagImage = function(imageUrl, token) {
  if (!token) {
    throw new Error('You must authenticate before you can tag an image');
  }

  var options = {
    url: 'https://api.clarifai.com/v1/tag/',
    auth: { bearer: token },
    formData: { url: imageUrl },
    json: true
  };

  return new Promise (function(resolve, reject) {
    request.post(options, function(err, data, body) {
      if (err) { return reject(err); }
      if (body.status_code === 'ALL_ERROR') {
        return reject(body.status_msg);
      }

      var tags = body.results.map(function(result) {
        return result.result.tag.classes; // y u nested so deep?
      });

      // Handle both string or array inputs
      // If string, expect a single array of tags
      // If array, expect a nested array of tags
      if (typeof imageUrl === 'string') {
        resolve(tags[0]);
      } else {
        resolve(tags);
      }
    });
  });
};


module.exports = {
  tagImage: tagImage,
  getIntersection: getIntersection,
  getGitHubProfile: getGitHubProfile,
  authenticateImageTagger: authenticateImageTagger,
  setImageTaggerCredentials: setImageTaggerCredentials
};
