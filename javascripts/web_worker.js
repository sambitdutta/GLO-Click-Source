var getContent = function (messageId, attachId, filename, email) {
    console.log("__getContent__");
    var method = "GET";
    var url = "https://www.googleapis.com/gmail/v1/users/" + email + "/messages/" + messageId + "/attachments/" + attachId;
    console.log(url);
    xhrWithAuth(method, url, false, onAttachmentInfoFetched, filename);
}

onmessage = function(e){
    getContent(e.data.messageId, e.data.attachmentId, e.data.filename, e.data.email);
}