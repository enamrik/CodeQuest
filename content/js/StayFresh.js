require.ensure(['knockout', './ViewModel', './models/Refresher'],
    function (ko, ViewModel, Refresher) {
        var StayFresh = function () {
            var self = this;
            ViewModel.call(self);

            self.Refresher = ko.observable();

            self.initialize = function (data) {
                loadRefresher(data);
            };

            self.next = function () {
                self.get('/learn/next', {}, function (data) {
                    loadRefresher(data);
                    self.scrollToPageTop();
                });
            };

            function loadRefresher(data) {
                self.Refresher(new Refresher(data));
                self.PageTitle(self.Refresher().Title());
            }
        };

        module.exports = StayFresh;
    });
