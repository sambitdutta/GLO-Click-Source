//listener

(function () {
    
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

        console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
        
        getMessage(request.messageId, request.email);

    });

//interactive sign in
    chrome.identity.getAuthToken({'interactive': true}, function (token) {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);

        } else {
            console.log(token);
        }
    });

    function getMessage(messageId, email) {
        window.email = email;
        var method = "GET";
        var url = "https://www.googleapis.com/gmail/v1/users/" + window.email + "/messages/" + messageId;
        console.log(url);
        xhrWithAuth(method, url, false, onMessageInfoFetched);
    }

    function getContent(messageId, attachId, filename) {
    
        var method = "GET";
        var url = "https://www.googleapis.com/gmail/v1/users/" + window.email + "/messages/" + messageId + "/attachments/" + attachId;
        console.log(url);
        xhrWithAuth(method, url, false, onAttachmentInfoFetched, filename);
        
    }

    function getAttachments(response) {
        var messageId = response.id;
        var attachments = $.grep(response.payload.parts, function (e) {
            return e.filename !== "";
        });

        attachments.forEach(function (attachment) {

            var attachmentId = attachment.body.attachmentId;

            getContent(messageId, attachmentId, attachment.filename);

        });

        showResponse("Files Sent");

    }

    function showResponse(content) {

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {result: content}, function (response) {

            });
        });

    }

    function xhrWithAuth(method, url, interactive, callback, filename) {
        
        console.log("xhrWithAuth");
        
        var access_token;

        var retry = true;

        getToken();

        function getToken() {
            chrome.identity.getAuthToken({interactive: interactive}, function (token) {

                console.log(token);

                if (chrome.runtime.lastError && callback !== undefined) {
                    callback(chrome.runtime.lastError);
                    return;
                }

                access_token = token;
                requestStart();
            });
        }

        function requestStart() {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
            xhr.onload = requestComplete;
            xhr.send();
            return xhr;
        }

        function requestComplete() {
            if (this.status == 401 && retry) {
                retry = false;
                chrome.identity.removeCachedAuthToken({token: access_token}, getToken);
            } else {
                if(callback !== undefined)
                    callback(null, this.status, this.response, filename);
            }
        }
    }

    function onMessageInfoFetched(error, status, response) {
        if (!error && status == 200) {
            console.log(response);
            getAttachments(JSON.parse(response));
        } else {

        }
    }
    
    function onAttachmentInfoFetched(error, status, response, filename) {
        if (!error && status == 200) {
            console.log(response);
            console.log(window.email);
            soapRequest(filename, JSON.parse(response).data, window.email);
        } else {

        }
    }

})();