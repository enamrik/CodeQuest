define(['ko', 'ViewModel', 'jquery'], function (ko, ViewModel) {
    var CSharpConsole = function () {
        var self = this;
        ViewModel.call(self);

        self.sourceCode = ko.observable();
        self.output = ko.observable();

        self.initialize = function () {
            self.PageTitle("C# Console");
        };

        self.compile = function () {
            self.post('/console/run', { code: self.sourceCode() },
                function (output) {
                    self.output(output.executionOutput);
                });
        };
    };

    return CSharpConsole;
});