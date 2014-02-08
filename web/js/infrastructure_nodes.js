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
  $.widget('eucalyptus.infrastructure_nodes', $.eucalyptus.eucawidget, {
    options : { },
    tableWrapper : null,
    addDialog : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#infrastructureNodesTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $instTable = $infrastructure.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'infrastructurenodes', // user of this widget should customize these options,
          data_deps: [],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'infrastructure_node',
            "aaSorting": [[ 1, "desc" ]],
            "aoColumnDefs": [
              {
  	      // Display the checkbox button in the main table
                "bSortable": false,
                "aTargets":[0],
                "mData": function(source) { return '<input type="checkbox"/>' },
                "sClass": "checkbox-cell",
              },
              {
                "aTargets":[1],
                "mData": function(source) { 
                    return source.hostName;
                },
              },
              {
                "aTargets":[2],
                "mData": function(source) { 
                    return source.fullName;
                },
              }, 
              {
                "aTargets":[3],
                "mData": function(source) { 
                    return source.type;
                },
              },   
              {
                "aTargets":[4],
                "mData": function(source) { 
                    return source.partition;
                },
              },   
              {
                "aTargets":[5],
                "mData": function(source) { 
                    return source.detail;
                },
              },                                     
              {
                  "aTargets":[6],
                  "mData": function(source) { 
                        var status = null;
                        var title = null;
                        if (source.state == 'enable' || source.state == 'ENABLED') {
                            status = 'available';
                            title = $.i18n.map.status_enable;
                        } else {
                            status = 'terminated';
                            title = $.i18n.map.status_disable;
                        }
                        return eucatableDisplayColumnTypeInfrastructureStatus(status, title);               
                    },
              }             
            ]
          },
          text : {
            create_resource : gloable_new,
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          menu_click_create : function(e) {
        	 thisObj.addDialog.eucadialog('open');
          },            
          menu_actions : function(args){
  			return {
  				'Delete' : {
  					"name" : gloable_delete,
  					callback : function() {
  						
  				        var itemsToDelete = [];
  				        var $tableWrapper = thisObj.tableWrapper;
  				        itemsToDelete = $tableWrapper.innertable('getSelectedRows', 1);
  				        var matrix = [];
  				        $.each(itemsToDelete,function(idx, key){
  				          matrix.push([key, key]);
  				        });

  				        if ( itemsToDelete.length > 0 ) {
  				          thisObj.delDialog.eucadialog('setSelectedResources', {title:[title_node], contents: matrix, limit:60, hideColumn: 1});
  				          thisObj.delDialog.dialog('open');
  				        }
  					}
  				},
  				'Enable' : {
  					"name" : gloable_enable,
  					callback : function() {
  						thisObj._enableAction();
  					}
  				},
  				'Disable' : {
  					"name" : gloable_disable,
  					callback : function(key,
  							opt) {
  						thisObj._disableAction();
  					}
  				}
  			};
          },

          draw_cell_callback : null, 
          expand_callback : function(row){ // row = [col1, col2, ..., etc]
            return thisObj._expandCallback(row);
          }
      }); //end of eucatable
      
      var $wrapper = $('<div>').addClass('infrastructure-wrapper');
      $infrastructure.appendTo($wrapper);
      $wrapper.appendTo(this.element);
    },

    _create : function() { 
        var thisObj = this;
        
        var $tmpl = $('html body').find('#deleteDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $del_dialog = $rendered.children().first();
        $del_dialog.find(".selected-resources").before($.i18n.map.text_del_component);
        this.delDialog = $del_dialog.eucadialog({
           id: 'keys-delete',
           title: title_del_node,
           width: 500,
           buttons: {
             'delete': {text: button_delete, click: function() {
                  var items = thisObj.tableWrapper.innertable('getSelectedRows');
                  $del_dialog.eucadialog("close");
                  var json = '[';
                  $(items).each(function(index, val) {
                      json += ('{\"partition\":' + '\"' + val.partition + '\"' 
                      + ',\"name\":' + '\"' + val.name + '\"},');
                  });
                  json += ']';
                  thisObj._deleteAction(json);
              }},
             'cancel': {text: button_cancel, focus:true, click: function() { $del_dialog.eucadialog("close");}} 
           },
         });
        
    	var createButtonId = "keys-add-btn";
        var $tmpl = $('html body div.templates').find('#addNodeDlgTmpl').clone();       
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $add_dialog = $rendered.children().first();
        this.addDialog = $add_dialog.eucadialog({
            id: 'keys-add',
            title: title_add_node,
            width: 500,
            buttons: { 
            // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...} 
		    'create' : {
								domid : createButtonId,
								text : button_add,
								disabled : true,
								click : function() {
									var host = $.trim(asText($add_dialog.find('#ip').val()));
						            var partition = $.trim($add_dialog.find('#partition').val());
						            var hostUser = $.trim(asText($add_dialog
                                            .find('#host-user').val()));
                                    var password = $.trim(asText($add_dialog
                                            .find('#password').val())); 
									$add_dialog.eucadialog("close");
									var model = {host: host, partition:partition, hostUser:hostUser, password:password};
									thisObj._addAction(model);
									;
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
        $add_dialog.find("#ip").watermark(watermark_input_ip);
        $add_dialog.find("#partition").watermark(watermark_input_partition);
        $add_dialog.find("#host-user").watermark(watermark_input_hostuser);
        $add_dialog.find("#password").watermark(watermark_input_password);        
        $add_dialog.eucadialog('buttonOnKeyupNew', $add_dialog.find('#ip'), createButtonId, function(val){
            var ip = $.trim($add_dialog.find('#ip').val());
            var partition = $.trim($add_dialog.find('#partition').val());
            var isMatch = IP_PATTERN.test(ip) && INFRASTRACTURE_NAME_PATTERN.test(partition);
            if (!IP_PATTERN.test(ip)) {
				thisObj.addDialog.eucadialog('showError',error_msg_ip);
            } else if (!INFRASTRACTURE_NAME_PATTERN.test(partition)){
            	thisObj.addDialog.eucadialog('showError',error_msg_infrastracture_partition_name);
            } else if (isMatch){
            	thisObj.addDialog.eucadialog('showError',null);
            }
            return isMatch;
          });
        $add_dialog.eucadialog('buttonOnKeyupNew', $add_dialog.find('#partition'), createButtonId, function(val){
            var ip = $.trim($add_dialog.find('#ip').val());
            var partition = $.trim($add_dialog.find('#partition').val());
            var isMatch = IP_PATTERN.test(ip) && INFRASTRACTURE_NAME_PATTERN.test(partition);
            if (!INFRASTRACTURE_NAME_PATTERN.test(partition)) {
  				thisObj.addDialog.eucadialog('showError', error_msg_infrastracture_partition_name);
            } else if (!IP_PATTERN.test(ip)){
            	thisObj.addDialog.eucadialog('showError', error_msg_ip);
            }  else if (isMatch){
            	thisObj.addDialog.eucadialog('showError',null);
            }
            return isMatch;
          });
    },
    
    _disableAction : function() {
        var itemsToDelete = thisObj.tableWrapper.innertable('getSelectedRowsString', 1);
        $.ajax({
        	type:"POST",
        	url:"ea.node.NodeAction$disableNode.json",
            data:{items : itemsToDelete},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                  notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_disable+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_disable+":" + value.desc+"</font>") + "</br>");
                 });
                 notifySuccess($.i18n.map.msg_show_result, notifyMsg);
              } else {
                notifyError($.i18n.map.error_msg_disable);
              } 
              require(['app'], function(app) { 
              	app.data.infrastructure_node.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
            	notifyError($.i18n.map.error_msg_disable, getErrorMessage(jqXHR));
            }
         });
      },
    
    _enableAction : function() {
        var itemsToDelete = thisObj.tableWrapper.innertable('getSelectedRowsString', 1);
        $.ajax({
        	type:"POST",
        	url:"ea.node.NodeAction$enableNode.json",
            data:{items : itemsToDelete},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_enable+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_enable+":"+value.desc+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);
              } else {
                notifyError($.i18n.map.error_msg_enable);
              }  
              require(['app'], function(app) { 
              	app.data.infrastructure_node.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
            	notifyError($.i18n.map.error_msg_enable, getErrorMessage(jqXHR));
            }
         });
      },
    
    _deleteAction : function(json) {
        $.ajax({
        	type:"POST",
        	url:"ea.node.NodeAction$deleteNode.json",
            data:{json : json},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+":" + value.desc +"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);                
              } else {
                notifyError($.i18n.map.error_msg_del);
              }
              require(['app'], function(app) { 
              	app.data.infrastructure_node.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
            	notifyError($.i18n.map.error_msg_del, getErrorMessage(jqXHR));
            }
         });
      },
    
    _addAction : function(model) {
        $.ajax({
          type:"POST",
          url:"ea.node.NodeAction$addNode.json",
          data:model,
          dataType:"json",
          async:false,
          success:
          function(data, textStatus, jqXHR){
            if (data.state) {
                notifySuccess($.i18n.map.success_msg_add);
            } else {
                notifyError($.i18n.map.error_msg_add + ":" + data.message);
            }
            require(['app'], function(app) { 
            	app.data.infrastructure_node.fetch(); 
            });
            thisObj.tableWrapper.innertable('refreshTable');
          },
          error:
          function(jqXHR, textStatus, errorThrown){
            notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
          }
       });
     },
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
