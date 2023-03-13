// ==UserScript==
// @name         LeetCode Study Plan
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Decorate Blog leetcode lists with Leetcode userdata
// @author       stephensmithwick
// @match        http://127.0.0.1:4000/leetcode/*
// @match        https://stephensmithwick.github.io/leetcode/*
// @match        http://stephensmithwick.github.io/leetcode/*
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
            console.log(leetData);

            const leetProblems = new Map(leetData.stat_status_pairs.map(x => [x.stat.question__title_slug, x]));

            [...document.querySelectorAll(".leetcode>li")].forEach(li => {
                const slug = li.innerHTML;
                const url = `https://leetcode.com/problems/${slug}`;

                const problem = leetProblems.get(slug);
                const id = problem?.stat?.frontend_question_id
                const title = problem?.stat?.question__title;
                const status = (problem?.status === "ac") ? '✅' : '⬛';
                const level = problem?.difficulty?.level;
                const difficulty = ["NA","🟢","🟡","🔴"][level ? level : 0]
                const total_acs = problem?.stat?.total_acs;
                const total_submitted = problem?.stat?.total_submitted;
                const success_rate = (total_acs && total_submitted) ? (total_acs/total_submitted).toFixed(2) : '';

                li.innerHTML = `
                <a href="${url}">
                    ${status} ${difficulty} ${id}. ${title} (
                        tries: <code class="language-plaintext">${total_submitted}</code>;
                        rate: <code class="language-plaintext">${success_rate}</code>;
                    )
                </a>`;
            });
        }
    });
})();
