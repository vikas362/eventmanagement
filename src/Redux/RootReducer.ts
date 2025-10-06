import {combineReducers} from 'redux';
import {AuthConstants, authReducers} from '.';
import ExploreReducer from './reducers/ExploreReducer';

const combinedReducer = combineReducers({
  auth: authReducers,
  explore: ExploreReducer,
});

/**
 * Reduces the entire state based on the action received.
 * If the action type is `AuthConstants.RESET_STATE`,
 * the state is reset to `undefined`.
 *
 * @param {Object | undefined} state - The current state.
 * @param {Object} action - The action to be reduced.
 * @returns {Object | undefined} The new state after reduction.
 */
const rootReducer = (state, action) => {
  /* Create a new object that is a copy of the current state.
	   This is done to avoid modifying the original state. */
  let newState = {...state};

  /* If the action type is `AuthConstants.RESET_STATE`,
	   set the new state to `undefined`. */
  if (action.type === AuthConstants.RESET_STATE) {
    newState = undefined;
  }

  /* Pass the new state and the action to the combined reducer,
	   and return the result. */
  return combinedReducer(newState, action);
};

export default rootReducer;
