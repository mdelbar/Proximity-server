/**
 * Model for fetching all users near the current user.
 */
var UsersNearModel = Backbone.Model.extend({
  
  /**
   * URL to use for fetching.
   */
  url: function() {
    return "https://" + this.document.location.host + "/users_near";
  }
  
});