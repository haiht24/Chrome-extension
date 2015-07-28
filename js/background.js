// Clicked to extension icon
chrome.browserAction.onClicked.addListener(function (tab) {
    // Try get tab with id saved before
    chrome.tabs.get(parseInt(localStorage['tabId']), function(){
        if (chrome.runtime.lastError) {
            // If tab not exist then create new instant
            console.log(chrome.runtime.lastError.message);
            chrome.tabs.create({url : 'popup.html'}, function(newTab){
                localStorage['tabId'] = newTab.id;
            });
        } else {
            // If tab exists then focus to it
            chrome.tabs.update(parseInt(localStorage['tabId']), {selected: true});
        }
    });
});