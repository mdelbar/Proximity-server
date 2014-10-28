/*! proximity 2014-10-28 */
/**
 * Model for keeping track of the user's location.
 */
var UserLocationModel = Backbone.Model.extend({
  
  /**
   * Creates a new UserLocationModel.
   * UserLocationModel keeps track of the user's GeoLocation.
   * Contains the necessary logic to handle location updates.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'updateLocation',
      'success',
      'failure'
    );
    
    this.updateLocation();
  },
  
  /**
   * Checks the current location via HTML5 GeoLocation.
   * If GeoLocation is not supported/available, bubbles a Proximity error.
   */
  updateLocation: function() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success, this.failure);
    }
    else {
      this.trigger('proximity:error', {'reason': 'Browser does not support GeoLocation.'});
    }
  },
  
  /**
   * Called when we successfully GeoLocated the user.
   * Sets the location in this model and bubbles a new user:location_updated event.
   * 
   * @param {Position} position - The Position object containing the user's lat/long
   */
  success: function(position) {
    var loc = [position.coords.longitude, position.coords.latitude];
    this.set('loc', loc);
    this.trigger('user:location_updated');
  },
  
  /**
   * Called when we fail to GeoLocate the user.
   * Bubbles up a Proximity error with the reason gotten from the Position Error.
   * 
   * @param {PositionError} error - The error
   */
  failure: function(error) {
    var errorMsg = "";
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMsg = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        errorMsg = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        errorMsg = "The request to get user location timed out."
        break;
      default:
        errorMsg = "An unknown error occurred."
        break;
    }
    this.trigger('proximity:error', {'reason': 'Could not get current position: ' + errorMsg});
  }
  
});
/**
 * Model for fetching all users in the database.
 */
var UsersModel = Backbone.Model.extend({
  
  /**
   * URL to use for fetching.
   */
  url: function() {
    return "//" + document.location.host + "/users";
  }
  
});
/**
 * Model for fetching all users near the current user.
 */
