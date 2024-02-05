
d3.csv("../datasets/main-chart.csv").then(function(data) {

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.name; }))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d['2024-01']; })])
        .nice()
        .range([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.name) + x.bandwidth() / 2; })
        .y(function(d) { return y(+d['2024-01']); });

    var svg = d3.select("#main_chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
});