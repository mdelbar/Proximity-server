require.config({
  paths: {
    jquery: 'libs/jquery.min',
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

define('googlemaps', ['async!http://maps.google.com/maps/api/js?sensor=false'], function() {
    // Google Maps API and all its dependencies will be loaded here.
});

define(['jquery', 'underscore', 'backbone', 'googlemaps', 'proximity'], function() {
  
  $(document).ready(function() {
    var ProximityApp = Backbone.View.extend({
      initialize: function() {
        var indexRouter = new IndexRouter();
      }
    });
  
    window.App = new ProximityApp({appendTo: $('body')});
  });
  
});

