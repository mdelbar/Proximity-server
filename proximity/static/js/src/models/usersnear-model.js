/**
 * Model for fetching all users near the current user.
 */
var UsersNearModel = Backbone.Model.extend({
  
  /**
   * URL to use for fetching.
   */
  url: function() {
    return "/users_near";
  }
  
});