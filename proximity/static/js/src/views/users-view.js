var UsersView = Backbone.View.extend({
  
  el: $('#users'),
  
  render: function(users) {
    var userTemplate = _.template($('#userlist-template').html());
    this.$el.empty();
    this.$el.append('<h3>Users</h3>');
    this.$el.append(userTemplate({'users': users}));
  }
});