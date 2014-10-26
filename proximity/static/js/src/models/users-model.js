var UsersModel = Backbone.Model.extend({
  url: function() {
    return "/users";
  }
});