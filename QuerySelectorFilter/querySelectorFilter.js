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
(function () {
    'use strict';
    const QUERY_SELECTOR_FILTER_CONTAINER_ID = 'querySelectorFilterContainer';
    const ELEMENT_SELECTOR_ID = 'elementSelector';
    const SELECTED_ELEMENT_BOX_CLASS = "selectedBoxElement";


    const addFilterables = () => {
        getAllNodes()
            .forEach(removePreveousElementBoxSelection);

        getFilterableNodes()
            .forEach(addElementBoxSelection);
    };

    const getAllNodes = () => {
        return document.querySelectorAll('*');
    };

    const getFilterableNodes = () => {
        return document.querySelectorAll(getElementSelector());
    };
    const getElementSelector = () => {
        const elementSelector = document.getElementById(ELEMENT_SELECTOR_ID);
        return elementSelector.value;
    };

    const removePreveousElementBoxSelection = node => {
        node.classList.remove(SELECTED_ELEMENT_BOX_CLASS);
    };

    const addElementBoxSelection = node => {
        node.classList.add(SELECTED_ELEMENT_BOX_CLASS);
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

    const newPageBodyContainer = () => {
        const querySelectorFilterContainer = document.createElement('div');
        querySelectorFilterContainer.id = QUERY_SELECTOR_FILTER_CONTAINER_ID;
        querySelectorFilterContainer.append(newQuerySelector());
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

    tamperMonkeyScript();
})();
