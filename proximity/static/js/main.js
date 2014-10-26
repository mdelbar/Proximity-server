require.config({
  paths: {
    jquery: 'libs/jquery.min',
    underscore: 'libs/underscore-min',
    backbone: 'libs/backbone-min',
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
});

define(['jquery', 'underscore', 'backbone', 'proximity'], function() {
  
  $(document).ready(function() {
    var ProximityApp = Backbone.View.extend({
      initialize: function() {
        var indexRouter = new IndexRouter();
      }
    });
  
    window.App = new ProximityApp();
  });
  
});

