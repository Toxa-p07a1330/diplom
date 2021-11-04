
import { history } from '../helpers/history';
import UserDataService from '../service/UserDataService';
import { combineReducers } from 'redux';

/* CONSTANTS */

export const userConstants = {
    LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
    LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
    LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',
    LOGOUT: 'USERS_LOGOUT'
};

export const alertConstants = {
    SUCCESS: 'ALERT_SUCCESS',
    ERROR: 'ALERT_ERROR',
    CLEAR: 'ALERT_CLEAR'
};

export const userActions = {
    login,
    logout,
    clearlogin,
};

export const alertActions = {
    success,
    error,
    clear
};

/* ACTIONS */

function login(username, password) {
    return dispatch => {
        UserDataService.login(username, password)
            .then(
                resp => {
                    localStorage.setItem('user', JSON.stringify(resp.data));
                    let user = JSON.parse(localStorage.getItem('user'));
                    dispatch(success(user));
                    history.push('/');
                }
            )
            .catch( () => {
                const err = 'Authorization failed';
                dispatch(error(err));
            });
    };

    //function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) {
        return { type: userConstants.LOGIN_SUCCESS, user }
    }

}

function logout() {
    UserDataService.logout();
    return { type: userConstants.LOGOUT };
}

function clearlogin() {
    localStorage.removeItem('user');
    return { type: userConstants.LOGOUT };
}

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(message) {
    return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

/* REDUSERS */

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user} : { };

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
        return {
        loggingIn: true,
        user: action.user
        };
    case userConstants.LOGIN_SUCCESS:
        return {
        loggedIn: true,
        user: action.user
        };
    case userConstants.LOGIN_FAILURE:
        return {};
    case userConstants.LOGOUT:
        return { loggedIn:false };
    case userConstants.ERROR:
        return { }
    default:
        return state
    }
}

let initialReState = { message: undefined }

export function errorReport(state = initialReState, action) {
    switch (action.type) {
        case alertConstants.ERROR:
            return { message: action.message }
        case alertConstants.CLEAR:
            return { message: undefined }
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
  authentication, errorReport
});