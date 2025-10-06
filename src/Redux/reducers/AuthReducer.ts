import {combineReducers} from 'redux';
import authConstants from '../types/AuthConstants';

/**
 * Reducer function for managing user information in the Redux store.
 *
 * @param {Object} state - The current state of the Redux store.
 * @param {Object} action - The action to be reduced.
 * @param {string} action.type - The type of the action.
 * @param {Object} action.user - The user object containing user information.
 * @returns {Object} The new state after reducing the action.
 */
export const userInfoReducer = (
  state = {
    user: undefined, // Initial user state is undefined
  },
  action,
) => {
  switch (action.type) {
    case authConstants.USER_INFO_RECEIVED: // If the action type is USER_INFO_RECEIVED
      return {
        ...state, // Spread the existing state
        user: action.user, // Update the user property with the action.user
      };
    default:
      return state; // Return the existing state if the action type is not USER_INFO_RECEIVED
  }
};

export const authReducers = combineReducers({
  user: userInfoReducer,
});
