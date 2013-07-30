var tutorial = angular.module('tutorial', ['arcTween', 'pieChart', 'animPieChart', 'map']);

tutorial.controller('ChartController', function ($scope) {
    // the data to work with
    var pie_data;
    var bar_data;

    // prepare method for insertion into animated pie
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

    // loading the data from server and initial selection
    d3.json("data/air_data.json", function (json) {
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

        var selected_data = pie_data.get(2009).get("HAALTERT").get("CO2");
        $scope.data = addPercentages(selected_data);
        $scope.$apply();

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

        var color = d3.scale.ordinal().range(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#ebf6ff"]);

        var w = 500, h = 300;

        var x = d3.scale.linear()
            .domain([0, $scope.yearBarData.length+2])
            .range([0, w]);

        var y = d3.scale.linear()
            .domain([0, d3.max($scope.yearBarData ,function(g) {return g.value})])
            .rangeRound([0, h-50]);

        var chart = d3.select("#yearChartContainer").append("svg")
            .attr("class", "chart")
            .attr("width", w)
            .attr("height", h);

        chart.selectAll("rect")
            .data($scope.yearBarData)
            .enter().append("rect")
            .attr("x", function(d, i) {
                return x(i);
            })
            .attr("y", function(d) { return h - y(d.value); })
            .attr("width", w / $scope.yearBarData.length)
            .attr("height", function(d) { return y(d.value); })
            .attr("fill", function(d, i) { return color(i); })
            .append("title")
            .text(function (d) {
                return d.y + " (amount: " + d.value + ")";
            });

        chart.selectAll("text")
            .data($scope.yearBarData)
            .enter()
            .append("text")
            .attr("class", "chart_label")
            .text(function(d) {
                return d.y;
            }).attr("x", function(d, i) {
                return x(i) + 5;
            })
            .attr("y", function(d) {
                return h - y(d.value) + 17;
            }).attr("font-size", "30px")
            .attr("fill", "#ddd");

        $scope.$watch('[yearBarData]', function () {
            chart.selectAll("rect")
                .data($scope.yearBarData)
                .transition().ease('elastic')
                .duration(900)
                .attr("y", function (d) {
                    return h - y(d.value);
                })
                .attr("height", function (d) {
                    return y(d.value);
                });

            chart.selectAll(".chart_label")
                .data($scope.yearBarData)
                .transition().ease('elastic')
                .duration(900)
                .attr("x", function(d, i) {
                    return x(i) + 5;
                })
                .attr("y", function(d) {
                    return h - y(d.value) + 17;
                });

        }, true);

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
                $scope.data = addPercentages(selected_data);
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