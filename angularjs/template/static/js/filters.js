var filters = angular.module('streamApp.filters', []);

filters.filter("tagsFilter", function () {
    return function (events, eventFilter) {
        var out = [];

        var now = moment();
        angular.forEach(events, function (event) {
            for (var i = 0; i < event.tags.length; i++) {
                time = moment(event.occurrence);
                if (eventFilter.past && time.isBefore(now)) {
                    if (eventFilter.tags) {
                        if ($.inArray(event.tags[i], eventFilter.tags) != -1) {
                            out.push(event);
                        }
                    } else {
                        out.push(event);
                    }
                } else if(!eventFilter.past) {
                    if (eventFilter.tags) {
                        if ($.inArray(event.tags[i], eventFilter.tags) != -1) {
                            out.push(event);
                        }
                    } else {
                        out.push(event);
                    }
                }
            }
        });
        return $.unique(out);
    };
});

filters.filter('fromNow', function () {
    return function (dateString) {
        return moment(dateString).fromNow();
    };
});
