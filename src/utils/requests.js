import axios from "axios";
// console.log(auth2)

const testBaseURL = "someurl";

const users = {
  doTest: () =>
    axios({
      url: "/entries",
      baseURL: testBaseURL,
      method: "get",
    }),
};

const protocols = {
  getProtocols: () => {

  }
}

export default { users, protocols };
