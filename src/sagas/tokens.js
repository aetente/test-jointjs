import { put, call, select } from "redux-saga/effects";
import { tokenActions } from "../actions";
import { googleSheetToArray } from "../utils/utils";

// const baseUrl = "http://" + window.location.hostname + ":8080/api";
// const baseUrl = "https://test-builder-api.herokuapp.com";
const baseUrl = "https://test-builder.azurewebsites.net";
const jsonBinUrl = "https://api.jsonbin.io/b/621b6c9125fb1b26b18971a6"
const jsonStorageUrl = "https://api.jsonstorage.net/v1/json/a8e231d8-705e-49c8-a5bd-4d0a2811e396/ee3d95df-e9f1-472b-bfb0-c546a517cf88"

export const tokenSagas = {
    fetchTokens,
    addToken,
    postToken,
    putToken,
    deleteToken
}


function* fetchTokens() {
    try {
        // yield window.gapi.client.sheets.spreadsheets.values.get({
        //     spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
        //     range: 'tokens',
        // }).then((response) => {
        //     let result = response.result;
        //     let tokens = googleSheetToArray(result.values);
        //     put(tokenActions.setTokens(tokens));
        // });
        
        let tokens = yield call(fetch, baseUrl + "/tokens"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        let tokensJson = yield tokens.json();
        yield put(tokenActions.setTokens(tokensJson));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* addToken(action) {
    try {
        let tokens = yield call(fetch, baseUrl + "/tokens"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(action.payload)
            });
        let tokensJson = yield tokens.json();
        yield put(tokenActions.setTokens(tokensJson));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* postToken(action) {
    // TODO after deal with the backend, put updating the tokens inside try
    const state = yield select();
    let allTokens = [...state.tokens.tokens]
    let tokenToPost = {...action.payload};
    delete tokenToPost.new;
    yield put(tokenActions.setTokens([...allTokens, tokenToPost]));
    try {
        let tokens = yield call(fetch, baseUrl + "/tokens"
        // let tokens = yield call(fetch, "db.json"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(tokenToPost)
            });
        // let tokensJson = yield tokens.json();
        // yield put(tokenActions.setTokens(tokensJson));
        
        // let tokens = yield call(fetch, jsonStorageUrl+`?apiKey=${process.env.REACT_APP_JSONSTORAGE_KEY}`
        //     // let protocols = yield call(fetch, "db.json"
        //     , {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json'
        //         },
        //         method: "PUT",
        //         body: JSON.stringify([...allTokens, action.payload])
        //     });
    }
    catch (e) {
        console.log("ERROR", e);
    }
}


function* putToken(action) {
    // TODO after deal with the backend, put updating the tokens inside try
    const state = yield select();
    let allTokens = [...state.tokens.tokens].map(pr => {
        if (pr.id === action.payload.id) {
            return action.payload.content
        }
        return pr;
    });
    yield put(tokenActions.setTokens(allTokens));
    try {
        // const state = yield select();
        let tokens = yield call(fetch, baseUrl + "/tokens/" + action.payload.id
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(action.payload.content)
            });
        // let tokensJson = yield tokens.json();
        // let allTokens = [...state.tokens.tokens].map(pr => {
        //     if (pr.id === action.payload.id) {
        //         return action.payload.content
        //     }
        //     return pr;
        // });
        // yield put(tokenActions.setTokens(allTokens));
        
        
        // let tokens = yield call(fetch, jsonStorageUrl+`?apiKey=${process.env.REACT_APP_JSONSTORAGE_KEY}`
        //     // let protocols = yield call(fetch, "db.json"
        //     , {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Accept': 'application/json',
        //         },
        //         method: "PUT",
        //         body: JSON.stringify([...allTokens])
        //     });
    }
    catch (e) {
        console.log("ERROR", e);
    }
}

function* deleteToken(action) {
    const state = yield select();
    let allTokens = [...state.tokens.tokens].filter(t => {
        return t.id !== action.payload.id;
    });
    yield put(tokenActions.setTokens(allTokens));
    try {
        let tokens = yield call(fetch, baseUrl + "/tokens/" + action.payload.id
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