import {
  GET_USER
} from '../actionTypes';

const initialState = {
  currentUser: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return Object.assign({}, state, {
        currentUser: action.payload.user
      });
    default:
      return state;
  }
};

export default reducer;
