import { combineReducers } from "redux";
import common from "./common";
import ui from "./ui";
import protocols from "./protocols";
import tokens from "./tokens";

export default combineReducers({
  common,
  ui,
  protocols,
  tokens
});
