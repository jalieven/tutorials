var topoMapDirective = angular.module('topoMap', []);

topoMapDirective.directive('topoMap', function(){
    return {
        restrict: 'E',
        replace: true,
//        scope: {
//            mouseOverMap: "&",
//            mouseOutMap: "&",
//            clickMap: "&"
//        },
        template: '<div class="topoMap"></div>',
        link: function(scope, element, attrs) {

            var width = attrs.width,
                height = attrs.height,
                scale = attrs.scale,
                color = attrs.color,
                center = attrs.center,
                rotate = attrs.rotate,
                parallels = attrs.parallels;

            var xym = d3.geo.albers()
                .center(center)
                .rotate(rotate)
                .parallels(parallels)
                .scale(scale);

            var path = d3.geo.path().projection(xym);

            var svg = d3.select(".topoMap")
                .append("svg").attr("id","svgoriginal").attr("width", width)
                .attr("height", height);

            var path_group = svg.append("g")
                .attr("id", "path_group");

            attrs.$observe('topology', function(topology) {
                if(topology.length > 0) {
                    var topo = angular.fromJson(topology);
                    path_group.selectAll("path")
                        .data(topojson.feature(topo, objects).features)
                        .enter().append("path")
                        .attr("fill", color)
                        .attr("id", function(d) {
                            return d.id;
                        }).on('mouseover', function() {
                            scope.mouseOverMap(this);
                        }).on('mouseout', function() {
                            scope.mouseOutMap(this);
                        }).on('click', function() {
                            scope.clickMap(this);
                        })
                        .attr("d", path);
                }
            });

        }
    }
});