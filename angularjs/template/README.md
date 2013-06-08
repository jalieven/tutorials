# Introduction

This tutorial shows the fundamentals of AngularJS and how to write an event-based web-app.

This tutorial is really a mach-up between these 2 talks:

AngularJS Fundamentals In 60-ish Minutes : http://www.youtube.com/watch?v=i9MHigUZKEM
Gevent-socketio, cross-framework real-time web live demo : http://www.youtube.com/watch?v=xi4PNVk0RIc

# Installation

	**IDE**
	* Webstorm

	**UI**
	* AngularJS
	* Bootstrap
	* Darkstrap
	* SocketIO
	* BreezeJS

	**TESTING**
	* NodeJS
	* JasminJS
	* Karma

	**BACKEND**
	* Python
	* LibEvent
	* MongoDB


# Tutorial

## UI

### Steps from scratch:

0. Take the most simple stream/index.html-page. Html-, Head-, Body-, metadata-tags,...
1. Add Bootstrap (responsive)/Darkstrap and own tweaks css. Add jquery.min.js, angular.min.js and bootstrap.min.js to the page. (All the latest versions)
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

			----------
			| Module |
			----------
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
                              ||
                        --------------
                        |  Factories  |
                        |  Services   |
                        |  Providers  |
                        ---------------


* What are these "data-" (or less standard "ng-") attributes for?

	W3C Specification says:

    Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements.
	These attributes are not intended for use by software that is independent of the site that uses the attributes.
    Every HTML element may have any number of custom data attributes specified, with any value.

	AngularJS says:

	We call them directives (see eg. http://docs.angularjs.org/api/ng.directive:ngRepeat) wich are markers so that the angular.js Javascript can do stuff
	with them at runtime. So lets give web-developers a break by adding behaviour from those "data-" attributes and make the browser a better platform to develop in.
	Hooray!!! No more low-level fiddling around with the DOM structure in Javascript.



### From mock template to live application

0. Init the application with the "ng-app"-directive and show the bi-directional data-binding and a simple ng-repeat.
1. Create a Module and modularize the application with routes and everything
2. Create an custom directive for the event-well.
3. Tie in the backend with a Service (and BreezeJS).