var UsersNearModel = Backbone.Model.extend({
  
  /**
   * URL to use for fetching.
   */
  url: function() {
    return "//" + document.location.host + "/users_near";
  }
  
});
var ErrorsView = Backbone.View.extend({
  
  // Bind view element
  el: $('#errors'),
  
  /**
   * Creates a new ErrorsView.
   * ErrorsView shows all error messages that may arise.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'addError'
    );
    
    this.errors = [];
  },
  
  /**
   * Renders the list of errors.
   */
  render: function() {
    var errorTemplate = _.template($('#errors-template').html());
    this.$el.html(errorTemplate({'errors': this.errors}));
  },
  
  /**
   * Adds an error to the list of errors.
   * 
   * @param {string} error - The error message
   */
  addError: function(error) {
    this.errors.push(error);
  }
});
var LoginView = Backbone.View.extend({
  
  // Bind view element
  el: $('#account'),
  
  // Register event listeners
  events: {
    'submit #loginform': 'login'
  },
  
  /**
   * Creates a new LoginView.
   * LoginView shows a login form and handles the initial submit event.
   * Performs minor sanity validation (only on age field).
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'login');
  },
  
  /**
   * Renders the login form.
   * Inserts the underscore.js login form template into this view.
   */
  render: function() {
    var loginTemplate = _.template($('#loginform-template').html());
    this.$el.html(loginTemplate());
  },
  
  /**
   * Called when the login form is submitted.
   * Creates a UsersModel object and bubbles a new user:login event along with it.
   * 
   * @param {Event} event - The loginform onSubmit event
   */
  login: function(event) {
    // Don't let the default event bubble up, we have our own logic to handle this
    event.preventDefault();
    
    var name = $('#name').val();
    var pass = $('#pass').val();
    var age = $('#age').val();
    var gender = $('input:radio[name=gender]:checked').val();
    var looking_for_m = $('#looking_for_m').val();
    var looking_for_f = $('#looking_for_f').val();
    
    // Sanity checks
    if(!name) {
      this.trigger('proximity:error', {'reason': 'Please fill in your name.'});
      return;
    }
    if(!pass) {
      this.trigger('proximity:error', {'reason': 'Please fill in your password.'});
      return;
    }
    if(!age) {
      this.trigger('proximity:error', {'reason': 'Please fill in your age.'});
      return;
    }
    if(!gender) {
      this.trigger('proximity:error', {'reason': 'Please fill in your gender.'});
      return;
    }
    if(!looking_for_m && !looking_for_f) {
      this.trigger('proximity:error', {'reason': 'Please fill in if you\' looking for men or women.'});
      return;
    }
    // Extra sanity check for age
    if(!this.isValidAge(age)) {
      this.trigger('proximity:error', {'reason': 'Age must be a positive number.'});
      return;
    }
    
    // Create new user and set values
    var user = new UsersModel();
    user.set('name', name);
    user.set('pass', pass);
    user.set('age', parseInt(age));
    user.set('gender', gender);
    user.set('looking_for_m', ((looking_for_m == "on") ? 1 : 0));
    user.set('looking_for_f', ((looking_for_f == "on") ? 1 : 0));
    
    // Bubble our own event up, passing user model along
    this.trigger('user:login', user);
  },
  
  /**
   * Checks whether a value is a valid age (integer >0).
   * 
   * @param {Object} value - The value to check
   * @returns {boolean} Whether the value is a valid age or not
   */
  isValidAge: function(value) {
    return !isNaN(value)
      && parseInt(Number(value)) == value
      && parseInt(value) > 1;
  }
});
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
var MapView = Backbone.View.extend({
  
  // Bind view element
  el: $('#map-canvas'),
  
  /**
   * Creates a new MapView.
   * MapView shows a list of users on a Google Map.
   * Creates a new GMap (bound to Window, not to this),
   * a new LatLngBounds object to re-center the GMap if needed,
   * and adds a DOM event listener to resize the GMap if the window resizes.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'newMap',
      'render',
      'centerMap',
      'addUserMarkerToMap'
    );
    
    // Don't bind map to "this", but to Window, for easier access
    map = this.newMap();
    
    // Keep track of bounds in "this" so we can re-center the map if need be
    this.bounds = new google.maps.LatLngBounds();
		
		// Re-center map on window resize
		google.maps.event.addDomListener(window, 'resize', this.centerMap);
  },
  
  /**
   * Creates a new Google Map with default options.
   * 
   * @return {google.maps.Map} The Google Map
   */
  newMap: function() {
    var mapOptions = {
      center: new google.maps.LatLng(0.0, 0.0),
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    
    return new google.maps.Map(this.el, mapOptions);
  },
  
  /**
   * Renders users on the map.
   * If a currentUser is passed along, it is rendered with a green icon to distinguish.
   * 
   * @param {UsersModel} model - The model containing the users to render
   * @param {UsersModel} currentUser - The current user to render (optional)
   */
  render: function(model, currentUser) {
    // Reset map and bounds
    map = this.newMap();
    this.bounds = new google.maps.LatLngBounds();
    
    // Add current user to map (if applicable)
    // Do this first so the larger icon doesn't accidentally hide other users
    if(currentUser) {
      // User currentUser attributes to conform to expected data type
      var latlng = this.addUserMarkerToMap(currentUser.attributes, 'static/images/map-pin-green.png');
      this.bounds.extend(latlng);
    }
    
    // Add each marker to the map
    var users = model.get('users');
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      latlng = this.addUserMarkerToMap(user);
      this.bounds.extend(latlng);
    }
    
    // Zoom/pan to fit all markers
    this.centerMap();
  },
  
  /**
   * Centers the map on the bounds created by the map markers.
   */
  centerMap: function() {
    if(!this.bounds.isEmpty()) {
      map.setCenter(this.bounds.getCenter());
      map.fitBounds(this.bounds);
    }
  },
  
  /**
   * Adds a marker to the map with some user info.
   * 
   * @param {Array} user - The user that contains the info
   * @param {string} icon - The icon path (optional)
   */
  addUserMarkerToMap: function(user, icon) {
    var latlng = new google.maps.LatLng(user['loc'][1], user['loc'][0]);
    var marker = new google.maps.Marker({
      'position': latlng,
      'map': map,
      'title': user['name'],
      'icon': icon
    });
    
    // Attach info window to marker
    this.attachInfoWindowToMarker(marker, user);
    return latlng;
  },
  
  /**
   * Attaches an info window to a marker.
   * This is the popup window that appears when a user clicks a marker.
   * The infowindow HTML comes from an underscore.js template.
   * 
   * @param {google.maps.Marker} marker - The marker
   * @param {Array} user - The user that contains the info
   */
  attachInfoWindowToMarker: function(marker, user) {
    var infoWindowContent = _.template($('#infowindow-template').html())({'user': user});
    var infoWindow = new google.maps.InfoWindow({
      'content': infoWindowContent
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });
  }
  
});

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
var UsersRouter = Backbone.Router.extend({
  
  /**
   * Creates a new UsersRouter.
   * UsersRouter fetches all users in the database and shows them on a Google Map.
   * Also shows a login view for the user.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'onUserLogin',
      'usersFetched',
      'userSaved',
      'userSaveError',
      'onProximityError');
    
    // Model containing all users
    this.usersModel = new UsersModel();
    // Model containing user location
    this.userLocationModel = new UserLocationModel();

    // Map view to show all users
    this.mapView = new MapView();
    // Show login screen
    this.loginView = new LoginView();
    this.loginView.render();
    
    // Listen to the login event from the login view
    this.listenTo(this.loginView, 'user:login', this.onUserLogin);
    // Listen to any error event and bubble up
    this.listenTo(this.userLocationModel, 'proximity:error', this.onProximityError);
    this.listenTo(this.loginView, 'proximity:error', this.onProximityError);
    this.listenTo(this.mapView, 'proximity:error', this.onProximityError);
    this.listenTo(this.usersModel, 'proximity:error', this.onProximityError);

    // Fetch all users from the database (via Backbone.sync)
    this.usersModel.fetch({
      success: this.usersFetched
    });
  },
  
  /**
   * Called when the loginView bubbles up a user:login event.
   * Creates a new UsersModel and stores it in the database (via Backbone.sync).
   * If we have no GeoLocation for the user, a Proximity error event is bubbled up.
   * 
   * @param {UsersModel} user - The user model containing info to store.
   */
  onUserLogin: function(user) {
    if(this.userLocationModel.has('loc')) {
      user.set('loc', this.userLocationModel.get('loc'));
      user.save({},{'success': this.userSaved, 'error': this.userSaveError});
    }
    else {
      // No location means we can't save the user. Bubble error event.
      this.trigger('proximity:error', {'reason': 'Location required to log in.'});
    }
  },
  
  /**
   * Called when the users have been fetched from the database.
   * Delegates to the MapView which will show all users.
   * 
   * @param {UsersModel} model - The model containing all fetched users
   */
  usersFetched: function(model) {
    this.mapView.render(model);
  },
  
  /**
   * Called when the user has been successfully stored.
   * Triggers a user:saved event.
   * 
   * @param {UsersModel} model - The UsersModel that was used to store the user
   */
  userSaved: function(model) {
    // Bubble up an event to the parent router to refresh the view
    // Event contains the new user that was set in the model via the JSON server response
    this.trigger('user:saved', model.get('user'));
  },
  
  /**
   * Called when there was an error storing the user.
   * Triggers a proximity:error event.
   * 
   * @param {UsersModel} model - The UsersModel that was used to store the user
   * @param {???} response - The JSON response from the server???
   */
  userSaveError: function(model, response) {
    this.trigger('proximity:error', {'reason': 'Could not save user: ' + response['error']});
  },
  
  /**
   * Called when a Proximity error bubbles up from below.
   * Bubbles the event further up along the chain.
   * 
   * @param {Object} error - The error
   */
  onProximityError: function(error) {
    this.trigger('proximity:error', error);
  }
    
});
var UsersNearRouter = Backbone.Router.extend({
  
  /**
   * Creates a new UsersNearRouter.
   * UsersNearRouter fetches all users near the current user and shows them on a Google Map.
   * Also shows a greeting and logout button for the user.
   * 
   * @constructor
   * @param {UsersModel} currentUser - The current user
   */
  initialize: function(currentUser) {
    _.bindAll(
      this,
      'fetchUsersNear',
      'usersNearFetched',
      'usersNearFetchError',
      'onUserLogout',
      'onUserLocationUpdated',
      'userSaved',
      'userSaveError',
      'onProximityError'
    );
    
    this.currentUser = currentUser;
    
    // Model containing all users
    this.usersNearModel = new UsersNearModel();
    // Model containing user location
    this.userLocationModel = new UserLocationModel();

    // Map view to show all users near the current user
    this.mapView = new MapView();
    // Show user info and a logout button
    this.logoutView = new LogoutView(currentUser);
    this.logoutView.render();
    
    // Listen to the user logout event
    this.listenTo(this.logoutView, 'user:logout', this.onUserLogout);
    // Listen to user location update events
    this.listenTo(this.userLocationModel, 'user:location_updated', this.onUserLocationUpdated);
    // Listen to any error event and bubble up
    this.listenTo(this.userLocationModel, 'proximity:error', this.onProximityError);
    this.listenTo(this.logoutView, 'proximity:error', this.onProximityError);
    this.listenTo(this.mapView, 'proximity:error', this.onProximityError);
    this.listenTo(this.usersNearModel, 'proximity:error', this.onProximityError);

    // Fetch users near the current user
    this.fetchUsersNear();
  },
  
  /**
   * Fetches users from the database (via Backbone.sync).
   */
  fetchUsersNear: function() {
    this.usersNearModel.fetch({
      data: {
        'uid': this.currentUser.get('uid')
      },
      success: this.usersNearFetched,
      error: this.usersNearFetchError
    });
  },
  
  /**
   * Called when we've successfully fetched users near current user.
   * Delegates to MapView which will show the users and the current user.
   * 
   * @param {UsersNearModel} model - The UsersNearModel containing the fetched users
   */
  usersNearFetched: function(model) {
    this.mapView.render(model, this.currentUser);
  },
  
  /**
   * Called when there was an error fetching users.
   * Usually happens when the user no longer exists in the database.
   * Triggers a logout as precaution and bubbles a Proximity error.
   */
  usersNearFetchError: function() {
    this.trigger('user:logout');
    this.trigger('proximity:error', {'reason': 'Error fetching users near current user, try logging in again.'});
  },
  
  /**
   * Called when a user:logout is bubbled up from below.
   * Bubbles the event further up along the chain.
   */
  onUserLogout: function() {
    // Bubble up the event to the parent router to refresh the view
    this.trigger('user:logout');
  },
  
  /**
   * Called when the current user's location has been updated
   * Updates this information in the database (via Backbone.sync).
   */
  onUserLocationUpdated: function() {
    // Update the user (create new UsersModel due to PUT bug)
    this.currentUser.set('loc', this.userLocationModel.get('loc'));
    this.currentUser.save();
    // var newUser = new UsersModel();
    // for(param in this.currentUser.attributes) {
    //   newUser.set(param, this.currentUser.get(param));
    // }
    // newUser.set('loc', this.userLocationModel.get('loc'));
    // newUser.save({},{'success': this.userSaved, 'error': this.userSaveError});
  },
  
  /**
   * Called when the user has been successfully stored.
   * Triggers a user:saved event.
   * 
   * @param {UsersModel} model - The UsersModel that was used to store the user
   */
  userSaved: function(model) {
    // Bubble up an event to the parent router to refresh the view
    // Event contains the new user that was set in the model via the JSON server response
    this.trigger('user:saved', model.get('user'));
  },
  
  /**
   * Called when there was an error storing the user.
   * Triggers a proximity:error event.
   * 
   * @param {UsersModel} model - The UsersModel that was used to store the user
   * @param {???} response - The JSON response from the server???
   */
  userSaveError: function(model, response) {
    this.trigger('proximity:error', {'reason': 'Could not save user: ' + response['error']});
  },
  
  /**
   * Called when a Proximity error bubbles up from below.
   * Bubbles the event further up along the chain.
   * 
   * @param {Object} error - The error
   */
  onProximityError: function(error) {
    this.trigger('proximity:error', error);
  }
  
});