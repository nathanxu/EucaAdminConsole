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
  $.widget('eucalyptus.configurecloud_dnsservice', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#dnsserviceTmpl').clone();    
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 

      var $wrapper = $('<div>').addClass('cloudproperties-wrapper');
      $configurecloud.appendTo($wrapper);
      
      var $xmlconfigs = $.eucalyptus.xmlconfig()._loadFromConfig('../../jsconfig/dnsservice.xml');
      $xmlconfigs.appendTo($wrapper.find('.inner-table'));
      var $savebtnDiv =  $('<div>');
      $savebtnDiv.addClass('euca-innertable-save');
      $savebtnDiv.append($('<a>').attr('id','innertable-dns-save').addClass('button').attr('href','#').text($.i18n.map.gloable_save));
	  $savebtnDiv.appendTo($wrapper.find('.inner-table'));
	  $savebtnDiv.click(function(e) {
	      var json = '[';
          var v1 = document.getElementById('system.dns.dnsdomain').value;
          json += ('{\"key\":\"system.dns.dnsdomain\"' 
          + ',\"value\":' + '\"' + v1 + '\"},');
          var v2 = document.getElementById('use_dns_delegation').checked;
          json += ('{\"key\":\"bootstrap.webservices.use_dns_delegation\"' 
          + ',\"value\":' + '\"' + v2 + '\"},');
          var v3 = document.getElementById('use_instance_dns').checked;
          json += ('{\"key\":\"bootstrap.webservices.use_instance_dns\"' 
          + ',\"value\":' + '\"' + v3 + '\"},');
          var v4 = document.getElementById('cloud.vmstate.instance_subdomain').value;
          json += ('{\"key\":\"cloud.vmstate.instance_subdomain\"' 
          + ',\"value\":' + '\"' + v4 + '\"}');
          json += ']';
          thisObj._addAction(json);
	  });
      $wrapper.appendTo(this.element);

      
	  
      var dnsData = describe('configurecloud_dnsservice');
      for(var i=0;i<dnsData.length;i++){
      	var nameId = dnsData[i].name;
      	if(nameId == 'bootstrap.webservices.use_instance_dns'){
      		nameId = 'use_instance_dns';
      	}
      	if(nameId == 'bootstrap.webservices.use_dns_delegation'){
      		nameId = 'use_dns_delegation';
      	}
      	var $currtar = $(document.getElementById(nameId));
      	if($currtar.attr('type')=='checkbox'){
      		$currtar.attr('checked',eval(dnsData[i].value));
      	}else{
      		$currtar.val(dnsData[i].value);
      	}
      }
      this.element.find('#use_dns_delegation ,#use_instance_dns').iToggle();
    },

    _create : function() { 
    },

    _addAction : function(json) {
          $.ajax({
            type:"POST",
            url:"ea.configurecloud.DnsserviceAction$save.json",
            data:{json: json},
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
                app.data.configurecloud_dnsservice.fetch(); 
              });
              thisObj.tableWrapper.innertable('refreshTable');
            },
            error:
            function(jqXHR, textStatus, errorThrown){
              notifyError($.i18n.map.error_msg_save, getErrorMessage(jqXHR));
            }
         });    
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
