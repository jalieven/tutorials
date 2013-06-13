describe("Custom directive 'dateTimePicker':", function() {

    var el;

    beforeEach(module('streamApp'));
    beforeEach(module('partial/datetimepicker.html'));
    beforeEach(inject(function($compile, $rootScope) {
        var scope = $rootScope;

        scope.newEvent = {occurrence : '2008/10/10 12:00:0'};

        el = angular.element('<date-time-picker ng-model="newEvent.occurrence"></date-time-picker>');
        $compile(el)(scope);
        scope.$digest();
        console.log(el[0]);
    }));


    it("to work correctly", function() {


        var a = 12;
        var b = a;
        expect(a).toBe(b);
        expect(a).not.toBe(null);
    });
});
