var MapView = Backbone.View.extend({
  
  // Bind view element
  el: $('#map-canvas'),
  
  /**
   * Creates a new MapView.
   * MapView shows a list of users on a Google Map.
   * Creates a new GMap (bound to Window, not to this),
   * a new LatLngBounds object to re-center the GMap if needed,
   * and adds a DOM event listener to resize the GMap if the window resizes.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'newMap',
      'render',
      'centerMap',
      'addUserMarkerToMap'
    );
    
    // Don't bind map to "this", but to Window, for easier access
    map = this.newMap();
    
    // Keep track of bounds in "this" so we can re-center the map if need be
    this.bounds = new google.maps.LatLngBounds();
		
		// Re-center map on window resize
		google.maps.event.addDomListener(window, 'resize', this.centerMap);
  },
  
  /**
   * Creates a new Google Map with default options.
   * 
   * @return {google.maps.Map} The Google Map
   */
  newMap: function() {
    var mapOptions = {
      center: new google.maps.LatLng(0.0, 0.0),
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    
    return new google.maps.Map(this.el, mapOptions);
  },
  
  /**
   * Renders users on the map.
   * If a currentUser is passed along, it is rendered with a green icon to distinguish.
   * 
   * @param {UsersModel} model - The model containing the users to render
   * @param {UsersModel} currentUser - The current user to render (optional)
   */
  render: function(model, currentUser) {
    // Reset map and bounds
    map = this.newMap();
    this.bounds = new google.maps.LatLngBounds();
    
    // Add current user to map (if applicable)
    // Do this first so the larger icon doesn't accidentally hide other users
    if(currentUser) {
      // User currentUser attributes to conform to expected data type
      var latlng = this.addUserMarkerToMap(currentUser.attributes, 'static/images/map-pin-green.png');
      this.bounds.extend(latlng);
    }
    
    // Add each marker to the map
    var users = model.get('users');
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      latlng = this.addUserMarkerToMap(user);
      this.bounds.extend(latlng);
    }
    
    // Zoom/pan to fit all markers
    this.centerMap();
  },
  
  /**
   * Centers the map on the bounds created by the map markers.
   */
  centerMap: function() {
    if(!this.bounds.isEmpty()) {
      map.setCenter(this.bounds.getCenter());
      map.fitBounds(this.bounds);
    }
  },
  
  /**
   * Adds a marker to the map with some user info.
   * 
   * @param {Array} user - The user that contains the info
   * @param {string} icon - The icon path (optional)
   */
  addUserMarkerToMap: function(user, icon) {
    var latlng = new google.maps.LatLng(user['loc'][1], user['loc'][0]);
    var marker = new google.maps.Marker({
      'position': latlng,
      'map': map,
      'title': user['name'],
      'icon': icon
    });
    
    // Attach info window to marker
    this.attachInfoWindowToMarker(marker, user);
    return latlng;
  },
  
  /**
   * Attaches an info window to a marker.
   * This is the popup window that appears when a user clicks a marker.
   * The infowindow HTML comes from an underscore.js template.
   * 
   * @param {google.maps.Marker} marker - The marker
   * @param {Array} user - The user that contains the info
   */
  attachInfoWindowToMarker: function(marker, user) {
    var infoWindowContent = _.template($('#infowindow-template').html())({'user': user});
    var infoWindow = new google.maps.InfoWindow({
      'content': infoWindowContent
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map, marker);
    });
  }
  
});
