var ErrorsView = Backbone.View.extend({
  
  // Bind view element
  el: $('#errors'),
  
  /**
   * Creates a new ErrorsView.
   * ErrorsView shows all error messages that may arise.
   * 
   * @constructor
   */
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'addError'
    );
    
    this.errors = [];
  },
  
  /**
   * Renders the list of errors.
   */
  render: function() {
    var errorTemplate = _.template($('#errors-template').html());
    this.$el.html(errorTemplate({'errors': this.errors}));
  },
  
  /**
   * Adds an error to the list of errors.
   * 
   * @param {string} error - The error message
   */
  addError: function(error) {
    this.errors.push(error);
  }
});