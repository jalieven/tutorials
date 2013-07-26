var directives = angular.module('streamApp.directives', []);

directives.directive('dateTimePicker', function(){
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel', // the '?' means: if the required controller is not found,
        // Angular will throw an exception to tell you about the problem
        templateUrl: 'partial/datetimepicker.html',
        link: function(scope, element, attrs, ngModel){
            var input = element.find('input');

            element.datetimepicker({
                format: "yyyy/mm/dd hh:ii:ss",
                pickerPosition: 'bottom-left',
                autoclose: true,
                todayBtn: true
            });
            // $watch takes either a function or a string:
            // If it is a function then this function will get called on every loop of the
            // $digest and the return value from this function is taken
            // sas the value to compare against previous iterations.
            scope.$watch(ngModel, function(value){
               input.val(value);
            });

            element.bind('blur keyup change',  function() {
                ngModel.$setViewValue(input.val());
            });

        }
    }
});


directives.directive('arcTween', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="arctween"></div>',
        link: function(scope, element, attrs){
            // Use $observe when you need to observe/watch a DOM attribute
            // that contains interpolation (i.e., {{}}'s).
            attrs.$observe('meter', function(value) {
                var scale = d3.scale.linear()
                    .range([0,1])
                    .domain([attrs.min,attrs.max]);

                foreground.transition()
                    .duration(attrs.tweenDuration)
                    .call(arcTween, scale(value) * τ);
            });

            var width = attrs.outerRadius * 2.1,
                height = attrs.outerRadius * 2.1,
                τ = 2 * Math.PI;

            var arc = d3.svg.arc()
                .innerRadius(attrs.innerRadius)
                .outerRadius(attrs.outerRadius)
                .startAngle(0);
            var svg = d3.select(".arctween").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            var background = svg.append("path")
                .datum({endAngle: τ})
                .style("fill", attrs.backgroundColor)
                .attr("d", arc);
            var foreground = svg.append("path")
                .datum({endAngle: τ})
                .style("fill", attrs.foregroundColor)
                .attr("d", arc);

            function arcTween(transition, newAngle) {
                transition.attrTween("d", function(d) {
                    var interpolate = d3.interpolate(d.endAngle, newAngle);
                    return function(t) {
                        d.endAngle = interpolate(t);
                        return arc(d);
                    };
                });
            }

        }
    }
});


