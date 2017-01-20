Promise.all([
    InboxSDK.load('1.0', 'sdk_gl_resume_parse_10bfc55d53')
])
        .then(function (results) {
            var service = analytics.getService('resume_parser_app');
            console.log(service);
            var tracker = service.getTracker('UA-90195501-1');
            console.log(tracker);
            var sdk = results[0];

            var email = sdk.User.getEmailAddress();

            console.log(email);

            var registerHandler = function () {
                sdk.Conversations.registerMessageViewHandler(messageViewHandler);
            };

            var messageViewHandler = function (messageView) {
                if (messageView.isLoaded()) {
                    // Add CustomAttachmentsToolbarButton to the given message view.

                    threadView = messageView.getThreadView();
                    console.log(threadView.getSubject());

                    //if (threadView.getSubject().match(/resume|cv|curriculum|vitae/i)) {
                    addCustomAttachmentsToolbarButton(messageView);
                    // Send to Analytics that the Button has been loaded
                    tracker.sendAppView('ButtonView');
                    //}
                }
            };

            var addCustomAttachmentsToolbarButton = function (messageView) {
                var options = {
                    tooltip: chrome.i18n.getMessage('tooltip'),
                    iconUrl: chrome.runtime.getURL('images/parse.png'),
                    onClick: handleAttachmentsButtonClick
                };

                messageView.addAttachmentsToolbarButton(options);
            };

            var handleAttachmentsButtonClick = function (event) {
                //var downloadUrls = [];

                // Send to Analytics that the Button has been clicked
                tracker.sendEvent('Button', 'ParseAllAttachments', 'Init');
                // Iterate over attachmentCardViews array to get URL's.

                var messageId = event.attachmentCardViews[0].getMessageView().getMessageID();

                getMessage(messageId);

            }

            function getMessage(messageId) {
                chrome.runtime.sendMessage({messageId: messageId, email: email, timestamp: Number(new Date())}, function (response) {
                    //console.log(response);
                });
            }


            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

                console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");

                console.log(request);
                
                sdk.Widgets.showModalView({el: '<p>'+request.result+'</p>'});

            });

            // Run.
            registerHandler();
        });
