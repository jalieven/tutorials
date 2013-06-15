var filters = angular.module('streamApp.filters', []);

filters.filter("tagsFilter", function () {
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

filters.filter('fromNow', function () {
    return function (dateString) {
        return moment(new Date(dateString)).fromNow()
    };
});