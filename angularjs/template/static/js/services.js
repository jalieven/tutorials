var services = angular.module('streamApp.services', ['ngResource']);

services.factory('Event', function($resource) {
    return $resource('https://api.mongoolab.com/api/1/databases/events/collections/event/:id',
        { apiKey: 'k8zps1HXroKSrtGtV_MBawdgtM6AblsF', q: '@q' },
        {
            get: {method: 'GET'},
            update: { method: 'PUT' },
            query:  {method:'GET', isArray:true}
        }
    );
});

services.factory('EventsLoader', ['Event', '$q', function(Event, $q) {
    return function() {
        var delay = $q.defer();
        Event.query(function(events) {
            delay.resolve(events);
        }, function() {
            delay.reject('Unable to fetch events!');
        });
        return delay.promise;
    };
}]);

services.factory('EventLoader', ['Event', '$route', '$q', function(Event, $route, $q) {
    return function() {
        var delay = $q.defer();
        Event.get({id: $route.current.params.eventId}, function(event) {
            delay.resolve(event);
            delay.reject('Unable to fetch event ' + $route.current.params.eventId);
        });
        return delay.promise;
    };
}]);

services.factory('$socketio', function ($rootScope) {
    var socket = io.connect('http://localhost:8888/eventstream');
    socket.on('connect', function () {
        toastr.options.toastClass = 'notification';
        toastr.options.timeOut = 15000;
        toastr.options.extendedTimeOut = 15000;
        toastr['success']('', 'Live streaming available!');
    });
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    }
});
