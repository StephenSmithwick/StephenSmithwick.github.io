// ==UserScript==
// @name         LeetCode Study Plan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Decorate Blog leetcode lists with Leetcode userdata
// @author       stephensmithwick
// @match        http://127.0.0.1:4000/*
// @match        https://stephensmithwick.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://leetcode.com/api/problems/algorithms/",
        onload: function(leet) {
            const leetData = JSON.parse(leet.response);
            const leetProblems = new Map(leetData.stat_status_pairs.map(x => [x.stat.question__title_slug, x]));
            console.log(leetProblems);

            [...document.querySelectorAll(".leetcode>li")].forEach(li => {
                const id = li.innerHTML;
                const problem = leetProblems.get(id)
                if (problem && problem.status == "ac") {
                    li.innerHTML = `<a href="https://leetcode.com/problems/${id}">✅ ${id}</a>`;
                } else {
                    li.innerHTML = `<a href="https://leetcode.com/problems/${id}">${id}</a>`;
                }
            });
        }
    });
})();