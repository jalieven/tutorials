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

            scope.$watch(attrs.ngModel, function(value){
               input.val(value);
            });

            element.bind('blur keyup change',  function() {
                ngModel.$setViewValue(input.val());
            });


        }
    }
});