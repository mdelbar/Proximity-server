var LogoutView = Backbone.View.extend({
  
  el: $('#account'),
  
  events: {
    'submit #logoutform': 'logout'
  },

  initialize: function(userInfo) {
    _.bindAll(
      this,
      'render',
      'logout'
    );
    
    this.userInfo = userInfo;
  },
  
  render: function() {
    var logoutTemplate = _.template($('#logoutform-template').html());
    this.$el.html(logoutTemplate({'user': this.userInfo}));
  },
  
  logout: function(event) {
    // Don't let the default event bubble up, we have our own logic to handle this
    event.preventDefault();
    this.trigger('user:logout');
  }
});