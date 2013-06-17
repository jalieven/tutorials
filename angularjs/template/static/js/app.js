var streamApp = angular.module('streamApp', ['streamApp.services', 'streamApp.filters', 'streamApp.directives']);

var controllers = {};

controllers.StreamController = function ($scope, events, Event) {

    $scope.events = events;

    $scope.clearFilter = function(){
        $scope.eventFilter = {};
    };

    $scope.selectEvent = function(id) {
        angular.forEach($scope.events, function(event) {
            if(event._id.$oid == id) {
                $scope.commentEvent = new Event(event);
            }
        });
    }

    $scope.addComment = function() {
        if($scope.commentEvent.comments == undefined) {
            $scope.commentEvent.comments = [];
        }
        $scope.commentEvent.comments.push($scope.commentEvent.newComment);
        $scope.commentEvent.$update({id: $scope.commentEvent._id.$oid, comments: $scope.commentEvent.comments}, function(event) {
            $scope.commentEvent.comments = event.comments;
        });
    }

};

controllers.NewController = function($scope, $location, Event) {

    $scope.createEvent = function() {
        $scope.newEvent = new Event($scope.newEvent);
        $scope.newEvent.$save(function(savedEvent) {
            $location.path('/');
        });
    };

};

controllers.AboutController = function ($scope) {
    // TODO
};

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
        .when('/new',
        {
            controller: 'NewController',
            templateUrl: 'partial/new.html'
        })
        .when('/about',
        {
            controller: 'AboutController',
            templateUrl: 'partial/about.html'
        })
        .otherwise({ redirectTo: '/'});
});