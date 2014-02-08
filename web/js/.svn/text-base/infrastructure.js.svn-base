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
  $.widget('eucalyptus.infrastructure', $.eucalyptus.eucawidget, {
    options : { },
    _init : function() {
      var thisObj = this;
      var $tmpl = $('html body div.templates').find('#infrastructureTmpl').clone();       
      var $wrapper = $($tmpl.render($.extend($.i18n.map, help_dashboard)));
      var $infrastructure = $wrapper.children().first();
      var $help = $wrapper.children().last();
      var $wrapper = $('<div>').addClass('infrastructure-wrapper');
      $infrastructure.appendTo($wrapper);
      $wrapper.appendTo(this.element);
      $wrapper.find('#leftmenu a').click(function(evt){
    	  thisObj._trigger('innerselect', evt, {container:thisObj.element.find('#rightcontent'),selected:this.id});
      });
      this._addHelp($help);
    },

    _create : function() { 
    },

    _destroy : function() { },
    

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
      this._super('close');
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
