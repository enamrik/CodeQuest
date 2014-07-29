define(['knockout', 'jquery', './util/inheritsFrom', './util/server'], function(ko, $, inheritsFrom, server){

    function RootView(){ }

    RootView.start = function (func){
        inheritsFrom(func, RootView);
        var f = new func();
        f.init();
    };

    RootView.prototype.init = function(){
        this.configure(CodeQuest.data);

        $("title").text(this.pageTitle ? this.pageTitle : "CodeQuest");

        ko.applyBindings(this, $("#Header").get(0));
        ko.applyBindings(this, $("#Content").get(0));
        ko.applyBindings(this, $("#Footer").get(0));
    };

    RootView.prototype.inProgress = ko.observable(false);

    RootView.prototype.get = function () {
        this._callServer.apply(this, this.addServerMethodArg(arguments, 'get'));
    };

    RootView.prototype.post = function () {
        this._callServer.apply(this, this.addServerMethodArg(arguments, 'post'));
    };

    RootView.prototype.scrollToPageTop = function() {
        if (this.hasScrollBar()) {
            $("html, body").scrollTop();
        }
    };

    RootView.prototype._callServer = function (method, url, data, doneCallback, failCallback) {
        var self = this;

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

    RootView.prototype.addServerMethodArg = function(args, method) {
        var array = Array.prototype.slice.call(args);
        array.unshift(method);
        return array;
    }

    RootView.prototype.hasScrollBar = function() {
        return $('body').height() > $(window).height();
    }

    module.exports = RootView;
});

