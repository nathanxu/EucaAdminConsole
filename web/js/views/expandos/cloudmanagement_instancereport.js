define([
  'app',
  './eucaexpandoview',
  'text!./cloudmanagement_instancereport.html!strip',
], function(app, EucaExpandoView, template) {
  return EucaExpandoView.extend({
    initialize : function(args) {
      this.template = template;
      var tmp = this.model ? this.model : new Backbone.Model();
      this.model = new Backbone.Model();
      this.model.set('report', tmp);
      this.scope = this.model;
      this._do_init();
    },
  });
});
