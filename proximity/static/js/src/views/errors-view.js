var ErrorsView = Backbone.View.extend({
  
  el: $('#errors'),
  
  initialize: function() {
    _.bindAll(
      this,
      'render',
      'addError'
    );
    
    this.errors = [];
  },
  
  render: function() {
    var errorTemplate = _.template($('#errors-template').html());
    this.$el.html(errorTemplate({'errors': this.errors}));
  },
  
  addError: function(error) {
    this.errors.push(error);
  }
});