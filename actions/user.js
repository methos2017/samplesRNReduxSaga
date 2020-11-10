import * as USER from '../constants/user';

export function loginRequest(login, password, componentId) {
  return {
    type: USER.LOGIN_REQUEST,
    payload: {
      login,
      password,
    },
    meta: {
      componentId,
    },
  };
}

export function loginSuccess(key, settings, staff, componentId) {
  return {
    type: USER.LOGIN_SUCCESS,
    payload: {
      key,
      settings,
      staff,
    },
    meta: {
      componentId,
    },
  };
}

export function sendPushTokensRequest() {
  return {
    type: USER.SEND_PUSH_TOKENS_REQUEST,
  };
}

export function sendPushTokensSuccess() {
  return {
    type: USER.SEND_PUSH_TOKENS_SUCCESS,
  };
}

export function sendPushTokensError() {
  return {
    type: USER.SEND_PUSH_TOKENS_ERROR,
  };
}

export function loginError() {
  return {
    type: USER.LOGIN_ERROR,
  };
}
