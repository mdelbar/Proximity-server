require.config({
  paths: {
    jquery: 'libs/jquery.min',
    foundation: 'libs/foundation.min',
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
    async: 'libs/async',
    proximity: 'build/proximity'
  },
  shim: {
		backbone : {
			deps : ['underscore','jquery'],
			exports : 'Backbone'
		},
		foundation: {
		  deps : ['jquery']
		},
		underscore : {
			exports : '_'
		},
		proximity : {
			deps : ['backbone']
		}
	},
	// Longer timeout because Google Maps is loaded async and can take some time
	waitSeconds: 30
});

define('googlemaps', ['async!https://maps.google.com/maps/api/js?key=AIzaSyB9kiwVwxAlD81EZZzgf_5j-VF2ljD83Ec'], function() {
    // Google Maps API and all its dependencies will be loaded here.
});

define(['jquery', 'foundation', 'underscore', 'backbone', 'googlemaps', 'proximity'], function() {
  
  // Launch Foundation
  $(document).foundation({});
  
  // Launch Proximity
  $(document).ready(function() {
    var ProximityApp = Backbone.View.extend({
      initialize: function() {
        // Start up the main router
        var indexRouter = new IndexRouter();
      }
    });
  
    window.App = new ProximityApp({appendTo: $('body')});
  });
  
});

