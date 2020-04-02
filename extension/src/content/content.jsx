/* global document */

import React from "react";
import ReactDOM from "react-dom";
import ext from "../utils/ext";
import { inboxSDK } from "./scripts/sdk.js";

// import "./content.css";

function onRequest(request) {
  if (request.action === "change-color") {
    document.body.style.background = request.data.color;
  }
}

ext.runtime.onMessage.addListener(onRequest);

class Main extends React.Component {
  constructor(props) {
    super(props);
    inboxSDK();
  }

  render() {
    return (
      <div className="my-extension">
        {/* <h1>Hello world - My first Extension</h1> */}
      </div>
    );
  }
}

const app = document.createElement("div");
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
