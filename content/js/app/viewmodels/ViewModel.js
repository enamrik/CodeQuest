define(['server', 'ko', 'jquery'], function (server, ko, $) {
    var ViewModel = function () {
        var self = this;

        self.inProgress = ko.observable(false);

        self.get = function () {
            callServer.apply(self, addServerMethodArg(arguments, 'get'));
        };

        self.post = function () {
            callServer.apply(self, addServerMethodArg(arguments, 'post'));
        };

        self.scrollToPageTop = function() {
            if (hasScrollBar()) {
                $("html, body").scrollTop();
            }
        };

        self.PageTitle = function(pageTitle) {
            $("title").text(pageTitle);
        };

        function callServer(method, url, data, doneCallback, failCallback) {
            self.inProgress(true);
            server[method](url, data)
                .done(function () {
                    self.inProgress(false);
                    doneCallback.apply(this, arguments);
                })
                .fail(function() {
                   self.inProgress(false);
                   if (failCallback) {
                        failCallback.apply(this, arguments);
                   }
                });
        }

        function addServerMethodArg(args, method) {
            var array = Array.prototype.slice.call(args);
            array.unshift(method);
            return array;
        }

        function hasScrollBar () {
            return $('body').height() > $(window).height();
        }
    };
    return ViewModel;
});