var IndexRouter = Backbone.Router.extend({
  
  /**
   * Creates a new IndexRouter.
   * IndexRouter is the primary router for the index page.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'refresh',
      'onUserSaved',
      'onUserLogout',
      'onProximityError');
    
    // Trigger a refresh to get everything rolling
    this.refresh();
  },
  
  /**
   * Checks if we have a user currently logged in (via cookie).
   * If there is no user, we show all users in the database.
   * If there is a user, we show all users near that user.
   * Also clears the errors view.
   * This method can be called multiple times throughout the application flow (usually after login/logout).
   */
  refresh: function() {
    // Clear error view
    this.errorsView = new ErrorsView();
    this.errorsView.render();
    
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
      // Refresh cookie
      this.storeUserInCookies(this.currentUser);
      
      // Current user found in cookies, so show users near that current user
      var usersNearRouter = new UsersNearRouter(this.currentUser);
      this.listenTo(usersNearRouter, 'user:logout', this.onUserLogout);
      this.listenTo(usersNearRouter, 'proximity:error', this.onProximityError);
    }
    
    // Scroll to top of page to "reset" view
    window.scrollTo(0, 0);
  },
  
  // Event handler methods
  /////////////////////////
  
  /**
   * Called when a user has successfully been stored in the database.
   * Stores the user info in a cookie and triggers a refresh.
   * 
   * @param {UsersModel} user - The user that was stored
   */
  onUserSaved: function(user) {
    this.storeUserInCookies(user);
    this.refresh();
  },
  
  /**
   * Called when a user has logged out.
   * Deletes the cookie with the user info and triggers a refresh.
   */
  onUserLogout: function() {
    this.deleteUserFromCookies();
    this.refresh();
  },
  
  /**
   * Called when a Proximity error was bubbled up.
   * Adds the error to the errors view and re-renders that view.
   * 
   * @param {Object} error - The error
   */
  onProximityError: function(error) {
    this.errorsView.addError(error);
    this.errorsView.render();
    // Scroll to top of page to ensure error is seen
    window.scrollTo(0, 0);
  },

  // Methods managing user in cookies
  ////////////////////////////////////
  
  /**
   * Looks for user info in a proximity.user cookie.
   * If found, recreates the user from the stored JSON string.
   * 
   * @return {undefined | UsersModel} user - 
   *      The user that was found, or undefined if no user was stored.
   */
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
    
    var userJson = JSON.parse(cookie);
    // Construct user from JSON
    var user = new UsersModel();
    for(param in userJson) {
      user.set(param, userJson[param]);
    }
    return user;
  },
  
  /**
   * Stores user info in a proximity.user cookie.
   * Stores the user object as JSON string.
   * 
   * @param {Object} user - The user object to be stored.
   */
  storeUserInCookies: function(user) {
    var d = new Date();
    // Expires after 30 minutes
    d.setTime(d.getTime() + (30*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "proximity.user"+"="+JSON.stringify(user)+"; "+expires;
  },
  
  /**
   * Clears the proximity.user cookie by overwriting it with a past expiry date.
   */
  deleteUserFromCookies: function() {
    // Set the cookie to expire Now-1 second
    var d = new Date();
    d.setTime(d.getTime() - 1000);
    document.cookie = "proximity.user={}; expires="+d.toUTCString();
  }
  
});