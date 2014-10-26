var IndexRouter = Backbone.Router.extend({
  
  initialize: function() {
    _.bindAll(
      this,
      'refresh',
      'onUserSaved',
      'onUserLogout',
      'onProximityError',
      'findUserInCookies',
      'storeUserInCookies',
      'deleteUserFromCookies');
    
    this.refresh();
  },
  
  refresh: function() {
    // Clear error view
    this.errorsView = new ErrorsView();
    
    // Find the user in cookies
    var currentUser = this.findUserInCookies();
    this.currentUser = currentUser;
    
    if(!this.currentUser) {
      // No current user in cookies, so show all users
      var usersRouter = new UsersRouter();
      this.listenTo(usersRouter, 'user:saved', this.onUserSaved);
      this.listenTo(usersRouter, 'proximity:error', this.onProximityError);
    }
    else {
      // Current user found in cookies, so show users near that current user
      var usersNearRouter = new UsersNearRouter(this.currentUser);
      this.listenTo(usersNearRouter, 'user:logout', this.onUserLogout);
      this.listenTo(usersNearRouter, 'proximity:error', this.onProximityError);
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
  
  onProximityError: function(error) {
    this.errorsView.addError(error);
    this.errorsView.render();
  },

  // Methods managing user in cookies
  ////////////////////////////////////
  
  findUserInCookies: function() {
    var cookieName = "proximity.user=";
    var cIndex = document.cookie.indexOf(cookieName);
    if(cIndex == -1) {
      return undefined;
    }
    var cEnd = document.cookie.indexOf("; ", cIndex);
    if(cEnd == -1) {
      cEnd = document.cookie.length;
    }
    var cookie = document.cookie.substring(cIndex+cookieName.length, cEnd);
    if(cookie == "") {
      return undefined;
    }
    return JSON.parse(cookie);
  },

  storeUserInCookies: function(user) {
    var d = new Date();
    // Expires after 30 minutes
    d.setTime(d.getTime() + (30*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "proximity.user"+"="+JSON.stringify(user)+"; "+expires;
  },

  deleteUserFromCookies: function() {
    // Set the cookie to expire Now-1 second
    var d = new Date();
    d.setTime(d.getTime() - 1000);
    document.cookie = "proximity.user={}; expires="+d.toUTCString();
  }
  
});