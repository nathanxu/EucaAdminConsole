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
  $.widget('eucalyptus.cloudmanagement_manageimage', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#manageimageTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 
      
      var $instTable = $configurecloud.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'cloudmanagement_manageimage', // user of this widget should customize these options,
          data_deps: ['cloudmanagement_manageimage'],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'cloudmanagement_manageimage',
            "aaSorting": [[ 3, "desc" ]],
            "aoColumnDefs": [
              {
                "bSortable": false,
                "aTargets":[0],
                "mData": function(source) { return '<input type="checkbox"/>' },
                "sClass": "checkbox-cell",
              },
              {
                "aTargets":[1],
                "mData": function(source) { 
                  return source.imageId;
                },
              },
              {
            	"aTargets":[2],
                "mData": function(source){
                  return source.architecture;
                },
              },
              {
                "aTargets":[3],
                "mData": function(source) { 
                	return source.isPublic;
                },
              },
              {
                  "aTargets":[4],
                  "mData": function(source) { 
                    return source.imageType;
                  },
                },
                {
              	"aTargets":[5],
                  "mData": function(source){
                    return source.state;
                  },
                },
            ]
          },
          text : {
            create_resource : '',
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          menu_actions : function(args) {
            return {
                'Deregister' : {
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
                          thisObj.delDialog.eucadialog('setSelectedResources', {title:[manageimage_subtitle], contents: matrix, limit:60, hideColumn: 1});
                          thisObj.delDialog.dialog('open');
                        }
                    }
                },
                'Public' : {
                    "name" : manageimage_public,
                    callback : function(key, opt) {
                        thisObj._modifyAction(true);
                    }
                },
                'Private' : {
                    "name" : manageimage_private,
                    callback : function(key, opt) {
                        thisObj._modifyAction(false);
                    }
                },
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
           title: manageimage_deregister,
           width: 500,
           buttons: {
             'delete': {text: button_delete, click: function() {
                  $del_dialog.eucadialog("close");
                  thisObj._deleteAction();
              }},
             'cancel': {text: button_cancel, focus:true, click: function() { $del_dialog.eucadialog("close");}} 
           },
         });        
    },

    _modifyAction : function(isPublic) {
        var thisObj = this;
        var items = thisObj.tableWrapper.innertable('getSelectedRowsString', 1);
        $.ajax({
            type:"POST",
            url:"ea.cloudmanagement.ManageImageAction$modify.json",
            data:{items : items, isPublic : isPublic},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+
                    $.i18n.map.success_msg_modify+"</font>" : "<font color='red'>"+
                    $.i18n.map.error_msg_modify+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);
              } else {
                notifyError($.i18n.map.error_msg_modify);
              }  
              require(['app'], function(app) { 
                app.data.cloudmanagement_manageimage.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
                notifyError($.i18n.map.error_msg_modify, getErrorMessage(jqXHR));
            }
         });        
    },
    
    _deleteAction : function() {
        var thisObj = this;
        var items = thisObj.delDialog.eucadialog('getSelectedResourcesString',1);
        $.ajax({
            type:"POST",
            url:"ea.cloudmanagement.ManageImageAction$delete.json",
            data:{items : items},
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
              if (data) {
                var notifyMsg = "";
                $.each(data, function(idx, value) {
                    notifyMsg += (value.key +" : "+ (value.value ? "<font color='green'>"+$.i18n.map.success_msg_del+"</font>" : "<font color='red'>"+$.i18n.map.error_msg_del+"</font>") + "</br>");
                });
                notifySuccess($.i18n.map.msg_show_result, notifyMsg);                
              } else {
                notifyError($.i18n.map.error_msg_del);
              }
              require(['app'], function(app) { 
                app.data.cloudmanagement_manageimage.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
                notifyError($.i18n.map.error_msg_del, getErrorMessage(jqXHR));
            }
         });        
    }
    
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
