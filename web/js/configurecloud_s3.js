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
  $.widget('eucalyptus.configurecloud_s3', $.eucalyptus.eucawidget, {
    options : { },
    baseTable : null,
    tableWrapper : null,
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#s3Tmpl').clone();
      var $wrapper = $($tmpl.render($.i18n.map));
      var $configurecloud = $wrapper.children().first();
      var $help = $wrapper.children().last(); 
      var $wrapper = $('<div>').addClass('cloudproperties-wrapper');
      $configurecloud.appendTo($wrapper);
      
      var $xmlconfigs = $.eucalyptus.xmlconfig()._loadFromConfig('../../jsconfig/s3.xml');
      $xmlconfigs.appendTo($wrapper.find('.inner-table'));
      
      var $savebtnDiv =  $('<div>');
      $savebtnDiv.addClass('euca-innertable-save');
      $savebtnDiv.append($('<a>').attr('id','innertable-s3-save').addClass('button').attr('href','#').text($.i18n.map.gloable_save));
	  $savebtnDiv.appendTo($wrapper.find('.inner-table'));
	  $savebtnDiv.click(function(e){
	      var json = '[';
	      var storagemaxbucketsizeinmb = document.getElementById('walrus.storagemaxbucketsizeinmb').value;
	      json += ('{\"key\":\"walrus.storagemaxbucketsizeinmb\"' 
          + ',\"value\":' + '\"' + storagemaxbucketsizeinmb + '\"},');
	      var storagemaxcachesizeinmb = document.getElementById('walrus.storagemaxcachesizeinmb').value;
	      json += ('{\"key\":\"walrus.storagemaxcachesizeinmb\"' 
          + ',\"value\":' + '\"' + storagemaxcachesizeinmb + '\"},');
	      var storagemaxbucketperaccount = document.getElementById('walrus.storagemaxbucketsperaccount').value;
	      json += ('{\"key\":\"walrus.storagemaxbucketsperaccount\"' 
          + ',\"value\":' + '\"' + storagemaxbucketperaccount + '\"},');
	      var storagemaxtotalcapacity = document.getElementById('walrus.storagemaxtotalcapacity').value;
	      json += ('{\"key\":\"walrus.storagemaxtotalcapacity\"' 
          + ',\"value\":' + '\"' + storagemaxtotalcapacity + '\"},');
	      var storagemaxtotalsnapshotsizeingb = document.getElementById('walrus.storagemaxtotalsnapshotsizeingb').value;
	      json += ('{\"key\":\"walrus.storagemaxtotalsnapshotsizeingb\"' 
          + ',\"value\":' + '\"' + storagemaxtotalsnapshotsizeingb + '\"}');
	      json += ']';
	      thisObj._addAction(json);
	  });
	  
      $wrapper.appendTo(this.element);
      
      var s3Data = describe('configurecloud_s3');
      for(var i=0;i<s3Data.length;i++){
      	var nameId = s3Data[i].name;
      	$(document.getElementById(nameId)).val(s3Data[i].value);
      }
    },

    _create : function() { 
    },
    
    _addAction : function(json) {
          $.ajax({
            type:"POST",
            url:"ea.configurecloud.S3Action$save.json",
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
                app.data.configurecloud_s3.fetch(); 
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
