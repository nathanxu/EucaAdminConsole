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
  $.widget('eucalyptus.dashboard', $.eucalyptus.eucawidget, {
    options : { },
    _init : function() {
      var $tmpl = $('html body div.templates').find('#dashboardowlTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $dashboard = $wrapper.children().first();
      var $help = $wrapper.children().last();
      
      this._setClickBinding($dashboard.find('#dashboard-content'));
      this._setData($dashboard.find('#dashboard-content'));
      var $wrapper = $('<div>').addClass('dashboard-wrapper');
      $dashboard.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      this._addHelp($help);
    },

    _setData : function($dashboard) { 
        $.ajax({
            type:"POST",
            url:"ea.dashboard.DashBoardAction$query.json",
            dataType:"json",
            async:false,
            success:
            function(data, textStatus, jqXHR){
                var accounts = $.i18n.map.account_subtitle;
                $dashboard.find('#dash_account_button').append(accounts + '('+ data.accounts +')');
                var groups = $.i18n.map.dash_access_group;
                $dashboard.find('#dash_users_button').append(groups + '('+ data.groups +')');
                var users = $.i18n.map.dash_access_user;
                $dashboard.find('#dash_user_button').append(users + '('+ data.users +')');
                var disk = $.i18n.map.vmtype_disk;
                $dashboard.find('#dash_disk_button').append(disk + '('+ data.availableDisk +'/'+ data.totalDisk +')');
                var mem = $.i18n.map.vmtype_mem;
                $dashboard.find('#dash_mem_button').append(mem + '('+ data.availableMem +'/'+ data.totalMem +')');
                var cpu = $.i18n.map.vmtype_cpu;
                $dashboard.find('#dash_cpu_button').append(cpu + '('+ data.availableCpu +'/'+ data.totalCpu +')');
                var vm =  $.i18n.map.dash_instance;
                var totalVm = $.i18n.map.dash_instance_total;
                var availableVm = $.i18n.map.dash_instance_available;
                $dashboard.find('#dash_instance_button').append(vm+"(" +totalVm+":" + data.runInstances +"," + availableVm +":" + data.stoppedInstances +")")
                /*
                $dashboard.find('#runningVM').html(data.runInstances);
                $dashboard.find('#stoppedVM').html(data.stoppedInstances);
                $dashboard.find('#penddingVM').html(data.penddingInstances);
                */
                $dashboard.find('#dash_eip_button').append($.i18n.map.dash_eip + '('+$.i18n.map.dash_eip_total +":"+ data.totalIp +','+$.i18n.map.dash_eip_available +":" + data.availableIp +')');
                var ebs = $.i18n.map.dash_ebs;
                var ebsCreated = $.i18n.map.dash_ebs_total;
                var ebsAttached = $.i18n.map.dash_ebs_available;
                $dashboard.find('#dash_ebs_button').append(ebs + "(" + ebsCreated +":" +data.createdVolume + "," + ebsAttached +":" + data.attachedVolume+")");
                /*
                $dashboard.find('#createdVolume').append(data.createdVolume + 'G');
                $dashboard.find('#attachedVolume').append(data.attachedVolume + 'G');
                */
            }
         });        
    },

    _setClickBinding :function(dashboard){
    	var thisObj = this;
    	dashboard.find("#dash_account_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'cloudmanagement'});
    		var newTarget = $('html body').find('#cloudManagement-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'cloudmanagement_account'});
            return false;
    	});
    	dashboard.find("#dash_users_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'cloudmanagement'});
    		var newTarget = $('html body').find('#cloudManagement-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'cloudmanagement_usergroup'});
            return false;
    	});
    	dashboard.find("#dash_user_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'cloudmanagement'});
    		var newTarget = $('html body').find('#cloudManagement-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'cloudmanagement_user'});
            return false;
    	});
    	
    	dashboard.find("#dash_topo_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'infrastructure'});
    		var newTarget = $('html body').find('#infrastructure-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'infrastructure_topology'});
            return false;
    	});
    	dashboard.find("#dash_storage_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'infrastructure'});
    		var newTarget = $('html body').find('#infrastructure-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'infrastructure_storage'});
            return false;
    	});
    	dashboard.find("#dash_network_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'infrastructure'});
    		var newTarget = $('html body').find('#infrastructure-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'infrastructure_network'});
            return false;
    	});
    	
    	dashboard.find("#dash_ebs_button").click(function(e){
    		thisObj._trigger('select', e, {selected:'configurecloud'});
    		var newTarget = $('html body').find('#configurecloud-content');
    		thisObj._trigger('innerselect', e, {container:newTarget.find('#rightcontent'),selected:'configurecloud_ebsservice'});
            return false;
    	});
    },

    _addHelp : function(help){
      var thisObj = this;
      var $header = this.element.find('.box-header');
      $header.find('span').append(
          $('<div>').addClass('help-link').append(
            $('<a>').attr('href','#').text('?').click( function(evt){
              thisObj._flipToHelp(evt, {content:help, url: help_dashboard.landing_content_url} ); 
            })));
      return $header;
    },

    close: function() {
      $('html body').eucadata('removeCallback', 'zone','dashboard-summary');
      $('html body').eucadata('removeCallback', 'summary', 'dashboard-summary');
      this._super('close');
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
