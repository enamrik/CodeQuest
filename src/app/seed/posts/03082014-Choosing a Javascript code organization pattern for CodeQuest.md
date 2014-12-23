Picking a javascript OO pattern took a bit of exploring but I think I've picked a pattern I can live with, for now anyways.


    define(['ko', 'viewmodels/ViewModel', 'models/Refresher'],
    function (ko, ViewModel, Refresher) {
        var StayFresh = function () {
            var self = this;

            //call base class
            ViewModel.call(self);

            //private field
            var postUrl = '/next';

            //public property
            self.Refresher(new Refresher(data));

            //public method
            self.next = function () {
                self.get(postUrl, {}, function (data) {
                    self.Refresher(new Refresher(data));
                    self.scrollToPageTop();
                });
            };

            //private function
            function doStuff(){
            }
        };
        return StayFresh;
    });

This is a combination of knockoutjs, requirejs and plain old javascript. CodeQuest has actually been build with this pattern. I picked this pattern for a few reasons. First off, I am fully aware that by not taking advantage of javascript's prototype system, I'm taking a loss in performance. The reality is, for my site, which isn't a full SPA, that's never going to be a problem. And even if it were an SPA, based on the performance test results I see around the web, I'd have to be writing really inefficient client-side code before I started feeling the pain of not leveraging the prototype chain. In case you're wondering, this is the Functional pattern. Now I know I could have settled for the Module pattern, avoid the **new** keyword and embrace just how different javascript is from class-based languages. I guess I just didn't want to. I love pretending that when I type

    var StayFresh = function(){}

I'm actually defining a class. And that when I type

    self.next = function(){}

inside the body of my constructor function, I'm actually defining a public method. I loved the fact that it's all happening inside my constructor function; it feels very organized. I do love new experiences so maybe down the road you might see an update to this post with a link pointing to a more recent post where I take a dump on the Functional pattern. Who knows...