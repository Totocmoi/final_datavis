var fileNames = [
  "2014-11.json",
  "2014-12.json",
  "2015-01.json",
  "2015-02.json",
  "2015-03.json",
  "2015-04.json",
  "2015-05.json",
  "2015-06.json",
  "2015-07.json",
  "2015-08.json",
  "2015-09.json",
  "2015-10.json",
  "2015-11.json",
  "2015-12.json",
  "2016-01.json",
  "2016-02.json",
  "2016-03.json",
  "2016-04.json",
  "2016-05.json",
  "2016-06.json",
  "2016-07.json",
  "2016-08.json",
  "2016-09.json",
  "2016-10.json",
  "2016-11.json",
  "2016-12.json",
  "2017-01.json",
  "2017-02.json",
  "2017-03.json",
  "2017-04.json",
  "2017-05.json",
  "2017-06.json",
  "2017-07.json",
  "2017-08.json",
  "2017-09.json",
  "2017-10.json",
  "2017-11.json",
  "2017-12.json",
  "2018-01.json",
  "2018-02.json",
  "2018-03.json",
  "2018-04.json",
  "2018-05.json",
  "2018-06.json",
  "2018-07.json",
  "2018-08.json",
  "2018-09.json",
  "2018-10.json",
  "2018-11.json",
  "2018-12.json",
  "2019-01.json",
  "2019-02.json",
  "2019-03.json",
  "2019-04.json",
  "2019-05.json",
  "2019-06.json",
  "2019-07.json",
  "2019-08.json",
  "2019-09.json",
  "2019-10.json",
  "2019-11.json",
  "2019-12.json",
  "2020-01.json",
  "2020-02.json",
  "2020-03.json",
  "2020-04.json",
  "2020-05.json",
  "2020-06-DLC1.json",
  "2020-06.json",
  "2020-07.json",
  "2020-08.json",
  "2020-09.json",
  "2020-10-DLC2.json",
  "2020-10.json",
  "2020-11-H1.json",
  "2020-11-H2.json",
  "2020-11.json",
  "2020-12-H1.json",
  "2020-12-H2.json",
  "2020-12.json",
  "2021-01.json",
  "2021-02.json",
  "2021-03.json",
  "2021-04.json",
  "2021-05.json",
  "2021-06.json",
  "2021-07.json",
  "2021-08.json",
  "2021-09.json",
  "2021-10.json",
  "2021-11.json",
  "2021-12.json",
  "2022-01.json",
  "2022-02.json",
  "2022-03.json",
  "2022-04.json",
  "2022-05.json",
  "2022-06.json",
  "2022-07.json",
  "2022-08.json",
  "2022-09.json",
  "2022-10.json",
  "2022-11.json",
  "2022-12.json",
  "2023-01.json",
  "2023-02.json",
  "2023-03.json",
  "2023-04.json",
  "2023-05.json",
  "2023-06.json",
  "2023-07.json",
  "2023-08.json",
  "2023-09-DLC1.json",
  "2023-09.json",
  "2023-10.json",
  "2023-11.json",
  "2023-12-DLC2.json",
  "2023-12.json",
  "2024-01.json",
];

var margin = { top: 20, right: 20, bottom: 40, left: 50 },
  width =
    document.getElementById("network").offsetWidth - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

d3.select("#teamDropdown")
  .selectAll("option")
  .data(fileNames)
  .enter()
  .append("option")
  .text(function (d) {
    return d.replace(".json", "");
  });

var teamDropdown = d3.select("#teamDropdown");
teamDropdown.on("change", function () {
  var selectedFileName = this.value;
  d3.json(
    "../datasets/network/" + selectedFileName + ".json",
    function (error, graph) {
      if (error) throw error;
      var nodes = [];
      graph.nodes.forEach(function (node) {
        nodes.push({ id: node });
      });
      var links = graph.links.map(function (link) {
        return {
          source: link.source,
          target: link.target,
          value: Math.pow(link.value, 3),
        };
      });
      d3.select("svg").remove();
      var svg = d3
        .select("#network")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var drag = d3.drag().on("drag", dragged);

      svg.call(drag);
      
      var offsetX = margin.left;
      var offsetY = margin.top;
      var scale = 1

      function dragged() {
        offsetX += d3.event.dx;
        offsetY += d3.event.dy;
        d3.select(this).attr("transform", "translate(" + offsetX + "," + offsetY + ") scale(" + scale + ")");
      }
      var zoom = d3.zoom().scaleExtent([0.1, 10]).on("zoom", zoomed);

      svg.call(zoom);

      function zoomed() {
        scale =d3.event.transform.k
        d3.select(this).attr("transform", "translate(" + offsetX + "," + offsetY + ") scale(" + scale + ")");
      }
      var zoomInButton = document.getElementById("zoomIn");
      var zoomOutButton = document.getElementById("zoomOut");
      zoomInButton.addEventListener("click", function () {
        zoom.scaleBy(svg, 1.2);
      });

      zoomOutButton.addEventListener("click", function () {
        zoom.scaleBy(svg, 0.8);
      });
      var simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink(links).id((d) => d.id),
        )
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2));

      var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.8)
        .attr("stroke-width", function (d) {
          return Math.cbrt(d.value) / 500;
        });

      var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "blue")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

      node.append("title").text((d) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });
    },
  );
});
