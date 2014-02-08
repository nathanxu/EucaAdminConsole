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
    $.widget('eucalyptus.cloudmanagement_policy', $.eucalyptus.eucawidget, {
        options : { },
        baseTable : null,
        tableWrapper : null,
        _init : function() {
            var thisObj = this;
            var $tmpl = $('html body div.templates').find('#policyTmpl').clone();
            var $wrapper = $($tmpl.render($.i18n.map));
            var $configurecloud = $wrapper.children().first();
            var $help = $wrapper.children().last();

            var $instTable = $configurecloud.children('.inner-table');
            thisObj.tableWrapper = $instTable.innertable({
                id : 'cloudmanagement_policy', // user of this widget should customize these options,
                data_deps : ['cloudmanagement_policy'],
                hidden : thisObj.options['hidden'],
                dt_arg : {
                    "sAjaxSource" : 'cloudmanagement_policy',
                    "aoColumnDefs" : [{
                        "bSortable" : false,
                        "aTargets" : [0],
                        "mData" : function(source) {
                            return '<input type="checkbox"/>';
                        },
                        "sClass" : "checkbox-cell",
                    }, {
                        "aTargets" : [1],
                        "mData" : function(source) {
                            return source.policyName;
                        },
                    }, {
                        "aTargets" : [2],
                        "mData" : function(source) {
                            return source.type;
                        },
                    }, {
                        "aTargets" : [3],
                        "mData" : function(source) {
                            return source.element;
                        },
                    }, {
                        "aTargets" : [4],
                        "mData" : function(source) {
                            return source.accountName;
                        },    
                    }, {
                        "aTargets" : [5],
                        "mData" : function(source) {
                            return source.policyDocument.Statement[0].Effect;
                        },
                    }, {
                        "aTargets" : [6],
                        "mData" : function(source) {
                            return source.policyDocument.Statement[0].Action;
                        },
                    }, {
                        "aTargets" : [7],
                        "mData" : function(source) {
                            return source.policyDocument.Statement[0].Resource;
                        },
                    }, {
                        "aTargets" : [8],
                        "mData" : function(source) {
                            return (source.policyDocument.Statement[0].Condition!=null)?JSON.stringify(source.policyDocument.Statement[0].Condition):"";
                        },
                    },
                    ]
                },
                text : {
                    create_resource : gloable_new,
                    resource_found : 'record_found',
                    resource_search : record_search,
                    resource_plural : record_plural,
                },
                menu_click_create : function(e) {
                    var $account = $('#account');
                    var $group = $('#group');
                    var $user = $('#user');
                    var $effect = $('#effect');
                    var $assignTo = $('#assign-to');
                    $effect.children('option:lt(2)').hide();
                    $effect.children().last().prop('selected', true);
                    $assignTo.children().first().prop('selected', true);
                    $group.hide();
                    $user.hide();
                    var accounts = describe('cloudmanagement_account');
                    $account.empty();
                    //alert(accounts.length);
                    $.each(accounts, function(idx, val){
                        var $option = $('<option>').val(val.accountName).text(val.accountName);
                        $account.append($option);
                    });
                    
                    $assignTo.change(function(e) {
                        var assignTo = e.target.value;
                        if (assignTo == 'Account') {
                            $effect.children('option:lt(2)').hide();
                            $effect.children().last().prop('selected', true);
                            $group.hide();
                            $user.hide();
                        } else if (assignTo == 'Group'){
                            $effect.children('option:lt(2)').show();
                            $group.show();
                            $user.hide();
                        } else {
                            $effect.children('option:lt(2)').show();
                            $group.hide();
                            $user.show();
                        }
                        $account.change();
                    });
                    
                    $account.change(function(e) {
                        var assignTo = $assignTo.val();
                        var account = $account.val();
                        if (assignTo == 'Group') {
                            var groups = thisObj._getGroupsByAccount(account);
                            $group.empty();
                            $.each(groups, function(idx, val) {
                                var $option = $('<option>').val(val.groupName).text(val.groupName);
                                $group.append($option);
                            });
                        } else if (assignTo == 'User'){
                            var users = thisObj._getUsersByAccount(account);
                            $user.empty();
                            $.each(users, function(idx, val) {
                                var $option = $('<option>').val(val.userName).text(val.userName);
                                $user.append($option);
                            });
                        }
                    });
                    thisObj.addDialog.eucadialog('open');
                },
                menu_actions : function(args) {
                    return {
                        'Delete' : {
                            "name" : gloable_delete,
                            callback : function(key, opt) {
                                var items = [];
                                var $tableWrapper = thisObj.tableWrapper;
                                items = $tableWrapper.innertable('getSelectedRows', 1);
                                var matrix = [];
                                $.each(items,function(idx, key){
                                  matrix.push([key, key]);
                                });
                                if ( items.length > 0 ) {
                                  thisObj.delDialog.eucadialog('setSelectedResources', {title:[policy_subtitle], contents: matrix, limit:60, hideColumn: 1});
                                  thisObj.delDialog.dialog('open');
                                }
                            }
                        }
                    };
                },
            });
            //end of eucatable

            var $wrapper = $('<div>').addClass('innertable-wrapper');
            $configurecloud.appendTo($wrapper);
            $wrapper.appendTo(this.element);

        },

        _create : function() {
            var thisObj = this;
            var createButtonId = "keys-add-btn";
            var $tmpl = $('html body div.templates').find('#addPolicyDlgTmpl').clone();
            var $rendered = $($tmpl.render($.extend($.i18n.map)));
            var $add_dialog = $rendered.children().first();
            this.addDialog = $add_dialog.eucadialog({
                id : 'keys-add',
                title : policy_addpolicy,
                width : 500,
                buttons : {
                    // e.g., add : { domid: keys-add-btn, text: "Add new key", disabled: true, focus: true, click : function() { }, keypress : function() { }, ...}
                    'create' : {
                        domid : createButtonId,
                        text : button_add,
                        disabled : true,
                        click : function() {
                            var name = $.trim(asText($add_dialog.find('#name').val()));
                            var assignTo = $.trim(asText($add_dialog.find('#assign-to').val()));
                            var account = $.trim(asText($add_dialog.find('#account').val()));
                            var group = $.trim(asText($add_dialog.find('#group').val()));
                            var user = $.trim(asText($add_dialog.find('#user').val()));
                            var action = $.trim(asText($add_dialog.find('#action').val()));
                            var resource = $.trim(asText($add_dialog.find('#resource').val()));
                            var effect = $.trim(asText($add_dialog.find('#effect').val()));
                            var condition = $.trim(asText($add_dialog.find('#condition').val()));
                            $add_dialog.eucadialog("close");
                            if (assignTo == 'Account') {
                                var model = {
                                    name : name,
                                    account : account,
                                    actionName : action,
                                    resource : resource,
                                    effect : effect,
                                    condition : condition
                                };
                                thisObj._addAccountPolicy(model);
                            } else if (assignTo == 'Group'){
                                var model = {
                                    name : name,
                                    account : account,
                                    group : group,
                                    actionName : action,
                                    resource : resource,
                                    effect : effect,
                                    condition : condition
                                };
                                thisObj._addGroupPolicy(model);
                            } else {
                                var model = {
                                    name : name,
                                    account : account,
                                    user : user,
                                    actionName : action,
                                    resource : resource,
                                    effect : effect,
                                    condition : condition
                                };
                                thisObj._addUserPolicy(model);
                            }
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
            
            var $tmpl = $('html body').find('#deleteDlgTmpl').clone();
            var $rendered = $($tmpl.render($.extend($.i18n.map)));
            var $del_dialog = $rendered.children().first();
            $del_dialog.find(".selected-resources").before($.i18n.map.text_del_component);
            this.delDialog = $del_dialog.eucadialog({
                id : 'keys-delete',
                title : user_deletepolicy,
                width : 500,
                buttons : {
                    'delete' : {
                        text : button_delete,
                        click : function() {
                            var items = thisObj.tableWrapper.innertable('getSelectedRows');
                            $del_dialog.eucadialog("close");
                            var notifyMsg = "";
                            var result = false;
                            $.each(items, function(idx, val) {
                                if (val.type == 'Account Policy') {
                                    var model = {account: val.accountName, policy: val.policyName};
                                    result = thisObj._deleteAccountPolicy(model);
                                    notifyMsg += (val.policyName +" : "+ (result ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+"</font>") + "</br>");
                                } else if (val.type == 'Group Policy') {
                                    var model = {account: val.accountName, group: val.groupName, policy: val.policyName};
                                    result = thisObj._deleteGroupPolicy(model);
                                    notifyMsg += (val.policyName +" : "+ (result ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+"</font>") + "</br>");
                                } else {
                                    var model = {account: val.accountName, user: val.userName, policy: val.policyName};
                                    result = thisObj._deleteUserPolicy(model);
                                    notifyMsg += (val.policyName +" : "+ (result ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+"</font>") + "</br>");
                                }          
                            });
                            notifySuccess($.i18n.map.msg_show_result, notifyMsg);   
                            require(['app'], function(app) { 
                                app.data.cloudmanagement_policy.fetch(); 
                            });
                            thisObj.tableWrapper.innertable('refreshTable');
                        }
                    },
                    'cancel' : {
                        text : button_cancel,
                        focus : true,
                        click : function() {
                            $del_dialog.eucadialog("close");
                        }
                    }
                },
            }); 
        },
        
        _getGroupsByAccount : function(account) {
          var groups = null;
          $.ajax({
              type:"POST",
              url:"ea.cloudmanagement.UserGroupAction$getGroupsByAccount.json",
              data:{account: account},
              dataType:"json",
              async:false,
              success: function(data){
                  groups = data;
              }
           });
           return groups;
        },
        
        _getUsersByAccount : function(account) {
          var users = null;
          $.ajax({
              type:"POST",
              url:"ea.cloudmanagement.UserAction$getUsersByAccount.json",
              data:{account: account},
              dataType:"json",
              async:false,
              success: function(data, textStatus, jqXHR){
                      users = data;
              }
           });
           return users;
        },
        
        _addAccountPolicy : function(model) {
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
           });    
        },
        
        _addGroupPolicy : function(model) {
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
           });     
        },
        
        _addUserPolicy : function(model) {
            $.ajax({
              type:"POST",
              url:"ea.cloudmanagement.PolicyAction$addUserPolicy.json",
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
           });     
        },
        
        _deleteAccountPolicy : function(model) {
            var result = false;
            $.ajax({
                type:"POST",
                url:"ea.cloudmanagement.PolicyAction$deleteAccountPolicy.json",
                data:model,
                dataType:"json",
                async:false,
                success:
                  function(data, textStatus, jqXHR){
                      result = true;
                  },
                  error:
                  function(jqXHR, textStatus, errorThrown){
                      result = false;
                  }
             });
             return result;
        },
        
        _deleteGroupPolicy : function(model) {
            var result = false;
            $.ajax({
                type:"POST",
                url:"ea.cloudmanagement.PolicyAction$deleteGroupPolicy.json",
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
        },
        
        _deleteUserPolicy : function(model) {
            $.ajax({
                type:"POST",
                url:"ea.cloudmanagement.PolicyAction$deleteUserPolicy.json",
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
})(jQuery, window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
