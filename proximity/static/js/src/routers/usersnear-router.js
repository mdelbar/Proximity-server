var UsersNearRouter = Backbone.Router.extend({
  initialize: function(currentUser) {
    _.bindAll(
      this,
      'usersNearFetched',
      'onUserLogout'
    );
    
    // Model containing all users
    this.usersNearModel = new UsersNearModel();

    // View to show all users near the current user
    this.usersNearView = new UsersNearView();
    // Show user info and a logout button
    this.logoutView = new LogoutView(currentUser);
    this.logoutView.render();
    
    // Listen to the user logout event
    this.listenTo(this.logoutView, 'user:logout', this.onUserLogout);

    // Fetch users near the current user
    this.usersNearModel.fetch({
      data: {
        'uid': currentUser.uid
      },
      success: this.usersNearFetched
    });
  },
  
  usersNearFetched: function(model) {
    this.usersNearView.render(model.get('users'));
  },
  
  onUserLogout: function() {
    // Bubble up the event to the parent router to refresh the view
    this.trigger('user:logout');
  }
  
});