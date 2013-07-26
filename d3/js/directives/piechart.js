var pieChartDirective = angular.module('pieChart', []);

pieChartDirective.directive('pieChart', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="pieChart"></div>',
        link: function(scope, element, attrs) {

            var width = attrs.width,
                height = attrs.height,
                margin = attrs.margin,
                band = attrs.band,
                radius = Math.min(width, height) / 2;

            var color = d3.scale.category20c();

            var arc = d3.svg.arc().outerRadius(radius - margin).innerRadius(radius - margin - band);

            attrs.$observe('data', function(value) {
                var data = angular.fromJson(value);
                var vis = d3.select(".pieChart")
                    .append("svg:svg")
                    .data([data])
                    .attr("width", width)
                    .attr("height", height)
                    .append("svg:g")
                    .attr("transform", "translate(" + radius + "," + radius + ")");

                var pie = d3.layout.pie()
                    .value(function(d) { return d.value; });

                var arcs = vis.selectAll("g.slice")
                    .data(pie)
                    .enter()
                    .append("svg:g")
                    .attr("class", "slice");

                arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } )
                    .attr("d", arc);

                arcs.append("svg:text")
                    .attr("transform", function(d) {
                        d.innerRadius = 0;
                        d.outerRadius = radius;
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d, i) { return data[i].label; });
            });

        }
    }
});