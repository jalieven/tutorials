var directives = angular.module('streamApp.directives', []);

directives.directive('dateTimePicker', function(){
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        templateUrl: 'partial/datetimepicker.html',
        link: function(scope, element, attrs, ngModel){
            var input = element.find('input');

            element.datetimepicker({
                format: "yyyy/mm/dd hh:ii:ss",
                pickerPosition: 'bottom-left',
                autoclose: true,
                todayBtn: true
            });

            element.bind('blur keyup change', function() {
                scope.$apply(read);
            });

            read(); // initialize

            // Write data to the model
            function read() {
                ngModel.$setViewValue(input.val());
            }
        }
    }
});