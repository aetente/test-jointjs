import axios from "axios";

const testBaseURL = "someurl";

const users = {
  doTest: () =>
    axios({
      url: "/entries",
      baseURL: testBaseURL,
      method: "get",
    }),
};

export default { users };
