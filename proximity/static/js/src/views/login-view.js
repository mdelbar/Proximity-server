var LoginView = Backbone.View.extend({
  
  el: $('#account'),
  
  events: {
    'submit #loginform': 'login'
  },
  
  render: function() {
    var loginTemplate = _.template($('#loginform-template').html());
    this.$el.html(loginTemplate());
  },
  
  login: function(event) {
    // Don't let the default event bubble up, we have our own logic to handle this
    event.preventDefault();
    var name = $('#name').val();
    var pass = $('#pass').val();
    // Sanity check for age
    if(!this.isValidAge($('#age').val())) {
      this.trigger('proximity:error', {'reason': 'Age must be a positive number.'});
      return;
    }
    var age = parseInt($('#age').val());
    var gender = $('#gender').val();
    var looking_for_m = $('#looking_for_m').prop('checked') ? 1 : 0;
    var looking_for_f = $('#looking_for_f').prop('checked') ? 1 : 0;
    
    // Bubble our own event up, passing login info along
    this.trigger('user:login', {
      'name': name, 
      'pass': pass, 
      'age': age, 
      'gender': gender,
      'looking_for_m': looking_for_m,
      'looking_for_f': looking_for_f
    });
  },
  
  isValidAge: function(value) {
    return !isNaN(value)
      && parseInt(Number(value)) == value
      && parseInt(value) > 1;
  }
});