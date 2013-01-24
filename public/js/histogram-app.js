
(function () {

    var NavView = Backbone.View.extend({
        model: new Backbone.Model(),

        events: {
            "click a": "clicked"
        },

        initialize: function () {
            this.model.bind('change', _.bind(this.render, this));
        },

        render: function () {
            this.$el.find('.active').removeClass('active');
            this.$el.find('[data-type='+this.model.get('state')+']').addClass('active');
        },

        clicked: function (event) {
            event.preventDefault();

            this.options.router.navigate("/"+$(event.currentTarget).attr('data-type'),
                                         {trigger: true});
        }
    });

    var App = Backbone.Router.extend({
        
        routes: {
            hours: 'hours',
            days: 'days',
            weekends: 'weekends',
            noweekends: 'noweekends'
        },

        initialize: function () {
            this.graph = new GraphView();
            this.nav = new NavView({el: $('#graph-nav'),
                                    router: this});
        },

        hours: function () {
            this.graph.render('hours');
            this.nav.model.set({state: 'hours'});
        },

        days: function () {
            this.graph.render('days');
            this.nav.model.set({state: 'days'});
        },

        weekends: function () {
            this.graph.render('weekends');
            this.nav.model.set({state: 'weekends'});
        },

        noweekends: function () {
            this.graph.render('noweekends');
            this.nav.model.set({state: 'noweekends'});
        }
    });

    var app = new App();
    Backbone.history.start({pushState: true, root: '/histogram/'});

})();
