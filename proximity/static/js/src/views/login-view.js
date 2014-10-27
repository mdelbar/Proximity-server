var LoginView = Backbone.View.extend({
  
  // Bind view element
  el: $('#account'),
  
  // Register event listeners
  events: {
    'submit #loginform': 'login'
  },
  
  /**
   * Creates a new LoginView.
   * LoginView shows a login form and handles the initial submit event.
   * Performs minor sanity validation (only on age field).
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'login');
  },
  
  /**
   * Renders the login form.
   * Inserts the underscore.js login form template into this view.
   */
  render: function() {
    var loginTemplate = _.template($('#loginform-template').html());
    this.$el.html(loginTemplate());
  },
  
  /**
   * Called when the login form is submitted.
   * Creates a UsersModel object and bubbles a new user:login event along with it.
   * 
   * @param {Event} event - The loginform onSubmit event
   */
  login: function(event) {
    // Don't let the default event bubble up, we have our own logic to handle this
    event.preventDefault();
    
    var name = $('#name').val();
    var pass = $('#pass').val();
    var age = $('#age').val();
    var gender = $('input:radio[name=gender]:checked').val();
    var looking_for_m = $('#looking_for_m').val();
    var looking_for_f = $('#looking_for_f').val();
    
    // Sanity checks
    if(!name) {
      this.trigger('proximity:error', {'reason': 'Please fill in your name.'});
      return;
    }
    if(!pass) {
      this.trigger('proximity:error', {'reason': 'Please fill in your password.'});
      return;
    }
    if(!age) {
      this.trigger('proximity:error', {'reason': 'Please fill in your age.'});
      return;
    }
    if(!gender) {
      this.trigger('proximity:error', {'reason': 'Please fill in your gender.'});
      return;
    }
    if(!looking_for_m && !looking_for_f) {
      this.trigger('proximity:error', {'reason': 'Please fill in if you\' looking for men or women.'});
      return;
    }
    // Extra sanity check for age
    if(!this.isValidAge(age)) {
      this.trigger('proximity:error', {'reason': 'Age must be a positive number.'});
      return;
    }
    
    // Create new user and set values
    var user = new UsersModel();
    user.set('name', name);
    user.set('pass', pass);
    user.set('age', parseInt(age));
    user.set('gender', gender);
    user.set('looking_for_m', ((looking_for_m == "on") ? 1 : 0));
    user.set('looking_for_f', ((looking_for_f == "on") ? 1 : 0));
    
    // Bubble our own event up, passing user model along
    this.trigger('user:login', user);
  },
  
  /**
   * Checks whether a value is a valid age (integer >0).
   * 
   * @param {Object} value - The value to check
   * @returns {boolean} Whether the value is a valid age or not
   */
  isValidAge: function(value) {
    return !isNaN(value)
      && parseInt(Number(value)) == value
      && parseInt(value) > 1;
  }
});