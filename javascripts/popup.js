var resumeParser = {
    /*
     getSuccess: function () {
     var success = [];
     console.log("success");
     chrome.storage.sync.get('success', function (obj) {
     console.log(obj);
     success = obj.success;
     });
     
     return success;
     },
     getError: function () {
     var error = [];
     console.log("error");
     chrome.storage.sync.get('error', function (obj) {
     console.log(obj);
     success = obj.error;
     });
     
     return error;
     },
     */
    renderSuccess: function () {
        $("#success ul").html("");

        chrome.storage.sync.get('success', function (obj) {
            //console.log(obj);
            obj.success.forEach(function (e) {
                var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                $("#success").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
            });
        });

    },
    renderError: function () {
        $("#error ul").html("");

        chrome.storage.sync.get('error', function (obj) {
            //console.log(obj);
            obj.error.forEach(function (e) {
                var date = moment(new Date(e.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                $("#error").append('<div class="row"><div class="col-xs-6">'+e.filename+'</div><div class="col-xs-6">'+date+'</div></div>');
            });
        });

    }
}

$(function () {
/*
    $("#accordion").accordion({
        collapsible: true
    });
    
    */

    resumeParser.renderSuccess();
    resumeParser.renderError();



});

/*
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
 */

window.onload = function () {
    /*
     chrome.storage.onChanged.addListener(function (changes, namespace) {
     console.log("changed");
     for (key in changes) {
     console.log(key);
     console.log(changes[key]);
     }
     });
     */
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

