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

d3.select("#teamDropdown")
  .selectAll("option")
  .data(fileNames)
  .enter()
  .append("option")
  .text(function (d) {
    return d.replace(".csv", "");
  });

var teamDropdown = d3.select("#teamDropdown");

teamDropdown.on("change", function () {
  var selectedFileName = this.value;

  d3.csv("../datasets/network/" + selectedFileName, function (error, data) {
    if (error) throw error;
    var nodes = [];
    var links = [];

    data.forEach(function (d) {
      if (d.id) {
        nodes.push({ id: d.id });
      } else {
        console.warn("Données manquantes pour créer un noeud :", d);
      }
    });

    data.forEach(function (d, i) {
      Object.keys(d).forEach(function (key) {
        if (key !== "id") {
          links.push({
            source: i,
            target: nodes.findIndex(function (node) {
              return node.id === key;
            }),
            value: +d[key], 
          });
        }
      });
    });

    var simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("link", d3.forceLink(links).distance(100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "#999")
      .style("stroke-opacity", 0.6)
      .attr("stroke-width", function (d) {
        return Math.sqrt(d.value);
      });

    var node = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .style("fill", "#1f77b4");

    node.append("title").text(function (d) {
      return d.id;
    });

    simulation.on("tick", function () {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    });
  });
});
