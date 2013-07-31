var tutorial = angular.module('tutorial', ['arcTween', 'pieChart', 'animPieChart', 'animBarChart', 'municipalityMap']);

tutorial.controller('ChartController', function ($scope) {
    // the data to work with
    var pie_data;
    var bar_data;

    // prepare method for insertion into animPieChart
    function addPercentages(d3Map) {
        var total = 0;
        d3Map.forEach(function (d) {
            total += d.a;
        });

        d3Map.forEach(function (d) {
            d.percentage = ((d.a / total) * 100).toFixed(2);
            d.label = d.s;
            d.value = d.a;
        });
        return d3Map;
    }

    // loading the data from server and transform json-data
    d3.json("data/air_data.json", function (json) {
        // this stuff is for the sourcePieChart
        pie_data = d3.nest()
            .key(function (d) {
                return d.y;
            }).sortKeys(d3.ascending)
            .key(function (d) {
                return d.m;
            }).sortKeys(d3.ascending)
            .key(function (d) {
                return d.sub;
            }).sortKeys(d3.ascending)
            .map(json.data, d3.map);

        var selected_pie_data = pie_data.get(2009).get("HAALTERT").get("CO2");
        $scope.sourcePieData = addPercentages(selected_pie_data);

        // this stuff is for the yearBarChart
        bar_data = d3.nest()
            .key(function (d) {
                return d.m;
            }).sortKeys(d3.ascending)
            .key(function (d) {
                return d.sub;
            }).sortKeys(d3.ascending)
            .map(json.data, d3.map);

        var selected_bar_data = bar_data.get("HAALTERT").get("CO2");

        var bar_per_year = d3.nest()
            .key(function (d) {
                return d.y;
            }).sortKeys(d3.ascending)
            .rollup(function(d) {
                return {
                    y: d3.mean(d,function(g) {return +g.y}),
                    value:d3.sum(d,function(g) {return +g.a})
                };
            })
            .map(selected_bar_data, d3.map);

        $scope.yearBarData = bar_per_year.values();

        // apply the scope changes
        $scope.$apply();
    });

    // gis component for selecting the municipality
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
                d3.select("#pointerSelection").text(ucwords(this.id.toLowerCase().replace(/_/g, '-')));
                d3.select(this).attr("fill", "#3182bd");
            })
            .on('mouseout', function() {
                d3.select(this).attr("fill", "#ddd");
            })
            .on('click', function() {
                // set the titles
                d3.selectAll(".gisSelection").text(ucwords(this.id.toLowerCase().replace(/_/g, '-')));
                // change the pieChartData
                var selected_data = pie_data.get(2009).get(this.id).get("CO2");
                $scope.sourcePieData = addPercentages(selected_data);
                // change the barChartData
                var selected_bar_data = bar_data.get(this.id).get("CO2");
                $scope.yearBarData = d3.nest()
                    .key(function (d) {
                        return d.y;
                    }).sortKeys(d3.ascending)
                    .rollup(function (d) {
                        return {
                            y: d3.mean(d, function (g) {
                                return +g.y
                            }),
                            value: d3.sum(d, function (g) {
                                return +g.a
                            })
                        };
                    })
                    .map(selected_bar_data, d3.map).values();

                // apply our data changes
                $scope.$apply();
            })
            .attr("d", path);
    });

    function ucwords(input) {
        var words = input.split(/(\s|-)+/),
            output = [];
        for (var i = 0, len = words.length; i < len; i += 1) {
            output.push(words[i][0].toUpperCase() +
                words[i].toLowerCase().substr(1));
        }
        return output.join('');
    }

});