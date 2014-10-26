var ErrorsView = Backbone.View.extend({
  
  el: $('#errors'),
  
  events: {
    'click #clear-errors': 'clearErrors'
  },
  
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'addError',
      'clearErrors'
    );
    
    this.errors = [];
  },
  
  render: function() {
    var errorTemplate = _.template($('#errors-template').html());
    this.$el.html(errorTemplate({'errors': this.errors}));
  },
  
  addError: function(error) {
    this.errors.push(error);
  },
  
  clearErrors: function() {
    this.errors = [];
  }
});