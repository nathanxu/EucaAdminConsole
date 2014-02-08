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
  $.widget('eucalyptus.infrastructure_network', $.eucalyptus.eucawidget, {
    options : { },
    tableWrapper : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#infrastructureNetworkTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $props_area = $infrastructure.find('#network-content');
      var $select = $infrastructure.find('select');
      $select.change(function(e) {
    	  var mode = e.target.value;
    	  thisObj._setProps(mode, $props_area);
      });
      var mode = thisObj._getMode();
      $select.val(mode).change();
      var $wrapper = $('<div>').addClass('infrastructure-wrapper');
      $infrastructure.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      $('#saveBtn').click(function() {
          var json = '[';
          var $options = $props_area.find('.form-row');
          var mode = $select.val();
          
          $options.each(function(index, val) {
              json += ('{\"key\":' + '\"' + $(val).children('label').html() + '\"' 
              + ',\"value\":' + '\"' + $(val).children('input').val() + '\"},');
          });
          json += ']';
          thisObj._saveAction(mode,json);
      });
    },

    _create : function() { 
    },
    
    _getMode : function() {
        var thisObj = this;
        var mode = null;
        $.ajax({
            type:"POST",
            url:"ea.network.NetworkAction$queryMode.json",
            dataType:"json",
            async:false,
            success:
            function(data){
                mode = data.value;
            }
         });
         return mode;
    },
    
    _setProps : function(mode, $props_area) {
        $.ajax({
            type:"POST",
            url:"ea.network.NetworkAction$queryProps.json",
            data:{mode : mode},
            dataType:"json",
            async:false,
            success:
            function(props){
                 var html = '';
                 if (props == null) {
                     $props_area.html(html);
                 } else {
                     $.each(props, function(i, val) {
                        html += '<div class="form-row"><label class="extra-long-label">'+ val.name +'</label><input type="text" value="'+ val.value +'"/></div>'; 
                     });        
                     $props_area.html(html);
                 }

            },
         });
    },
    
    _saveAction : function(networkmode,json) {
          $.ajax({
            type:"POST",
            url:"ea.network.NetworkAction$save.json",
            data:{mode:networkmode,json: json},
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
    
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
