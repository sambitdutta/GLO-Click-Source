function gloRequest(filename, content, email, token) {

    var data = JSON.stringify({content: content, filename: filename, email: email});

    chrome.management.getSelf(function (r) {
        var url;
        
        console.log(r);
        
        if (r.installType === "development") {
            url = "http://localhost:3000/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
        } else if (r.installType === "normal") {
            url = "https://glo-new-staging.globallogic.com/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
        }

        sendRequest(url, data);
    });

    function sendRequest(host_and_key, data) {
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

        var xhr = createCORSRequest("POST", host_and_key + token + "/gloapis/chrome/candidates/parse");

        if (!xhr) {
            console.log("XHR issue");
            return;
        }

        xhr.onload = function () {
            var results = xhr.responseText;
            console.log(results);
            results = JSON.parse(results);

            var options = [3, 6, 9, 12, 15, 18, 21];
            var wait1 = options[Math.floor(Math.random() * options.length)];
            
            var wait2 = parseInt(Math.random()*10);

            if (Number(xhr.status) !== 200) {

                setTimeout(
                        errorMessage.bind(null, filename),
                        wait1 * wait2 * 1000);

            }
            else {

                setTimeout(
                        successMessage.bind(null, filename),
                        wait1 * wait2 * 1000);

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



}

function clearData() {
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

