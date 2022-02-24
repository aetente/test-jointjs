import { all, takeLatest } from "redux-saga/effects";
import { protocolTypes, tokensTypes } from "../types";
import { protocolSagas } from "./protocols";
import { tokenSagas } from "./tokens";

// import GoogleSpreadsheet

// // window.gapi.client.init({
// //     apiKey: process.env.REACT_APP_API_KEY,
// //     clientId: process.env.REACT_APP_CLIENT_ID,
// //   }).then(function () {
// //         window.gapi.auth2.getAuthInstance().isSignedIn.listen(console.log("a"));
// //       console.log("very cool")
// //   }, function(error) {
// //       console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", error)
// //   });

// const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = process.env.REACT_APP_SHEET_ID;
// const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
// const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

// const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// const appendSpreadsheet = async (row) => {
//   try {
//     await doc.useServiceAccountAuth({
//       client_email: CLIENT_EMAIL,
//       private_key: PRIVATE_KEY,
//     });
//     // loads document properties and worksheets
//     await doc.loadInfo();

//     const sheet = doc.sheetsById[SHEET_ID];
//     const result = await sheet.addRow(row);
//   } catch (e) {
//     console.error('Error: ', e);
//   }
// };

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