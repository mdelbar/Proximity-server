var LogoutView = Backbone.View.extend({
  
  // Bind view element
  el: $('#account'),
  
  // Register event listeners
  events: {
    'click #logoutbtn': 'logout'
  },
  
  /**
   * Creates a new LogoutView.
   * LogoutView shows a greeting to the user and a logout button
   * 
   * @constructor
   * @param {UsersModel} user - The user
   */
  initialize: function(user) {
    _.bindAll(
      this,
      'render',
      'logout'
    );
    
    this.user = user;
  },
  
  /**
   * Renders the view via an underscore.js template.
   */
  render: function() {
    var logoutTemplate = _.template($('#logoutform-template').html());
    this.$el.html(logoutTemplate({'user': this.user}));
  },
  
  /**
   * Called when the user clicks the logout button
   * Bubbles up a user:logout event.
   * 
   * @param {Event} event - The event
   */
  logout: function(event) {
    // Don't let the default event bubble up, we have our own logic to handle this
    event.preventDefault();
    this.trigger('user:logout');
  }
});