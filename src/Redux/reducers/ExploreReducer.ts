import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
} from '../types/exploreTypes';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const ExploreReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FETCH_DATA_REQUEST:
      return {...state, loading: true, error: null};
    case FETCH_DATA_SUCCESS:
      return {...state, loading: false, data: payload};
    case FETCH_DATA_FAILURE:
      return {...state, loading: false, error: payload};
    default:
      return state;
  }
};

export default ExploreReducer;
