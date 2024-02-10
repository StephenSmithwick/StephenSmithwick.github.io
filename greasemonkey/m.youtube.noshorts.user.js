    // ==UserScript==
    // @name         Remove Youtube Shorts
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  Remove Youtube Shorts
    // @author       Stephen Smithwick
    // @match        https://m.youtube.com/*
    // ==/UserScript==

    var removeTimeout;

    function removeShorts() {
        console.log("Removing Shorts");
        [...document.querySelectorAll(".reel-shelf-content-wrapper")].forEach(
            (elem) => {elem.remove()}
        )
    }
    const removeAddedShorts = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (
                mutation.type === "childList" 
                && mutation.addedNodes 
                && mutation.target.className == "reel-shelf-content-wrapper"
            ) { removeShorts(); }
        }
    });

    removeAddedShorts.observe(document.getElementById("app"), { childList: true, subtree: true });