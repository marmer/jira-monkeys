import * as React from "react";
import * as ReactDOM from "react-dom";
import JiraMonkey from "./ui/JiraMonkey";

import * as packageJson from '../package.json';

// tslint:disable-next-line:only-arrow-functions
(function() {
    // if no body is here yet, it is (currently) ok when the application crashes
    const body = document.querySelectorAll("body")[0];
    const appContainer = document.createElement("nav");
    body.prepend(appContainer);

    let lastJiraMonkey: any = null;
    let lastLocation = window.location.href;


    const tryMount = () => {
        // TODO: marmer 13.10.2019 maybe better match to "window.location.pathname? ;)
        if (window.location.href.startsWith(packageJson.tampermonkey.match.baseUrl + "/browse/")) {
            lastJiraMonkey = <JiraMonkey/>;
            ReactDOM.render(lastJiraMonkey, appContainer);
        }
    };

    tryMount();

    const interval = setInterval(() => {
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
