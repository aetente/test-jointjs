import { tokensTypes } from "../types";

export const tokenActions = {
    getTokens,
    setTokens,
    updateTokens,
    postTokens,
    putTokens,
    deleteToken
}

function getTokens() {
    return {
        type: tokensTypes.GET_TOKENS,
    };
}

function setTokens(payload) {
    return {
        type: tokensTypes.SET_TOKENS,
        payload,
    };
}

function updateTokens(payload) {
    return {
        type: tokensTypes.UPDATE_TOKENS,
        payload,
    };
}

function postTokens(payload) {
    return {
        type: tokensTypes.POST_TOKENS,
        payload,
    };
}

function putTokens(payload) {
    return {
        type: tokensTypes.PUT_TOKENS,
        payload,
    };
}

function deleteToken(payload) {
    return {
        type: tokensTypes.DELETE_TOKEN,
        payload
    }
}