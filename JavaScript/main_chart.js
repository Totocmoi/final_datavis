d3.csv("../datasets/main-chart.csv", function (error, data) {
  if (error) throw error;

  var margin = { top: 20, right: 20, bottom: 40, left: 50 },
    width =
      document.getElementById("main_chart").offsetWidth -
      margin.left -
      margin.right,
    height = 400 - margin.top - margin.bottom;

  var svg = d3
    .select("#main_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("background-color", "white");

  var transposedData = [];
  data.forEach(function (d) {
    var name = d.name;
    Object.keys(d).forEach(function (date) {
      transposedData.push({ name: name, date: date, value: +d[date] });
    });
  });

  var filteredData = transposedData.filter(function (d) {
    return !isNaN(d.value);
  });

  var x = d3
    .scaleBand()
    .domain(
      transposedData.map(function (d) {
        return d.date;
      }),
    )
    .range([0, width])
    .padding(0.1);

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(transposedData, function (d) {
        return d.value;
      }),
    ])
    .nice()
    .range([height, 0]);

  var colorScale = ["red", "orange", "cyan", "green", "blue", "black", "grey", "purple", "pink", "brown"];
  var usedColors = [];

  var line = d3
    .line()
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.value);
    });
  var i = 0;
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(function(d) { i=i+1;return i%10==5?d:"" ; }));

  svg.append("g")
  .call(d3.axisLeft(y)
      .tickFormat(function(d) { return d + "%"; }) 
  );

  svg
    .selectAll(".line")
    .data(data)
    .enter()
    .append("path")
    .style("fill", "none")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(
        filteredData.filter(function (e) {
          return e.name === d.name;
        }),
      );
    })
    .attr("data-pokemon", function (d) {
      return d.name;
    });

  var maxChecked = 10;
  var pokemonCategories = {};
  d3.csv("../datasets/pokemon.csv", function (error, pokemonData) {
    if (error) throw error;

    pokemonCategories["g1"] = [];
    pokemonCategories["g2"] = [];
    pokemonCategories["g3"] = [];
    pokemonCategories["g4"] = [];
    pokemonCategories["g5"] = [];
    pokemonCategories["g6"] = [];
    pokemonCategories["g7"] = [];
    pokemonCategories["g8"] = [];
    pokemonCategories["g9"] = [];
    pokemonData.forEach(function (pokemon) {
      var pokemonId = pokemon.id;
      var category;
      if (pokemonId < 152) {
        category = "g1";
      } else {
        if (pokemonId < 252) {
          category = "g2";
        } else {
          if (pokemonId < 387) {
            category = "g3";
          } else {
            if (pokemonId < 494) {
              category = "g4";
            } else {
              if (pokemonId < 650) {
                category = "g5";
              } else {
                if (pokemonId < 722) {
                  category = "g6";
                } else {
                  if (pokemonId < 810) {
                    category = "g7";
                  } else {
                    if (pokemonId < 906) {
                      category = "g8";
                    } else {
                      category = "g9";
                    }
                  }
                }
              }
            }
          }
        }
      }
      pokemonCategories[category].push(pokemon);
    });

    Object.keys(pokemonCategories).forEach(function (category) {
      var checkboxes = d3
        .select("#" + category)
        .selectAll("input")
        .data(
          pokemonCategories[category].filter(function (pokemon) {
            return transposedData.some(function (d) {
              return d.name === pokemon.name;
            });
          })
        )
        .enter()
        .append("div")
        .html(function (d, i) {
          var isChecked =
            d.name == "Kingambit" ||
            d.name == "Hippowdon" ||
            d.name == "Garchomp" ||
            d.name == "Tyranitar"
              ? "checked"
              : "";
          return (
            '<input type="checkbox" class="pokemon-checkbox" id="' +
            d.name +
            '" ' +
            isChecked +
            ">" +
            d.name
          );
        });
    });

    d3.selectAll(".pokemon-checkbox").each(function () {
      var pokemonName = this.id;
      var isVisible = this.checked;
      var line = svg.selectAll("path.line").filter(function () {
        return d3.select(this).attr("data-pokemon") === pokemonName;
      });
      if (isVisible) {
        line.style("display", "block").style("stroke", function () {
            var color = colorScale[0]; 
            usedColors.push(color); 
            colorScale.shift(); 
            return color;});
      } else {
        line.style("display", "none");
      }
    });

    d3.selectAll(".pokemon-checkbox").on("change", function () {
      var checkedBoxes = d3.selectAll(".pokemon-checkbox:checked").nodes();
      if (checkedBoxes.length > maxChecked) {
        this.checked = false;
        return;
      }
      var pokemonName = this.id;
      var isVisible = this.checked;
      var line = svg.selectAll("path.line").filter(function () {
        return d3.select(this).attr("data-pokemon") === pokemonName;
      });
      if (isVisible) {
        line.style("display", "block").style("stroke", function () {
            var color = colorScale[0]; 
            usedColors.push(color); 
            colorScale.shift(); 
            return color;
          });
      } else {
        line.style("display", "none");
        var color = line.style("stroke"); 
        colorScale.push(color); 
        usedColors.splice(usedColors.indexOf(color), 1);
      }
      updateLegend();
    });
    function getDisplayedPokemonNames() {
      var displayedPokemonNames = [];
      d3.selectAll(".pokemon-checkbox").each(function () {
          var pokemonName = this.id;
          var isVisible = this.checked;
          if (isVisible) {
              displayedPokemonNames.push(pokemonName);
          }
      });
      return displayedPokemonNames;
    }

    var displayedPokemonNames = getDisplayedPokemonNames();

    svg.selectAll(".legend")
      .data(data.filter(function(d) {
          return displayedPokemonNames.includes(d.name);
      }))
      .enter()
      .append("text")
      .attr("class", "legend")
      .attr("x", 10)
      .attr("y", function(d, i) { return i * 20 + 20; })
      .style("fill", function(d) {
          var lineColor = svg.select("path.line[data-pokemon='" + d.name.replace("'", "\\'") + "']").style("stroke");
          return lineColor;
      })
      .text(function(d) { return d.name; });
    function updateLegend() {
        svg.selectAll(".legend").remove();

        var displayedPokemonNames = getDisplayedPokemonNames();

        svg.selectAll(".legend")
            .data(data.filter(function(d) {
                return displayedPokemonNames.includes(d.name);
            }))
            .enter()
            .append("text")
            .attr("class", "legend")
            .attr("x", 10)
            .attr("y", function(d, i) { return i * 20 + 20; })
            .style("fill", function(d) {
                var lineColor = svg.select("path.line[data-pokemon='" + d.name.replace("'", "\\'") + "']").style("stroke");
                return lineColor;
            })
            .text(function(d) { return d.name; });
    }
    function makeYGridlines() {
      return d3.axisLeft(y)
          .ticks(5)
    }
    svg.append("g")
      .attr("class", "grid")
      .call(makeYGridlines()
          .tickSize(-width)
          .tickFormat("")
      );
    svg.selectAll(".grid line")
      .style("stroke", "lightgray")
      .style("stroke-opacity", "0.7")
      .style("shape-rendering", "crispEdges")
      .style("stroke-dasharray", "2,2");
  });
});
