var resumeParser = {
    renderSuccess: function () {
        chrome.storage.sync.get('success', function (obj) {
            //console.log(obj);
            var content = "";
            if (obj.success === undefined)
                return false;
            obj.success.forEach(function (e) {
                var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                //$("#success").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
                content += '<div class="row"><div class="col-xs-6">' + e.filename + '</div><div class="col-xs-6">' + date + '</div></div>';
            });
            $("#success").html(content);
        });

    },
    renderError: function () {
        chrome.storage.sync.get('error', function (obj) {
            //console.log(obj);
            var content = "";
            if (obj.error === undefined)
                return false;
            obj.error.forEach(function (e) {
                var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                //$("#error").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
                content += '<div class="row"><div class="col-xs-6">' + e.filename + '</div><div class="col-xs-6">' + date + '</div></div>';
            });
            $("#error").html(content);
        });

    },
    renderAll: function () {
        chrome.storage.sync.get(['success', 'error', 'progress'], function (obj) {
            //console.log(obj);
            var content = "";

            if (obj.progress !== undefined)
                obj.progress.forEach(function (e) {
                    var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                    //$("#success").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
                    content += '<tr><td>' + e.filename + '</td><td>' + date + '</td><td>In Progress</td></tr>';
                });

            if (obj.error !== undefined)
                obj.error.forEach(function (e) {
                    var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                    //$("#success").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
                    content += '<tr><td>' + e.filename + '</td><td>' + date + '</td><td>Error</td></tr>';
                });

            if (obj.success !== undefined)
                obj.success.forEach(function (e) {
                    var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                    //$("#success").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
                    content += '<tr><td>' + e.filename + '</td><td>' + date + '</td><td>Success</td></tr>';
                });

            $("#statusContent").html(content);

            if ($("#statusContent").html().length === 0)
                $("#statusContent").html("<tr><td colspan='3'>No data found</td></tr>");

        });
    },
    
    clearData: function () {

        chrome.storage.sync.get('error', function (obj) {
            obj.error = [];
            chrome.storage.sync.set(obj, function () {
                resumeParser.renderAll();
            });
        });

        chrome.storage.sync.get('success', function (obj) {
            obj.success = [];
            chrome.storage.sync.set(obj, function () {
                resumeParser.renderAll();
            });
        });

        chrome.storage.sync.get('progress', function (obj) {
            obj.progress = [];
            chrome.storage.sync.set(obj, function () {
                resumeParser.renderAll();
            });
        });

    }

}

var Base64 = {_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }}

function formBinding(host_and_key) {

    $(document).on('click', "a#logout", function () {
        chrome.storage.sync.get('token', function (obj) {

            if (obj.token) {

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

                var xhr = createCORSRequest("GET", host_and_key + obj.token + "/gloapis/logout");

                xhr.onload = function () {
                    var results = xhr.responseText;
                    console.log(results);
                    results = JSON.parse(results);

                    if (Number(xhr.status) === 200) {

                        chrome.storage.sync.set({token: ""}, function () {
                            // Notify that we saved.
                            console.log('Token cleared');
                            loadLoginPage();

                        });

                    }
                    else {

                        console.log("Logout failed");

                    }


                }

                xhr.setRequestHeader('Accept', 'application/json');

                xhr.send("");

            }
            else {

                loadLoginPage();

            }

        });
    });

    $(document).on('click', "a#continue", function () {
        loadWidgets();
    });

    $(document).on('keyup', ".loginmodal-container input:text, .loginmodal-container input:password", function () {
        $("p#errorMessage").hide();
    });

    $(document).on('click', "#sign_in", function () {

        var $button = $(this);

        $button.button("loading");

        if ($("input[name='login']").val() && $("input[name='password']").val()) {
            var login = $("input[name='login']").val();
            var password = $("input[name='password']").val();

            console.log("entered");

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

            var xhr = createCORSRequest("POST", host_and_key + "gloapis/login");

            xhr.onload = function () {
                var results = xhr.responseText;
                console.log(results);
                results = JSON.parse(results);

                $button.button("reset");

                if (Number(xhr.status) === 200) {


                    chrome.storage.sync.set({token: results.app_token}, function () {
                        // Notify that we saved.
                        console.log('Token saved');

                        loadSuccessPage();

                    });


                }
                else {
                    console.log("Auth failed");
                    $("p#errorMessage").show();
                }


            }

            xhr.setRequestHeader('Authorization', Base64.encode(login + ":" + password));
            xhr.setRequestHeader('Accept', 'application/json');

            var data = JSON.stringify({clicknsource: "true"});

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(data);

        }

    });
}

function loadWidgets() {
    console.log("Loading Widgets");
    $("#content").load("table.html div.files-table", function () {
        //resumeParser.renderSuccess();
        //resumeParser.renderError();
        resumeParser.renderAll();
        $("div.logout-container").removeClass("hidden");
        $("a#clearData").removeClass("hidden");
    });
}

function loadSuccessPage() {
    $("#content").load("success.html div#loginSuccess", function () {

    });
}

function loadLoginPage() {
    $("#content").load("login.html div", function () {
        $("div.logout-container").addClass("hidden");
    });
}



$(function () {

    chrome.management.getSelf(function (r) {
        var url;
        if (r.installType === "development") {
            url = "http://localhost:3000/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
        } else if (r.installType === "normal") {
            url = "https://gloapis.globallogic.com/a40d6b8cbea3754bab60a51a6e72b35329df399z/";
        }

        formBinding(url);
    });

    chrome.storage.sync.get('token', function (obj) {
        if (!obj.token) {
            loadLoginPage();
        }
        else {
            loadWidgets();
        }
    });

});

window.onload = function () {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        console.log("changed");
        for (key in changes) {
            console.log(key);
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                    'Old value was "%s", new value is "%s".',
                    key,
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);

            if (key === 'error')
                resumeParser.renderError();
            else if (key === 'success')
                resumeParser.renderSuccess();
        }
    });
}

function clearToken() {
    chrome.storage.sync.set({token: ""}, function () {
        // Notify that we saved.
        console.log('Token cleared');

    });
}

$(function () {
    $("a.new-window").click(function () {
        var w = 500;
        var h = 500;
        chrome.windows.create({'url': 'popup.html', 'type': 'popup', 'width': w, 'height': h}, function (window) {
        });
    });

    chrome.windows.getCurrent(function (c) {
        if (c.type === "popup")
            $("a.new-window").hide();
    });
    
    $(document).on("click", "#clearData", function(){
        resumeParser.clearData();
    });
});