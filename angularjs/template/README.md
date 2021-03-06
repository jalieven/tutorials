# Introduction

This tutorial shows the fundamentals of AngularJS and how to write an event-based web-app.

This tutorial is really a mach-up between these 2 talks:

AngularJS Fundamentals In 60-ish Minutes : http://www.youtube.com/watch?v=i9MHigUZKEM

Gevent-socketio, cross-framework real-time web live demo : http://www.youtube.com/watch?v=xi4PNVk0RIc

# Installation

**IDE**
* [Webstorm](http://www.jetbrains.com/webstorm/)

**UI**
* [AngularJS](http://angularjs.org/)
* [Bootstrap](http://twitter.github.io/bootstrap/)
* [Bootstrap-DateTimePicker](http://www.malot.fr/bootstrap-datetimepicker/)
* [Darkstrap](https://github.com/danneu/darkstrap)
* [MomentJS](http://momentjs.com/)
* [SocketIO](http://socket.io/)
* [BreezeJS](http://www.breezejs.com/)

**TESTING**
* [NodeJS](http://nodejs.org/)
* [JasminJS](http://pivotal.github.io/jasmine/)
* [Karma](http://karma-runner.github.io/0.8/index.html)

**BACKEND**
* [Python](http://www.python.org/)
* [Gevent-SocketIO](https://gevent-socketio.readthedocs.org/en/latest/)
* [MongoDB](http://www.mongodb.org/)

___________________

# Tutorial

## UI

### Steps from scratch:

0. Take the most simple stream/index.html-page. Html-, Head-, Body-, metadata-tags,...
1. Add Bootstrap (responsive)/Darkstrap and own tweaks css. Add jquery.min.js, angular.min.js and bootstrap.min.js (+datetime picker) to the page. (All the latest versions)
2. Start coding in Bootstrap and come up with a cool static-mock-template-site that does absolutely nothing. All static pages...


### AngularJS Introduction

* What is AngularJS all about?

	* SPA-MVC (Single-Page-Application) (Model-View-Controller) framework. Say goodbye to roundtrip web-applications.
	* Routing, templating, validation
	* Bi-directional data-binding (Knock-out style but better)
	* Dependency Injection (RequireJS style but easier)
	* History. The back-button just works (if you don't rape AngularJS)
	* Testing the UI.
	* Most importantly: Structuring your Javascript-code through modularization

* Ok! But I don't give a rat's ass about your marketing talk. What does an AngularJS app consist of, what are the concepts?

	* Directives on the Views (no more code in the view)
	* Use of $scope with bi-directionality (the glue between View and Controller)
	* Controllers (tying things together)
	* Services, Factories, Providers (to fetch data from backend and promote real modular applications)
	* Modules and Config

	This would be a high-level ASCII-art overview:

				--------------
				| Module/App |
				--------------
					||
				----------
				| Config |
				----------
					||
				----------
				| Routes |
				----------
			   //        \\
		 --------        --------------
		 | View |-$scope-| Controller |
		 --------        --------------
			||					  ||
		--------------			--------------
		| Directives |			|  Factories  |
		--------------			|  Services   |
								|  Providers  |
								---------------


* What are these "(data-)ng-XXX" attributes for?

	W3C Specification says:

    Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements.
	These attributes are not intended for use by software that is independent of the site that uses the attributes.
    Every HTML element may have any number of custom data attributes specified, with any value.

	AngularJS says:

	We call them directives (see eg. http://docs.angularjs.org/api/ng.directive:ngRepeat) wich are markers so that the angular.js Javascript can do stuff
	with them at runtime, actually a way to teach html new tricks. Actually in the AngularJS internals this is performed by a thing called the HTML Compiler.
	The compiler is an angular service which traverses the DOM looking for attributes. The compilation process happens in two phases.

	* Compile: traverse the DOM and collect all of the directives. The result is a linking function.
	* Link: combine the directives with a scope and produce a live view.
			Any changes in the scope model are reflected in the view,
			and any user interactions with the view are reflected in the scope model.
			This makes the scope model the single source of truth.

    Some directives such ng-repeat clone DOM elements once for each item in collection.
    Having a compile and link phase improves performance since the cloned template only needs to be compiled once, and then linked once for each clone instance.

	So lets give web-developers a break by adding behaviour from those "data-" attributes and make the browser a better platform to develop in.
	Hooray!!! No more low-level fiddling around with the DOM structure in Javascript.
	So you can even go further and create your own DSL (as in your own custom HTML dialect).
	The directives can be placed in element names, attributes, class names, as well as comments and are basically just functions which executes when the compiler encounters it in the DOM.

* What's the deal with these scope-thingies?

	Both controllers and directives have reference to the scope, but not to each other. This arrangement isolates the controller from the directive as well as from DOM.
	This is an important point since it makes the controllers view agnostic, which greatly improves the testing story of the applications.

	For more info see: http://docs.angularjs.org/guide/scope

* How 'bout filters. What are those?

	It's the pipe character inside the moustache-bindings or "data-ng-repeat" and can be used to filter, change, order, ... the values it is piped to.

* What's the relation between the View and the Controllers?

	Normally the View wouldn't know about the Controller (but it can if you use the "data-ng-controller" directive, but this is not the recommended way of doing it).
	In the ideal case the view and the Controller will be tied together when defining the routes through the routeProvider.
	Inversely the Controller should absolutely never know about the View it is controlling! This makes the Controller view agnostic and makes testing your UI a breeze.

### From mock template to live application

#### Serve the app
First lets make sure we serve the static application via a web server in stead of file:// protocol (which is problematic in Chrome). Go to the directory where the index.html is:

```bash
python -m SimpleHTTPServer 8000
```

#### Initialize the app
Init the application with the "data-ng-app"-directive and show the bi-directional data-binding, a simple "data-ng-repeat" and "data-ng-init" along with a filter.

Here's the data-model:

		data-ng-init="events=[{
                            _id: '1',
                            occurrence: '2013/05/07 8:15:16',
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
                            comments: [{
                                    timestamp: '08/05/2013 8:17:16',
                                    user: 'gert',
                                    message: 'What the hell were you guys thinking?'
                                }, {
                                    timestamp: '08/05/2013 8:20:17',
                                    user: 'tina',
                                    message: 'Could I get that with fries?'
                                }
                            ]
                        }, {
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
                        }, {
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
                        }, {
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
                        }, {
                            _id: '5',
                            occurrence: '2013/05/08 18:14:27',
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
                    ]"

Put data-ng-repeat="event in events | orderBy: 'occurrence':true" (and binding moustaches for the well-divs!) in the well-element.

Now add a date filter to the binding of the date-badge: | date:'dd-MM-yyyy HH:mm:ss'
Actually we want a user-friendly date filter so do this:

```javascript
angular.module('streamApp').
filter('fromNow', function() {
	return function(dateString) {
		return moment(new Date(dateString)).fromNow()
	};
});
```

now use "| fromNow" as a filter.

#### Create a Module and modularize the application with routes, controllers and everything.

Start with the configuration of the app and explain the "dependency injection" syntax:

```javascript
var streamApp = angular.module('streamApp', []);
```

Now for the less recommended way of creating a Controller (so cut away the "data-ng-init" from earlier):

```javascript
streamApp.controller('StreamController', function($scope) {
	$scope.events = [{ /* copy JSON dict from earlier */ }];
});
```

Lets define all the routes now:

```javascript
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
            templateUrl: 'partial/comment.html'
        })
        .when('/search',
        {
            controller: 'SearchController',
            templateUrl: 'partial/search.html'
        })
        .otherwise({ redirectTo: '/'});

});
```

Or even better:

```javascript
var controllers = {};

controllers.StreamController = function ($scope) { ... }

controllers.EventController = function ($scope) { ... }

...

streamApp.controller(controllers);
```

Now break up the view with an "data-ng-view" to make a template out of the "stream" page and also the "about" page.

```html
<div data-ng-view=""></div>
```

And add the href to the "About" button on the view.

```html
<a href="#/about">...
```

If that is done show the history-feature in the browser.

Search for <select id="filter-tags"> and add data-ng-model="eventFilter.tags" attribute.

Since we have a single tag select as filter now refactor to a multiple select:

```javascript
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
```

Let's plug in the filter:

```html
<div class="well" data-ng-repeat="event in events | tagsFilter:eventFilter ...
```

Now lets fix the clear button:

```javascript
$scope.clearFilter = function(){
	$scope.eventFilter = {};
};
```

```html
<input class="btn btn-danger" style="clear: left; width: 100%; " type="reset" value="Clear" data-ng-click="clearFilter()" />
```

```javascript
$(function () {

	// Setup drop down menu
	$('.dropdown-toggle').dropdown();

	// Fix input element click problem
	$('.dropdown-menu input, .dropdown-menu select, .dropdown-menu label').click(function(e) {
		e.stopPropagation();
	});
});
```

#### Create an Event Use Case

Now that we can view and filter the stream we can now work on the event-creation use-case.

First put all the data-ng-model="newEvent.###" directives into the create-form and ultimately data-ng-click="createEvent()" onto the "Create"-btn.

Now we can create the controller createEvent() function, so add this into the StreamController:

```javascript
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
```

Now if we select a date-time we see that the value doesn't get binded. As it turns out Angular isn't observing the
input for "outside" changes, because it expects the value to only change if (a) the user changes it, or (b) it's changed by the controller.
To fix this we need to:
* Use the bootstrap-datetimepicker cuz it's awesome and I'm way to lazy to code something from scratch
* I'm going to need to wrap this plugin in a directive and use that directive. Doing it this way would be more inline with Angular and you'd be doing it "The Angular Way".
* Basically you'd want something like:

```html
<date-time-picker ng-model="newEvent.occurrence"></date-time-picker>
```

So make a new partial with the html placeholder code so that the datetimepicker library can modify this:

```html
<div class="control-group input-append date datetime">
	<input type="text" name="datetime" ng-model="ngModel">
	<span class="add-on"><em class="icon-remove"></em></span>
	<span class="add-on"><em class="icon-th"></em></span>
</div>
```

Create a new "date picking" custom directive:

```javascript
directives.directive('dateTimePicker', function(){
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
            });

            scope.$watch(attrs.ngModel, function(value){
               input.val(value);
            });

            element.bind('blur keyup change',  function() {
                ngModel.$setViewValue(input.val());
            });

        }
    }
});
```

TODO: do creation of the comments in angularjs use case...

#### Validation

The other directive that we want to cover in some depth here is the form validation controls and more specifically
the controls for the "create new event" form.
It is easy enough in the AngularJS world to set a particular form field “as required.”
Simply add the required tag to the input. But now what do you do with it?

For that, we jump down to the Save button. Put a "data-ng-disabled" directive on
it, which says "newEventForm.$invalid". The newEventForm is the name of the form
which we have declared. AngularJS adds some special variables to it ($valid and $invalid being just two)
that allow you to control the form elements. AngularJS looks at all the required elements and updates
these special variables accordingly. So if our Event message is empty, recipeForm.$invalid gets set to true
(and $valid to false), and our Save button is instantly disabled.

Correctly set the name-attributes of the input in the newEventForm and in the modal-header of the create event modal:

```html
<br/>

<div class="error alert" ng-show="newEventForm.message.$error.minlength">
	<button type="button" class="close" data-dismiss="alert">&times;</button>
	<strong>Warning!</strong> Message too short (should be at least 3 characters)!
</div>

<div class="error alert" ng-show="newEventForm.message.$error.maxlength">
	<button type="button" class="close" data-dismiss="alert">&times;</button>
	<strong>Warning!</strong> Message too long (should be maximum 280 characters)!
</div>
```

And now add some validation directives on the message input:

```html
<textarea name="message" id="create-message" class="input-large" placeholder="Message..."
    data-ng-model="newEvent.message" data-ng-minlength="3" data-ng-maxlength="280" required></textarea>
```

And on the "Create" button do this ("data-ng-disabled" is important here):

```html
<button class="btn btn-danger" data-dismiss="modal" data-ng-disabled="newEventForm.$invalid" data-ng-click="createEvent()">Create</button>
```

Ofcuz it is better to put this stuff in AngularJS custom directive.

#### Testing

Test the create event use-case and the custom directive:

For testing with Karma first install nodejs and npm. After that you can use npm to install karma and create an initial file:

```bash
	npm install -g karma
	cd /path/to/project/template/test
	karma init stream.conf.js
```

Make sure to anwer "Yes" on the question: "Do you want Testacular to watch all the files and run the tests on change?"
This step will create a stream.conf.js file in yout test directory.

After that you have to configure a "Karma Server" in WebStorm:

* Press the “+” button in the top-left of the “Run/Debug Configurations” dialog.
* Select “Node.js” in the list
* Name: enter “Karma Server”
* Path to Node: absolute path to NodeJS executable
* Working Directory: absolute path of your module test dir (i.e. /path/to/project/template/test)
* Path to Node App JS File: should point to the (globally) installed “Karma” NodeJs executable
* Application Parameters: "start stream.conf.js --no-single-run --auto-watch --reporters dots"

Now you are ready to write some test cases which you normally put in the directory "/path/to/project/template/test/js".
That is if you have the following in your stream.conf.js file:

	basePath = '../static';
	files = [
		JASMINE,
		JASMINE_ADAPTER,
		'js/vendor/jquery.min.js',
		'js/vendor/bootstrap.min.js',
		'js/vendor/bootstrap-datetimepicker.min.js',
		'js/vendor/moment.min.js',
		'js/vendor/angular.min.js',
		'../test/js/vendor/angular-mocks.js',
		'../test/js/*.unit.js'
	];

So make sure the basePath points to the JavaScript files that are to be watched and all files under "files" config-param
are accessible.

Now when you write tests for JavaScript in folder "test/js" and you change/save anything in "../static/js" that is tested
then those tests will be run auto-magically.

TODO
but first see: http://www.youtube.com/watch?v=APyRKfxHLgU
and http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-testacular.html#testing-controllers

## Backend

### Hooking up the backend into AngularJS

First off you'd want to know about callback functions in Javascript because that might come a handy when talking
factories, services and all that.
It so happens that in Javascript a function is an object so it makes sense to do this:

```javascript
// define our function with the callback argument
function someFunction(arg1, arg2, callback) {
	// this generates a random number between arg1 and arg2
	var myNumber = Math.ceil(Math.random() * (arg1 - arg2) + arg2);
	// then we're done, so we'll call the callback and pass our result
	callback(myNumber);
}
// call the function
someFunction(5, 15, function(num) {
	// this anonymous function will run when the callback is called
	console.log("callback called! " + num);
});
```

Javascript gives us an option to do things a bit differently. Rather than wait around for a function to finish
by returning a value, we can use callbacks to do it asynchronously. This is useful for things that take a while
to finish, like making an AJAX request, because we aren’t holding up the browser. This is sometimes referred to
as "Continuation Passing Style" programming.
A very bad side-effect of this structure is that you can get something called "The pyramid of Doom". Take a look
at this piece of code (which could potentially result in an endless anonymous function callback-stack, not very
readable indeed but all called asynchronously):

```javascript
range.on("preheat", function() {
	pot.on("boil", function() {
		rice.on("cooked", function() {
			dinner.serve(rice);
		});
	});
});
```

To refactor these structures let alone to handle errors in them is a pain in the *.

Instead we can circumvent these structures in AngularJS like this. Let's say we have 2 functions that we
would like to call but one after the other and both take a considerate amount of time (those freakin' slow
backends...). Very importantly the output of the first function must be processed in the second one.
Let's start off with a very naive function call-stack and build up from there.

```javascript
var firstFunction = function(param) {
	return param + ' - firstResult';
};

var secondFunction = function(param) {
	return param + ' - secondResult';
};

var thirdFunction = function(param) {
	$scope.result = param;
}
// ultimately we want to call them one after the other so we naively code:
thirdFunction(secondFunction(firstFunction()));
// but this code sucks cuz it blocks the further execution of the program
```

Here's how to do this the proper way in AngularJS with the $q api:

```javascript
// first we create a new 'deferred' object, which represents a chain of operations
var deferred = $q.defer();
// the 'promise' property represents the eventual result of the chain
var promise = deferred.promise;
// the 'then' method adds a step to the chain and then returns a new promise representing
// the eventual result of the extended chain
// you can add as many steps as you like
promise = promise.then(firstFunction).then(secondFunction).then(thirdFunction);
// so far, we have set up our chain of functions, but nothing has actually happened
// you get things started by calling deferred.resolve,
// specifying the initial value you want to pass to the first actual step in the chain
deferred.resolve('initial value');
// and then...still nothing happens
// to ensure that model changes are properly observed, Angular doesn't actually call the first step
// in the chain until the next time $apply is called
$scope.$apply();
```

Now how about error handling in this refactored structure?
Turns out you can provide a second function in the 'then' calls. Lets say we refactor our 'firstFunction' to
contain a error-case:

```javascript
// if param is a 'bad value' we reject the deferred execution
var firstFunction = function(param) {
	if (param == 'bad value') {
    	return $q.reject('invalid value');
    } else {
		return param + ' - firstResult';
    }
};
// and we define an error handling function:
var errorFn = function(message) {
   $scope.result = 'Badness happened: ' + message;
 };
```
So you can either place a error-handling function inside each 'then'-call or you can globally catch the case at the end.

Now we will use MongoLab as a first backend to store and retrieve the Events. MongoLab is actually a plain vanilla
MongoDB with a RESTful interface. This way we don't have to write a iota backend code.

We first define a separate "services" Angular module and inject that into our main 'streamApp'.
In the "services" module we'll put code on how to do CRUD operations on the Events resource.

```javascript
// our main app module (check out our "streamApp.services" injection!)
var streamApp = angular.module('streamApp', ['streamApp.services']);

// our new services module
var streamAppServices = angular.module('streamApp.services', ['ngResource']);

streamAppServices.factory('Event', function($resource) {
    return $resource('https://api.mongolab.com/api/1/databases/events/collections/event/:id',
        { apiKey: 'k8zps1HXroKSrtGtV_MBawdgtM6AblsF' },
        {
            get: {method: 'GET'},
			update: { method: 'PUT' },
			query:  {method:'GET', isArray:true}
        }
    );
});
```
So we defined an Angular "Resource" named 'Event'. The $resource api is actually a wrapper around the $http api.
If you want to go lower level you can always inject the $http instead of the $resource.

The first arg to the $resource function is the URL, the second is a hash with all the default-http-params and
the third one is an hash with declaration of custom action.

Instead of our lengthy JSON event domain model we do:
```javascript
...
controllers.StreamController = function ($scope, Event) {
	$scope.events = Event.query();
...
```

When we launch this you will probably see the following in your console:

	Error: No module: ngResource

So add the angular-resource.min.js to the JavaScript includes on the index.html page.
If all went well you'll see some events come in.

Notice that we haven't done anything with the promise api! Bad bad, not good!
Notice also that the html's and javascript gets loaded before we try to retrieve the events (the xhr call).
Add the following factory that will use the first factory (mind the 'Event' injection):

```javascript
streamAppServices.factory('EventsLoader', ['Event', '$q', function(Event, $q) {
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
```
Now we can change our StreamController into:

```javascript
...
controllers.StreamController = function ($scope, EventsLoader) {
	$scope.events = Event.query();
...
```

We can also make AngularJS make a call to EventsLoader when it is needed i.e. in the StreamController that is!
This way we can make sure everything is there (or shall I say injected) before we build up our UI-component and
testing this is a breeze!

```javascript
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
	...
```

The "resolve" directive in the "routeProvider" is an optional map of dependencies which should be injected
into the controller. If any of these dependencies are promises, they will be resolved and converted
to a value before the controller is instantiated.
Now check out the order in which the html, javascripts and the xhr are called!


Here's overview on how you can RESTfully call the MongoLab collections:

		/databases
		  GET - lists databases linked to the authenticated
				account
		/databases/<d>
		  GET - lists sub-services for database <d>
		/databases/<d>/collections
		  GET - lists collections in database <d>
		/databases/<d>/collections/<c>
		  GET - lists objects in collection <c>
		  POST - inserts a new object into collection <c>
		/databases/<d>/collections/<c>/<id>
		  GET - returns object with _id <id>
		  PUT - modifies object (or creates if new)
		  DELETE - deletes object with _id <id>
		/databases/<d>/collections/<c>?[q=<query>][&c=true]
		  [&f=<fields>][&fo=true][&s=<order>]
		  [&sk=<skip>][&l=<limit>]
		  GET - lists all objects matching these
				optional params:
			q: JSON queryreference
			c: returns the result count for this query
			f: set of fields to be returned in each object
			   (1—include; 0—exclude)
			   e.g. { "name" : 1, "email": 1 } OR
			   e.g. { "comments" : 0 }
		   fo: return a single object from the result set
			   (same as 'findOne()' in the mongo shell)
			s: sort order (1—asc; -1—desc)
			   i.e. { <field> : <order> }
		   sk: number of results to skip in the result set
			l: limit for the number of results
		/databases/<d>/collections/<c>?[q=<query>][&m=true]
		  [&u=true]
		  PUT - updates one or all objects matching the query.
				payload should contain modifier operations
			q: JSON queryreference
			m: apply update to all objects in result set
			   (by default, only one is updated)
			u: insert if none match the query (upsert)

Now we want to make sure our create event use case hooks up with our MongoLab backend. This is very easy with the
resource api (mind the injected "Event" object).

```javascript
controllers.StreamController = function ($scope, events, Event) {
    ...
    $scope.createEvent = function() {
        // wrap the non resource object into a resource object
        $scope.newEvent = new Event($scope.newEvent);
        // then call save on that object and when saved add it to the list
        $scope.newEvent.$save(function(savedEvent) {
			// we have to push cuz we don't want to load it back from the backend
			// we just got the saved entity (with _id and all) from the backend
            $scope.events.push(savedEvent);
        });
    };
}
```

### Last split-up refactor

Now for the last part we split up the stream.js file into multiple module files like so:

1. filters.js > filters "fromNow" and "tagsFilter"
2. directives.js > directives "dateTimePicker"
3. services.js > all the factories to do operations on
4. app.js > controllers and config with all the other modules injected

