import { all, call, put, takeLatest, select } from "redux-saga/effects";
// import { writeJsonFile } from 'write-json-file';
import { protocolTypes } from "../types";
import { protocolActions } from "../actions";

const baseUrl = "http://" + window.location.hostname + ":8080/api";

function* fetchProtocols() {
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        let protocolsJson = yield protocols.json();
        yield put(protocolActions.setProtocols(protocolsJson));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* addProtocol(action) {
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(action.payload)
            });
        let protocolsJson = yield protocols.json();
        yield put(protocolActions.setProtocols(protocolsJson));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* postProtocol(action) {
    // TODO after deal with the backend, put updating the protocols inside try
    const state = yield select();
    let allProtocols = [...state.protocols.protocols]
    yield put(protocolActions.setProtocols([...allProtocols, action.payload]));
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(action.payload)
            });
        let protocolsJson = yield protocols.json();
        // yield put(protocolActions.setProtocols(protocolsJson));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}


function* putProtocol(action) {
    // TODO after deal with the backend, put updating the protocols inside try
    const state = yield select();
    let allProtocols = [...state.protocols.protocols].map(pr => {
        if (pr.id === action.payload.id) {
            return action.payload.content
        }
        return pr;
    });
    yield put(protocolActions.setProtocols(allProtocols));
    try {
        const state = yield select();
        let protocols = yield call(fetch, baseUrl + "/protocols/" + action.payload.id
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(action.payload.content)
            });
        let protocolsJson = yield protocols.json();
        // let allProtocols = [...state.protocols.protocols].map(pr => {
        //     if (pr.id === action.payload.id) {
        //         return action.payload.content
        //     }
        //     return pr;
        // });
        // yield put(protocolActions.setProtocols(allProtocols));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* mySaga() {
    yield all([
        yield takeLatest(protocolTypes.GET_PROTOCOLS, fetchProtocols),
        yield takeLatest(protocolTypes.UPDATE_PROTOCOLS, addProtocol),
        yield takeLatest(protocolTypes.POST_PROTOCOL, postProtocol),
        yield takeLatest(protocolTypes.PUT_PROTOCOL, putProtocol)
    ]);
}

export default mySaga;