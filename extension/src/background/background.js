import ext from "./../utils/ext";
import {
  BASE_URL,
  API_CHECK_EMAIL,
  MSG_VAL_EMAIL
} from "./../utils/constant.js";
import "babel-polyfill";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  transformRequest: [
    (data, headers) => {
      console.log("===== request header from client =====", headers);
      console.log("===== request data from client=====", data);
      return data;
    }
  ],
  transformResponse: [
    data => {
      let resp;
      try {
        resp = JSON.parse(data);
      } catch (error) {
        throw Error(
          `[requestClient] Error parsing response JSON data - ${JSON.stringify(
            error
          )}`
        );
      }
      console.log("===== response data from server =====", resp);
      return resp;
    }
  ],
  timeout: 10000,
  validateStatus: status => {
    console.log("===== response status code from server =====", status);
    return status >= 200 && status < 300; // default
  }
});

/**
 * Define content script functions
 * @type {class}
 */
class Background {
  constructor() {
    this._port;
    this._mainTab;
    this.init();
  }

  /**
   * Document Ready
   * @returns {void}
   */
  init() {
    console.log("loaded BackgroundScripts");
    axios
      .post("http://localhost:3000/api/register-email", {
        email: "revol0605@hotmail.com"
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(JSON.stringify(error.response));
      });

    //Redirect to google OAuth when extension installed
    ext.runtime.onInstalled.addListener(() => this.onInstalled());

    //Add message listener in Browser.
    ext.runtime.onMessage.addListener((message, sender, reply) =>
      this.onMessage(message, sender, reply)
    );

    //Add message listener from Extension
    ext.extension.onConnect.addListener(port => this.onConnect(port));

    //Add Update listener for tab
    ext.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
      this.onUpdatedTab(tabId, changeInfo, tab)
    );
  }

  /**
   * Extension Installed Handler
   */
  onInstalled() {
    console.log("Installed Email Validation Extension!");
  }

  /**
   * Message Handler Function
   *
   * @param { object } message
   * @param { object } sender
   * @param { object } reply
   */
  onMessage(message, sender, reply) {
    console.log("Message from ContentScript", message);
    switch (message.type) {
      case MSG_VAL_EMAIL: {
        this.validateEmail(message.data)
          .then(data => {
            console.log("checked data:", data);
            reply({ status: "success", data: data });
          })
          .catch(err => {
            console.log("error:", err);
            reply({ status: "failed", data: err });
          });
        break;
      }
    }
    return true;
  }

  /**
   * Connect with Extension
   *
   * @param {*} port
   */
  onConnect(port) {
    this._port = port;
    console.log("Connected .....");
    this._port.onMessage.addListener(msg => this.onMessageFromExtension(msg));
  }

  /**
   * Message from Extension
   *
   * @param {*} msg
   */
  onMessageFromExtension(msg) {
    console.log("message recieved:" + msg);
  }

  /**
   *Handle Updated Tab Info

   * @param {*} tabId
   * @param {*} changeInfo
   * @param {*} tab
   */
  onUpdatedTab(tabId, changeInfo, tab) {
    //Close Auth tab
  }

  async validateEmail(emailAddresses) {
    console.log("Validating: ", emailAddresses);
    var new_emailAddresses = new Array();
    for (var i = 0; i < emailAddresses.length; i++) {
      var new_el = new Array();
      for (var j = 0; j < emailAddresses[i].length; j++) {
        var el = emailAddresses[i][j];
        const res = await axiosInstance.get(API_CHECK_EMAIL, {
          params: {
            key: "private_ac736fef9815e0d0671528c07ad4b657",
            email: el.emailAddress
          }
        });
        console.log(res);

        if (res.data.result == "valid") {
          new_el.push(el.emailAddress);
        }
      }
      new_emailAddresses.push(new_el);
    }

    return new_emailAddresses;
  }
}

export const background = new Background();
