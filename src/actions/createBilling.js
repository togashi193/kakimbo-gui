import { CREATE_BILLING } from '../actionTypes';

const createBilling = billing => {
  return {
    type: CREATE_BILLING,
    payload: {
      billing: billing
    }
  };
};

export default createBilling;
