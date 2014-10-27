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