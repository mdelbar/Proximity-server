var UsersNearRouter = Backbone.Router.extend({
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
  
  fetchUsersNear: function() {
    this.usersNearModel.fetch({
      data: {
        'uid': this.currentUser.uid
      },
      success: this.usersNearFetched,
      error: this.usersNearFetchError
    });
  },
  
  usersNearFetched: function(model) {
    this.mapView.render(model.get('users'), this.currentUser);
  },
  
  usersNearFetchError: function(error) {
    this.trigger('user:logout');
    this.trigger('proximity:error', {'reason': 'User does not exist, logged out automatically.'});
  },
  
  onUserLogout: function() {
    // Bubble up the event to the parent router to refresh the view
    this.trigger('user:logout');
  },
  
  onUserLocationUpdated: function() {
    // Update the user
    var newUser = new UsersModel();
    for(param in this.currentUser) {
      newUser.set(param, this.currentUser[param]);
    }
    newUser.set('loc', this.userLocationModel.get('loc'));
    newUser.save({},{'success': this.userSaved, 'error': this.userSaveError});
  },
  
  userSaved: function(model, response, options) {
    // Bubble up an event to the parent router to refresh the view
    // Event contains the new user that was set in the model via the JSON server response
    this.trigger('user:saved', model.get('user'));
  },
  
  userSaveError: function(model, response, options) {
    this.trigger('proximity:error', {'reason': 'Could not save user'});
  },
  
  onProximityError: function(error) {
    this.trigger('proximity:error', error);
  }
  
});