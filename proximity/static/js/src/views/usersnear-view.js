var UsersNearView = Backbone.View.extend({
  
  el: $('#map-canvas'),
  
  initialize: function() {
    _.bindAll(
      this, 
      'render'
    );
  },
  
  render: function(users) {
    var mapTemplate = _.template($('#map-template').html());
    this.$el.empty();
    this.$el.append(mapTemplate({'users': users}));
  }
});
