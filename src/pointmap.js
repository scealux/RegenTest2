import "./styles.css";
import * as d3 from "d3";
// https://www.d3-graph-gallery.com/graph/choropleth_basic.html

/// map //
// The svg
var svg = d3.select("#pointmap"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
// Map and projection
var projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .scale(900)
  .center([-98.8, 38]);

var statesMap = d3.json("./data/updatedUSA.geojson");
var locData = d3.csv("./data/locations4-12.csv");
var path = d3.geoPath().projection(projection);

//// Bottom Map //
const g = svg.append("g");

Promise.all([statesMap, locData]).then((res) => {
  // let centers = res[0].features.centroid();
  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  let pntMap = g
    .append("g")
    .selectAll("path")
    .data(res[0].features)
    .enter()
    .append("path")
    .on("click", clicked)
    .attr("d", path)
    .attr("fill", "#d1ded4")
    .attr("stroke", "white")
    .attr("stroke-width", ".5px");
  //tool tip div
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // add points to the map
  g.append("g")
    .selectAll("circles.points")
    .data(res[1])
    .enter()
    .append("circle")
    .attr("r", 2)
    .attr("stroke", "white")
    .attr("fill", "#E3866F")
    .attr("transform", function (d) {
      return "translate(" + projection([d.Long, d.Lat]) + ")";
    })

    .on("click", (event, z) => {
      const whereTo = z.Website || z.Social || z.Contact;
      window.open(whereTo);
    })

    .on("mouseover", (event, z) => {
      d3.select(this)
        .classed("selected", true)
        .transition()
        .duration(100)
        .attr("r", 20)
        .attr("fill", "#ff0000");

      tooltip.transition().duration(200).style("opacity", 0.9);
      // `<h3>${z.properties.NAME}</h3> <hr/> xx %`
      tooltip
        .html(`<h3>${z.Name}</h3><hr>${z.Classifications}`)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (d) => {
      d3.select(this).classed("selected", false);
      tooltip.transition().duration(500).style("opacity", 0);
    });

  svg.call(zoom);

  function reset() {
    pntMap.transition().style("fill", null);
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
  }

  function clicked(event, d) {
    const [[x0, y0], [x1, y1]] = path.bounds(d);
    event.stopPropagation();
    pntMap.transition().style("fill", null);
    d3.select(this).transition().style("fill", "#66c2a4");
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(
            Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
          )
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
      );
  }

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  return svg.node();

  /////////
});
