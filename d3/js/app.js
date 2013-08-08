var tutorial = angular.module('tutorial', ['arcTween', 'pieChart', 'animPieChart', 'animBarChart', 'topoMap']);

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

    d3.json("map/vlaamse_hoofdgemeenten_topo.json", function (json) {
        $scope.topology = json;
        $scope.objects = json.objects.vlaamse_hoofdgemeenten;
        $scope.center = [0, 55.4];
        $scope.rotate = [-4.2, 4.3];
        $scope.mouseOverMap = function(element) {
            d3.select("#pointerSelection").text(ucwords(element.id.toLowerCase().replace(/_/g, '-')));
            d3.select(element).attr("fill", "#3182bd");
        };
        $scope.mouseOutMap = function(element) {
            d3.select(element).attr("fill", "#ddd");
        };
        $scope.clickMap = function(element) {
            d3.selectAll(".gisSelection").text(ucwords(element.id.toLowerCase().replace(/_/g, '-')));
            // change the pieChartData
            var selected_data = pie_data.get(2009).get(element.id).get("CO2");
            $scope.sourcePieData = addPercentages(selected_data);
            // change the barChartData
            var selected_bar_data = bar_data.get(element.id).get("CO2");
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
        };
        $scope.$apply();
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