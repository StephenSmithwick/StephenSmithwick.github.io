// ==UserScript==
// @name         Remove Youtube Shorts
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove Youtube Shorts
// @author       Stephen Smithwick
// @match        https://m.youtube.com/*
// ==/UserScript==

const target_class = [
    "rich-section-single-column",
    "reel-shelf-content-wrapper",
    "rich-section-content-wrapper",
    "reel-shelf-items",
    "reel-shelf-header"
]

function removeShorts() {
    console.log("Removing Shorts");
    for (const clazz of target_class) {
        [...document.querySelectorAll(`.${clazz}`)].forEach(
            (elem) => {elem.remove()}
        )
    }
}
const removeAddedShorts = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        if (
            mutation.type === "childList" 
            && mutation.addedNodes 
            && target_class.some(clazz => mutation.target.innerHTML.indexOf(clazz) > 0)
        ) {
            console.log(mutation.target)
            removeShorts();
        }
    }
});

console.log("Remove Youtube Shorts - loaded");
removeAddedShorts.observe(document.getElementById("app"), { childList: true, subtree: true });

removeShorts();
