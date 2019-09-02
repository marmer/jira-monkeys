import * as ReactDOM from "react-dom";
import * as React from "react";

export default class WorklogSummarizer {
    register() {
        // TODO: marmer 02.09.2019 Read /projects/ISBJRD/repos/isbj-redesign-frontend-components/browse/src/Modal/FocusCapture.ts for MutationCallbacks to get out whether my injected elements are gone

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

        new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    switch (mutation.type) {

                    }
                    console.log("---------------------------------------");
                    console.log("###Veränderung von target:" + (mutation.target as any).id);
                    console.log("###Veränderung von type:" + mutation.type);
                    console.log("###Veränderung von oldValue:" + mutation.oldValue);
                    console.log("###Veränderung von removedNodes:" + this.stringify(mutation.removedNodes));
                    mutation.removedNodes.forEach(node => {
                        console.log("######entfernt von:" + this.stringify(node));
                    });
                    console.log("###Veränderung von addedNodes:" + this.stringify(mutation.addedNodes));
                    mutation.addedNodes.forEach(node => {
                        console.log("######Hinzugefügt von:" + this.stringify(node));
                    });
                    console.log("---------------------------------------");
                })
            }
        ).observe(issueTabContainer, {
            attributeOldValue: true,
            attributes: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
        });

        ReactDOM.render(<SomeNiceReactContainer/>, customElement);
    }

    private stringify(value: any) {
        return "{" + Object.keys(value).map(value1 => value1 + ": " + value[value1]).join(",\n") + "}";
        // return value && value.id ?
        //     value.id :
        //     JSON.stringify(Object.getOwnPropertyNames(value));
    }
}

const SomeNiceReactContainer = () => {
    return <a id="my-observable-element">Doc cakes</a>
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
