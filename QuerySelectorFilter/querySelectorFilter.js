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

(function () {
    'use strict';
    const QUERY_SELECTOR_FILTER_CONTAINER_ID = 'querySelectorFilterContainer';
    const ELEMENT_SELECTOR_ID = 'elementSelector';
    const SELECTED_ELEMENT_BOX_CLASS = "selectedBoxElement";


    const selectFilterables = () => {
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

    const newPageBodyContainer = () => {
        const querySelectorFilterContainer = document.createElement('div');
        querySelectorFilterContainer.id = QUERY_SELECTOR_FILTER_CONTAINER_ID;
        querySelectorFilterContainer.append(newBoxQuerySelector());
        querySelectorFilterContainer.append(newFilterElementSelector());
        querySelectorFilterContainer.append(newFilterRegexSelector());
        return querySelectorFilterContainer;
    };

    const newBoxQuerySelector = () => {
        const labeledInput = document.createElement('label');
        labeledInput.append("Box Querry Selector");
        const mainElementSelectorInput = document.createElement('input');
        mainElementSelectorInput.id = ELEMENT_SELECTOR_ID;
        mainElementSelectorInput.type = 'text';
        mainElementSelectorInput.placeholder = ".someCssClass";
        mainElementSelectorInput.addEventListener("input", selectFilterables);
        labeledInput.append(mainElementSelectorInput);
        return labeledInput;
    };

    const newFilterElementSelector = () => {
        const labeledInput = document.createElement('label');
        labeledInput.append("Filter Querry Selector");
        const mainElementSelectorInput = document.createElement('input');
        mainElementSelectorInput.id = ELEMENT_SELECTOR_ID;
        mainElementSelectorInput.type = 'text';
        mainElementSelectorInput.placeholder = ".someCssClass";

        mainElementSelectorInput.addEventListener("input", selectFilterablePart);

        labeledInput.append(mainElementSelectorInput);
        return labeledInput;
    };

    const selectFilterablePart = () => {
        getAllNodes()
            .forEach(removePreveousElementBoxSelection);

        getSelectablePartOfFilterableNodes()
            .forEach(addElementBoxSelection);
    };

    const newFilterRegexSelector = () => {
        // TODO: marmer 16.07.2019 Implement
        return document.createElement('div');
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
