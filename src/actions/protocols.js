import { protocolTypes } from "../types";

export const protocolActions = {
    getProtocols,
    setProtocols,
    updateProtocols,
    postProtocols,
    putProtocols,
    deleteProtocol
}

function getProtocols() {
    return {
        type: protocolTypes.GET_PROTOCOLS,
    };
}

function setProtocols(payload) {
    return {
        type: protocolTypes.SET_PROTOCOLS,
        payload,
    };
}

function updateProtocols(payload) {
    return {
        type: protocolTypes.UPDATE_PROTOCOLS,
        payload,
    };
}

function postProtocols(payload) {
    return {
        type: protocolTypes.POST_PROTOCOL,
        payload,
    };
}

function putProtocols(payload) {
    return {
        type: protocolTypes.PUT_PROTOCOL,
        payload,
    };
}

function deleteProtocol(payload) {
    return {
        type: protocolTypes.DELETE_PROTOCOL,
        payload
    }
}