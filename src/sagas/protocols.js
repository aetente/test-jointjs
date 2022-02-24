import { put, call, select } from "redux-saga/effects";
import { protocolActions } from "../actions";

// const baseUrl = "http://" + window.location.hostname + ":8080/api";

const baseUrl = "https://test-builder-api.herokuapp.com";

export const protocolSagas = {
    fetchProtocols,
    addProtocol,
    postProtocol,
    putProtocol
}

const initClient = async () => {
    window.gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/spreadsheets"
    }).then(() => {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen((res) => {console.log("help", res)})
        console.log("very cool", window.gapi.auth2.getAuthInstance().isSignedIn.get())

        // window.gapi.client.sheets.spreadsheets.values.get({
        //     spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        // }).then((response) => {
        //     var result = response.result;
        //     var numRows = result.values ? result.values.length : 0;
        //     console.log(result);
        // });

    }, (error) => {
        console.log("AAAAAAAAAAAAAAAAAAAAAAA")
    });
}


function* fetchProtocols() {
    yield window.gapi.load('client:auth2', function*() {yield initClient()});
    yield console.log("very cool?")
    // console.log(process.env.REACT_APP_API_KEY, process.env.REACT_APP_CLIENT_ID)
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols"
            // let protocols = yield call(fetch, "db.json"
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
            // let protocols = yield call(fetch, "db.json"
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