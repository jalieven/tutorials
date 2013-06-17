var services = angular.module('streamApp.services', ['ngResource']);

services.factory('Event', function($resource) {
    return $resource('https://api.mongolab.com/api/1/databases/events/collections/event/:id',
        { apiKey: 'k8zps1HXroKSrtGtV_MBawdgtM6AblsF' },
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
            delay.reject('Unable to fetch event ' + $route.current.params.recipeId);
        });
        return delay.promise;
    };
}]);