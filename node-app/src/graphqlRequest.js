import { request } from 'graphql-request'
import { ENDPOINT } from './constants'


export const graphqlRequest = async function (query) {
  const result = await request(ENDPOINT, query);
  console.log(result);
  return result;
}