import { v4 as uuidv4 } from 'uuid';
import { REMOVE_ALERT, SET_ALERT } from './types';

export const setAlert = (msg, alertType, timeout) => (dispatch) => {
  const id = uuidv4();

  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType
    }
  });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, timeout);
};
