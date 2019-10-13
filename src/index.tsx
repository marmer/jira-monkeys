import * as React from "react";
import * as ReactDOM from "react-dom";
import JiraMonkey from "./ui/JiraMonkey";

// tslint:disable-next-line:only-arrow-functions
(function() {
    // if no body is here yet, it is (currently) ok when the application crashes
    const body = document.querySelectorAll("body")[0];
    const appContainer = document.createElement("nav");
    body.prepend(appContainer);

    let lastJiraMonkey: any = null;
    let lastLocation = window.location.href;

    const tryMount = () => {
        if (window.location.pathname.startsWith("/browse/")) {
            lastJiraMonkey = <JiraMonkey/>;
            ReactDOM.render(lastJiraMonkey, appContainer);
        }
    };

    tryMount();

    setInterval(() => {
        if (lastLocation !== window.location.href) {
            lastLocation = window.location.href;
            if (lastJiraMonkey) {
                ReactDOM.unmountComponentAtNode(appContainer);
                lastJiraMonkey = null;
            }
            tryMount();
        }
    }, 100)
})();
