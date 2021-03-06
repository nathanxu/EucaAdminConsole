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
  $.widget('eucalyptus.infrastructure_topology', $.eucalyptus.eucawidget, {
    options : { },
    cloudDetailDialog : null,
    clusterDetailDialog : null,
    nodeDetailDialog : null,
    _init : function() {
      thisObj = this;
      var $tmpl = $('html body div.templates').find('#infrastructureTopologyTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $wrapper = $('<div>').addClass('infrastructure-wrapper');
      var clc = describe('infrastructure_clc');
      var walrus = describe('infrastructure_walrus');
      // var nodes = describe('infrastructure_node');
      $.each(clc, function(i, val) {
    	  $infrastructure.find('#cloud_item tr').append($('<td><a href="#" class="element-clc"><span class="topology-item-element">'
    	  + val.name +'</span><br /><span class="topology-item-element">'+ val.hostName 
    	  +'</span></a></td>').attr('title',$.i18n.map.title_clc).poshytip({
                            className: 'tip-darkgray'
                        }));
      });
      // var $moreClc = $('<a style="color:orange">').text('More').attr('href','#');
      // $infrastructure.find('#cloud_item tr').append($moreClc);
      // $moreClc.click(function(){
          // var $newTarget = $('html body').find('#infrastructure-content').find('#rightcontent');          
          // $newTarget.children().detach();
          // $newTarget.infrastructure_controllers();
      // });
      $.each(walrus, function(i, val) {
          $infrastructure.find('#cloud_item tr').append($('<td><a href="#" class="element-walrus"><span class="topology-item-element">'
          + val.name +'</span><br /><span class="topology-item-element">'+ val.hostName 
          + '</span></a></td>').attr('title',$.i18n.map.title_walrus).poshytip({
                            className: 'tip-darkgray'
                        }));
      });
      
      var partitions = thisObj._getAllPartition();
      $.each(partitions, function(i, val) {
          var $td = $('<td>');
          $titleTr = $('<tr>').append($('<td style="font-weight:bold">').attr('colspan',2).text("Cluster: "+val));
          $td.append($titleTr);
          $td.append($('<tr>').append($('<td>').attr('colspan',2).append('<hr style="border: 1px solid #ccc" />')));
          var ccs = describeAllByPartition('infrastructure_cc', val);
          var scs = describeAllByPartition('infrastructure_sc', val);
          var nodes = describeAllByPartition('infrastructure_node', val);
          
          var $cc= $('<td>').attr('title',$.i18n.map.title_cc).poshytip({
                            className: 'tip-darkgray'
                        });
          $.each(ccs, function(idx, val) {
              //var $ccTr = $('<tr>').append($('<td>').append($('<a>').attr('href','#').addClass('element-cc').text(val.name)));
              var $ccTr = $('<td><a href="#" class="element-cc"><span class="topology-item-element">'
                      + val.name +'</span><br /><span class="topology-item-element">'+ val.hostName 
                      + '</span></a></td>').poshytip({className: 'tip-darkgray'})
        	  $cc.append($ccTr);
          });
          var $sc = $('<td>').attr('title',$.i18n.map.title_sc).poshytip({
                            className: 'tip-darkgray'
                        });
          $.each(scs, function(idx, val) {
              //var $scTr = $('<tr>').append($('<td>').append($('<a>').attr('href','#').addClass('element-sc').text(val.name)));
              var $scTr = $('<td><a href="#" class="element-sc"><span class="topology-item-element">'
                      + val.name +'</span><br /><span class="topology-item-element">'+ val.hostName 
                      + '</span></a></td>').poshytip({className: 'tip-darkgray'})
              $sc.append($scTr);
          });          
          var $clusterTr = $('<tr>').css({'height':'48px'});
          $clusterTr.append($cc).append($sc);
          $td.append($clusterTr);
          $td.append($('<tr>').append($('<td>').attr('colspan',2).append('<hr style="border: 1px solid #ccc" />')));
          
          $.each(nodes, function(idx, val) {
              var $node = $('<td><a href="#" class="element-node">' + "Node:" +
                        val.hostName +'</a></td>').attr('colspan',2).attr('title',$.i18n.map.title_node).poshytip({
                            className: 'tip-darkgray'
                        });
              $td.append($('<tr>').append($node));
          });
    	  $infrastructure.find('#cluster_item table').append($td);
      });
      
      $infrastructure.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      $infrastructure.find('#cloud_item .element-clc').click(function(e){
    	  var name = $(this).children().first().html();
    	  var cloudcomponent = describe('infrastructure_clc', name);
    	  thisObj.cloudDetailDialog.find('#name').html(cloudcomponent.name);
    	  thisObj.cloudDetailDialog.find('#hostname').html(cloudcomponent.hostName);
    	  thisObj.cloudDetailDialog.find('#fullname').html(cloudcomponent.fullName);
    	  thisObj.cloudDetailDialog.find('#type').html(cloudcomponent.type);
    	  thisObj.cloudDetailDialog.find('#detail').html(cloudcomponent.detail);
    	  thisObj.cloudDetailDialog.find('#status').html((cloudcomponent.state =='enable' || cloudcomponent.state == 'ENABLED') ? '<font color="green">'+ $.i18n.map.status_enable +'</font>':'<font color="red">'+ $.i18n.map.status_disable +'</font>');
    	  thisObj.cloudDetailDialog.eucadialog('open');
      });
      $infrastructure.find('#cloud_item .element-walrus').click(function(e){
          var name = $(this).children().first().html();
          var cloudcomponent = describe('infrastructure_walrus', name);
          thisObj.cloudDetailDialog.find('#name').html(cloudcomponent.name);
          thisObj.cloudDetailDialog.find('#hostname').html(cloudcomponent.hostName);
          thisObj.cloudDetailDialog.find('#fullname').html(cloudcomponent.fullName);
          thisObj.cloudDetailDialog.find('#type').html(cloudcomponent.type);
          thisObj.cloudDetailDialog.find('#detail').html(cloudcomponent.detail);
          thisObj.cloudDetailDialog.find('#status').html( (cloudcomponent.state =='enable' || cloudcomponent.state == 'ENABLED')   ? '<font color="green">'+ $.i18n.map.status_enable +'</font>':'<font color="red">'+ $.i18n.map.status_disable +'</font>');
          thisObj.cloudDetailDialog.eucadialog('open');
      });      
      $infrastructure.find('#cluster_item .element-cc').click(function(e){
          var name =$(this).children().first().html();
          var cloudcomponent = describe('infrastructure_cc', name);
          thisObj.clusterDetailDialog.find('#name').html(cloudcomponent.name);
          thisObj.clusterDetailDialog.find('#hostname').html(cloudcomponent.hostName);
          thisObj.clusterDetailDialog.find('#fullname').html(cloudcomponent.fullName);
          thisObj.clusterDetailDialog.find('#type').html(cloudcomponent.type);
          thisObj.clusterDetailDialog.find('#partition').html(cloudcomponent.partition);
          thisObj.clusterDetailDialog.find('#detail').html(cloudcomponent.detail);
          thisObj.clusterDetailDialog.find('#status').html((cloudcomponent.state =='enable' || cloudcomponent.state == 'ENABLED') ? '<font color="green">'+ $.i18n.map.status_enable +'</font>':'<font color="red">'+ $.i18n.map.status_disable +'</font>');
          thisObj.clusterDetailDialog.eucadialog('open');
      });
      $infrastructure.find('#cluster_item .element-sc').click(function(e){
          var name = $(this).children().first().html();
          var cloudcomponent = describe('infrastructure_sc', name);
          thisObj.clusterDetailDialog.find('#name').html(cloudcomponent.name);
          thisObj.clusterDetailDialog.find('#hostname').html(cloudcomponent.hostName);
          thisObj.clusterDetailDialog.find('#fullname').html(cloudcomponent.fullName);
          thisObj.clusterDetailDialog.find('#type').html(cloudcomponent.type);
          thisObj.clusterDetailDialog.find('#partition').html(cloudcomponent.partition);
          thisObj.clusterDetailDialog.find('#detail').html(cloudcomponent.detail);
          thisObj.clusterDetailDialog.find('#status').html((cloudcomponent.state =='enable' || cloudcomponent.state == 'ENABLED') ? '<font color="green">'+ $.i18n.map.status_enable +'</font>':'<font color="red">'+ $.i18n.map.status_disable +'</font>');
          thisObj.clusterDetailDialog.eucadialog('open');
      });
      $infrastructure.find('#cluster_item .element-node').click(function(e){
          var id = $(this).html();
          var cloudcomponent = describeById('infrastructure_node', id.substr(5));
          thisObj.nodeDetailDialog.find('#hostname').html(cloudcomponent.hostName);
          thisObj.nodeDetailDialog.find('#fullname').html(cloudcomponent.fullName);
          thisObj.nodeDetailDialog.find('#type').html(cloudcomponent.type);
          thisObj.nodeDetailDialog.find('#partition').html(cloudcomponent.partition);
          thisObj.nodeDetailDialog.find('#detail').html(cloudcomponent.detail);
          thisObj.nodeDetailDialog.find('#status').html((cloudcomponent.state =='enable' || cloudcomponent.state == 'ENABLED') ? '<font color="green">'+ $.i18n.map.status_enable +'</font>':'<font color="red">'+ $.i18n.map.status_disable +'</font>');
          thisObj.nodeDetailDialog.eucadialog('open');
      });
    },

    _create : function() { 
        var $tmpl = $('html body div.templates').find('#cloudDetailDlgTmpl').clone();       
        var $rendered = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
        var $cloud_detail_dialog = $rendered.children().first();
        var $cloud_detail_help = $rendered.children().last();
        this.cloudDetailDialog = $cloud_detail_dialog.eucadialog({
            id: 'cloud-detail',
            title: title_cloud,
            width: 400,
            buttons: {
              'cancel': {text: dialog_cancel_btn, focus:true, click: function() { $cloud_detail_dialog.eucadialog("close");}} 
            },
            help: { content: $cloud_detail_help, url: help_keypair.dialog_delete_content_url },
          });
        
        $tmpl = $('html body div.templates').find('#clusterDetailDlgTmpl').clone();       
        $rendered = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
        var $cluster_detail_dialog = $rendered.children().first();
        var $cluster_detail_help = $rendered.children().last();
        this.clusterDetailDialog = $cluster_detail_dialog.eucadialog({
            id: 'cluster-detail',
            title: title_cluster,
            width: 400,
            buttons: {
              'cancel': {text: dialog_cancel_btn, focus:true, click: function() { $cluster_detail_dialog.eucadialog("close");}} 
            },
            help: { content: $cluster_detail_help, url: help_keypair.dialog_delete_content_url },
          });
        
        $tmpl = $('html body div.templates').find('#nodeDetailDlgTmpl').clone();       
        $rendered = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
        var $node_detail_dialog = $rendered.children().first();
        var $node_detail_help = $rendered.children().last();
        this.nodeDetailDialog = $node_detail_dialog.eucadialog({
            id: 'node-detail',
            title: title_node,
            width: 400,
            buttons: {
              'cancel': {text: dialog_cancel_btn, focus:true, click: function() { $node_detail_dialog.eucadialog("close");}} 
            },
            help: { content: $node_detail_help, url: help_keypair.dialog_delete_content_url },
          });
    },
    
    _getAllPartition : function() {
       var cc = describe('infrastructure_cc');
       var sc = describe('infrastructure_sc');
       var partitions = [];
       $.each(cc, function(idx, val) {
           partitions.push(val.partition);
       });
       $.each(sc, function(idx, val) {
           partitions.push(val.partition);
       });
       
        var newArray=[];
        var provisionalTable = {};
        for (var i = 0, item; (item= partitions[i]) != null; i++) {
            if (!provisionalTable[item]) {
                newArray.push(item);
                provisionalTable[item] = true;
            }
        }
       
       return newArray;
    },
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
