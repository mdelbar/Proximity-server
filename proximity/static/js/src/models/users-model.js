/**
 * Model for fetching all users in the database.
 */
var UsersModel = Backbone.Model.extend({
  
  /**
   * URL to use for fetching.
   */
  url: function() {
    return "/users";
  }
  
});