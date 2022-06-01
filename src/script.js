// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eyewire.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eyewire.org
// @grant        none
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // todo - cleanup/timeout
    let map = {}

    // for testing - handles existing messages. for new messages, see mutation observer below
    $('.chatMsg:has(span.userName)').each((k, v) => {
        handleMessage(v)
    })

    function handleMessage(element) {
        let username = $(element).find('.userName').html()
        if(map[username] === undefined) {
            map[username] = "pending"
            getLevel(username, (level) => {
                map[username] = level
                if (level === 0) {
                    prependTraineeIcon($(element))
                }
            })
        } else if (map[username] === 0) {
            prependTraineeIcon($(element))
        }
    }

    function prependTraineeIcon(el) {
        el.find('.userEnc:first()').prepend("🔰")
    }

    function getLevel(username, callback) {
        console.log("fetching level for: " + username)
        fetch("https://eyewire.org/1.0/player/" + username + "/bio").then(response => response.json()).then(bio => callback(bio.level))
    }

    var mutationObserver = new MutationObserver(observerCallback);
    mutationObserver.observe(document.getElementsByClassName('chatMsgContainer')[0], {
        childList: true,
        attributres: false,
        characterData: false,
        subtree: false
    });

    function observerCallback(updates) {
        var update = updates[0];
        if (!update.addedNodes) return;
        var message = $(update.addedNodes[0]);
        handleMessage(message)
    }
})();
