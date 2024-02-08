var MoveNamespace = {};

MoveNamespace.init =(function () {
  var margin = { top: 0, right: 20, bottom: 0, left: 50 },
  width =
    document.getElementById("types_chart").offsetWidth -
    margin.left -
    margin.right,
  height = 330;
var tooltip = d3.select("#tooltip");
d3.csv("../datasets/waffle.csv", function (error, alldata) {
  if (error) throw error;

  var range = d3.select("#rangeInput");
  var output = document.getElementById("affDate");
  var svg = d3
    .select("#types_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  range.on("change", function () {
    var index = range.node().value;
    output.innerHTML = Object.keys(alldata[0])[index];

    var data = alldata.map(function (d) {
      return {
        category: d[Object.keys(d)[0]],
        value: +d[Object.keys(d)[index]],
      };
    });

    var totalValues = d3.sum(data, function (d) {
      return d.value;
    });
    var squareSize = 20;
    var squarePadding = 2;
    var totalSquares = 0;

    svg.selectAll("rect").remove();

    data.forEach(function (d) {
      var squaresForCategory = Math.round(
        ((((d.value / totalValues) * width) / 22) * height) / 22,
      );
      for (var i = 0; i < squaresForCategory; i++) {
        svg
          .append("rect")
          .attr("x", function () {
            var col = Math.floor(
              totalSquares / Math.floor(height / (squareSize + squarePadding)),
            );
            return col * (squareSize + squarePadding);
          })
          .attr("y", function () {
            var row =
              totalSquares % Math.floor(height / (squareSize + squarePadding));
            return row * (squareSize + squarePadding);
          })
          .attr("width", squareSize)
          .attr("height", squareSize)
          .style("fill", function () {
            if (d.category === "Normal") return "#AAB09F";
            if (d.category === "Dark") return "#736C75";
            if (d.category === "Flying") return "#7DA6DE";
            if (d.category === "Fairy") return "#E397D1";
            if (d.category === "Fire") return "#EA7A3C";
            if (d.category === "Grass") return "#71C558";
            if (d.category === "Bug") return "#94BC4A";
            if (d.category === "Water") return "#539AE2";
            if (d.category === "Poison") return "#B468B7";
            if (d.category === "Steel") return "#89A1B0";
            if (d.category === "Dragon") return "#6A7BAF";
            if (d.category === "Fighting") return "#CB5F48";
            if (d.category === "Psychic") return "#E5709B";
            if (d.category === "Ghost") return "#846AB6";
            if (d.category === "Ice") return "#70CBD4";
            if (d.category === "Rock") return "#B2A061";
            if (d.category === "Ground") return "#CC9F4F";
            if (d.category === "Electric") return "#E5C531";
          })
          .on("mouseover", function () {
            tooltip.transition().duration(200).style("opacity", 0.9);
            var a = d.category + "\n" + Math.round(d.value / 6) + "%";
            tooltip
              .html(a)
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 28 + "px");
          })
          .on("mousemove", function () {
            tooltip
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 28 + "px");
          })
          .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
          });
        totalSquares++;
      }
    });
  });
});

  })();