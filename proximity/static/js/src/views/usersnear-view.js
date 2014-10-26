var UsersNearView = Backbone.View.extend({
  
  el: $('#users'),
  
  initialize: function() {
    _.bindAll(
      this, 
      'render'
    );
  },
  
  render: function(users) {
    var userTemplate = _.template($('#userlist-template').html());
    this.$el.empty();
    this.$el.append('<h3>Users Near</h3>');
    this.$el.append(userTemplate({'users': users}));
  }
});
