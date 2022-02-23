import { put, call, select } from "redux-saga/effects";
import { tokenActions } from "../actions";

// const baseUrl = "http://" + window.location.hostname + ":8080/api";
const baseUrl = "https://test-builder-api.herokuapp.com";

export const tokenSagas = {
    fetchTokens,
    addToken,
    postToken,
    putToken
}


function* fetchTokens() {
    try {
        let tokens = yield call(fetch, baseUrl + "/tokens"
        // let tokens = yield call(fetch, "db.json"
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
    console.log(action)
    yield put(tokenActions.setTokens([...allTokens, action.payload]));
    try {
        let tokens = yield call(fetch, baseUrl + "/tokens"
        // let tokens = yield call(fetch, "db.json"
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(action.payload)
            });
        let tokensJson = yield tokens.json();
        // yield put(tokenActions.setTokens(tokensJson));
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
        const state = yield select();
        let tokens = yield call(fetch, baseUrl + "/tokens/" + action.payload.id
            , {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(action.payload.content)
            });
        let tokensJson = yield tokens.json();
        // let allTokens = [...state.tokens.tokens].map(pr => {
        //     if (pr.id === action.payload.id) {
        //         return action.payload.content
        //     }
        //     return pr;
        // });
        // yield put(tokenActions.setTokens(allTokens));
    }
    catch (e) {
        console.log("ERROR", e);
    }
}