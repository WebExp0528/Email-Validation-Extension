import {
  MSG_VAL_EMAIL,
  UNCHECKED,
  CHECKED,
  CHECKING
} from "./../../utils/constant.js";
import ext from "./../../utils/ext";

class ComposeView {
  constructor(props) {
    this._composeView = props;
    console.log("loaded ComposeView", props);
    this._checked = UNCHECKED;
    this.init();
  }

  init() {
    // Add Events for ComposeView

    this._composeView.on("destroy", event => this.onDestroy(event)); //Add Destroy Event

    this._composeView.on("presending", event => this.onPresending(event)); //Add Presending Event

    this._composeView.on("sent", event => this.onSent(event)); //Add Sent Event
  }

  /**
   *Destroy Event for ComposeView
   *
   * @param { object | { messageID: string, closedByInboxSDK: boolean } } event
   */
  onSent(event) {
    console.log(event);
  }

  /**
   *Destroy Event for ComposeView
   *
   * @param { object | { messageID: string, closedByInboxSDK: boolean } } event
   */
  onDestroy(event) {
    console.log(event);
  }

  /**
   * Presending Event for ComposeView
   *
   * @param { cancel() | function } event
   */
  onPresending(event) {
    console.log(this._checked);
    switch (this._checked) {
      case UNCHECKED: {
        this.validateEmail();
        event.cancel();
        break;
      }
      case CHECKING: {
        event.cancel();
        break;
      }
      case CHECKED: {
        break;
      }
    }
  }

  validateEmail() {
    this._checked = CHECKING;
    var recipients = new Array(3);
    recipients[0] = this._composeView.getToRecipients();
    recipients[1] = this._composeView.getCcRecipients();
    recipients[2] = this._composeView.getBccRecipients();
    ext.runtime.sendMessage(
      { type: MSG_VAL_EMAIL, data: recipients },
      response => this.sendEmail(response)
    );
  }

  sendEmail(response) {
    if (response.status == "success") {
      this._checked = CHECKED;
      console.log("checked emails:", response.data);
      this._composeView.setToRecipients(response.data[0]);
      this._composeView.setCcRecipients(response.data[1]);
      this._composeView.setBccRecipients(response.data[2]);
      this._composeView.send();
    }
  }
}

export const composeView = props => {
  return new ComposeView(props);
};
