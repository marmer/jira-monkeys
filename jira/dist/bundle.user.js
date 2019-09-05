// ==UserScript==
// @name        Jira Tools
// @version     0.2.2
// @author      MarMer
// @description A little script to help working with jira
// @match       https://jira.schuetze.ag/browse/*
// @namespace   http://tampermonkey.net/
// @grant       none
// @updateURL   https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/dist/bundle.user.js
// @downloadURL https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/dist/bundle.user.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/ui/core/groupBy.ts
/* harmony default export */ var groupBy = ((values, keyExtractor) => {
    const intermediateGroup = {};
    values.forEach(value => {
        const key = keyExtractor(value);
        const indexKey = "" + key;
        if (!intermediateGroup[indexKey]) {
            intermediateGroup[indexKey] = { key: key, values: [] };
        }
        intermediateGroup[indexKey].values.push(value);
    });
    const result = [];
    Object.keys(intermediateGroup)
        .forEach(key => result.push(intermediateGroup[key]));
    return result;
});

// CONCATENATED MODULE: ./src/ui/core/WorklogService.ts

class WorklogService_WorklogService {
    static groupedByDisplayName(worklogs) {
        return worklogs;
    }
    static toWorklog(responseWorklog) {
        const timeSpentInMinutes = Math.floor(responseWorklog.timeSpentSeconds / 60);
        const author = responseWorklog.author;
        return {
            author,
            timeSpentInMinutes
        };
    }
    getSummedWorklogsByUser() {
        const worklogsUrl = window.location.origin + "/rest/api/2/issue/" + window.location.pathname.replace("/browse/", "") + "/worklog";
        return fetch(worklogsUrl, { "method": "GET" })
            .then((response) => {
            if (response.status !== 200) {
                throw new Error("Bad status");
            }
            return response.json();
        })
            .then(responseJson => responseJson.worklogs.map(WorklogService_WorklogService.toWorklog))
            .then(this.sumUp)
            .then(WorklogService_WorklogService.groupedByDisplayName);
    }
    sumUp(worklog) {
        return groupBy(worklog, w => w.author.displayName)
            .map(tupel => tupel.values.reduce((previousValue, currentValue) => {
            const newValue = Object.assign({}, previousValue);
            newValue.timeSpentInMinutes += currentValue.timeSpentInMinutes;
            return newValue;
        })).sort((a, b) => a.author.displayName < b.author.displayName ? -1 : 1);
    }
}

// CONCATENATED MODULE: ./src/ui/core/jiraFormat.ts
const minute = { symbol: "m", factor: 1 };
const hour = { symbol: "h", factor: 60 * minute.factor };
const day = { symbol: "d", factor: 8 * hour.factor };
const week = { symbol: "w", factor: 5 * day.factor };
const weeksOf = (timeSpentInMinutes) => Math.floor(timeSpentInMinutes / week.factor);
const daysOf = (timeSpentInMinutes) => Math.floor((timeSpentInMinutes % week.factor) / day.factor);
const hoursOf = (timeSpentInMinutes) => Math.floor((timeSpentInMinutes % day.factor) / hour.factor);
const minutesOf = (timeSpentInMinutes) => Math.floor((timeSpentInMinutes % hour.factor) / minute.factor);
const minutePartOf = (timeSpentInMinutes) => unitStringFor(minutesOf(timeSpentInMinutes), minute);
const hourPartOf = (timeSpentInMinutes) => unitStringFor(hoursOf(timeSpentInMinutes), hour);
const dayPartOf = (timeSpentInMinutes) => unitStringFor(daysOf(timeSpentInMinutes), day);
const weekPartOf = (timeSpentInMinutes) => unitStringFor(weeksOf(timeSpentInMinutes), week);
const unitStringFor = (result, unit) => result == 0 ? "" : result + unit.symbol;
/* harmony default export */ var jiraFormat = ((timeSpentInMinutes) => {
    const absoluteTimeSpendInMinutes = Math.abs(timeSpentInMinutes);
    const resultString = `${weekPartOf(absoluteTimeSpendInMinutes)} ${dayPartOf(absoluteTimeSpendInMinutes)} ${hourPartOf(absoluteTimeSpendInMinutes)} ${minutePartOf(absoluteTimeSpendInMinutes)}`
        .replace(/\s+/, " ")
        .trim();
    return resultString === "" ?
        "0" + minute.symbol :
        resultString;
});

// CONCATENATED MODULE: ./src/ui/App.ts


class App_App {
    static run() {
        this.worklog.getSummedWorklogsByUser()
            .then(worklogs => worklogs.forEach(this.logToConsole));
    }
    static logToConsole(worklog) {
        console.log(worklog.author.displayName + ": " + jiraFormat(worklog.timeSpentInMinutes));
    }
}
App_App.worklog = new WorklogService_WorklogService();

// CONCATENATED MODULE: ./src/index.js


(function () {
    App_App.run()
})();

/***/ })
/******/ ]);