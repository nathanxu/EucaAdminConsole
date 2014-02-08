/*************************************************************************
 * Copyright 2009-2012 Eucalyptus Systems, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/.
 *
 * Please contact Eucalyptus Systems, Inc., 6755 Hollister Ave., Goleta
 * CA 93117, USA or visit http://www.eucalyptus.com/licenses/ if you need
 * additional information or have any questions.
 ************************************************************************/

(function($, eucalyptus) {
  $.widget('eucalyptus.eucadata', $.eucalyptus.eucawidget, {
    options : {  
      refresh_interval_sec : REFRESH_INTERVAL_SEC,
      max_refresh_attempt : 3,
      endpoints: [
                  {name:'configurecloud_cloudproperty', type:'configurecloud_cloudproperties', collection: 'configurecloud_cloudproperties'},
                  {name:'configurecloud_vmtype', type:'configurecloud_configurecloud_vmtypes', collection: 'configurecloud_vmtypes'},
                  {name:'configurecloud_ebsservice', type:'configurecloud_ebsservices', collection: 'configurecloud_ebsservices'},
                  {name:'configurecloud_s3', type:'configurecloud_s3s', collection: 'configurecloud_s3s'},
                  {name:'configurecloud_dnsservice', type:'configurecloud_dnsservices', collection: 'configurecloud_dnsservices'},
                  {name:'configurecloud_loadbalancer', type:'configurecloud_loadbalancers', collection: 'configurecloud_loadbalancers'},
                 
                  {name:'cloudmanagement_account', type:'cloudmanagement_accounts', collection: 'cloudmanagement_accounts'},
                  {name:'cloudmanagement_user', type:'cloudmanagement_users', collection: 'cloudmanagement_users'},
                  {name:'cloudmanagement_usergroup', type:'cloudmanagement_usergroups', collection: 'cloudmanagement_usergroups'},
                  {name:'cloudmanagement_policy', type:'cloudmanagement_policys', collection: 'cloudmanagement_policys'},
                  {name:'cloudmanagement_credential', type:'cloudmanagement_credentials', collection: 'cloudmanagement_credentials'},
                  {name:'cloudmanagement_manageimage', type:'cloudmanagement_manageimages', collection: 'cloudmanagement_manageimages'},
                  {name:'cloudmanagement_healthchecking', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_healthcheckings'},
                  {name:'cloudmanagement_capacityreport', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_capacityreports'},
                  {name:'cloudmanagement_s3report', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_s3reports'},
                  {name:'cloudmanagement_instancereport', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_instancereports'},
                  {name:'cloudmanagement_volumereport', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_volumereports'},
                  {name:'cloudmanagement_ipreport', type:'cloudmanagement_healthcheckings', collection: 'cloudmanagement_ipreports'},
                  
                  
                  {name:'infrastructure_cc', type:'infrastructure_ccs', collection: 'infrastructure_ccs'},
                  {name:'infrastructure_sc', type:'infrastructure_scs', collection: 'infrastructure_scs'},
                  {name:'infrastructure_vmwarebroker', type:'infrastructure_vmwarebroker', collection: 'infrastructure_vmwarebrokers'},
                  {name:'infrastructure_node', type:'infrastructure_nodes', collection: 'infrastructure_nodes'},
                  {name:'infrastructure_clc', type:'infrastructure_clcs', collection: 'infrastructure_clcs'},
                  {name:'infrastructure_walrus', type:'infrastructure_walruses', collection: 'infrastructure_walruses'},
                  {name:'infrastructure_storage', type:'infrastructure_storages', collection: 'infrastructure_storages'}
                  
      ], 
    },
    _data : {},
    _callbacks : {}, 
    _listeners : {},
    _init : function(){ },
    _numPending : 0,
    _enabled : true,
    _errorCode : null, // the http status code of the latest response
    _data_needs : null, // if this is set, only resources listed will be fetched from the proxy
    _create : function(){
      var thisObj = this;
      
      $.each(thisObj.options.endpoints, function(idx, ep){
        var name = ep.name;
        var url = ep.url;

        // add setup backbone collections in endpoints array
        if (ep.collection != null) {
          //console.log("set up model for "+name);

          require(['underscore', 'app'], function(_, app) {
            ep.model = app.data[ep.name];

            var doUpdate = function() {
//              console.log('EUCADATA', name, ep.model.length);
              thisObj._data[name] = {
                lastupdated: new Date(),
                results: ep.model.toJSON()
              }
              if(thisObj._listeners[name] && thisObj._listeners[name].length >0) {
                $.each(thisObj._listeners[name], function (idx, callback){
                  callback['callback'].apply(thisObj);
                });
              }
            }
            ep.model.on('sync reset change add remove', _.debounce(doUpdate, 100, false));

            // set up callback for timer which updates model if necessary
            thisObj._callbacks[name] = {callback: function(){
              if(!thisObj._enabled || thisObj.countPendingReq() > MAX_PENDING_REQ ) {
                return;
              }
              if (thisObj._data_needs && thisObj._data_needs.indexOf(ep.type) == -1) {
                return;
              }
              if (ep.model == undefined) {
                return;
              }
              ep.model.fetch({merge: true, add: true, remove: true,
                              //success: function(col, resp, options) {
                              //  col.trigger('initialized');
                              //},
                              error:function(textStatus, jqXHR, options) {
                                thisObj._errorCode = jqXHR.status;
                                thisObj._numPending--;
                                if(thisObj._data[name]){
                                  var last = thisObj._data[name]['lastupdated'];
                                  var now = new Date();
                                  var elapsedSec = Math.round((now-last)/1000);             
                                  if((jqXHR.status === 401 || jqXHR === 403)  ||
                                     (elapsedSec > thisObj.options.refresh_interval_sec*thisObj.options.max_refresh_attempt)){
                                    delete thisObj._data[name];
                                    thisObj._data[name] = null;
                                  }
                                  if(thisObj.getStatus() !== 'online'){
                                    errorAndLogout(thisObj._errorCode);
                                  }
                                  if (jqXHR.status === 504) {
                                    notifyError($.i18n.prop('data_load_timeout'));
                                  }
                                }
                              }});
            }, repeat: null};

            var interval = thisObj.options.refresh_interval_sec*1000;
            thisObj._callbacks[name].repeat = runRepeat(thisObj._callbacks[name].callback, interval, true);
          });
        }
      });
      // use this to trigger cache refresh on proxy.
      // if we decide to set data interest more accurately per landing page (maybe leverage data needs), this call will probably be un-necessary.
      //setDataInterest({});
    }, 
    _destroy : function(){
    },
     
/***** Public Methods *****/
    // e.g., get(instance, id);
    get : function(resource){
      var thisObj = this;
      if(thisObj._data[resource])
        return thisObj._data[resource].results;
      else
        return null;
    },

    countPendingReq : function(){
      var thisObj = this;
      return thisObj._numPending;
    }, 

    addCallback : function(resource, source, callback){
      var thisObj = this;
      if (typeof(callback) === "function"){
        if(!thisObj._listeners[resource])
          thisObj._listeners[resource] = [];
        var duplicate = false;
        for (i=0; i<thisObj._listeners[resource].length; i++){
          var cb = thisObj._listeners[resource][i];
          if(cb['src'] === source){ 
            duplicate = true; 
            break; 
          }
        }
        if(!duplicate)
          thisObj._listeners[resource].push({src:source, callback: callback});
      }
    },
    
    removeCallback : function(resource, source){
      var thisObj = this;
      if (! thisObj._listeners[resource] || thisObj._listeners[resource].length <=0)
        return;
      var toDelete = -1;
      for (i=0; i< thisObj._listeners[resource].length; i++){
        var cb = thisObj._listeners[resource][i];
        if (cb['src'] === source) {
          toDelete = i;
          break;
        }
      }
      if(toDelete>=0)
        thisObj._listeners[resource].splice(toDelete, 1);
    },

    refresh : function(resource){
      var thisObj = this;
      if(thisObj._callbacks[resource])
        thisObj._callbacks[resource].callback.apply(this); 
    },

    setDataNeeds : function(resources){
        this._data_needs = resources;
        var thisObj = this;
        var resList = resources;
        $.each(thisObj.options.endpoints, function(idx, ep){
            if (resList.indexOf(ep.type) > -1) {
                thisObj.refresh(ep.name);
            }
        });
    },

    // this can be used to set any additional param, including filters
    setDataFilter : function(resource, filters){
        var thisObj = this;
        $.each(this.options.endpoints, function(idx, ep){
            if (resource == ep.type) {
                ep.params = filters;
                thisObj.refresh(ep.name);
            }
        });
    },

    // status: online, offline, error
    getStatus : function(){
      var thisObj = this;
      var status = 'online';
      var numOff = 0;
      $.each(thisObj._data, function(resource, data){
        if(!data)
          numOff++;
      });
      if(numOff >= 2) 
        status='offline';

      return status;
    },

    disable : function(){
      this._enabled = false;
    },

    enable : function(){
      this._enabled = true;
    },

    isEnabled : function(){
      return this._enabled;
    }
/**************************/ 
  });
})
(jQuery, window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
