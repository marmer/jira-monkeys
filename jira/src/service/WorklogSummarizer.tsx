import * as ReactDOM from "react-dom";
import * as React from "react";

export default class WorklogSummarizer {
    register() {
        console.log("#Worklog Summerizer started to register")

        const issueTabContainer = document.getElementById("issue-tabs");

        performFancyFetch();

        if (!issueTabContainer) {
            console.error("No element found with id: issue-tabs");
            return;
        }
        document.querySelectorAll("#issue-tabs>li").forEach(issueTab => console.log("####" + issueTab.id));

        let customElement = document.createElement("li");
        customElement.classList.add("menu-item");
        customElement.classList.add("active-tab");
        // TODO: marmer 01.09.2019 add focus, blur and clicklistener
        // TODO: marmer 01.09.2019 find and add "hover" class/functionality
        customElement.id = "summarizer-tab";
        issueTabContainer.append(customElement);

        ReactDOM.render(<SomeNiceReactContainer/>, customElement);
    }
}

const SomeNiceReactContainer = () => {
    return <a>Doc cakes</a>
};

function performFancyFetch() {
    fetch(window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", ""), {
        "method": "GET"
    })
        .then(response => {
            response.json().then(value => {
                console.log("############# " + value.key);
                console.log("############# " + value.fields.worklog.worklogs[0].timeSpentSeconds);
                console.log("############# " + value.fields.worklog.worklogs[0].author.displayName)
            });
        })
        .catch(err => {
            console.log("#### " + err);
        });
}
