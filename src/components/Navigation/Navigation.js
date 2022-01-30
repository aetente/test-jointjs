import React, { Component } from "react";
// import Test from "../Test/Test";
import Content from "../Content/Content";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect,
} from "react-router-dom";

class Navigation extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Content />} />
          <Route path="/test" element={<Content />} />
        </Routes>
      </Router>
    );
  }
}

export default Navigation;
