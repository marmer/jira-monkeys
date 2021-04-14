import * as React from "react";
import * as ReactDOM from "react-dom";
import JiraMonkey from "./ui/JiraMonkey";

/**
 * dirty hack to force the browser to resize the elements of jira correctly
 * @param appContainer
 */
const registerRedrawHookAt = (appContainer: HTMLElement) => {
    const redrawSite = () => {
        const evt = document.createEvent("UIEvents") as any;
        evt.initUIEvent("resize", true, false, window, 0);
        window.dispatchEvent(evt);
    };

    const mutationObserver = new MutationObserver(redrawSite);

    mutationObserver.observe(appContainer, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeOldValue: true,
        characterDataOldValue: true,
    });
};

// tslint:disable-next-line:only-arrow-functions
(function() {
    // if no body is here yet, it is (currently) ok when the application crashes
    const content = document.querySelector("#page > #content[role=main]");
    const body = content ? content : document.querySelectorAll("body")[0];

    // const body = document.querySelectorAll("body")[0];
    const appContainer = document.createElement("nav");
    body.prepend(appContainer);

    let lastJiraMonkey: any = null;
    let lastLocation = window.location.href;

  const tryMount = () => {
    if (window.location.pathname.indexOf("/browse/") >= 0) {
      lastJiraMonkey = <JiraMonkey/>;
      ReactDOM.render(lastJiraMonkey, appContainer);
    }
  };

    tryMount();

    registerRedrawHookAt(appContainer);

    setInterval(() => {
        if (lastLocation !== window.location.href) {
            lastLocation = window.location.href;
            if (lastJiraMonkey) {
                ReactDOM.unmountComponentAtNode(appContainer);
                lastJiraMonkey = null;
            }
            tryMount();
        }

    }, 100);
})();
