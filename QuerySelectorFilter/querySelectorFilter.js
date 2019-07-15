// ==UserScript==
// @name         Filter by query selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       MarMer
// @match        http*://*
// @match        http*://*/*
// @match        http*://*/*/*
// @match        http*://*/*/*/*
// @match        http*://*/*/*/*/*
// @match        http*://*/*/*/*/*/*
// @match        http*://*/*/*/*/*/*/*
// @match        http*://*/*/*/*/*/*/*/*
// @match        http*://*/*/*/*/*/*/*/*/*
// @grant        none
// ==/UserScript==

// Insert everything of this file except the last line into your tamper monkey script
const QUERY_SELECTOR_FILTER_CONTAINER_ID = 'querySelectorFilterContainer';
const ELEMENT_SELECTOR_ID = 'elementSelector';
const FILTERABLE_ELEMENTS_CONTAINER_ID = "filterableElementsContainer";

const addFilterables = () => {
    const elementSelector = document.getElementById(ELEMENT_SELECTOR_ID);
    const filterableElementsContainer = document.getElementById(FILTERABLE_ELEMENTS_CONTAINER_ID);
    let querySelectorElements = document.querySelectorAll(elementSelector.value);
    filterableElementsContainer.innerHTML = "";
    for (const selectedElement in querySelectorElements) {
        // TODO: marmer 14.07.2019 Some selection should be possible here
        filterableElementsContainer.appendChild(querySelectorElements[selectedElement].cloneNode(true));
    }
};

const newQuerySelector = () => {
    const labeledInput = document.createElement('label');
    labeledInput.append("Query selector:");
    const mainElementSelectorInput = document.createElement('input');
    mainElementSelectorInput.id = ELEMENT_SELECTOR_ID;
    mainElementSelectorInput.type = 'text';
    mainElementSelectorInput.placeholder = ".someCssClass";
    mainElementSelectorInput.addEventListener("input", addFilterables);
    labeledInput.append(mainElementSelectorInput);
    return labeledInput;
};

const newFilterableElementsContainer = () => {
    let container = document.createElement('div');
    container.id = FILTERABLE_ELEMENTS_CONTAINER_ID;
    container.append("someContent");
    return container;
};

const newPageBodyContainer = () => {
    const querySelectorFilterContainer = document.createElement('div');
    querySelectorFilterContainer.id = QUERY_SELECTOR_FILTER_CONTAINER_ID;
    querySelectorFilterContainer.append(newQuerySelector());
    querySelectorFilterContainer.append(newFilterableElementsContainer());
    return querySelectorFilterContainer;
};

const addContainerToPageBody = () => {
    const body = document.querySelector('body');


    body.prepend(newPageBodyContainer());
};

const tamperMonkeyScript = () => {

    (function () {
        'use strict';

        const container = document.getElementById(QUERY_SELECTOR_FILTER_CONTAINER_ID);

        if (!container) {
            addContainerToPageBody();
        }
    })();

};


document.addEventListener("readystatechange", tamperMonkeyScript);
(function () {
    'use strict';

    tamperMonkeyScript();
})();