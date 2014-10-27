/**
 * Model for keeping track of the user's location.
 */
var UserLocationModel = Backbone.Model.extend({
  
  /**
   * Creates a new UserLocationModel.
   * UserLocationModel keeps track of the user's GeoLocation.
   * Contains the necessary logic to handle location updates.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'updateLocation',
      'success',
      'failure'
    );
    
    this.updateLocation();
  },
  
  /**
   * Checks the current location via HTML5 GeoLocation.
   * If GeoLocation is not supported/available, bubbles a Proximity error.
   */
  updateLocation: function() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success, this.failure);
    }
    else {
      this.trigger('proximity:error', {'reason': 'Browser does not support GeoLocation.'});
    }
  },
  
  /**
   * Called when we successfully GeoLocated the user.
   * Sets the location in this model and bubbles a new user:location_updated event.
   * 
   * @param {Position} position - The Position object containing the user's lat/long
   */
  success: function(position) {
    var loc = [position.coords.longitude, position.coords.latitude];
    this.set('loc', loc);
    this.trigger('user:location_updated');
  },
  
  /**
   * Called when we fail to GeoLocate the user.
   * Bubbles up a Proximity error with the reason gotten from the Position Error.
   * 
   * @param {PositionError} error - The error
   */
  failure: function(error) {
    var errorMsg = "";
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMsg = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        errorMsg = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        errorMsg = "The request to get user location timed out."
        break;
      default:
        errorMsg = "An unknown error occurred."
        break;
    }
    this.trigger('proximity:error', {'reason': 'Could not get current position: ' + errorMsg});
  }
  
});