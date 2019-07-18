const { request } = require('graphql-request')
const { ENDPOINT } = require('./constants')


module.exports.graphqlRequest = function (query) {
  return request(ENDPOINT, query).then(data => console.log(data))
}