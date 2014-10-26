var UsersView = Backbone.View.extend({
  
  el: $('#map-canvas'),
  
  render: function(users) {
    var mapTemplate = _.template($('#map-template').html());
    this.$el.empty();
    this.$el.append(mapTemplate({'users': users}));
  }
});