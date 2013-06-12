var streamApp = angular.module('streamApp', []);

var controllers = {};

controllers.StreamController = function ($scope) {

    $scope.events = [
        {
            _id: '1',
            occurrence: '2013/06/07 8:15:16',
            instigators: [
                'jalie', 'tiroo'
            ],
            judgement: [
                'INFORMATIVE', 'PALM_FACE'
            ],
            tags: [
                'HACK', 'COMMIT-AND-RUN'
            ],
            link: 'http://www.someurl.be',
            message: 'Some text here...',
            comments: [
                {
                    timestamp: '08/05/2013 8:17:16',
                    user: 'gert',
                    message: 'What the hell were you guys thinking?'
                },
                {
                    timestamp: '08/05/2013 8:20:17',
                    user: 'tina',
                    message: 'Could I get that with fries?'
                }
            ]
        },
        {
            _id: '2',
            occurrence: '2013/05/08 10:15:10',
            instigators: [],
            judgement: [
                'INFORMATIVE'
            ],
            tags: [
                'NEXUS'
            ],
            link: 'http://www.milieuinfo.be/repository',
            message: 'New release PRTR 1.2.13',
            comments: []
        },
        {
            _id: '3',
            occurrence: '2013/05/08 11:15:20',
            instigators: [
                'jalie'
            ],
            judgement: [
                'INFORMATIVE'
            ],
            tags: [
                'REDEPLOYMENT'
            ],
            link: 'http://oefen.milieuinfo.be/prtr',
            message: 'Installing new version 1.2.13'
        },
        {
            _id: '4',
            occurrence: '2013/04/08 18:12:27',
            instigators: [
                'jalie'
            ],
            judgement: [
                'FUNNY'
            ],
            tags: [
                'QUIP'
            ],
            link: 'http://www.chucknorrisfacts.com/all-chuck-norris-facts',
            message: 'Chuck Norris can count to infinity. Backwards.'
        },
        {
            _id: '5',
            occurrence: '2013/06/11 18:14:27',
            instigators: [
                'jalie'
            ],
            judgement: [
                'FUNNY'
            ],
            tags: [
                'QUIP'
            ],
            link: 'http://www.chucknorrisfacts.com/all-chuck-norris-facts',
            message: 'When Chuck Norris was born he slapped the doctor to test his reflexes.'
        }
    ];

    $scope.clearFilter = function(){
        $scope.eventFilter = {};
    };

    $scope.createEvent = function() {
        $scope.events.push(
            {   occurrence: $scope.newEvent.occurrence,
                instigators: $scope.newEvent.instigators,
                judgement: $scope.newEvent.judgement,
                tags: $scope.newEvent.tags,
                link: $scope.newEvent.link,
                message: $scope.newEvent.message,
                comments:[]
            }
        );
    };

    $scope.dateChanged = function() {
        alert($scope.newEvent.occurrence);
    }

}

controllers.AboutController = function ($scope) {

}

streamApp.controller(controllers);

streamApp.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'StreamController',
            templateUrl: 'partial/stream.html'
        })
        .when('/about',
        {
            controller: 'AboutController',
            templateUrl: 'partial/about.html'
        })
        .otherwise({ redirectTo: '/'});
});

streamApp.filter("tagsFilter", function () {
    return function (events, eventFilter) {
        var out = [];
        if (eventFilter && eventFilter.tags) {
            angular.forEach(events, function (event) {
                for (var i = 0; i < event.tags.length; i++) {
                    if ($.inArray(event.tags[i], eventFilter.tags) != -1) {
                        out.push(event);
                    }
                }
            })
        } else {
            out = events;
        }
        return $.unique(out);
    };
});

streamApp.filter('fromNow', function () {
    return function (dateString) {
        return moment(new Date(dateString)).fromNow()
    };
});


streamApp.directive('dateTimePicker', function(){
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
            })

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
