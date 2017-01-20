//oauth2 auth

/*
chrome.identity.getAuthToken(
        {'interactive': true},
function (token) {
    console.log(token);
}
);
*/

window.gapi_onload = function () {

    gapi.auth.authorize({
        client_id: '86466949238-53h1gupka81d97i2e8u2qd5f2dbu43gr.apps.googleusercontent.com',
        immediate: true,
        scope: 'https://www.googleapis.com/auth/gmail.modify'
    },
    handleAuthResult);


    //handleAuthResult(true);
}

function handleAuthResult(authResult) {
    if (authResult && authResult.error) {
        gapi.auth.authorize({
            client_id: '86466949238-53h1gupka81d97i2e8u2qd5f2dbu43gr.apps.googleusercontent.com',
            immediate: false,
            scope: 'https://www.googleapis.com/auth/gmail.modify'
        },
        handleAuthResult);
    }
    else {
        console.log(authResult);
        gapi.client.load('gmail', 'v1', function () {
        });
    }
    return false;
}

/*
 function gmailAPILoaded(){
 //do stuff here
 console.log("gmailAPILoaded");	
 
 console.log(gapi.client.gmail);
 
 gmailClient = gapi.client.gmail;
 }
 */

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

    getMessage(request.messageId, request.timestamp, request.email);

    //sendResponse({result: result});

    //sendResponse({result: request.messageID});

    //return true;  

});

function getMessage(messageId, timestamp, email) {

    window.email = email;

    gapi.client.load('gmail', 'v1', function () {
        var request = gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageId
        });

        return request.execute(getAttachments);
    });

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

function getContent(messageId, attachId, filename) {
    var request = gapi.client.gmail.users.messages.attachments.get({
        'id': attachId,
        'messageId': messageId,
        'userId': 'me'
    });
    request.execute(function (attachment) {

        soapRequest(filename, attachment.data, window.email);

    });
}

function showResponse(content) {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {result: content}, function (response) {

        });
    });

}