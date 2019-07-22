import { request } from 'graphql-request'
import { ENDPOINT } from './constants'


export const graphqlRequest = function (query) {
  return request(ENDPOINT, query).then(data => { console.log(data); return data })
}