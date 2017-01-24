function soapRequest(filename, content, email) {

    var data = JSON.stringify({content: content, filename: filename, email: email});

    /*
     
     chrome.storage.sync.get('error', function (obj) {
     
     var fileObj = {filename: filename, timestamp: (new Date()).toString()};
     
     if (Object.keys(obj).length === 0 && obj.constructor === Object) {
     console.log("fresh");
     obj.error = [fileObj];
     }
     else {
     obj.error.push(fileObj);
     }
     
     chrome.storage.sync.set(obj, function () {
     // Notify that we saved.
     console.log('Error saved');
     
     });
     
     });
     
     return;
     
     */

    function doInCurrentTab(tabCallback) {
        debugger;
        chrome.tabs.query(
                {currentWindow: true, active: true},
        function (tabs) {
            tabCallback(tabs[0]);
        }
        );
    }



    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();

        if ("withCredentials" in xhr) {
            xhr.open(method, url, false);
        }
        else if (typeof XDomainRequest != "undefined") {
            //alert 
            xhr = new XDomainRequest();
            xhr.open(method, url);
        }
        else {
            console.log("CORS not supported");
            alert("CORS not supported");
            xhr = null;
        }

        return xhr;
    }

    var xhr = createCORSRequest("POST", "https://glo-new-staging.globallogic.com/a40d6b8cbea3754bab60a51a6e72b35329df399z/gloapis/email/candidates/parse");

    if (!xhr) {
        console.log("XHR issue");
        return;
    }

    xhr.onload = function () {
        var results = xhr.responseText;
        console.log(results);
        results = JSON.parse(results);
        
        var wait = Math.floor(Math.random() * 10) + 1;

        if (Number(xhr.status) !== 200) {

            setTimeout(
                    errorMessage.bind(null, filename),
                    wait*1000);

        }
        else {

            setTimeout(
                    successMessage.bind(null, filename),
                    wait*1000);


        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.send(data);

    function errorMessage(filename) {
        chrome.browserAction.getBadgeText({}, function (r) {
            chrome.browserAction.setBadgeText({text: String(Number(r) + 1)});
        });
        chrome.browserAction.setBadgeBackgroundColor({color: "red"});

        chrome.storage.sync.get('error', function (obj) {
            // Notify that we saved.

            var fileObj = {filename: filename, timestamp: (new Date()).toString()};

            if (Object.keys(obj).length === 0 && obj.constructor === Object) {
                obj.error = [fileObj];
            }
            else {
                obj.error.push(fileObj);
            }

            console.log(obj);

            chrome.storage.sync.set(obj, function () {
                // Notify that we saved.
                console.log('Error saved');

            });

        });
    }

    function successMessage(filename) {
        chrome.storage.sync.get('success', function (obj) {
            // Notify that we saved.
            console.log(obj.success);

            var fileObj = {filename: filename, timestamp: (new Date()).toString()};

            if (Object.keys(obj).length === 0 && obj.constructor === Object) {
                obj.success = [fileObj];
            }
            else {
                obj.success.push(fileObj);
            }

            console.log(obj);

            chrome.storage.sync.set(obj, function () {
                // Notify that we saved.
                console.log('Success saved');

            });

        });
    }

}





/*
 chrome.storage.sync.get('error', function (obj) {
 obj.error = [];
 chrome.storage.sync.set(obj, function () {
 
 });
 });
 
 chrome.storage.sync.get('success', function (obj) {
 obj.success = [];
 chrome.storage.sync.set(obj, function () {
 
 });
 });
 
 
 
 
 chrome.storage.sync.get('error', function (obj) {
 console.log(obj)
 });
 
 chrome.storage.sync.get('success', function (obj) {
 console.log(obj)
 });
 */

