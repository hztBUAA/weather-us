import axios from 'axios';
axios.defaults.timeout = 5000;

export async function request(url, method, params){
  let response;
  const options = { url, method };
  if (typeof params !== 'undefined') {
    if (method === 'get' || method === 'delete') {
      options.params = params
    } else {
      options.data = params
    }
  }
  if (options.headers !== undefined) {
    options.headers['Cache-Control'] = 'no-cache';
  } else {
    options['headers'] = {
      'Cache-Control': 'no-cache'
    };
  }
  try {
    response = axios(options);
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
  return response
}

export async function getData(url, params){
  let response;
  const options = { url, method: 'get' };
  if (typeof params !== 'undefined') {
    options.params = params
  }
  try {
    response = axios(options);
  } catch (error) {
    console.log(error.response.data);
    throw error;
  }
  return response
}