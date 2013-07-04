var streamApp = angular.module('streamApp', ['streamApp.services', 'streamApp.filters', 'streamApp.directives']);

var controllers = {};

controllers.StreamController = function ($scope, events, $socketio) {

    $scope.events = events;
    $scope.eventFilter = {};
    $scope.eventFilter.past = true;

    $scope.clearFilter = function () {
        $scope.eventFilter = {};
    };

    // when we are on the eventstream and a new event was created we add it to the stream
    $socketio.on('event_created', function (data) {
        $scope.events.push(data.event);
    });

    // when we are on the eventstream and a new comment was created we notify with toastr
    $socketio.on('comment_created', function (data) {
        toastr.options.toastClass = 'notification';
        toastr.options.timeOut = 5000;
        toastr.options.extendedTimeOut = 5000;
        toastr['info']('<a href="/#' + data.url + '">Click me</a>', 'New comment added');
    });

};

controllers.EventController = function ($scope, $location, $socketio, Event) {
    $scope.newEvent = {};
    $scope.newEvent.occurrence = moment().format("YYYY/MM/DD HH:mm:ss");

    $scope.createEvent = function () {
        // first create the not yet used comments array
        $scope.newEvent.comments = [];
        // convert the occurrence into ISO so it's queryable
        $scope.newEvent.occurrence = moment($scope.newEvent.occurrence);
        // wrap the newly created event in a $resource
        $scope.newEvent = new Event($scope.newEvent);
        // save the newly created event to MongoLab
        $scope.newEvent.$save(function (savedEvent) {
            // now notify all other web-sockets
            $socketio.emit('event_created',
                {eventId: savedEvent._id.$oid, url: '/event/' + savedEvent._id.$oid + '/comment', event: $scope.newEvent},
                function () {
                    // change back to root: event stream page will show our new event via a collection GET
                    $location.path('/');
                });
        });
    };
};

controllers.CommentController = function ($scope, $location, $socketio, event) {
    // put the retrieved event (by id) on the scope
    $scope.event = event;

    $scope.addComment = function () {
        // what event are we talking about?
        var eventId = $scope.event._id.$oid;
        // then create a comment object
        var createdComment = {};
        createdComment.userid = 'jalie';
        // since the datetimepicker uses UTC we have to do it here also
        createdComment.timestamp = moment.utc();
        createdComment.message =  $scope.newComment;
        // clear the new comment field
        $scope.newComment = '';
        // push it onto the event
        $scope.event.comments.push(createdComment);
        // the following line might look a bit odd but is due to some weirdness in MongoLab
        $scope.event._id = undefined;
        // do a PUT operation on MongoLab
        $scope.event.$update({id: eventId}, function(savedEvent) {
            // now notify all other web-sockets
            $socketio.emit('comment_created',
                {eventId: eventId, url: '/event/' + eventId + '/comment', comment: createdComment}, function () {
                    // nothing to do here
                });
        });
    }

    // when we are on the comment page and someone added a comment on that event we add it to the page
    $socketio.on('comment_created', function (data) {
        if (data.eventId == $scope.event._id.$oid) {
            $scope.event.comments.push(data.comment);
        }
    });

    // when we are on the comment page there was a new event we notify with toastr
    $socketio.on('event_created', function (data) {
        // TODO do only notifications when the eventFilter matches!

    });

};

controllers.SearchController = function($scope, $socketio, Event) {

    $scope.searchEvent = {};

    $scope.searchForEvent = function () {
         var search = {
             tags: $scope.searchEvent.tags,
             instigators: $scope.searchEvent.instigators,
             judgement: $scope.searchEvent.judgement
        };

        var query = JSON.stringify(search);
        $scope.foundEvents = Event.query({}, {q: query});
    };

};

streamApp.controller(controllers);

var notificationInterceptor = function ($q) {
    return function (promise) {
        var resolve = function (response) {
            return response;
        };
        var reject = function (response) {
            toastr.options.toastClass = 'notification';
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
                events: function (EventsLoader) {
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
                event: function (EventLoader) {
                    return EventLoader();
                }
            }
        })
        .when('/search',
        {
            controller: 'SearchController',
            templateUrl: 'partial/search.html'
        })
        .otherwise({ redirectTo: '/'});

    $httpProvider.responseInterceptors.push(notificationInterceptor);

});


