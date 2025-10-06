import axios from 'axios';
import {envVars} from '../Constant/Urls';
// import envVars from '../Constant/Urls';

let reqTimeout = null;

function newAbortSignal(timeoutMs) {
  const abortController = new AbortController();
  reqTimeout = setTimeout(() => abortController.abort(), timeoutMs || 0);

  return abortController.signal;
}

export const api = axios.create({
  timeout: 30000,
  baseURL: envVars?.baseUrl,

  signal: newAbortSignal(30000), //Aborts request after 5 seconds
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

api.interceptors.request.use(request => {
  return request;
});

api.interceptors.response.use(
  response => {
    // console.log('response', response);
    clearTimeout(reqTimeout);

    return response;
  },
  error => {
    // console.log('response-err', error);

    clearTimeout(reqTimeout);

    return error?.response;
  },
);
