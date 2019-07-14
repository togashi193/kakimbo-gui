import {
  GET_USER,
  OPEN_BILLING_FORM_DIALOG,
  CLOSE_BILLING_FORM_DIALOG,
  FETCH_BILLINGS,
  CREATE_BILLING,
  DELETE_BILLING
} from '../actionTypes';

const initialState = {
  currentUser: {},
  billingFormDialogOpen: false,
  billings: []
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
    case FETCH_BILLINGS:
      return Object.assign({}, state, {
        billings: action.payload.billings
      });
    case CREATE_BILLING:
      return Object.assign({}, state, {
        billings: [...state.billings, action.payload.billing]
      });
    case DELETE_BILLING:
      const rejected = state.billings.filter(
        billing => billing.id !== action.payload.id
      );
      return Object.assign({}, state, {
        billings: rejected
      });
    default:
      return state;
  }
};

export default reducer;
