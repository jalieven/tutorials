var animPieChartDirective = angular.module('animPieChart', []);

animPieChartDirective.directive('animPieChart', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="animPieChart"></div>',
        link: function(scope, element, attrs) {

            var width = attrs.width,
                height = attrs.height,
                margin = attrs.margin,
                band = attrs.band,
                ease = attrs.ease,
                duration = attrs.duration,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.ordinal().range(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#dcedff"]);

            var pie = d3.layout.pie()
                .value(function (d) {
                    return d.value;
                }).sort(null);

            var arc = d3.svg.arc().outerRadius(radius - margin).innerRadius(radius - margin - band);

            var svg = d3.select(".animPieChart").append("svg")
                .attr("width", width)
                .attr("height", height);

            var chart_group = svg.append("g")
                .attr("class", "chart_group")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var label_group = svg.append("g")
                .attr("class", "label_group")
                .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

            var path = chart_group.selectAll("path");
            var slice_labels = label_group.selectAll("text");

            function change(data) {

                var data0 = path.data(),
                    data1 = pie(data);

                path = path.data(data1, key);

                slice_labels = slice_labels.data(data1, key);

                slice_labels.enter().append("svg:text")
                    .attr("class", "slice_label")
                    .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
                    .attr("text-anchor", "middle")
                    .attr("fill", "#ddd")
                    .text(function(d) {
                        return d.data.label;
                    });

                slice_labels.exit().remove();

                slice_labels.transition().ease(ease).duration(duration)
                    .attr("transform", function(d) {return "translate(" + arc.centroid(d) + ")"; })
                    .text(function(d) {
                        return d.value==0 ? '' : d.data.label;
                    });

                path.enter()
                    .append("path")
                    .each(function (d, i) {
                        this._current = findNeighborArc(i, data0, data1, key) || d;
                    })
                    .attr("fill", function (d) {
                        return color(d.data.label);
                    })
                    .append("title")
                    .text(function (d) {
                        return d.data.label + ': ' + d.data.percentage + "% (amount: " + d.data.value + ")";
                    });

                path.exit()
                    .datum(function (d, i) {
                        return findNeighborArc(i, data1, data0, key) || d;
                    })
                    .transition().ease(ease)
                    .duration(duration)
                    .attrTween("d", arcTween)
                    .remove();

                path.transition().ease(ease)
                    .duration(duration)
                    .attrTween("d", function arcTween(d) {
                        var i = d3.interpolate(this._current, d);
                        this._current = i(0);
                        return function (t) {
                            return arc(i(t));
                        };
                    });

                path.select("title").text(function (d) {
                    return d.data.label + ': ' + d.data.percentage + "% (amount: " + d.data.value + ")";
                });

                path.on("mouseover", function (d) {
                //        alert(d.data.label);
                });
            }

            function key(d) {
                return d.data.label;
            }

            function findNeighborArc(i, data0, data1, key) {
                var d;
                return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
                    : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
                    : null;
            }

            // Find the element in data0 that joins the highest preceding element in data1.
            function findPreceding(i, data0, data1, key) {
                var m = data0.length;
                while (--i >= 0) {
                    var k = key(data1[i]);
                    for (var j = 0; j < m; ++j) {
                        if (key(data0[j]) === k) return data0[j];
                    }
                }
            }

            // Find the element in data0 that joins the lowest following element in data1.
            function findFollowing(i, data0, data1, key) {
                var n = data1.length, m = data0.length;
                while (++i < n) {
                    var k = key(data1[i]);
                    for (var j = 0; j < m; ++j) {
                        if (key(data0[j]) === k) return data0[j];
                    }
                }
            }

            function arcTween(d) {
                var i = d3.interpolate(this._current, d);
                this._current = i(0);
                return function (t) {
                    return arc(i(t));
                };
            }

            attrs.$observe('data', function(value) {
                if(value.length > 0) {
                    var data = angular.fromJson(value);
                    change(data);
                }
            });

        }
    }
});