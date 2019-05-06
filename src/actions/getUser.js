import { GET_USER } from '../actionTypes';

const getUser = user => {
  return {
    type: GET_USER,
    payload: {
      user: user
    }
  };
};

export default getUser;
