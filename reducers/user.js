import { set, assign, compose } from 'lodash/fp';

import * as USER from '../constants/user';

export const defaultState = {
  key: undefined,
  settings: {},
  staff: {},
};

const userReducer = (state = defaultState, action = {}) => {

  switch (action.type) {

    case USER.LOGIN_REQUEST:
      return set('key', action.payload.key, state);

    case USER.LOGIN_SUCCESS:
      const { key, settings, staff } = action.payload;
      return compose(
        set('key', key),
        set('settings', settings),
        set('staff', staff)
      )(state);

    case USER.LOGIN_ERROR:
      return state;

    case USER.LOGOUT:
      return assign({}, defaultState);

    default:
      return state;
  }
};

export default userReducer;
