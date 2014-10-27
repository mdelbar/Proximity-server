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