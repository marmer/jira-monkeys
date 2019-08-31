// ==UserScript==
// @name        Jira booking summarizer
// @version     0.2.1
// @author      MarMer
// @description A script to help summarizing worklogs in Jira
// @match       https://jira.schuetze.ag/browse/*
// @namespace   http://tampermonkey.net/
// @grant       none
// @updateURL   https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/bookingSummarizer.js
// @downloadURL https://raw.githubusercontent.com/marmer/Tampermonkeys/master/jira/bookingSummarizer.js
// ==/UserScript==

!function(e){var o={};function t(n){if(o[n])return o[n].exports;var r=o[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=o,t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,o){if(1&o&&(e=t(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var r in e)t.d(n,r,function(o){return e[o]}.bind(null,r));return n},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},t.p="",t(t.s=0)}([function(e,o){(()=>{"use strict";const e=document.getElementById("issue-tabs");if(fetch(window.location.origin+"/rest/api/2/issue/"+window.location.pathname.replace("/browse/",""),{method:"GET"}).then(e=>{e.json().then(e=>{console.log("############# "+e.key),console.log("############# "+e.fields.worklog.worklogs[0].timeSpentSeconds),console.log("############# "+e.fields.worklog.worklogs[0].author.displayName)})}).catch(e=>{console.log("#### "+e)}),!e)return void console.error("No element found with id: issue-tabs");document.querySelectorAll("#issue-tabs>li").forEach(e=>console.log("####"+e.id));let o=document.createElement("li");o.classList.add("menu-item"),o.id="summarizer-tab",e.append(o)})()}]);