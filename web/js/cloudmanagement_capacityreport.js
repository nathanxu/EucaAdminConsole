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
  $.widget('eucalyptus.cloudmanagement_capacityreport', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#capacityReportTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $report = $wrapper.children().first();
      var $help = $wrapper.children().last(); 
      
      require(['app'], function(app) { 
          var report = app.data.cloudmanagement_capacityreport;
          report.url = 'ea.cloudmanagement.CapacityReportAction$query.json';
          report.fetch();
          });
      
      var $instTable = $report.children('.inner-table');
      thisObj.tableWrapper = $instTable.innertable({
          id : 'cloudmanagement_capacityreport', // user of this widget should customize these options,
          data_deps: ['cloudmanagement_capacityreport'],
          hidden: thisObj.options['hidden'],
          dt_arg : {
            "sAjaxSource": 'cloudmanagement_capacityreport',
            "aoColumnDefs": [
              {
            	"aTargets":[0],
                "mData": function(source){
                  return source.resource;
                },
              },
              {
                "aTargets":[1],
                "mData": function(source) { 
                	return source.total;
                },
              },
              {
                "aTargets":[2],
                "mData": function(source) { 
                    return source.available;
                },
              },
            ]
          },
          text : {
            // create_resource : gloable_new,
            resource_found : 'record_found',
            resource_search : record_search,
            resource_plural : record_plural,
          },
          // menu_click_create : function(e) {
        	  // require(['app'], function(app) { 
        	      // var report = app.data.cloudmanagement_capacityreport;
        	      // report.url = 'ea.cloudmanagement.CapacityReportAction$query.json?start=2013-11-11';
                // report.fetch(); 
            // });
          // },            

      }); //end of eucatable
        
      var $searchArea = $report.find('.table_cloudmanagement_capacityreport_top');
      var $from = $('<input type="text" id="from" style="width:65px;height:15px">');
      $from.datepicker({
        changeMonth: true,
        changeYear: true,
        onClose: function( selectedDate ) {
            $searchArea.find( "#to" ).datepicker( "option", "minDate", selectedDate );
            if ($from.val() != '' && $to.val() != '') {
                $searchArea.find('#seachRange').attr('disabled', false);
             } else {
                $searchArea.find('#seachRange').attr('disabled', 'disabled');
             }
        }
      });
      
      var $to = $('<input type="text" id="to" style="width:65px;height:15px">');
      $to.datepicker({
         changeMonth: true,
         changeYear: true,
         onClose: function( selectedDate ) {
             $searchArea.find( "#from" ).datepicker( "option", "maxDate", selectedDate );
             if ($from.val() != '' && $to.val() != '') {
                $searchArea.find('#seachRange').attr('disabled', false);
             } else {
                $searchArea.find('#seachRange').attr('disabled', 'disabled');
             }
         }
      });      
      
      $searchArea.append($from);
      $searchArea.append(' -> ');
      $searchArea.append($to);
      $searchArea.append('     ');
      $searchArea.append($('<a href="#" id="seachRange" disabled="disabled" class="button">'+ $.i18n.map.label_report_search +'</a>'));
      
      $searchArea.find('#seachRange').click(function() {
          require(['app'], function(app) { 
              var report = app.data.cloudmanagement_capacityreport;
              report.url = 'ea.cloudmanagement.CapacityReportAction$query.json?from='+ $from.val() +'&to=' + $to.val();
              report.fetch();
              
          });
          thisObj.tableWrapper.innertable('refreshTable');
          });
          
      var $wrapper = $('<div>').addClass('innertable-wrapper');
      $report.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      
    },
      
    _create : function() { 
    },
    
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
