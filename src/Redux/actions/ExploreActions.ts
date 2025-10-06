import axios from 'axios';
import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
} from '../types/exploreTypes';
// import {getData} from '../../Services/explore';
import {getData} from '../../Services/explore';

/**
 * Returns an action of type `FETCH_DATA_REQUEST` to indicate that a request
 * to fetch data has been initiated.
 *
 * @returns {{type: FETCH_DATA_REQUEST}} An action of type `FETCH_DATA_REQUEST`.
 */
export const fetchDataRequest = (): {type: FETCH_DATA_REQUEST} => ({
  type: FETCH_DATA_REQUEST,
});

/**
 * Returns an action of type `FETCH_DATA_SUCCESS` to indicate that the data has
 * been successfully fetched.
 *
 * @param data The data that was fetched.
 *
 * @returns {{type: FETCH_DATA_SUCCESS, payload: data}} An action of type `FETCH_DATA_SUCCESS`.
 */
export const fetchDataSuccess = (
  data: data,
): {type: FETCH_DATA_SUCCESS; payload: data} => ({
  type: FETCH_DATA_SUCCESS,
  payload: data,
});

/**
 * Returns an action of type `FETCH_DATA_FAILURE` to indicate that an error has
 * occurred while fetching data.
 *
 * @param error The error that occurred.
 *
 * @returns {{type: FETCH_DATA_FAILURE, payload: Error}} An action of type `FETCH_DATA_FAILURE`.
 */
export const fetchDataFailure = (
  error: Error,
): {type: FETCH_DATA_FAILURE; payload: Error} => ({
  type: FETCH_DATA_FAILURE,
  payload: error,
});

/**
 * A thunk function for fetching data from the backend.
 *
 * @returns A function that takes a `dispatch` function as an argument and returns a `Promise<void>`.
 */
export const fetchData = () => async dispatch => {
  dispatch(fetchDataRequest());

  try {
    const response = await getData();
    console.log('data', response);

    dispatch(fetchDataSuccess(response));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};
