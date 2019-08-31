export default class App {
    static whooop() {
        tamperMonkeyScript();
    }

}

const tamperMonkeyScript = () => {
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

    const issueTabContainer = document.getElementById("issue-tabs");

    performFancyFetch();

    if (!issueTabContainer) {
        console.error("No element found with id: issue-tabs");
        return;
    }
    document.querySelectorAll("#issue-tabs>li").forEach(issueTab => console.log("####" + issueTab.id));

    let customElement = document.createElement("li");
    customElement.classList.add("menu-item");
    customElement.id = "summarizer-tab";
    issueTabContainer.append(customElement);
};
