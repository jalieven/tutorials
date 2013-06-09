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

	It's the pipe character inside the moustache-bindings or "ng-repeat" and can be used to filter, change, order, ... the values it is piped to.

* What's the relation between the View and the Controllers?

	Normally the View wouldn't know about the Controller (but it can if you use the "ng-controller" directive, but this is not the recommended way of doing it).
	In the ideal case the view and the Controller will be tied together when defining the routes through the routeProvider.
	Inversely the Controller should absolutely never know about the View it is controlling! This makes the Controller view agnostic and makes testing your UI a breeze.

### From mock template to live application

0. Init the application with the "ng-app"-directive and show the bi-directional data-binding, a simple "ng-repeat" and "ng-init" along with a filter.

	init the app with ng-app="stream"

	ng-init="events=[{
                            _id: '1',
                            occurance: '2013/05/07 8:15:16',
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
                            occurance: '2013/05/08 10:15:10',
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
                            occurance: '2013/05/08 11:15:20',
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
                            occurance: '2013/04/08 18:12:27',
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
                            occurance: '2013/05/08 18:14:27',
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

	ng-repeat="event in events" (and binding moustaches for the well-divs!)

	search for <select id="filter-tags">:
		add ng-model="eventFilter.tags" attribute
		and in our previous ng-repeat="event in events | filter:eventFilter | orderBy: 'occurance'"
		now add a date filter to the binding of the date-badge: | date:'dd-MM-yyyy HH:mm:ss'
		actually we want a user-friendly date filter so do this:

			angular.module('streamApp').
              	filter('fromNow', function() {
                	return function(dateString) {
                  		return moment(new Date(dateString)).fromNow()
                	};
              	});

            now use "| fromNow" as a filter. (thx to http://www.34m0.com/2012/07/angularjs-user-friendly-date-display.html)

1. Create a Module and modularize the application with routes, controllers and everything.

	Start with the configuration of the app and explain the "dependency injection" syntax:

		var streamApp = angular.module('streamApp', []);

	Now for the less recommended way of creating a Controller (so cut away the "ng-init" from earlier):

		streamApp.controller('StreamController', function($scope) {
            $scope.events = [{ /* copy JSON dict from earlier */ }];
        });

    Lets define 2 routes now: the stream page and the about page:

    	streamApp.config(function ($routeProvider) {
           $routeProvider
               .when('/',
                    {
                        controller: 'StreamController',
                        templateUrl: 'stream.html'
                    })
               .when('/about',
                    {
                        controller: 'AboutController',
                        templateUrl: 'about.html'
                    })
               .otherwise({ redirectTo: '/'});
        });

	Now break up the view with an "ng-view" to make a template out of the "stream" page and also the "about" page.

		<div ng-view=""></div>

	And add the href to the "About" button on the view.

		<a href="#/about">...

	If that is done show the history-feature in the browser.

3. Now that we can view the stream and filter it we can now work on the event-creation use-case.

	First put all the ng-model="newEvent.###" directives into the create-form and ultimately ng-click="createEvent()" onto the "Create"-btn.

	Now we can create the controller createEvent() function, so add this into the StreamController:

		$scope.createEvent = function() {
			$scope.events.push(
				{   occurance: $scope.newEvent.occurance,
					instigators: $scope.newEvent.instigators,
					judgement: $scope.newEvent.judgement,
					tags: $scope.newEvent.tags,
					link: $scope.newEvent.link,
					message: $scope.newEvent.message,
					comments:[]
				}
			);
		};

	TODO: do something similar with the comments...

4. Create an custom directive for the "event-well" which is used all over the place.

	TODO

5. Tie in the backend with a Service (and BreezeJS).

	TODO

6. I18n

	TODO
	but first understand: http://codingsmackdown.tv/blog/2012/12/14/localizing-your-angularjs-app/

7. Test the create event use-case and the custom directive:

	TODO
	but first see: http://www.youtube.com/watch?v=APyRKfxHLgU