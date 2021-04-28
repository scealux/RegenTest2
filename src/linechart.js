import "./styles.css";
import * as d3 from "d3";
// Create 2 datasets

// Title: Percent of farmers based on Demogrpahic Over time
var data1 = [
  //ser1: year ser2: percent
  { ser1: 1900, ser2: 13.0097844 },
  { ser1: 1910, ser2: 14.0338514 },
  { ser1: 1920, ser2: 14.343187 },
  { ser1: 1930, ser2: 14.0243932 },
  { ser1: 1940, ser2: 11.1724584 },
  { ser1: 1950, ser2: 10.3922529 },
  { ser1: 1959, ser2: 7.35013443 },
  { ser1: 1964, ser2: 5.82686296 },
  { ser1: 1969, ser2: 3.20091567 },
  { ser1: 1974, ser2: 1.9703433 },
  { ser1: 1978, ser2: 1.65432782 },
  { ser1: 1982, ser2: 1.48372852 },
  { ser1: 1987, ser2: 1.0994564 },
  { ser1: 1992, ser2: 0.97730224 },
  { ser1: 1997, ser2: 0.96508163 }
];

var data2 = [
  { ser1: 1900, ser2: 86.5927877 },
  { ser1: 1910, ser2: 85.4660875 },
  { ser1: 1920, ser2: 85.1946338 },
  { ser1: 1930, ser2: 85.345355 },
  { ser1: 1940, ser2: 88.1245579 },
  { ser1: 1950, ser2: 89.1027027 },
  { ser1: 1959, ser2: 92.3243238 },
  { ser1: 1964, ser2: 93.668111 },
  { ser1: 1969, ser2: 96.1964289 },
  { ser1: 1974, ser2: 97.4342841 },
  { ser1: 1978, ser2: 97.4316307 },
  { ser1: 1982, ser2: 97.5739588 },
  { ser1: 1987, ser2: 97.8618222 },
  { ser1: 1992, ser2: 97.7412871 },
  { ser1: 1997, ser2: 97.507243 }
];

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 50, left: 50 },
  width = 900 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#line_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialise a X axis:
var x = d3.scaleLinear().range([0, width]);
var xAxis = d3.axisBottom().scale(x).tickFormat(d3.format("d"));
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class", "myXaxis");

// Initialize an Y axis
var y = d3.scaleLinear().range([height, 0]);
var yAxis = d3
  .axisLeft()
  .scale(y)
  .tickFormat((d) => d + "%");
svg.append("g").attr("class", "myYaxis");

document.getElementById("buttonTwo").onclick = function () {
  update(data2);
};
document.getElementById("buttonOne").onclick = function () {
  update(data1);
};
// Create a function that takes a dataset as input and update the plot:
function update(data) {
  document.getElementById("demo").innerHTML = data == data2 ? "White" : "Black";
  // Create the X axis:
  x.domain([
    1900,
    d3.max(data, function (d) {
      return d.ser1;
    })
  ]);
  svg.selectAll(".myXaxis").transition().duration(3000).call(xAxis);

  // create the Y axis
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.ser2;
    })
  ]);
  svg.selectAll(".myYaxis").transition().duration(3000).call(yAxis);

  // Create a update selection: bind to the new data
  var u = svg.selectAll(".lineTest").data([data], function (d) {
    return d.ser1;
  });

  // Updata the line
  u.enter()
    .append("path")
    .attr("class", "lineTest")
    .merge(u)
    .transition()
    .duration(3000)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.ser1);
        })
        .y(function (d) {
          return y(d.ser2);
        })
    )
    .attr("fill", "none")
    .attr("stroke", "#238b45")
    .attr("stroke-width", 2.5);

  u.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percent of Farmers that are Black");
}

update(data1);
