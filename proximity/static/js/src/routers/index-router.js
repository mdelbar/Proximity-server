var IndexRouter = Backbone.Router.extend({
  
  initialize: function() {
    _.bindAll(
      this,
      'refresh',
      'onUserSaved',
      'onUserLogout',
      'findUserInCookies',
      'storeUserInCookies',
      'deleteUserFromCookies');
    
    this.refresh();
  },
  
  refresh: function() {
    // Find the user in cookies
    var currentUser = this.findUserInCookies();
    this.currentUser = currentUser;
    
    if(!this.currentUser) {
      // No current user in cookies, so show all users
      var usersRouter = new UsersRouter();
      this.listenTo(usersRouter, 'user:saved', this.onUserSaved);
    }
    else {
      // Current user found in cookies, so show users near that current user
      var usersNearRouter = new UsersNearRouter(this.currentUser);
      this.listenTo(usersNearRouter, 'user:logout', this.onUserLogout);
    }
  },
  
  // Event handler methods
  /////////////////////////
  
  onUserSaved: function(user) {
    this.storeUserInCookies(user);
    this.refresh();
  },
  
  onUserLogout: function() {
    this.deleteUserFromCookies();
    this.refresh();
  },

  // Methods managing user in cookies
  ////////////////////////////////////
  
  findUserInCookies: function() {
    return this.currentUser;
  },

  storeUserInCookies: function(user) {
    this.currentUser = user;
  },

  deleteUserFromCookies: function() {
    this.currentUser = undefined;
  }
  
});