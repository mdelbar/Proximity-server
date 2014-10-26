var MapView = Backbone.View.extend({
  
  el: $('#map-canvas'),
  
  initialize: function() {
    _.bindAll(
      this, 
      'render'
    );
    
    var mapOptions = {
      center: new google.maps.LatLng(0.0, 0.0),
      zoom: 1,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    
    // Don't bind map to "this", but to Window, for easier access
    map = new google.maps.Map(this.el, mapOptions);
    
  },
  
  render: function(users, currentUser) {
    var bounds = new google.maps.LatLngBounds();
    
    // Add current user to map (if applicable)
    if(currentUser) {
      var latlng = this.addUserMarkerToMap(currentUser, 'static/images/map-pin-green.png');
      bounds.extend(latlng);
    }
    
    // Add each marker to the map
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      latlng = this.addUserMarkerToMap(user);
      bounds.extend(latlng);
    }
    
    // Zoom/pan to fit all markers
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
  },
  
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
