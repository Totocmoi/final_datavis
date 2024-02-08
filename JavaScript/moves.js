var margin = { top: 0, right: 20, bottom: 0, left: 50 },
  width =
    document.getElementById("moves_chart").offsetWidth -
    margin.left -
    margin.right,
  height = 600;
d3.csv("../datasets/cloud.csv", function(error, alldata) {
  if (error) throw error;

  var range = d3.select("#rangeInput");
  var output = document.getElementById("affDate");
  var svg = d3.select("#moves_chart").append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom);

  range.on("change", function() {
    var index = range.node().value;
    output.innerHTML = Object.keys(alldata[0])[index];

    svg.selectAll("text").remove();
    var data = alldata.map(function(d) {
      return {
        text: d[Object.keys(d)[0]],
        size: +d[Object.keys(d)[index]]
      };
    });

    var fontSize = d3.scaleLinear()
      .domain([
        0,
        d3.max(data, function(d) { return +d.size; })
      ])
      .range([10, 60]);

    d3.layout.cloud().size([width, height])
      .words(data)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return fontSize(d.size); })
      .on("end", draw)
      .start();

    function draw(words) {
      svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
  });
});