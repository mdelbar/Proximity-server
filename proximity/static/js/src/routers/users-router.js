var UsersRouter = Backbone.Router.extend({
  initialize: function() {
    _.bindAll(
      this,
      'usersFetched',
      'onUserLogin',
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

    // Fetch all users
    this.usersModel.fetch({
      success: this.usersFetched
    });
  },
  
  onUserLogin: function(userInfo) {
    var newUser = new UsersModel();
    for(param in userInfo) {
      newUser.set(param, userInfo[param]);
    }
    if(this.userLocationModel.has('loc')) {
      newUser.set('loc', this.userLocationModel.get('loc'));
      newUser.save({},{'success': this.userSaved, 'error': this.userSaveError});
    }
    else {
      // No location means we can't save the user. Bubble error event.
      this.trigger('proximity:error', {'reason': 'Location required'});
    }
  },
  
  userSaved: function(model, response, options) {
    // Bubble up an event to the parent router to refresh the view
    // Event contains the new user that was set in the model via the JSON server response
    this.trigger('user:saved', model.get('user'));
  },
  
  userSaveError: function(model, response, options) {
    this.trigger('proximity:error', {'reason': 'Could not save user: ' + response['error']});
  },
  
  usersFetched: function(model) {
    this.mapView.render(model.get('users'));
  },

  onProximityError: function(error) {
    this.trigger('proximity:error', error);
  }
    
});