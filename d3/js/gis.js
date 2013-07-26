var width = 960,
    height = 500;

var xym = d3.geo.albers()
    .center([0, 55.4])
    .rotate([-4.2, 4.3])
    .parallels([55, 65])
    .scale(25000);

var path = d3.geo.path().projection(xym);

var svg = d3.select("#gis")
    .append("svg").attr("id","svgoriginal").attr("width", width)
    .attr("height", height);

var gemeentes = svg.append("g")
    .attr("id", "gemeentes");

d3.json("map/vlaamse_hoofdgemeenten_topo.json", function (json) {
    gemeentes.selectAll("path")
        .data(topojson.feature(json, json.objects.vlaamse_hoofdgemeenten).features)
        .enter().append("path")
        .attr("fill", "#ddd")
        .attr("id", function(d) {
            return d.id;
        }).on('mouseover', function() {
            d3.select("#gisSelection").text(this.id);
            d3.select(this).attr("fill", "#3182bd");
        })
        .on('mouseout', function() {
            d3.select(this).attr("fill", "#ddd");
        })
        .attr("d", path);
});
