window.busy = false;

function gloRequest(filename, content, email, token) {

    var data = JSON.stringify({content: content, filename: filename, email: email});

    var progressObj = {filename: filename, id: Number(new Date()), timestamp: (new Date()).toString()};

    if (window.busy === true) {
        console.log("BUSY - setting timeout");
        setTimeout(processRequest, parseInt(Math.random()*10000));
    }
    else {
        processRequest();
    }

    function processRequest() {

        window.busy = true;

        chrome.storage.sync.get('progress', function (obj) {
            // Notify that we saved.
            if (Object.keys(obj).length === 0 && obj.constructor === Object) {
                obj.progress = [progressObj];
            }
            else {
                obj.progress.push(progressObj);
            }

            console.log(obj);

            chrome.storage.sync.set(obj, function () {
                // Notify that we saved.
                console.log('Progress saved');

                chrome.management.getSelf(function (r) {
                    var url;

                    if (r.installType === "development") {
                        url = "http://localhost:3000/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
                    } else if (r.installType === "normal") {
                        url = "https://gloapis.globallogic.com/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
                    }

                    sendRequest(url, data, progressObj);
                });

                function sendRequest(host_and_key, data, progressObj) {

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

                        handleResponse(xhr, filename, results);
                    };

                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Accept', 'application/json');

                    xhr.send(data);

                    function handleResponse(xhr, filename, results) {
                        //var options = [3, 6, 9, 12, 15, 18, 21];
                        //var wait1 = options[Math.floor(Math.random() * options.length)];

                        //var wait2 = parseInt(Math.random() * 10);

                        console.log(xhr.status);
                        
                        if (Number(xhr.status) === 401)
                            clearToken();
                            

                        if (Number(xhr.status) !== 200) {

                            /*
                             if (window.busy === true) {
                             console.log("LOCKED - setting timeout");
                             setTimeout(
                             handleResponse.bind(null, xhr, filename, results),
                             2000);
                             }
                             else {
                             errorMessage(filename);
                             }
                             */

                            errorMessage(filename);


                        }
                        else {

                            /*
                             if (window.busy === true) {
                             console.log("LOCKED - setting timeout");
                             setTimeout(
                             handleResponse.bind(null, xhr, filename, results),
                             2000);
                             }
                             else {
                             successMessage(filename);
                             }
                             */
                            successMessage(filename);

                        }
                    }

                    function errorMessage(filename) {
                        
                        //window.busy = true;

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

                                chrome.storage.sync.get('progress', function (obj) {
                                    // Notify that we saved.

                                    obj.progress = obj.progress.filter(function (o) {
                                        return o.id !== progressObj.id;
                                    });

                                    chrome.storage.sync.set(obj, function () {
                                        // Notify that we saved.
                                        console.log('Progress cleared');

                                        window.busy = false;

                                    });

                                });

                            });

                        });
                    }

                    function successMessage(filename) {
                        
                        //window.busy = true;

                        chrome.storage.sync.get('success', function (obj) {
                            // Notify that we saved.

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

                                chrome.storage.sync.get('progress', function (obj) {
                                    // Notify that we saved.

                                    obj.progress = obj.progress.filter(function (o) {
                                        return o.id !== progressObj.id;
                                    });

                                    chrome.storage.sync.set(obj, function () {
                                        // Notify that we saved.
                                        console.log('Progress cleared');

                                        window.busy = false;

                                    });

                                });

                            });

                        });
                    }
                }


            });

        });
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

    chrome.storage.sync.get('progress', function (obj) {
        obj.progress = [];
        chrome.storage.sync.set(obj, function () {

        });
    });
}


function clearToken() {
    chrome.storage.sync.set({token: ""}, function () {
        // Notify that we saved.
        console.log('Token cleared');

    });
}