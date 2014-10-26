var UserLocationModel = Backbone.Model.extend({
  
  initialize: function() {
    _.bindAll(
      this,
      'updateLocation',
      'curPosSuccess',
      'curPosError'
    );
    
    this.updateLocation();
  },
  
  updateLocation: function() {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.curPosSuccess, this.curPosError);
    }
  },
  
  curPosSuccess: function(position) {
    var loc = [position.coords.longitude, position.coords.latitude];
    this.set('loc', loc);
    this.trigger('user:location_updated');
  },
  
  curPosError: function(error) {
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