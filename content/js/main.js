requirejs.config({
    baseUrl: '/static/js/lib',
    urlArgs:'v=1',
    paths: {
        models: '../app/models',
        viewmodels: '../app/viewmodels',
        ko: "knockout"
    }
});

(function () {
    if (!window.pageRequire) {
        window.pageRequire = {
            modules: [],
            callback: function () { return {}; }
        };
    }

    var modules = _.union(window.pageRequire.modules, ['ko', 'jquery']);

    require(modules, function () {
        var $ = arguments[modules.indexOf('jquery')];
        var ko = arguments[modules.indexOf('ko')];

        var viewModel = window.pageRequire.callback.apply(this, arguments);
        if (!$("title").text()) { $("title").text("CodeQuest"); }
        ko.applyBindings(viewModel, $("#Content").get(0));

        ko.applyBindings({
            isSelected: function (pageName) {
                var allowedNames = Array.isArray(pageName) ? pageName : [pageName];
                return allowedNames.indexOf(window.location.pathname.split('/')[1]) != -1;
            }
        }, $("#Header").get(0));

        ko.applyBindings({}, $("#Footer").get(0));
    });
}());
