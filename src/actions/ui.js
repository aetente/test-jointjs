import { uiTypes } from "../types";

export const uiActions = {
    addTokenOption,
    pushTokenOption,
    unshiftTokenOption,
    setEditAccess
}

function addTokenOption(payload) {
    return {
        type: uiTypes.ADD_TOKEN_OPTION,
        payload,
    };
}

function pushTokenOption(payload) {
    return {
        type: uiTypes.PUSH_TOKEN_OPTION,
        payload,
    };
}

function unshiftTokenOption(payload) {
    return {
        type: uiTypes.UNSHIFT_TOKEN_OPTION,
        payload,
    };
}

function setEditAccess(payload) {
    return {
        type: uiTypes.SET_EDIT_ACCESS,
        payload
    }
}