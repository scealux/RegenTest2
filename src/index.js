import "./styles.css";
import * as d3 from "d3";
// https://www.d3-graph-gallery.com/graph/choropleth_basic.html

//tool tip div
var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

///--- bar chart ----//

var barmargin = { top: 20, right: 20, bottom: 20, left: 100 },
  barwidth = 1000 - barmargin.left - barmargin.right,
  barheight = 250 - barmargin.top - barmargin.bottom;

// set the ranges
var barx = d3.scaleBand().range([0, barwidth]).padding(0.1);
var bary = d3.scaleLinear().range([barheight, 0]);

var barsvg = d3
  .select("#bar_chart")
  .append("svg")
  .attr("width", barwidth + barmargin.left + barmargin.right)
  .attr("height", barheight + barmargin.top + barmargin.bottom)
  .append("g")
  .attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")");

// get data
d3.csv("./data/totals.csv").then(function (data) {
  data.forEach(function (d) {
    d.num = +d.num;
  });

  // Scale
  let domain = barx.domain(
    data.map(function (d) {
      return d.Demo;
    })
  );
  bary.domain([0, 3200596]);
  console.log(domain);
  // rectangles for the bar chart
  barsvg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return barx(d.Demo);
    })
    .attr("width", barx.bandwidth())
    .attr("y", function (d) {
      return bary(d.Num);
    })
    .attr("height", function (d) {
      return barheight - bary(d.Num);
    })
    .attr("fill", "#4db383")

    .on("mouseover", (event, z) => {
      d3.select(this).classed("selected", true);
      tooltip.transition().duration(200).style("opacity", 1);
      let format = d3.format(",");
      tooltip
        .html(`<h3>${format(z.Num)}</h3>`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      d3.select(this).classed("selected", false);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // x Axis
  barsvg
    .append("g")
    .attr("transform", "translate(0," + barheight + ")")
    .call(d3.axisBottom(barx));

  // x axis label
  barsvg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + barmargin.top + 20) + ")"
    )
    .style("text-anchor", "middle")
    .text("Date");

  //  y Axis
  barsvg.append("g").call(d3.axisLeft(bary));
});

// y axis label
barsvg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - barmargin.left)
  .attr("x", 0 - barheight / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Number of Producers");

// -- end bar chart ---//

/// cloro map //
// The svg
var svg = d3.select("#map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .scale(600)
  .center([-98.8, 38]);

//Data and color scale
// var data = d3.map();

var colors = d3
  .scaleQuantize()
  .domain([0, 5])
  .range(["#edf8fb", "#b2e2e2", "#66c2a4", "#238b45"]);

var statesMap = d3.json("./data/updatedUSA.geojson");
var statesData = d3.csv("./data/FarmerDemographic.csv");
var path = d3.geoPath().projection(projection);

Promise.all([statesMap, statesData]).then((res) => {
  console.log(res[1]);

  svg
    .append("g")
    .selectAll("path")
    .data(res[0].features)
    .enter()
    .append("path")
    .attr("class", (d) => {
      let demo = res[1].find((el) => el.NAME === d.properties.NAME);
      return +demo?.PecentBlack > 1 ? "state tex" : "state";
    }) //state
    .attr("d", path)
    .attr("stroke", "black")
    .attr("stroke-width", ".5px")
    .attr("fill", (d) => {
      let demo = res[1].find((el) => el.NAME === d.properties.NAME);
      return colors(+demo?.PecentBlack); //Missing Puerto Rico & District of Colombia
    })
    .on("mouseover", (event, z) => {
      d3.select(this).classed("selected", true);
      tooltip.transition().duration(200).style("opacity", 1);

      let dat = res[1].find((el) => el.NAME === z.properties.NAME);

      tooltip
        .html(
          `<h3>${z.properties.NAME}</h3> <hr/> ${parseFloat(
            dat.PecentBlack
          ).toFixed(2)} %`
        )
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      d3.select(this).classed("selected", false);
      tooltip.transition().duration(500).style("opacity", 0);
    });
});
