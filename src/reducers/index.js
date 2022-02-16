import { combineReducers } from "redux";
import common from "./common";
import ui from "./ui";
import protocols from "./protocols";

export default combineReducers({
  common,
  ui,
  protocols
});
