'use strict';

var _require = require('graphql-request'),
    request = _require.request;

var _require2 = require('./constants'),
    ENDPOINT = _require2.ENDPOINT;

module.exports.graphqlRequest = function (query) {
  return request(ENDPOINT, query).then(function (data) {
    console.log(data);return data;
  });
};