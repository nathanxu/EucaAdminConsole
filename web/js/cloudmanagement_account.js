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
  $.widget('eucalyptus.cloudmanagement_account', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#accountTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 
      
      var $instTable = $configurecloud.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'cloudmanagement_account', // user of this widget should customize these options,
          data_deps: ['cloudmanagement_account'],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'cloudmanagement_account',
            "aaSorting": [[ 3, "desc" ]],
            "aoColumnDefs": [
              {
                "bSortable": false,
                "aTargets":[0],
                "mData": function(source) { return '<input type="checkbox"/>'; },
                "sClass": "checkbox-cell",
              },
              {
            	"aTargets":[1],
                "mData": function(source){
                  return source.accountName;
                },
              },
              {
                "aTargets":[2],
                "mData": function(source) { 
                	return source.accountStatus;
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
      				          thisObj.delDialog.eucadialog('setSelectedResources', {title:[account_subtitle], contents: matrix, limit:60, hideColumn: 1});
      				          thisObj.delDialog.dialog('open');
      				        }
      					  }
						},
						'Add_User' : {
							"name" : account_adduser,
							callback : function(key, opt) {
								items = thisObj.tableWrapper.innertable('getSelectedRows', 1);
								if (items.length != 1) {
									notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
									return false;
								} 
								thisObj.addUserDialog.find("#account").before('<span id="account">' +items[0]+'</span>').remove();
								thisObj.addUserDialog.eucadialog('open');
							}
						},
						'Add_UserGroup' : {
							"name" : account_addusergroup,
							callback : function(key, opt) {
								items = thisObj.tableWrapper.innertable('getSelectedRows', 1);
								if (items.length != 1) {
									notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
									return false;
								} 
								thisObj.addUserGroupDialog.find("#account").before('<span id="account">' +items[0]+'</span>').remove();
								thisObj.addUserGroupDialog.eucadialog('open');
							}
						},
						'Delete_User' : {
							"name" : account_deleteuser,
							callback : function(key, opt) {
	      				        var itemsToDelete = [];
	      				        var $tableWrapper = thisObj.tableWrapper;
	      				        itemsToDelete = $tableWrapper.innertable('getSelectedRows', 1);
	      				        if (itemsToDelete.length != 1) {
                                    notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
                                    return false;
                                }
	      				        var matrix = [];
	      				        $.each(itemsToDelete,function(idx, key){        
	      				          $.ajax({
	      				          type:"POST",
	      				          url:"ea.cloudmanagement.UserAction$getUsersByAccount.json",
	      				          data:{account: key},
	      				          dataType:"json",
	      				          async:false,
		      				          success:function(data){
		      				        	  $.each(data, function(idx, val) {
		      				        		  matrix.push([val.userName,
	            				        			       $.i18n.map.user_name+': '+val.userName+'\n'+
	            				        			       $.i18n.map.user_account+': '+val.userAccount+'\n'+
	            				        			       $.i18n.map.user_group+': '+val.userGroup+'\n'+
	            				        			       $.i18n.map.user_status+': '+val.userStat,
	            				        			       false]);
		      				        	  });
		      				          },
	      				          });
	      				        });
	      				        thisObj.delUserDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
	      				        if ( matrix.length > 0 ) {
	      				          //thisObj.delUserDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
	      				          thisObj.delUserDialog.find(".selected-resources").hcheckbox();
	      				        }
	      				        thisObj.delUserDialog.find('.checkbox').bind('click', function(event) {
									var button = thisObj.delUserDialog.parent().find('#keys-delete-btn');
                                    if (thisObj.delUserDialog.find('.checkbox.checked').size() != 0)
                                        button.removeAttr('disabled').removeClass('ui-state-disabled');
                                    else
                                        button.prop('disabled', true).addClass('ui-state-disabled');
								});
								thisObj.delUserDialog.dialog('open');
							}
						},
						'Delete_UserGroup' : {
							"name" : account_deleteusergroup,
							callback : function(key, opt) {
	      				        var itemsToDelete = [];
	      				        var $tableWrapper = thisObj.tableWrapper;
	      				        itemsToDelete = $tableWrapper.innertable('getSelectedRows', 1);
	      				        if (itemsToDelete.length != 1) {
                                    notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
                                    return false;
                                }
	      				        var matrix = [];
	      				        $.each(itemsToDelete,function(idx, key){        
	      				          $.ajax({
	      				          type:"POST",
	      				          url:"ea.cloudmanagement.UserGroupAction$getGroupsByAccount.json",
	      				          data:{account: key},
	      				          dataType:"json",
	      				          async:false,
		      				          success:function(data){
		      				        	  $.each(data, function(idx, val) {
	          				        			matrix.push([val.groupName,
	            				        			         $.i18n.map.usergroup_name+': '+val.groupName+'\n'+
	            				        			         $.i18n.map.usergroup_account+': '+val.groupAccount,
	            				        			         false]);
		      				        	  });
		      				          },
	      				          });
	      				        });
	      				        
	      				        thisObj.delUserGroupDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
	      				        if ( matrix.length > 0 ) {
	      				          //thisObj.delUserGroupDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
	      				          thisObj.delUserGroupDialog.find(".selected-resources").hcheckbox();
	      				        }
	      				        thisObj.delUserGroupDialog.find('.checkbox').bind('click', function(event) {
                                    var button = thisObj.delUserGroupDialog.parent().find('#keys-delete-btn');
                                    if (thisObj.delUserGroupDialog.find('.checkbox.checked').size() != 0)
                                        button.removeAttr('disabled').removeClass('ui-state-disabled');
                                    else
                                        button.prop('disabled', true).addClass('ui-state-disabled');
                                });
								thisObj.delUserGroupDialog.dialog('open');
							}
						},
                        'Add_Policy' : {
                            "name" : user_addpolicy,
                            callback : function(key, opt) {
                                    var items = thisObj.tableWrapper.innertable('getSelectedRows');
                                    if (items.length != 1) {
                                        notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
                                        return false;
                                    }
                                    thisObj.addPolicyDialog.find('#account').val(items[0].accountName);
                                    thisObj.addPolicyDialog.find('#effect').val('Limit');
                                    thisObj.addPolicyDialog.dialog('open');
                            }
                        },
                        'Delete_Policy' : {
                            "name" : user_deletepolicy,
                            callback : function(key, opt) {
                                    var items = thisObj.tableWrapper.innertable('getSelectedRows', 1);
                                    if (items.length != 1) {
                                        notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.account_subtitle));
                                        return false;
                                    } 
                                    var matrix = [];
                                    $.ajax({
                                        type:"POST",
                                        url:"ea.cloudmanagement.PolicyAction$getPolicysByAccount.json",
                                        data:{account: items[0]},
                                        dataType:"json",
                                        async:false,
                                        success:function(data){
                                            $.each(data, function(idx, val){
                                               matrix.push([val.policyName,
                                                          $.i18n.map.policy_name+': '+val.policyName+'\n'+
                                                          $.i18n.map.policy_action+': '+val.policyDocument.Statement[0].Action+'\n'+
                                                          $.i18n.map.policy_resource+': '+val.policyDocument.Statement[0].Resource+'\n'+
                                                          $.i18n.map.policy_effect+': '+val.policyDocument.Statement[0].Effect +"\n" +
                                                          $.i18n.map.policy_condition+': '+val.policyDocument.Statement[0].Condition,
                                                          false]);                                      
                                            });
                                        }
                                    });
                                    thisObj.delPolicyDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
                                    if ( matrix.length > 0 ) {
                                      //thisObj.delPolicyDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
                                      thisObj.delPolicyDialog.find(".selected-resources").hcheckbox();
                                    }
                                    thisObj.delPolicyDialog.dialog('open');
                            }
                        }

					};
          },

      }); //end of eucatable
        

      var $wrapper = $('<div>').addClass('innertable-wrapper');
      $configurecloud.appendTo($wrapper);
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
           title: account_deletaccount,
           width: 500,
           buttons: {
             'delete': {text: button_delete, click: function() {
                  var itemsToDelete = thisObj.delDialog.eucadialog('getSelectedResourcesString',1);
                  $del_dialog.eucadialog("close");
                  thisObj._deleteAction(itemsToDelete);
              }},
             'cancel': {text: button_cancel, focus:true, click: function() { $del_dialog.eucadialog("close");}} 
           },
         });
        
        var $tmpl = $('html body').find('#deleteMultipleDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $delUser_dialog = $rendered.children().first();
        $delUser_dialog.find(".selected-resources").before($.i18n.map.text_del_selectcontent);
        this.delUserDialog = $delUser_dialog.eucadialog({
           id: 'keys-delete',
           width: 500,
           title: account_deleteuser,
           buttons: {
             'delete': {
                 domid : 'keys-delete-btn',
                 disabled : true,
            	 text: button_delete, 
            	 click: function() {
            	  var items = thisObj.tableWrapper.innertable('getSelectedRows', 1);
                  var users = thisObj.delUserDialog.eucadialog('getSelectedCheckedResources');
                  var json = '[';
                  $(users.split(',')).each(function(index, val) {
                      json += ('{\"account\":' + '\"' + items[0] + '\"' 
                      + ',\"user\":' + '\"' + val + '\"},');
                  });
                  json += ']';
                  $delUser_dialog.eucadialog("close");
                  thisObj._deleteUserAction(json);
               }},
             'cancel': {text: button_cancel, focus:true, click: function() { $delUser_dialog.eucadialog("close");}} 
           },
         });
        
        var $tmpl = $('html body').find('#deleteMultipleDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $delUserGroup_dialog = $rendered.children().first();
        $delUserGroup_dialog.find(".selected-resources").before($.i18n.map.text_del_selectcontent);
        this.delUserGroupDialog = $delUserGroup_dialog.eucadialog({
           id: 'keys-delete',
           width: 500,
           title: account_deleteusergroup,
           buttons: {
             'delete': {
                 domid : 'keys-delete-btn',
                 disabled : true,
            	 text: button_delete, 
            	 click: function() {
                  var groups = thisObj.delUserGroupDialog.eucadialog('getSelectedCheckedResources');
                  var items = thisObj.tableWrapper.innertable('getSelectedRows');
                  var json = '[';
                  $(groups.split(',')).each(function(index, val) {
                      json += ('{\"account\":' + '\"' + items[0].accountName + '\"' 
                      + ',\"group\":' + '\"' + val + '\"},');
                  });
                  json += ']';
                  $delUserGroup_dialog.eucadialog("close");
                  thisObj._deleteUserGroupAction(json);
               }},
             'cancel': {text: button_cancel, focus:true, click: function() { $delUserGroup_dialog.eucadialog("close");}} 
           },
         });
        
    	var createButtonId = "keys-add-btn";
        var $tmpl = $('html body div.templates').find('#addAccountDlgTmpl').clone();       
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $add_dialog = $rendered.children().first();
        this.addDialog = $add_dialog.eucadialog({
            id: 'keys-add',
            title: account_addaccount,
            width: 500,
            buttons: { 
            // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...} 
		    'create' : {
								domid : createButtonId,
								text : button_add,
								disabled : true,
								click : function() {
									var name = $.trim(asText($add_dialog.find('#name').val()));
									$add_dialog.eucadialog("close");
									var model = {name: name};
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
        
        $add_dialog.find("#name").watermark(watermark_input_name);
        $add_dialog.eucadialog('buttonOnKeyupNew', $add_dialog.find('#name'), createButtonId, function(val){
            var name = $.trim($add_dialog.find('#name').val());
            if (!INFRASTRACTURE_NAME_PATTERN.test(name)){
            	thisObj.addDialog.eucadialog('showError',error_msg_infrastracture_name);
            } else {
            	thisObj.addDialog.eucadialog('showError',null);
            }
            return INFRASTRACTURE_NAME_PATTERN.test(name);
          });
        
    	var createUserButtonId = "keys-add-user-btn";
        var $tmpl = $('html body div.templates').find('#addUserDlgTmpl').clone();       
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $addUser_dialog = $rendered.children().first();
        this.addUserDialog = $addUser_dialog.eucadialog({
            id: 'keys-add',
            title: account_adduser,
            width: 500,
            buttons: { 
            // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...} 
		    'create' : {
								domid : createUserButtonId,
								text : button_add,
								disabled : true,
								click : function() {
									var name = $.trim(asText($addUser_dialog.find('#name').val()));
									var account = $.trim(asText($addUser_dialog.find('#account').html()));
									$addUser_dialog.eucadialog("close");
									var model = {name: name, account: account};
									thisObj._addUserAction(model);
								}
							},
			'cancel' : {
								domid : 'keys-cancel-btn',
								text : button_cancel,
								click : function() {
									$addUser_dialog.eucadialog("close");
								}
							},
						},
          });
        
        $addUser_dialog.find("#name").watermark(watermark_input_name);
        $addUser_dialog.eucadialog('buttonOnKeyupNew', $addUser_dialog.find('#name'), createUserButtonId, function(val){
            var name = $.trim($addUser_dialog.find('#name').val());
            if (!INFRASTRACTURE_NAME_PATTERN.test(name)){
            	thisObj.addUserDialog.eucadialog('showError',error_msg_infrastracture_name);
            } else {
            	thisObj.addUserDialog.eucadialog('showError',null);
            }
            return INFRASTRACTURE_NAME_PATTERN.test(name);
          });
        
    	var createUserGroupButtonId = "keys-add-usergroup-btn";
        var $tmpl = $('html body div.templates').find('#addUserDlgTmpl').clone();       
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $addUserGroup_dialog = $rendered.children().first();
        this.addUserGroupDialog = $addUserGroup_dialog.eucadialog({
            id: 'keys-add',
            title: account_addusergroup,
            width: 500,
            buttons: { 
            // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...} 
		    'create' : {
								domid : createUserGroupButtonId,
								text : button_add,
								disabled : true,
								click : function() {
									var group = $.trim(asText($addUserGroup_dialog.find('#name').val()));
									var account = $.trim(asText($addUserGroup_dialog.find('#account').html()));
									$addUserGroup_dialog.eucadialog("close");
									var model = {group: group, account: account};
									thisObj._addUserGroupAction(model);
								}
							},
			'cancel' : {
								domid : 'keys-cancel-btn',
								text : button_cancel,
								click : function() {
									$addUserGroup_dialog.eucadialog("close");
								}
							},
						},
          });
        
        $addUserGroup_dialog.find("#name").watermark(watermark_input_name);
        $addUserGroup_dialog.eucadialog('buttonOnKeyupNew', $addUserGroup_dialog.find('#name'), createUserGroupButtonId, function(val){
            var name = $.trim($addUserGroup_dialog.find('#name').val());
            if (!INFRASTRACTURE_NAME_PATTERN.test(name)){
            	thisObj.addUserGroupDialog.eucadialog('showError',error_msg_infrastracture_name);
            } else {
            	thisObj.addUserGroupDialog.eucadialog('showError',null);
            }
            return INFRASTRACTURE_NAME_PATTERN.test(name);
          });
    
        var $tmpl = $('html body').find('#deleteMultipleDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $policy_dialog = $rendered.children().first();
        this.policyDialog = $policy_dialog.eucadialog({
            id : 'keys-delete',
            width : 500,
            title : policy_manage,
            buttons : {
                'save' : {
                    text : button_save,
                    click : function() {
                        var items = thisObj.policyDialog.eucadialog('getSelectedCheckedResources');
                        if (items.length < 1) {
                            thisObj.policyDialog.eucadialog('showError', error_msg_multiple_delete);
                        } else {
                            $policy_dialog.eucadialog("close");
                            thisObj._policyAction(items);
                        }
                    }
                },
                'cancel' : {
                    text : button_cancel,
                    focus : true,
                    click : function() {
                        $policy_dialog.eucadialog("close");
                    }
                }
            },
        });
        
        var createPolicyButtonId = "keys-add-policy-btn";
        var $tmpl = $('html body').find('#addAccountPolicyDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $addPolicy_dialog = $rendered.children().first();
        thisObj.addPolicyDialog = $addPolicy_dialog.eucadialog({
            id : 'keys-delete',
            width : 500,
            title : user_addpolicy,
            buttons : {
                'save' : {
                    domid : createPolicyButtonId,
                    disabled : true,
                    text : button_save,
                    click : function() {
                        var name = $.trim(asText($addPolicy_dialog.find('#name').val()));
                        var account = $.trim(asText($addPolicy_dialog.find('#account').val()));
                        var user = $.trim(asText($addPolicy_dialog.find('#user').val()));
                        var action = $.trim(asText($addPolicy_dialog.find('#action').val()));
                        var resource = $.trim(asText($addPolicy_dialog.find('#resource').val()));
                        var effect = $.trim(asText($addPolicy_dialog.find('#effect').val()));
                        var condition = $.trim(asText($addPolicy_dialog.find('#condition').val()));
                        var model = {
                                    name : name,
                                    account : account,
                                    actionName : action,
                                    resource : resource,
                                    effect : effect,
                                    condition:condition
                                  };
                        $addPolicy_dialog.eucadialog("close");
                        thisObj._addPolicyAction(model);
                    }
                },
                'cancel' : {
                    text : button_cancel,
                    focus : true,
                    click : function() {
                        $addPolicy_dialog.eucadialog("close");
                    }
                }
            },
        });
        
        $addPolicy_dialog.find("#name").watermark(watermark_input_name);
        $addPolicy_dialog.eucadialog('buttonOnKeyupNew', $addPolicy_dialog.find('#name'), createPolicyButtonId, function(val) {
            var name = $.trim($addPolicy_dialog.find('#name').val());
            if (!INFRASTRACTURE_NAME_PATTERN.test(name)) {
                thisObj.addPolicyDialog.eucadialog('showError', error_msg_infrastracture_name);
            } else {
                thisObj.addPolicyDialog.eucadialog('showError', null);
            }
            return INFRASTRACTURE_NAME_PATTERN.test(name);
        });
        
        var $tmpl = $('html body').find('#deleteDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $delPolicy_dialog = $rendered.children().first();
        $delPolicy_dialog.find(".selected-resources").before($.i18n.map.text_del_component);
        thisObj.delPolicyDialog = $delPolicy_dialog.eucadialog({
           id: 'keys-delete',
           title: user_deletepolicy,
           width: 500,
           buttons: {
             'delete': {text: button_delete, click: function() {
                  var items = thisObj.tableWrapper.innertable('getSelectedRows');
                  var policys = thisObj.delPolicyDialog.eucadialog('getSelectedCheckedResources');
                  if (policys == '') {
                      thisObj.delPolicyDialog.eucadialog('showError',error_msg_multiple_delete);
                  } else {
                      var notifyMsg = "";
                      var result = false;
                      $delPolicy_dialog.eucadialog("close");
                      $.each(policys.split(','), function(idx, val) {
                        var model = {account: items[0].accountName, policy: val};
                        result = thisObj._deletePolicyAction(model);
                        notifyMsg += (val +" : "+ (result ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+"</font>") + "</br>");
                      });
                      notifySuccess($.i18n.map.msg_show_result, notifyMsg);   
                      require(['app'], function(app) { 
                        app.data.cloudmanagement_policy.fetch(); 
                      });
                      thisObj.tableWrapper.innertable('refreshTable');
                  }
              }},
             'cancel': {text: button_cancel, focus:true, click: function() { $delPolicy_dialog.eucadialog("close");}} 
           },
         });          

    },
    
    _deleteAction : function(itemsToDelete) {
        $.ajax({
        	type:"POST",
        	url:"ea.cloudmanagement.AccountAction$deleteAccount.json",
            data:{items : itemsToDelete},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+":"+value.desc+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);                
              } else {
                notifyError($.i18n.map.error_msg_del);
              }
              require(['app'], function(app) { 
                app.data.cloudmanagement_account.fetch(); 
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
          url:"ea.cloudmanagement.AccountAction$addAccount.json",
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
                app.data.cloudmanagement_account.fetch(); 
            });
            thisObj.tableWrapper.innertable('refreshTable');
          },
          error:
          function(jqXHR, textStatus, errorThrown){
            notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
          }
       });
     },
     
     _deleteUserAction : function(json) {
         $.ajax({
         	type:"POST",
         	url:"ea.cloudmanagement.UserAction$deleteUser.json",
             data:{json : json},
             dataType:"json",
             async:false,
             success:
              function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+":"+value.desc+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);                
                } else {
                  notifyError($.i18n.map.error_msg_del);
                }
                require(['app'], function(app) { 
                  app.data.cloudmanagement_user.fetch(); 
                });
                thisObj.tableWrapper.innertable('refreshTable');
              },
              error:
              function(jqXHR, textStatus, errorThrown){
                notifyError($.i18n.map.error_msg_del, getErrorMessage(jqXHR));
              }
          });
       },

     _addUserAction : function(model) {
         $.ajax({
           type:"POST",
           url:"ea.cloudmanagement.UserAction$addUser.json",
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
                app.data.cloudmanagement_user.fetch(); 
            });
            thisObj.tableWrapper.innertable('refreshTable');
          },
          error:
          function(jqXHR, textStatus, errorThrown){
            notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
          }
        });
      },
      
      _deleteUserGroupAction : function(json) {
          $.ajax({
          	type:"POST",
          	url:"ea.cloudmanagement.UserGroupAction$deleteUserGroup.json",
              data:{json : json},
              dataType:"json",
              async:false,
              success:
              function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+":"+value.desc+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);                
                } else {
                  notifyError($.i18n.map.error_msg_del);
                }
                require(['app'], function(app) { 
                  app.data.cloudmanagement_usergroup.fetch(); 
                });
                thisObj.tableWrapper.innertable('refreshTable');
              },
              error:
              function(jqXHR, textStatus, errorThrown){
                notifyError($.i18n.map.error_msg_del, getErrorMessage(jqXHR));
              }
           });
        },

      _addUserGroupAction : function(model) {
          $.ajax({
            type:"POST",
            url:"ea.cloudmanagement.UserGroupAction$addUserGroup.json",
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
                app.data.cloudmanagement_usergroup.fetch(); 
            });
            thisObj.tableWrapper.innertable('refreshTable');
          },
          error:
          function(jqXHR, textStatus, errorThrown){
            notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
          }
         });
       },
       
     _addPolicyAction : function(model) {
         var thisObj = this;
         $.ajax({
              type:"POST",
              url:"ea.cloudmanagement.PolicyAction$addAccountPolicy.json",
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
                    app.data.cloudmanagement_policy.fetch(); 
                });
                thisObj.tableWrapper.innertable('refreshTable');
              },
              error:
              function(jqXHR, textStatus, errorThrown){
                notifyError($.i18n.map.error_msg_add, getErrorMessage(jqXHR));
              }
           });;
     },
     
     _deletePolicyAction : function(model) {
         var thisObj = this;
         $.ajax({
                type:"POST",
                url:"ea.cloudmanagement.PolicyAction$deleteAccountPolicy.json",
                data:model,
                dataType:"json",
                async:false,
                success:
                  function(data, textStatus, jqXHR){
                      if (data) {
                        result = true;
                      } else {
                        result = false; 
                      }
                  },
                error:
                  function(jqXHR, textStatus, errorThrown){
                      result = false;
                  }
             });
         return result;
     }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
