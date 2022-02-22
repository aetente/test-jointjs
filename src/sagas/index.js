import { all, takeLatest } from "redux-saga/effects";
import { protocolTypes, tokensTypes } from "../types";
import { protocolSagas } from "./protocols";
import { tokenSagas } from "./tokens"

function* mySaga() {
    yield all([
        yield takeLatest(protocolTypes.GET_PROTOCOLS, protocolSagas.fetchProtocols),
        yield takeLatest(protocolTypes.UPDATE_PROTOCOLS, protocolSagas.addProtocol),
        yield takeLatest(protocolTypes.POST_PROTOCOL, protocolSagas.postProtocol),
        yield takeLatest(protocolTypes.PUT_PROTOCOL, protocolSagas.putProtocol),

        
        yield takeLatest(tokensTypes.GET_TOKENS, tokenSagas.fetchTokens),
        yield takeLatest(tokensTypes.UPDATE_TOKENS, tokenSagas.addToken),
        yield takeLatest(tokensTypes.POST_TOKENS, tokenSagas.postToken),
        yield takeLatest(tokensTypes.PUT_TOKENS, tokenSagas.putToken),
    ]);
}

export default mySaga;