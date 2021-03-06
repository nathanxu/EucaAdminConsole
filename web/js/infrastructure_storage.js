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
  $.widget('eucalyptus.infrastructure_storage', $.eucalyptus.eucawidget, {
    options : { },
    tableWrapper : null,
    addDialog : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#infrastructureStoragesTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $instTable = $infrastructure.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'infrastructureStorages', // user of this widget should customize these options,
          data_deps: [],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'infrastructure_storage',
            "aoColumnDefs": [
              {
                // Display the checkbox button in the main table
                "bSortable": false,
                "aTargets":[0],
                "mData": function(source) { return '<input type="radio" name="storage-radio" checked="checked"/>' },
                "sClass": "checkbox-cell"
              },
              { 
  	      // Display the id of the image in eucatable
  	      "aTargets":[1], 
                "mData": function(source){
                  var name = source.name;
                  if (source.value == "Overlay") {
                	  return '<a style="cursor:pointer;">' + source.name + '</a>';
                  } else {
                	  return eucatableDisplayColumnTypeTwist("block manager detail", name, 256); 
                  }
                },
              },
              {
  	             "aTargets":[2], 
                 "mData": "partition",
              },
              {
                 "aTargets":[3], 
                 "mData": "value",
              },
              {
                 "aTargets":[4], 
                 "mData": "description",
              },
              {
                 "bVisible": false,
                 "aTargets":[5], 
                 "mData": "name",
              }
            ],
          },
          text : {
        	create_resource : gloable_config,
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          menu_click_create : function(e) {
	          var $tableWrapper = thisObj.tableWrapper;
	          var $select = thisObj.addDialog.find('#block-manager');
              var $props_area = thisObj.addDialog.find('#block-manager-content');
              var  partition = $tableWrapper.innertable('getSelectedRows', 2)[0];
              $select.change(function(e) {
                  var m = e.target.value;
                  thisObj._setProps(partition, m, $props_area);
              });
	          thisObj.addDialog.find('#partition').val(partition);
              var mode = thisObj._getMode(partition);
              thisObj.addDialog.find('#block-manager').val(mode).change();
        	  thisObj.addDialog.eucadialog('open');
          },
          expand_callback : function(row){ // row = [col1, col2, ..., etc]
            return thisObj._expandCallback(row);
          },
        });
      	var $wrapper = $('<div>').addClass('infrastructure-wrapper');
        $infrastructure.appendTo($wrapper);
        $wrapper.appendTo(this.element);
      },

      _create : function() { 
          var thisObj = this;
      	  var createButtonId = "keys-config-btn";
          var $tmpl = $('html body div.templates').find('#configStorageDlgTmpl').clone();       
          var $rendered = $($tmpl.render($.extend($.i18n.map)));
          var $add_dialog = $rendered.children().first();
          this.addDialog = $add_dialog.eucadialog({
              id: 'keys-config',
              title: title_update_storage,
              width: 500,
              buttons: { 
              // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...} 
  		    'save' : {
  								domid : createButtonId,
  								text : button_save,
  								disabled : false,
  								click : function() {
  						            var partition = $.trim($add_dialog.find('#partition').val());
  						            var mode = $.trim($add_dialog.find('#block-manager').val());
  						            var json = '[';
  						            var $options = $add_dialog.find('#block-manager-content .form-row');
  						            $options.each(function(index, val) {
  						                json += ('{\"key\":' + '\"' + $(val).children('label').html() + '\"' 
  						                + ',\"value\":' + '\"' + $(val).children('input').val() + '\"},');
  						            });
  						            json += ']';
  									$add_dialog.eucadialog("close");
  									
  									var model = {partition: partition, mode: mode, json: json.toString()};
  									thisObj._saveAction(model);
  								}
  							},
  			'cancel' : {
  								domid : 'keys-cancel-btn',
  								text : button_cancel,
  								click : function() {
  									$add_dialog.eucadialog("close");
  								}
  							},
  						},
            });
      },      
      
      _saveAction : function(model) {
          $.ajax({
            type:"POST",
            url:"ea.cluster.StorageAction$save.json",
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
              	app.data.infrastructure_storage.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
              notifyError($.i18n.map.error_msg_save, getErrorMessage(jqXHR));
            }
         });
       },
       
    _getMode : function(partition) {
          var thisObj = this;
          var storage = null;
          $.ajax({
              type:"POST",
              url:"ea.cluster.StorageAction$queryByPartition.json",
              data:{partition : partition},
              dataType:"json",
              async:false,
              success: function(data){
                  mode = data.value;
              }
           });
           return mode;
    },
    
    _setProps : function(partition, mode, $props_area) {
        $.ajax({
            type:"POST",
            url:"ea.cluster.StorageAction$queryProps.json",
            data:{partition: partition, mode : mode},
            dataType:"json",
            async:false,
            success:
            function(props){
                 var html = '';
                 if (props == null) {
                     $props_area.html(html);
                 } else {
                     $.each(props, function(i, val) {
                        html += '<div class="form-row"><label class="label">'+ val.name.substring(val.name.lastIndexOf('.') + 1) +'</label><input type="text" value="'+ val.value +'"/></div>'; 
                     });        
                     $props_area.html(html);
                 }

            },
         });
    },

      _expandCallback : function(row){ 
        var $el = $('<div />');
        var type = row[3].toLowerCase();
        require(['app', 'views/expandos/infrastructure_storage_' + type], function(app, expando) {
            new expando({
                el : $el,
                model : describe('infrastructure_storage', row[5])
            });
        });
        return $el;
      },
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
