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
  $.widget('eucalyptus.cloudmanagement_healthchecking', $.eucalyptus.eucawidget, {
    options : { },
    tableWrapper : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#cloudmanagementHealthcheckingTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $instTable = $infrastructure.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'cloudmanagementHealthchecking', // user of this widget should customize these options,
          data_deps: [],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'cloudmanagement_healthchecking',
            "aaSorting": [[ 1, "desc" ]],
            "aoColumnDefs": [
              {
                "aTargets":[0],
                "mData": function(source) { 
                	return source.type; 
                },
              },
              {
              	"aTargets":[1],
                  "mData": function(source){
                    return source.partition;
                  },
                },
              {
            	"aTargets":[2],
                "mData": function(source){
                  return source.name;
                },
              },
              {
                "aTargets":[3],
                "mData": function(source) { 
                    return source.state;
                },
              },
              {
                  "aTargets":[4],
                  "mData": function(source) { 
                    if (source.event == '') {
                        return '-';
                    } else {
                        var $html = $('<div>').addClass('table-row-status').addClass('status-error').attr('title', source.event).attr('id',source.name);
                        $(document.getElementById(source.name)).poshytip({
                            className: 'tip-darkgray',
                            bgImageFrameSize: 11,
                            offsetX: -25
                        });
                        return asHTML($html); 
                    }
                  },
                },             
            ]
          },
          text : {
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          draw_cell_callback : null, 
      }); //end of eucatable
      
      var $wrapper = $('<div>').addClass('infrastructure-wrapper');
      $infrastructure.appendTo($wrapper);
      $wrapper.appendTo(this.element);
    },

    _create : function() { },
    
    _destroy : function() { },

    close: function() {
      this._super('close');
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
