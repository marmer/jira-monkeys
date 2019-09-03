// ==UserScript==
// @name        Jira booking summarizer
// @version     0.2.1
// @author      MarMer
// @description A script to help summarizing worklogs in Jira
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

// CONCATENATED MODULE: ./src/ui/core/WorklogService.ts
var WorklogService = /** @class */ (function () {
    function WorklogService() {
    }
    WorklogService.prototype.getSummedWorklogsByUser = function () {
        return [{ author: { displayName: "me" }, timeSpendInMinutes: 42 },
            { author: { displayName: "myself" }, timeSpendInMinutes: 546 },
            { author: { displayName: "and I" }, timeSpendInMinutes: 1337 }];
    };
    return WorklogService;
}());
/* harmony default export */ var core_WorklogService = (WorklogService);

// CONCATENATED MODULE: ./src/ui/core/jiraFormat.ts
var minute = { symbol: "m", factor: 1 };
var hour = { symbol: "h", factor: 60 * minute.factor };
var day = { symbol: "d", factor: 8 * hour.factor };
var week = { symbol: "w", factor: 5 * day.factor };
var weeksOf = function (timeSpentInMinutes) { return Math.floor(timeSpentInMinutes / week.factor); };
var daysOf = function (timeSpentInMinutes) { return Math.floor((timeSpentInMinutes % week.factor) / day.factor); };
var hoursOf = function (timeSpentInMinutes) { return Math.floor((timeSpentInMinutes % day.factor) / hour.factor); };
var minutesOf = function (timeSpentInMinutes) { return Math.floor((timeSpentInMinutes % hour.factor) / minute.factor); };
var minutePartOf = function (timeSpentInMinutes) { return unitStringFor(minutesOf(timeSpentInMinutes), minute); };
var hourPartOf = function (timeSpentInMinutes) { return unitStringFor(hoursOf(timeSpentInMinutes), hour); };
var dayPartOf = function (timeSpentInMinutes) { return unitStringFor(daysOf(timeSpentInMinutes), day); };
var weekPartOf = function (timeSpentInMinutes) { return unitStringFor(weeksOf(timeSpentInMinutes), week); };
var unitStringFor = function (result, unit) { return result == 0 ? "" : result + unit.symbol; };
/* harmony default export */ var jiraFormat = (function (timeSpentInMinutes) {
    var absoluteTimeSpendInMinutes = Math.abs(timeSpentInMinutes);
    var resultString = (weekPartOf(absoluteTimeSpendInMinutes) + " " + dayPartOf(absoluteTimeSpendInMinutes) + " " + hourPartOf(absoluteTimeSpendInMinutes) + " " + minutePartOf(absoluteTimeSpendInMinutes))
        .replace(/\s+/, " ")
        .trim();
    return resultString === "" ?
        "0" + minute.symbol :
        resultString;
});

// CONCATENATED MODULE: ./src/ui/App.ts


var App_App = /** @class */ (function () {
    function App() {
    }
    App.run = function () {
        this.worklog.getSummedWorklogsByUser()
            .forEach(function (worklog) { return console.log(worklog.author.displayName + ": " + jiraFormat(worklog.timeSpendInMinutes)); });
    };
    App.worklog = new core_WorklogService();
    return App;
}());
/* harmony default export */ var ui_App = (App_App);

// CONCATENATED MODULE: ./src/index.js


(function () {
    ui_App.run()
})();

/***/ })
/******/ ]);