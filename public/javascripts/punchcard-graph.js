
var w = 600,
    h = 300,
    pad = 20,
    max_r = _.max(_.map(punchcard_data,
                      function (d) { return d[2]; }));

var x = d3.scale.linear().domain([0, 23]).range([pad, w-pad]),
    y = d3.scale.linear().domain([0, 6]).range([pad, h-pad]),
    r = d3.scale.linear()
        .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
        .range([0, 8]);

var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

svg.selectAll("circle")
    .data(punchcard_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d[1]); })
    .attr("cy", function (d) { return y(d[0]); })
    .attr("r", function (d) { return r(d[2]); });

/*svg.selectAll("text")
    .data(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    .enter()
    .append("text")
    .text(*/


