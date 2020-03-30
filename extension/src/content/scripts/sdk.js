import { composeView } from "./composeView.js";

/**
 * Define InboxSDK functions
 * @type { class }
 */

class CInboxSDK {
  constructor() {
    InboxSDK.load(1, "sdk_EmailValidation_0f7ae3dc2f").then(sdk =>
      this.loadInboxSDK(sdk)
    );
  }

  static _iSDK = null;

  /**
   * Load functions in InboxSDK
   * @param {object} sdk
   * @returns {void}
   */
  loadInboxSDK(sdk) {
    console.log("loaded InboxSDK", sdk);
    CInboxSDK._iSDK = sdk;
    this.registerHandlers();
  }

  /**
   * register Handlers of InboxSDK
   */
  registerHandlers() {
    // //Register new Router
    // InboxSDK._iSDK.Router.handleAllRoutes(routerView => {
    //   router(routerView);
    // });

    // //Register ThreadRows
    // InboxSDK._iSDK.Lists.registerThreadRowViewHandler(threadRowView => {
    //   threadRow(threadRowView);
    // });

    // Register New composeviews
    CInboxSDK._iSDK.Compose.registerComposeViewHandler(compVw => {
      if (compVw.isInlineReplyForm()) {
        return;
      } else {
        composeView(compVw);
      }
    });
  }
}

export const inboxSDK = () => {
  return new CInboxSDK();
};
