define([
  './eucadialogview',
  'app',
  'models/scalinggrp',
  'models/scalingpolicy',
  'models/alarm',
  'views/newscalinggroup/page1',
  'views/newscalinggroup/page2',
  'views/newscalinggroup/page3',
  'text!./scalinggroupeditproperties.html'
], function(EucaDialog, app, ScalingGroup, ScalingPolicy, Alarm, tab1,tab2,tab3, tpl) {
  return EucaDialog.extend({
    initialize: function(options) {
      var self = this;
      this.template = tpl;
      this.valid1 = true;
      this.valid2 = true;

      this.scope = {
        help: {title: null, content: help_snapshot.dialog_create_content, url: help_snapshot.dialog_create_content_url, pop_height: 600},
        cancelButton: {
          id: 'button-dialog-editscalinggroup-cancel',
          click: function() {
            self.close();
          }
        },

        createButton: new Backbone.Model({
          id: 'button-dialog-editscalinggroup-save',
          disabled: false,
          click: function() {
            self.save();
            self.close();
          }
        }),

        availabilityZones: new Backbone.Collection(),
        loadBalancers: new Backbone.Collection(),
        alarms: new Backbone.Collection(),
        policies: new Backbone.Collection(),
        toggletest: new Backbone.Model({value: false}),
        scalingGroup: new ScalingGroup({
                min_size: 0,
                desired_capacity: 0,
                max_size: 0,
                launch_config_name: options.launchconfig ? options.launchconfig : null,
                show_lc_selector: options.launchconfig ? false : true
        }),
        change: function(e) {
            setTimeout(function() { $(e.target).change(); }, 0);
        }
      }

      //init from options
      if(options && options.model && options.model.length > 0) {
        var sg = options.model.at(0);
        this.scope.scalingGroup = sg.clone();
        
        if(sg.get('availability_zones') && sg.get('availability_zones').length > 0) {
          _.each(sg.get('availability_zones'), function(az) {
            self.scope.availabilityZones.add( app.data.zones.findWhere({name: az}).clone() );
          });
        }
        
        if(sg.get('load_balancers') && sg.get('load_balancers').length > 0) {
          _.each(sg.get('load_balancers'), function(lb) {
            self.scope.loadBalancers.add( app.data.loadbalancer.findWhere({name: lb}).clone() );
          });
        }
        
        _.each(app.data.scalingpolicy.where({as_name: sg.get('name')}), function(sp) {
          self.scope.policies.add( sp.clone() );
        });

        if(this.scope.policies) {
          this.scope.policies.each( function(pol) {
            _.each(pol.get('alarms'), function(al) {
              var almodel = new Alarm(al);
              self.scope.alarms.add(app.data.alarms.findWhere({alarm_arn: almodel.get('alarm_arn')}));
              pol.set('alarm_model', almodel.clone());
              pol.set('alarm', almodel.get('name'));
            });
          });
        }
      }

      var tabscope = new Backbone.Model(this.scope);
      var t1 = new tab1({model:tabscope});
      var t2 = new tab2({model:tabscope});
      var t3 = new tab3({model:tabscope});

      this._do_init( function(view) {
        setTimeout( function() {
          view.$el.find('#tabs-1').append(t1.render().el);
          view.$el.find('#tabs-2').append(t2.render().el);
          view.$el.find('#tabs-3').append(t3.render().el);
        }, 1000);
      });

      this.listenTo(t1, 'validationchange', this.setButtonState);
      this.listenTo(t2, 'validationchange', this.setButtonState);
      this.listenTo(t3, 'validationchange', this.setButtonState);
    },

    setButtonState: function(errors, ident) {
      if(ident == 'sgerr') {
        this.valid1 = errors.values().length > 0 ? false : true;
      } 
      if(ident == 'polerr') {
        this.valid2 = errors.values().length > 0 ? false : true;
      }
      this.scope.createButton.set('disabled', !(this.valid1 & this.valid2));
    },

    save: function() {
      var self = this;
      self.scope.scalingGroup.save({}, {
        success: function(model, response, options){  
          if(model != null){
            var name = model.get('name');
            notifySuccess(null, $.i18n.prop('create_scaling_group_run_success', name));  
            self.setPolicies(name);
          }else{
            notifyError($.i18n.prop('create_scaling_group_run_error'), undefined_error);
          }
        },
        error: function(model, jqXHR, options){  
          notifyError($.i18n.prop('create_scaling_group_run_error'), getErrorMessage(jqXHR));
        } 
      });
    },

    setPolicies: function(sg_name) {
      var self = this;
      self.scope.policies.each( function(model, index) {
        var policy = new ScalingPolicy(model.toJSON());
        policy.set('as_name', sg_name);
        if(policy.get('_deleted') == true) {
          policy.destroy({}, {
            success: function(model, response, options) {
              notifySuccess(null, $.i18n.prop('delete_scaling_group_policy_run_success')); //, name, sg_name)); 
            },
            error: function(model, jqXHR, options){  
              notifyError($.i18n.prop('create_scaling_group_policy run_error'), getErrorMessage(jqXHR));
            }
          });
        } else {
          policy.save({}, {
            success: function(model, response, options){  
              if(model != null){
                var name = model.get('name');
                notifySuccess(null, $.i18n.prop('create_scaling_group_policy_run_success', name, sg_name)); 
                self.setAlarms(model); 
              }else{
                notifyError($.i18n.prop('create_scaling_group_policy_run_error'), undefined_error);
              }
            },
            error: function(model, jqXHR, options){  
              notifyError($.i18n.prop('create_scaling_group_policy run_error'), getErrorMessage(jqXHR));
            }
          });
        }
      });
    },

    setAlarms: function(model) {
      var self = this;
      var arn = model.get('PolicyARN');
      if(alarm = self.scope.alarms.findWhere({name: model.get('alarm')})) {
        var actions = alarm.get('alarm_actions') ? alarm.get('alarm_actions') : new Array();
        actions.push(arn);
        alarm.set('alarm_actions', actions);
        alarm.save({}, {
          success: function(model, response, options){  
            if(model != null){
              var name = model.get('name');
              notifySuccess(null, $.i18n.prop('create_scaling_group_policy_alarm_run_success', name, arn)); 
            }else{
              notifyError($.i18n.prop('create_scaling_group_policy_alarm_run_error'), undefined_error);
            }
          },
          error: function(model, jqXHR, options){  
            notifyError($.i18n.prop('create_scaling_group_policy_alarm_run_error'), getErrorMessage(jqXHR));
          }
        });
      }
    }

  });
});
