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
  $.widget('eucalyptus.configurecloud_vmtype', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#vmtypeTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 

      var $instTable = $configurecloud.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'configurecloud_vmtype', // user of this widget should customize these options,
          data_deps: ['configurecloud_vmtype'],
          hidden: thisObj.options['configurecloud_hidden'],
          dt_arg : {
            "sAjaxSource": 'configurecloud_vmtype',
            "aaSorting": [[ 1, "desc" ]],
            "aoColumnDefs": [
              {
            	"aTargets":[0],
                "mData": function(source){
                  return source.name;
                },
              },
              {
                "aTargets":[1],
                "mData": function(source) { 
                	return source.disk;
                },
              },
              {
                  "aTargets":[2],
                  "mData": function(source) { 
                  	return source.memory;
                  },
                },
                {
                    "aTargets":[3],
                    "mData": function(source) { 
                    	return source.cpu;
                    },
                  },
                  {
                      "aTargets":[4],
                      "mData": function(source) { 
                            var $button = $('<a href="#">').addClass('button').text(gloable_modify).attr('id',source.name);
                            $(document.getElementById(source.name)).click(function(e) {
                                var name = $(e.target).parent().siblings()[0].innerHTML;
                                var disk = $(e.target).parent().siblings()[1].innerHTML;
                                var memory = $(e.target).parent().siblings()[2].innerHTML;
                                var cpu = $(e.target).parent().siblings()[3].innerHTML;
                                var model = {name: name, disk: disk, memory: memory, cpu: cpu};
                            thisObj._modifyAction(model);
                        });
                        return asHTML($button);
                       },
                      "sWidth": 80,
                    }
            ]
          },
          edit_args : {
              sUpdateURL: function(value, settings) {
                  this.innerHTML = value;
                 },
              "aoColumns": [
                            null,
                            {
                                indicator: 'Saving value...',
                                tooltip: 'Click to edit value',
                                type: 'text',
                                width:'50%',
                                cssclass : 'edit-form',
                                submit:'OK',
                                callback : function(value, settings) {
                                    return value;
                                }
                            },
                            {
                                indicator: 'Saving value...',
                                tooltip: 'Click to edit value',
                                type: 'text',
                                width:'50%',
                                cssclass : 'edit-form',
                                submit:'OK',
                                callback : function(value, settings) {
                                    return value;
                                }
                            },
                            {
                                indicator: 'Saving value...',
                                tooltip: 'Click to edit value',
                                type: 'text',
                                width:'50%',
                                cssclass : 'edit-form',
                                submit:'OK',
                                callback : function(value, settings) {
                                    return value;
                                }
                            },
                            null
                            ]
          },
          text : {
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          draw_cell_callback : null, 
          expand_callback : function(row){ // row = [col1, col2, ..., etc]
            return thisObj._expandCallback(row);
          }
      }); //end of eucatable
      var $wrapper = $('<div>').addClass('cloudproperties-wrapper');
      $configurecloud.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      
    },
    
    _modifyAction: function(model) {
       var thisObj = this;
       $.ajax({
          type:"POST",
          url:"ea.configurecloud.VmtypeAction$modify.json",
          data:model,
          dataType:"json",
          async:false,
          success:
          function(data, textStatus, jqXHR){
            if (data.state) {
                notifySuccess($.i18n.map.success_msg_save);
            } else {
                notifyError($.i18n.map.error_msg_save + ":" + data.message);
            }
            require(['app'], function(app) { 
                app.data.configurecloud_vmtype.fetch(); 
            });
            thisObj.tableWrapper.innertable('refreshTable');
          },
          error:
          function(jqXHR, textStatus, errorThrown){
            notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
          }
       }); 
    },
    
    _create : function() { 
    },

    _destroy : function() { },

    close: function() {
      this._super('close');
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
