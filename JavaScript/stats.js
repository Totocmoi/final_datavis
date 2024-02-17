var fileNames = [
  "2014-11.csv",
  "2014-12.csv",
  "2015-01.csv",
  "2015-02.csv",
  "2015-03.csv",
  "2015-04.csv",
  "2015-05.csv",
  "2015-06.csv",
  "2015-07.csv",
  "2015-08.csv",
  "2015-09.csv",
  "2015-10.csv",
  "2015-11.csv",
  "2015-12.csv",
  "2016-01.csv",
  "2016-02.csv",
  "2016-03.csv",
  "2016-04.csv",
  "2016-05.csv",
  "2016-06.csv",
  "2016-07.csv",
  "2016-08.csv",
  "2016-09.csv",
  "2016-10.csv",
  "2016-11.csv",
  "2016-12.csv",
  "2017-01.csv",
  "2017-02.csv",
  "2017-03.csv",
  "2017-04.csv",
  "2017-05.csv",
  "2017-06.csv",
  "2017-07.csv",
  "2017-08.csv",
  "2017-09.csv",
  "2017-10.csv",
  "2017-11.csv",
  "2017-12.csv",
  "2018-01.csv",
  "2018-02.csv",
  "2018-03.csv",
  "2018-04.csv",
  "2018-05.csv",
  "2018-06.csv",
  "2018-07.csv",
  "2018-08.csv",
  "2018-09.csv",
  "2018-10.csv",
  "2018-11.csv",
  "2018-12.csv",
  "2019-01.csv",
  "2019-02.csv",
  "2019-03.csv",
  "2019-04.csv",
  "2019-05.csv",
  "2019-06.csv",
  "2019-07.csv",
  "2019-08.csv",
  "2019-09.csv",
  "2019-10.csv",
  "2019-11.csv",
  "2019-12.csv",
  "2020-01.csv",
  "2020-02.csv",
  "2020-03.csv",
  "2020-04.csv",
  "2020-05.csv",
  "2020-06-DLC1.csv",
  "2020-06.csv",
  "2020-07.csv",
  "2020-08.csv",
  "2020-09.csv",
  "2020-10-DLC2.csv",
  "2020-10.csv",
  "2020-11-H1.csv",
  "2020-11-H2.csv",
  "2020-11.csv",
  "2020-12-H1.csv",
  "2020-12-H2.csv",
  "2020-12.csv",
  "2021-01.csv",
  "2021-02.csv",
  "2021-03.csv",
  "2021-04.csv",
  "2021-05.csv",
  "2021-06.csv",
  "2021-07.csv",
  "2021-08.csv",
  "2021-09.csv",
  "2021-10.csv",
  "2021-11.csv",
  "2021-12.csv",
  "2022-01.csv",
  "2022-02.csv",
  "2022-03.csv",
  "2022-04.csv",
  "2022-05.csv",
  "2022-06.csv",
  "2022-07.csv",
  "2022-08.csv",
  "2022-09.csv",
  "2022-10.csv",
  "2022-11.csv",
  "2022-12.csv",
  "2023-01.csv",
  "2023-02.csv",
  "2023-03.csv",
  "2023-04.csv",
  "2023-05.csv",
  "2023-06.csv",
  "2023-07.csv",
  "2023-08.csv",
  "2023-09-DLC1.csv",
  "2023-09.csv",
  "2023-10.csv",
  "2023-11.csv",
  "2023-12-DLC2.csv",
  "2023-12.csv",
  "2024-01.csv",
];

var range = d3.select("#rangeInput");
var output = document.getElementById("affDate");
var width = document.getElementById("chart").offsetWidth;
var height = 300;
var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

range.on("change", function () {
  svg.selectAll("*").remove();

  var index = +range.node().value;
  output.textContent = fileNames[index].replace(".csv", "");

  d3.csv("../datasets/violin/" + fileNames[index], function (error, data) {
    if (error) throw error;
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var index = +range.node().value;

    var attributes = [
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ];

    var xScale = d3
      .scaleBand()
      .domain(attributes)
      .range([0, innerWidth])
      .padding(0.1);

    var yScale = d3.scaleLinear().range([innerHeight, 0]).domain([0, 255]);

    var innerScale = d3
      .scaleLinear()
      .range([0, xScale.bandwidth()])
      .domain([0, 120]);

    attributes.forEach(function (attribute, index) {
      svg
        .selectAll(".bar" + index)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar" + index)
        .attr("x", function (d) {
          console.log(xScale(attribute))
          return xScale(attribute) +xScale.bandwidth()/2- innerScale(d[attribute]);
        })
        .attr("y", function (d) {
          return yScale(d[""]);
        })
        .attr("width", function (d) {
          return 2 * innerScale(d[attribute]);
        })
        .attr("height", 1)
        .attr("fill", "steelblue");
    });

    svg
      .append("g")
      .attr(
        "transform",
        "translate(0," + (innerHeight) + ")",
      )
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  });
});
