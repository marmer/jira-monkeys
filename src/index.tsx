import ConsoleLogApp from "./ui/ConsoleApp";
import * as ReactDOM from "react-dom";
import * as React from "react";
import JiraMonkey from "./ui/JiraMonkey";

(function () {
    ConsoleLogApp.run();

    const body = document.querySelectorAll("body")[0];

    const appContainer = document.createElement("nav");
    body.prepend(appContainer);
    ReactDOM.render(<JiraMonkey/>, appContainer);
})();