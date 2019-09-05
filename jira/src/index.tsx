import ConsoleLogApp from "./ui/App";
import * as ReactDOM from "react-dom";
import * as React from "react";

(function () {
    // TODO: marmer 05.09.2019 Remove as soon as it's not needer anymore
    ConsoleLogApp.run()

    const body = document.querySelectorAll("body")[0];

    const appContainer = document.createElement("nav");
    body.prepend(appContainer);
    ReactDOM.render(<div>Foo bar</div>, appContainer);
})();