var UsersNearModel = Backbone.Model.extend({
  url: function() {
    return "/users_near";
  }
});