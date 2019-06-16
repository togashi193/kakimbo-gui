import {
  GET_USER,
  OPEN_BILLING_FORM_DIALOG,
  CLOSE_BILLING_FORM_DIALOG
} from '../actionTypes';

const initialState = {
  currentUser: {},
  billingFormDialogOpen: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return Object.assign({}, state, {
        currentUser: action.payload.user
      });
    case OPEN_BILLING_FORM_DIALOG:
      return Object.assign({}, state, {
        billingFormDialogOpen: true
      });
    case CLOSE_BILLING_FORM_DIALOG:
      return Object.assign({}, state, {
        billingFormDialogOpen: false
      });
    default:
      return state;
  }
};

export default reducer;
