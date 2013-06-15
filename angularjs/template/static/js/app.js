var streamApp = angular.module('streamApp', ['streamApp.services', 'streamApp.filters', 'streamApp.directives']);

var controllers = {};

controllers.StreamController = function ($scope, events) {

    $scope.events = events;

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

}

controllers.AboutController = function ($scope) {
    // TODO
}

streamApp.controller(controllers);

streamApp.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'StreamController',
            templateUrl: 'partial/stream.html',
            resolve: {
                events: function(EventsLoader) {
                    return EventsLoader();
                }
            }
        })
        .when('/about',
        {
            controller: 'AboutController',
            templateUrl: 'partial/about.html'
        })
        .otherwise({ redirectTo: '/'});
});