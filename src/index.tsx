import * as ReactDOM from "react-dom";
import * as React from "react";
import JiraMonkey from "./ui/JiraMonkey";

(function () {
    //if no body is here yet, it is (currently) ok when the application crashes
    const body = document.querySelectorAll("body")[0];
    const appContainer = document.createElement("nav");
    body.prepend(appContainer);
    ReactDOM.render(<JiraMonkey/>, appContainer);
})();