// ==UserScript==
// @name         Jira booking summarizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jira.schuetze.ag/browse/*
// @grant        none
// ==/UserScript==

(function () {
    const tamperMonkeyScript = () => {

        (function () {
            'use strict';
            const issueTabContainer = document.getElementById("issue-tabs");
            document.querySelectorAll("#issue-tabs>li").forEach(issueTab => console.log("####" + issueTab.id));

            let customElement = document.createElement("li");
            customElement.classList.add("menu-item");
            customElement.id = "summarizer-tab"
            issueTabContainer.append(customElement);

        })();

    };

    tamperMonkeyScript();
})();