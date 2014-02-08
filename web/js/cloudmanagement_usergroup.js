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
  $.widget('eucalyptus.cloudmanagement_usergroup', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#usergroupTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 
      var $instTable = $configurecloud.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'cloudmanagement_usergroup', // user of this widget should customize these options,
          data_deps: ['cloudmanagement_usergroup'],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'cloudmanagement_usergroup',
            "aoColumnDefs": [
              {
                "bSortable": false,
                "aTargets":[0],
                "mData": function(source) { return '<input type="checkbox"/>'; },
                "sClass": "checkbox-cell",
              },
              {
                "aTargets":[1],
                "mData": function(source) { 
                  return source.groupName;
                },
              },
              {
            	"aTargets":[2],
                "mData": function(source){
                  return source.groupAccount;
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
        	  var accounts = describe('cloudmanagement_account');
        	  var $accountArea = thisObj.addDialog.find('#account');
        	  $accountArea.empty();
        	  $.each(accounts, function(idx, act) {
        		  $accountArea.append($('<option>').attr('value', act.accountName).text(act.accountName));
        	  });
        	  thisObj.addDialog.eucadialog('open');
          },            
          menu_actions : function(args){
              return {
                'Delete' : {
                    "name" : gloable_delete,
                    callback : function(key, opt) {
                        var itemsToDelete = [];
                        var $tableWrapper = thisObj.tableWrapper;
                        itemsToDelete = $tableWrapper.innertable('getSelectedRows', 1);
                        var matrix = [];
                        $.each(itemsToDelete,function(idx, key){
                          matrix.push([key, key]);
                        });

                        if ( itemsToDelete.length > 0 ) {
                          thisObj.delDialog.eucadialog('setSelectedResources', {title:[usergroup_subtitle], contents: matrix, limit:60, hideColumn: 1});
                          thisObj.delDialog.dialog('open');
                        }
                    }
                },
                'Manage_User' : {
                    "name" : usergroup_manageuser,
                    callback : function(key, opt) {
                        items = thisObj.tableWrapper.innertable('getSelectedRows');
                        if (items.length != 1) {
                            notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.usergroup_subtitle));
                            return false;
                        } 
                        var matrix = [];
                        $.ajax({
                        type:"POST",
                        url:"ea.cloudmanagement.UserAction$getUsersByGroup.json",
                        data:{group: items[0].groupName, account: items[0].groupAccount},
                        //data:{account: items[0].groupAccount, group: items[0].groupName},
                        dataType:"json",
                        async:false,
                        success:function(data){
                             // $.each(describe('cloudmanagement_usergroup'), function(idx1,ug) {
                             //     var flg = false;
                             $.each(data, function(idx2, user) {
                                     matrix.push([user.userName,"",true]);
                                          
                             });
                          },
                        });
                        
                        if ( matrix.length > 0 ) {
                          thisObj.manageUserDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});	
                          //thisObj.manageUserDialog.eucadialog('setSelectedResourcesWithCheckbox', {contents: matrix});
                          thisObj.manageUserDialog.find(".selected-resources").hcheckbox();
                        }
                        thisObj.manageUserDialog.dialog('open');
                    }
                },
                'Add_Policy' : {
                    "name" : user_addpolicy,
                    callback : function(key, opt) {
                            var items = thisObj.tableWrapper.innertable('getSelectedRows');
                            if (items.length != 1) {
                                notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.usergroup_subtitle));
                                return false;
                            }
                            thisObj.addPolicyDialog.find('#account').val(items[0].groupAccount);
                            thisObj.addPolicyDialog.find('#group').val(items[0].groupName);
                            thisObj.addPolicyDialog.dialog('open');
                    }
                },
                'Delete_Policy' : {
                    "name" : user_deletepolicy,
                    callback : function(key, opt) {
                            var items = thisObj.tableWrapper.innertable('getSelectedRows');
                            if (items.length != 1) {
                                notifySuccess($.i18n.prop('error_msg_select_one', $.i18n.map.usergroup_subtitle));
                                return false;
                            } 
                            var matrix = [];
                            $.ajax({
                                type:"POST",
                                url:"ea.cloudmanagement.PolicyAction$getPolicysByGroup.json",
                                data:{group: items[0].groupName, account: items[0].groupAccount},
                                dataType:"json",
                                async:false,
                                success:function(data){
                                    $.each(data, function(idx, val){
                                       matrix.push([val.policyName,
                                                  $.i18n.map.policy_name+': '+val.policyName+'\n'+
                                                  $.i18n.map.policy_action+': '+val.policyDocument.Statement[0].Action+'\n'+
                                                  $.i18n.map.policy_resource+': '+val.policyDocument.Statement[0].Resource+'\n'+
                                                  $.i18n.map.policy_effect+': '+val.policyDocument.Statement[0].Effect,
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
          draw_cell_callback : null, 
          expand_callback : function(row){ // row = [col1, col2, ..., etc]
            return thisObj._expandCallback(row);
          }
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
           title: account_deleteusergroup,
           width: 500,
           buttons: {
             'delete': {text: button_delete, click: function() {
                  var items = thisObj.tableWrapper.innertable('getSelectedRows');
                  $del_dialog.eucadialog("close");
                  var json = '[';
                  $(items).each(function(index, val) {
                      json += ('{\"account\":' + '\"' + val.groupAccount + '\"' 
                      + ',\"group\":' + '\"' + val.groupName + '\"},');
                  });
                  json += ']';
                  thisObj._deleteAction(json);
              }},
             'cancel': {text: button_cancel, focus:true, click: function() { $del_dialog.eucadialog("close");}} 
           },
         });
           
        var createButtonId = "keys-add-btn";
        var $tmpl = $('html body div.templates').find('#addUserGroupDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $add_dialog = $rendered.children().first();
        this.addDialog = $add_dialog.eucadialog({
            id : 'keys-add',
            title : account_addusergroup,
            width : 500,
            buttons : {
                // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...}
                'create' : {
                    domid : createButtonId,
                    text : button_add,
                    disabled : true,
                    click : function() {
                        var name = $.trim(asText($add_dialog.find('#name').val()));
                        var account = $.trim(asText($add_dialog.find('#account').val()));
                        $add_dialog.eucadialog("close");
                        var model = {
                            group : name,
                            account : account
                        };
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
        $add_dialog.eucadialog('buttonOnKeyupNew', $add_dialog.find('#name'), createButtonId, function(val) {
            var name = $.trim($add_dialog.find('#name').val());
            if (!INFRASTRACTURE_NAME_PATTERN.test(name)) {
                thisObj.addDialog.eucadialog('showError', error_msg_infrastracture_name);
            } else {
                thisObj.addDialog.eucadialog('showError', null);
            }
            return INFRASTRACTURE_NAME_PATTERN.test(name);
        }); 

        var $tmpl = $('html body').find('#deleteMultipleDlgTmpl').clone();
        var $rendered = $($tmpl.render($.extend($.i18n.map)));
        var $manageUser_dialog = $rendered.children().first();
        this.manageUserDialog = $manageUser_dialog.eucadialog({
           id: 'keys-delete',
           width: 500,
           title: usergroup_manageuser,
           buttons: {
             'delete': {
                 text: gloable_save, 
                 click: function() {
                  var items = thisObj.tableWrapper.innertable('getSelectedRows');
                  var user = thisObj.manageUserDialog.eucadialog('getSelectedCheckedResources');
                  if (items.length < 1) {
                      thisObj.manageUserDialog.eucadialog('showError',error_msg_multiple_delete);
                  } else {
                      $manageUser_dialog.eucadialog("close");
                      var model = {account: items[0].groupAccount, user: user, group: items[0].groupName};
                      thisObj._userAction(model);
                  }
               }},
             'cancel': {text: button_cancel, focus:true, click: function() { $manageUser_dialog.eucadialog("close");}} 
           },
         });
         
        var createPolicyButtonId = "keys-add-policy-btn";
        var $tmpl = $('html body').find('#addGroupPolicyDlgTmpl').clone();
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
                        var group = $.trim(asText($addPolicy_dialog.find('#group').val()));
                        var action = $.trim(asText($addPolicy_dialog.find('#action').val()));
                        var resource = $.trim(asText($addPolicy_dialog.find('#resource').val()));
                        var effect = $.trim(asText($addPolicy_dialog.find('#effect').val()));
                        var condition = $.trim(asText($addPolicy_dialog.find('#condition').val()));
                        var model = {
                                    name : name,
                                    account : account,
                                    group : group,
                                    actionName : action,
                                    resource : resource,
                                    effect : effect,
                                    condition: condition
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
        
        //var $tmpl = $('html body').find('#deleteDlgTmpl').clone();
        var $tmpl = $('html body').find('#deleteMultipleDlgTmpl').clone();
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
                        var model = {account: items[0].groupAccount, group: items[0].groupName, policy: val};
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
      
      _deleteAction : function(json) {
          var thisObj = this;
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

      _addAction : function(model) {
          var thisObj = this;
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
       
       _userAction : function(model) {
          var thisObj = this;
          $.ajax({
            type:"POST",
            url:"ea.cloudmanagement.UserGroupAction$manageUser.json",
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
              url:"ea.cloudmanagement.PolicyAction$addGroupPolicy.json",
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
                url:"ea.cloudmanagement.PolicyAction$deleteGroupPolicy.json",
                data:model,
                dataType:"json",
                async:false,
                success:
                  function(data, textStatus, jqXHR){
                      if (data.state) {
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
