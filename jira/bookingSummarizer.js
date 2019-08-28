// ==UserScript==
// @name         Jira booking summarizer
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  try to take over the world!
// @author       You
// @match        https://jira.schuetze.ag/browse/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @updateURL    https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/bookingSummarizer.js
// @downloadURL  https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/bookingSummarizer.js
// ==/UserScript==

(function () {
    module.exports = {blubbaDeleteMe: blubbaDeleteMe}

    function blubbaDeleteMe() {
        return "whoooooot######";
    }

    const tamperMonkeyScript = () => {
        'use strict';
        const issueTabContainer = document.getElementById("issue-tabs");
        if (!issueTabContainer) return;
        document.querySelectorAll("#issue-tabs>li").forEach(issueTab => console.log("####" + issueTab.id));

        let customElement = document.createElement("li");
        customElement.classList.add("menu-item");
        customElement.id = "summarizer-tab";
        issueTabContainer.append(customElement);
    };

    tamperMonkeyScript();
})();