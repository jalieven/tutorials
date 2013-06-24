var streamApp = angular.module('streamApp', ['streamApp.services', 'streamApp.filters', 'streamApp.directives']);

var controllers = {};

controllers.StreamController = function ($scope, events, $socketio) {
 
    

    $scope.events = events;
    $scope.eventFilter = {};
    $scope.eventFilter.past = true;

    $socketio.on('socket_event', function(data) {
	$scope.events.push(data);
    });

    $scope.clearFilter = function(){
        $scope.eventFilter = {};
    };

};

controllers.EventController = function($scope, $location, Event) {
    $scope.newEvent = {};
    $scope.newEvent.occurrence = moment().format("YYYY/MM/DD HH:mm:ss");

    $scope.createEvent = function() {
        // first create the not yet used comments array
        $scope.newEvent.comments = [];
        $scope.newEvent = new Event($scope.newEvent);
        $scope.newEvent.$save(function(savedEvent) {
            $location.path('/');
        });
    };

};

controllers.CommentController = function($scope, $location, event) {

    $scope.event = event;

    $scope.addComment = function() {
        $scope.event.comments.push(
            {
                userid: 'jalie',
                timestamp: moment().format("YYYY/MM/DD HH:mm:ss"),
                message: $scope.newComment
            });
        var eventId =  $scope.event._id.$oid;
        // the following line might look a bit odd but is due to some weirdness in MongoLab
        $scope.event._id = undefined;
        $scope.newComment = '';
        $scope.event.$update({id: eventId});
    }

};

streamApp.controller(controllers);

var notificationInterceptor = function($q) {
    return function(promise) {
        var resolve = function(response) {
            return response;
        };
        var reject = function(response) {
            toastr.options.toastClass='notification';
            toastr.options.timeOut = 50000;
            toastr.options.extendedTimeOut = 50000;
            toastr['error'](response.config.url, 'HTTP Error while fetching');
	    return $q.reject(response);
        };
        return promise.then(resolve, reject);
    }
};

streamApp.config(function ($routeProvider, $httpProvider) {

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
        .when('/event',
        {
            controller: 'EventController',
            templateUrl: 'partial/event.html'
        })
        .when('/event/:eventId/comment',
        {
            controller: 'CommentController',
            templateUrl: 'partial/comment.html',
            resolve: {
                event: function(EventLoader) {
                    return EventLoader();
                }
            }
        })
        .otherwise({ redirectTo: '/'});

    $httpProvider.responseInterceptors.push(notificationInterceptor);
    
});


