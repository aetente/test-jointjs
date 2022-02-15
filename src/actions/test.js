import { TEST, testTypes } from "../types";

export const testActions = {
    doTest
}

function doTest(payload) {
  return {
    type: testTypes.TEST,
    payload,
  };
}
