
var bucket = {w: 30, h: 30},
    max = _.max(_.map(punchcard_data,
                      function (d) { return d[2]; }));

console.log(max);

var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", bucket.w*(24+2))
        .attr("height", bucket.h*(7+2));

svg.selectAll("circle")
    .data(punchcard_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return d[1]*bucket.w+bucket.w; })
    .attr("cy", function (d) { return d[0]*bucket.h+bucket.h; })
    .attr("r", function (d) { return Math.floor(d[2]/max*(bucket.w/3)); });


