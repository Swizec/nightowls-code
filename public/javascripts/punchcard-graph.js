
var minvalx = 0, maxvalx = 23,
    minvaly = 0, maxvaly = 6,
    sampsize = punchcard_data.length;

var w = 800,
    h = 500,
    p = 80,
    x = d3.scale.linear().domain([0, maxvalx]).range([0, w]),
    y = d3.scale.linear().domain([0, maxvaly]).range([h, 0]);

var vis = d3
        .select("#punchcard")
        .data(punchcard_data)
        .enter().append("svg:svg")
        .attr("width", w+p*2)
        .attr("height", h+p*2)
        .append("svg:g")
        .attr("transform", "translate("+p+","+p+")");

var rules = vis
        .selectAll("g.rule")
        .data(x.ticks(1))
        .enter().append("svg:g")
        .attr("class", "rule");

rules.append("svg:line")
    .attr("x1", x).attr("x2", x)
    .attr("y1", 0).attr("y2", h-1);

rules.append("svg:line")
    .attr("class", function (d) { return d ? null : "axis"; })
    .data(y.ticks(1))
    .attr("y1", y).attr("y2", y)
    .attr("x1", 0)
    .attr("x2", w-10);

vis.selectAll("circle.line")
    .data(punchcard_data)
    .enter().append("svg:circle")
    .attr("class", "line")
    .attr("fill", "#000")
    .attr("cx", function (d) { return d[1]; })
    .attr("cy", function (d) { return d[0]; })
    .attr("r", function (d) { return Math.sqrt(d[2] / Math.PI); });
