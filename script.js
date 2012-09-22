
var swizec = new Gh3.User("swizec");
var repos = new Gh3.Repositories(swizec);

repos.fetch({page: 1, per_page: 500, direction: "desc"},
            function () {
                console.log("hello");
            });
