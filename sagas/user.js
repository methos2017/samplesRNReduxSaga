import OneSignal from "react-native-onesignal";
import { takeLatest, call, put, cps, select } from "redux-saga/effects";
import { Alert } from "react-native";

import request from "./request";
import { apiHost } from "../config";
import * as USER from "../constants/user";
import * as actions from "../actions";

import { navigate } from "../../RootNavigation";

function* loginRequest(action) {
  const response = yield call(request, {
    url: `${apiHost}login`,
    data: {
      params: {
        ...action.payload,
        interactive: true,
        remember: true
      },
      action_name: "login"
    }
  });

  if (response) {
    const { error } = response;

    if (!error) {
      const { key, settings, staff } = response;

      // Передаем навигатор дальше, он будет пойман следующей сагой
      const { componentId } = action.meta;
      yield put(actions.user.loginSuccess(key, settings, staff, componentId));
      yield put(actions.user.sendPushTokensRequest());
    } else {
      Alert.alert(
        "Ошибка",
        "Проверьте логин и пароль. \n Или обратитесь к администратору",
        [{ text: "OK" }],
        { cancelable: false }
      );
      yield put(actions.user.loginError(error));
    }
  }
}

function* sendPushTokensRequest() {
  const { userId, pushToken } = yield cps(cb =>
    OneSignal.getPermissionSubscriptionState(status => cb(null, status))
  );
  const id = yield select(state => state.user.staff.id_);

  const response = yield call(request, {
    url: `${apiHost}save`,
    data: {
      params: {
        where: [["id_", "eq", id]]
      },
      form_name: "staff",
      view_name: "std",
      action_name: "save",
      changed: [
        {
          mobile_push_allowed: 1,
          mobile_user_id: userId,
          mobile_original_token: pushToken,
          id_: String(id)
        }
      ]
    }
  });

  if (response) {
    const { error } = response;

    if (!error) {
      yield put(actions.user.sendPushTokensSuccess());
    } else {
      yield put(actions.user.sendPushTokensError());
    }
  }
}

function* loginRedirect(action) {
  const { componentId } = action.meta;
  // yield Navigation.setStackRoot(componentId, getScreenParams('tactise/audits/auditsList')());
  yield navigate("Main");
}

export default function*() {
  yield takeLatest(USER.LOGIN_REQUEST, loginRequest);
  yield takeLatest(USER.LOGIN_SUCCESS, loginRedirect);
  yield takeLatest(USER.SEND_PUSH_TOKENS_REQUEST, sendPushTokensRequest);
}
