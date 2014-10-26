var UsersRouter = Backbone.Router.extend({
  initialize: function() {
    _.bindAll(
      this,
      'usersFetched',
      'onUserLogin',
      'userSaved');
    
    // Model containing all users
    this.usersModel = new UsersModel();

    // View to show all users
    this.usersView = new UsersView();
    // Show login screen
    this.loginView = new LoginView();
    this.loginView.render();
    
    // Listen to the login event from the login view
    this.listenTo(this.loginView, 'user:login', this.onUserLogin);

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
    newUser.set('loc', [3.94,51.04]);
    newUser.save({},{'success': this.userSaved, 'error': alert});
  },
  
  userSaved: function(model) {
    // Bubble up an event to the parent router to refresh the view
    // Event contains the new user that was set in the model via the JSON server response
    this.trigger('user:saved', model.get('user'));
  },
  
  usersFetched: function(model) {
    this.usersView.render(model.get('users'));
  }
});