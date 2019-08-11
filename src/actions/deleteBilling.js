import { DELETE_BILLING } from '../actionTypes';

const deleteBilling = id => {
  return {
    type: DELETE_BILLING,
    payload: {
      id: id
    }
  };
};

export default deleteBilling;
