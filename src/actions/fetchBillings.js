import { FETCH_BILLINGS } from '../actionTypes';

const fetchBillings = billings => {
  return {
    type: FETCH_BILLINGS,
    payload: {
      billings: billings
    }
  };
};

export default fetchBillings;
