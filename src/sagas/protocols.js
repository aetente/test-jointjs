import { put, call, select } from "redux-saga/effects";
import { protocolActions } from "../actions";
import { googleSheetToArray } from "../utils/utils";

// const baseUrl = "http://" + window.location.hostname + ":8080/api";

// const baseUrl = "https://test-builder-api.herokuapp.com";

const baseUrl = "https://test-builder.azurewebsites.net";
const jsonBinUrl = "https://api.jsonbin.io/b/621b5c41c4790b3406246984"
const jsonStorageUrl = "https://api.jsonstorage.net/v1/json/a8e231d8-705e-49c8-a5bd-4d0a2811e396/cc1fd566-b049-471b-996b-4cf37c69ef40"

export const protocolSagas = {
    fetchProtocols,
    addProtocol,
    postProtocol,
    putProtocol,
    deleteProtocol
}


function* fetchProtocols() {
    // console.log(process.env.REACT_APP_API_KEY, process.env.REACT_APP_CLIENT_ID)
    try {
        // yield window.gapi.client.sheets.spreadsheets.values.get({
        //     spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        //     range: 'protocols',
        // }).then((response) => {
        //     let result = response.result;
        //     let protocols = googleSheetToArray(result.values);
        //     put(protocolActions.setProtocols(protocols));
        // });
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
    let allProtocols = [...state.protocols.protocols];
    let protocolToPost = {...action.payload};
    delete protocolToPost.new;
    yield put(protocolActions.setProtocols([...allProtocols, protocolToPost]));
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols"
            // let protocols = yield call(fetch, "db.json"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(protocolToPost)
            });
        // let protocolsJson = yield protocols.json();
        // yield window.gapi.client.sheets.spreadsheets.values.update({
        //     spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        //     range: `protocols!A${allProtocols.length + 1}`,
        //     majorDimension: "ROWS",
        //     values: Object.values(action.payload)
        // }).then((response) => {
        //     let result = response.result;
        //     console.log(result)
        //     // let protocols = googleSheetToArray(result.values);
        //     // put(protocolActions.setProtocols(protocols));
        // });
        // yield put(protocolActions.setProtocols(protocolsJson));
        // let protocols = yield call(fetch, jsonStorageUrl+`?apiKey=${process.env.REACT_APP_JSONSTORAGE_KEY}`
        //     // let protocols = yield call(fetch, "db.json"
        //     , {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json'
        //         },
        //         method: "PUT",
        //         body: JSON.stringify([...allProtocols, action.payload])
        //     });
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
        // let protocolsJson = yield protocols.json();
        // let allProtocols = [...state.protocols.protocols].map(pr => {
        //     if (pr.id === action.payload.id) {
        //         return action.payload.content
        //     }
        //     return pr;
        // });
        // yield put(protocolActions.setProtocols(allProtocols));

        // let protocols = yield call(fetch,  jsonStorageUrl+`?apiKey=${process.env.REACT_APP_JSONSTORAGE_KEY}`
        //     // let protocols = yield call(fetch, "db.json"
        //     , {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json'
        //         },
        //         method: "PUT",
        //         body: JSON.stringify([...allProtocols])
        //     });
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* deleteProtocol(action) {
    const state = yield select();
    let allProtocols = [...state.protocols.protocols].filter(pr => {
        return pr.id !== action.payload.id;
    });
    yield put(protocolActions.setProtocols(allProtocols));
    try {
        let protocols = yield call(fetch, baseUrl + "/protocols/" + action.payload.id
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "DELETE"
            });
    }
    catch (e) {
        console.log("ERROR", e);
    }
}