var animBarChartDirective = angular.module('animBarChart', []);

animBarChartDirective.directive('animBarChart', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="animBarChart"></div>',
        link: function(scope, element, attrs) {

            var width = attrs.width,
                height = attrs.height,
                ease = attrs.ease,
                duration = attrs.duration;

            var color = d3.scale.ordinal().range(["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#ebf6ff"]);

            var svg = d3.select(".animBarChart").append("svg")
                .attr("width", width)
                .attr("height", height);

            var chart_group = svg.append("g")
                .attr("class", "chart_group");

            var label_group = svg.append("g")
                .attr("class", "label_group");

            var rect = chart_group.selectAll("rect");
            var bar_labels = label_group.selectAll("text");

            function change(data) {
                var x = d3.scale.linear()
                    .domain([0, data.length+2])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .domain([0, d3.max(data, function(g) {
                        return g.value;
                    })])
                    .rangeRound([0, height-50]);

                rect = rect.data(data);
                bar_labels = bar_labels.data(data);

                // bar_labels enter
                bar_labels.enter().append("svg:text")
                    .attr("class", "bar_label")
                    .text(function(d) {
                        return d.y;
                    }).attr("x", function(d, i) {
                        return parseInt(x(i)) + 5;
                    }).attr("y", function(d) {
                        return height - y(d.value) + 17;
                    }).attr("font-size", "30px").attr("fill", "#ddd");

                // bar_labels exit
                bar_labels.exit().remove();

                // bar_labels transition
                bar_labels.transition().ease(ease).duration(duration)
                    .text(function(d) {
                        return d.y;
                    }).attr("x", function(d, i) {
                        return parseInt(x(i)) + 5;
                    }).attr("y", function(d) {
                        return height - y(d.value) + 17;
                    }).attr("font-size", "30px").attr("fill", "#ddd");

                // rect enter
                rect.enter().append("rect")
                    .attr("x", function(d, i) {
                        return x(i);
                    })
                    .attr("y", function(d) { return height - y(d.value); })
                    .attr("width", width / data.length)
                    .attr("height", function(d) { return y(d.value); })
                    .attr("fill", function(d, i) { return color(i); })
                    .append("title")
                    .text(function (d) {
                        return d.y + " (amount: " + d.value + ")";
                    });

                // rect exit
                rect.exit()
                    .transition().ease(ease)
                    .duration(duration)
                    .attrTween("height", heightTween)
                    .remove();

                // rect transition
                rect.transition().ease(ease)
                    .duration(duration)
                    .attr("y", function (d) {
                        return height - y(d.value);
                    })
                    .attr("height", function (d) {
                        return y(d.value);
                    });

            }

            function heightTween(d) {
                var i = d3.interpolate(0, d);
                return function (t) {
                    return i(t);
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
