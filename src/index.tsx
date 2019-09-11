import * as React from "react";
import * as ReactDOM from "react-dom";
import JiraMonkey from "./ui/JiraMonkey";

// tslint:disable-next-line:only-arrow-functions
(function() {
    // if no body is here yet, it is (currently) ok when the application crashes
    const body = document.querySelectorAll("body")[0];
    const appContainer = document.createElement("nav");
    body.prepend(appContainer);
    ReactDOM.render(<JiraMonkey/>, appContainer);
})();
