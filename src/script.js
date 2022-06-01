// ==UserScript==
// @name         Eyewire Trainee Icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds an icon to the start of a username in chat when the player is a trainee
// @author       st0ck53y
// @match        https://*.eyewire.org/
// @excludes     https://*.eyewire.org/1.0/*
// @downloadURL  https://raw.githubusercontent.com/st0ck53y/ew-trainee-icon/master/src/script.js
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

    // mostly stolen from kk's ewdlc
    var mutationObserver = new MutationObserver(observerCallback);
    mutationObserver.observe(document.getElementsByClassName('chatMsgContainer')[0], {
        childList: true,
        attributes: false,
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
