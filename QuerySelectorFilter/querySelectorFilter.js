// Insert everything of this file except the last line into your tamper monkey script
const QUERY_SELECTOR_FILTER_CONTAINER_ID = 'querySelectorFilterContainer';
const ELEMENT_SELECTOR_ID = 'elementSelector';
const FILTERABLE_ELEMENTS_CONTAINER_ID = "filterableElementsContainer";

function addFilterables() {
    const elementSelector = document.getElementById(ELEMENT_SELECTOR_ID);
    const filterableElementsContainer = document.getElementById(FILTERABLE_ELEMENTS_CONTAINER_ID);
        let querySelectorElements = document.querySelectorAll(elementSelector.value);
        filterableElementsContainer.innerHTML = "";
        for (const selectedElement in querySelectorElements) {
            // TODO: marmer 14.07.2019 Some selection should be possible here
            filterableElementsContainer.appendChild(querySelectorElements[selectedElement].cloneNode(true));
        }
}

const addContainer = () => {
    const body = document.querySelector('body');
    body.innerHTML = '<div id="querySelectorFilterContainer">\n    <label>\n        Query selector: <input id="elementSelector" type="text" oninput="addFilterables(this.value)" placeholder=".someClass">\n    </label>\n    <div id="filterableElementsContainer">\n        someContent\n    </div>\n</div>' + body.innerHTML;
};

const tamperMonkeyScript = () => {

    (function () {
        'use strict';

        const container = document.getElementById(QUERY_SELECTOR_FILTER_CONTAINER_ID);

        if (!container) {
            addContainer();
        }
    })();

};


document.addEventListener("readystatechange", tamperMonkeyScript);
