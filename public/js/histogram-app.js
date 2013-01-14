
(function () {

    var App = Backbone.Router.extend({
        
        routes: {
            hours: 'hours',
            days: 'days'
        },

        initialize: function () {
            this.view = new GraphView();
        },

        hours: function () {
            this.view.render('hours');
        },

        days: function () {
            this.view.render('days');
        }
    });

    var app = new App();
    Backbone.history.start({pushState: true, root: '/histogram/'});

})();
