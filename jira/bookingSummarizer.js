// ==UserScript==
// @name         Jira booking summarizer
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        https://jira.schuetze.ag/browse/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @updateURL    https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/bookingSummarizer.js
// ==/UserScript==

(function () {
    function performFancyFetch() {
        fetch("https://domain.com/rest/api/2/issue/ISSUEKEY-123", {
            "method": "GET"
        })
            .then(response => {
                response.json().then(value => {
                    console.log("############# " + value.key)
                    console.log("############# " + value.fields.worklog.worklogs[0].timeSpentSeconds)
                    console.log("############# " + value.fields.worklog.worklogs[0].author.displayName)
                });
            })
            .catch(err => {
                console.log("#### " + err);
            });
    }

    const tamperMonkeyScript = () => {
        'use strict';
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

    tamperMonkeyScript();
})();