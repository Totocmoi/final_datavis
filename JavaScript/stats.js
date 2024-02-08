var range = d3.select("#rangeInput");
var output = document.getElementById("affDate");
var width = document.getElementById("chart").offsetWidth;
var height = 300;

// Charger les données pour chaque statistique
d3.csv("../datasets/violin/hp.csv", function (error, allhpdata) {
  if (error) throw error;
  d3.csv("../datasets/violin/atk.csv", function (error, allatkdata) {
    if (error) throw error;
    d3.csv("../datasets/violin/def.csv", function (error, alldefdata) {
      if (error) throw error;
      d3.csv("../datasets/violin/satk.csv", function (error, allsatkdata) {
        if (error) throw error;
        d3.csv("../datasets/violin/sdef.csv", function (error, allsdefdata) {
          if (error) throw error;
          d3.csv("../datasets/violin/spe.csv", function (error, allspedata) {
            if (error) throw error;
            range.on("change", function () {
              d3.select("#chart").selectAll("svg").remove();

              var index = range.node().value;
              output.innerHTML = index;

              output.innerHTML = Object.keys(allhpdata[0])[index];
              
              var hpdata = formatData(allhpdata, index);
              var atkdata = formatData(allatkdata, index);
              var defdata = formatData(alldefdata, index);
              var satkdata = formatData(allsatkdata, index);
              var sdefdata = formatData(allsdefdata, index);
              var spedata = formatData(allspedata, index);

              createViolinChart(hpdata, "hp");
              createViolinChart(atkdata, "atk");
              createViolinChart(defdata, "def");
              createViolinChart(satkdata, "satk");
              createViolinChart(sdefdata, "sdef");
              createViolinChart(spedata, "spe");
            });
          });
        });
      });
    });
  });
});

function formatData(data, index) {
  return data.map(function (d) {
    return {
      stat: +d[Object.keys(d)[0]],
      percentage: +d[Object.keys(d)[index]],
    };
  });
}

function createViolinChart(data, chartId) {
  console.log(data)
  var svg = d3
    .select("#"+chartId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  var y = d3
    .scaleLinear()
    .domain([5, 255]) 
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(["hp", "atk", "def","satk", "sdef", "spe"]) 
    .padding(0.05);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var histogram = d3
    .histogram()
    .domain(y.domain())
    .thresholds(y.ticks(20))
    .value((d) => d.percentage);

  var sumstat = d3
    .nest()
    .key(function (d) {
      return d.stat;
    })
    .rollup(function (d) {
      input = d.map(function (g) {
        return g.percentage;
      });
      bins = histogram(input);
      return bins;
    })
    .entries(data);

  var maxNum = 0;
  for (i in sumstat) {
    allBins = sumstat[i].value;
    lengths = allBins.map(function (a) {
      return a.length;
    });
    longuest = d3.max(lengths);
    if (longuest > maxNum) {
      maxNum = longuest;
    }
  }
  var xNum = d3
    .scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum, maxNum]);

  svg
    .selectAll("myViolin")
    .data(sumstat)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + d.key + " ,0)";
    })
    .append("path")
    .datum(function (d) {
      return d.value;
    })
    .style("stroke", "none")
    .style("fill", "#69b3a2")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d) {
          return xNum(-d.length);
        })
        .x1(function (d) {
          return xNum(d.length);
        })
        .y(function (d) {
          return y(d.x0);
        })
        .curve(d3.curveCatmullRom),
    );
}
