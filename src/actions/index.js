import { TEST } from "../types";

export function doTest(payload) {
  return {
    type: TEST,
    payload,
  };
}

export * from "./test";
export * from "./ui";