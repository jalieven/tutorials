var topoMapDirective = angular.module('topoMap', []);

// TODO plug it in!

topoMapDirective.directive('topoMap', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="topoMap"></div>',
        link: function(scope, element, attrs) {

            var width = attrs.width,
                height = attrs.height,
                scale = attrs.scale,
                color1 = attrs.color1,
                color2 = attrs.color2,
                topojson = attrs.topojson;

            var xym = d3.geo.albers()
                .center([0, 55.4])
                .rotate([-4.2, 4.3])
                .parallels([55, 65])
                .scale(scale);

            var path = d3.geo.path().projection(xym);

            var svg = d3.select(".topoMap")
                .append("svg").attr("id","svgoriginal").attr("width", width)
                .attr("height", height);

            var path_group = svg.append("g")
                .attr("id", "path_group");

            d3.json(topojson, function (json) {
                path_group.selectAll("path")
                    .data(topojson.feature(json, json.objects.vlaamse_hoofdgemeenten).features)
                    .enter().append("path")
                    .attr("fill", color1)
                    .attr("id", function(d) {
                        return d.id;
                    }).on('mouseover', function() {
                        d3.select("#pointerSelection").text(ucwords(this.id.toLowerCase().replace(/_/g, '-')));
                        d3.select(this).attr("fill", color2);
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr("fill", color1);
                    })
                    .on('click', function() {
                        d3.selectAll(".gisSelection").text(ucwords(this.id.toLowerCase().replace(/_/g, '-')));
                        var selected_data = nested_data.get(2009).get(this.id).get("CO2");
                        scope.data = addPercentages(selected_data);
                        scope.$apply();
                    })
                    .attr("d", path);
            });

        }
    }
});