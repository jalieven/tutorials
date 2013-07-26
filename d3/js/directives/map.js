var mapDirective = angular.module('map', []);

// TODO plug it in!

mapDirective.directive('map', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="map"></div>',
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

            var svg = d3.select("#gis")
                .append("svg").attr("id","svgoriginal").attr("width", width)
                .attr("height", height);

            var gemeentes = svg.append("g")
                .attr("id", "gemeentes");

            d3.json(topojson, function (json) {
                gemeentes.selectAll("path")
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

            function ucwords(input) {
                var words = input.split(/(\s|-)+/),
                    output = [];
                for (var i = 0, len = words.length; i < len; i += 1) {
                    output.push(words[i][0].toUpperCase() +
                        words[i].toLowerCase().substr(1));
                }
                return output.join('');
            }

        }
    }
});