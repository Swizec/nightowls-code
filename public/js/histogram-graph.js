
GraphView = Backbone.View.extend({

    width: 940,
    height: 300,
    pad: 20,
    x_pad: 100,

    initialize: function () {
        this.svg = d3.select("#histogram")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.x = d3.scale.ordinal().rangeRoundBands([this.x_pad, this.width-this.pad], 0.1); 
        this.y = d3.scale.linear().range([this.height-this.pad, this.pad]);

        this.yAxis = d3.svg.axis().scale(this.y).orient("left");
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
    },

    render: function (type) { 
        var draw = function () {
            this.svg.append("text")
                .attr("class", "loading")
                .text("Loading ...")
                .attr("x", _.bind(function () { return this.width/2; }, this))
                .attr("y", _.bind(function () { return this.height/2-5; }, this));
            
            
            this.xAxis.tickFormat({hours: this.hoursTickFormat,
                                   days: this.daysTickFormat}[type]);
            
            this.drawGraph('/data/histogram-'+type+'.json');
        };

        if (this.graph_drawn) {
            this.clear(_.bind(draw, this));
        }else{
            _.bind(draw, this)();
        }        
    },

    hoursTickFormat: function (d, i) {
        var m = (d > 12) ? "p" : "a";
        return (d%12 == 0) ? 12+m :  d%12+m;
    },

    daysTickFormat: function (d, i) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
    },

    drawGraph: function (url) {
        var svg = this.svg,
            x = this.x,
            y = this.y,
            x_pad = this.x_pad,
            pad = this.pad,
            h = this.height,
            w = this.width;
            
        
        d3.json(url, _.bind(function (histogram_data) {
            var data = _.map(_.keys(histogram_data),
                             function (key) {
                                 return {bucket: parseInt(key, 10),
                                         count: histogram_data[key]};
                             });

            x.domain(data.map(function (d) { return d.bucket; }));
            y.domain([0, d3.max(data, function (d) { return d.count; })]);
            
            svg.selectAll(".loading").remove();
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+(x_pad-pad)+", 0)")
                .call(this.yAxis);
            
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0, "+(h-pad)+")")
                .call(this.xAxis);
            
            svg.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', function (d) { return x(d.bucket); })
                .attr('width', x.rangeBand())
                .attr('y', h-pad)
                .transition()
                .delay(function (d) { return d.bucket*20; })
                .duration(800)
                .attr('y', function (d) { return y(d.count); })
                .attr('height', function (d) { return h-pad - y(d.count); });

            this.graph_drawn = true;
            
        }, this));
    },

    clear: function (callback) {
        var svg = this.svg,
            h = this.height,
            pad = this.pad;

        svg.selectAll('.axis').remove();

        svg.selectAll('rect')
            .remove()
            .call(callback);
    }

});
