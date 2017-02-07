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

    }
}

function formBinding() {
    $(document).on('click', "#sign_in", function () {

        console.log("yessssssss");

        $(this).button("loading");

        if ($("input[name='login']").val() && $("input[name='password']").val()) {
            var login = $("input[name='login']").val();
            var password = $("input[name='password']").val();

            console.log("entered");

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

            var xhr = createCORSRequest("POST", "http://localhost:3000/a40d6b8cbea3754bab60a51a6e72b35329df399z/gloapis/login");

            xhr.onload = function () {
                var results = xhr.responseText;
                console.log(results);
                results = JSON.parse(results);

                chrome.storage.sync.set({token: results.app_token}, function () {
                    // Notify that we saved.
                    console.log('Token saved');

                });

                $(this).button("reset");

                if (Number(xhr.status) === 200) {
                    loadWidgets();
                }
                else {

                }


            }

            xhr.setRequestHeader('Authorization', Base64.encode(login + ":" + password));
            xhr.setRequestHeader('Accept', 'application/json');

            xhr.send("");



        }
    });
}

function loadWidgets() {
    console.log("Loading Widgets");
    $("#content").load("widgets.html div#accordion", function () {
        resumeParser.renderSuccess();
        resumeParser.renderError();
    })
}



$(function () {

    formBinding();

    chrome.storage.sync.get('token', function (obj) {
        if (!obj.token) {
            $("#content").load("login.html div", function () {

            });
        }
        else {
            loadWidgets();
        }
    })



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