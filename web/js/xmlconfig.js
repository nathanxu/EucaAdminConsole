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
  $.widget('eucalyptus.xmlconfig', $.eucalyptus.eucawidget, {
    options : { },
    _init : function() {
      
    },

    _create : function() { 
    },

    _destroy : function() { },
    
    
    _loadFromConfig : function(xml){
    	if(xml){
	    	var tmp='';
	        var oXmlHttp = new XMLHttpRequest() ; 
	        oXmlHttp.open( "GET", xml, false ) ; 
	        oXmlHttp.send(null) ; 
	        var nodes=oXmlHttp.responseXML.childNodes[0].childNodes;
	        for(var idxs = 0; idxs < nodes.length ; idxs++){
	          if (nodes[idxs].nodeType !=1)	
	        	  continue;
	      	  var node = nodes[idxs].childNodes;
	      	  var $label = $('<label></label>');
	      	  var $input = $('<input>');
	      	  for(var idx = 0; idx < node.length; idx++){
	      		  
	      		  var attr = node[idx];
	      		  if( attr.nodeType != 1)
	      			  continue;
	      		  var key = attr.nodeName;
	      		  var value = attr.textContent;
	      		  if(key =='label'){
	      			  $label.html(value);
	      		  }else{
	      			  if(value!=''){
			      		  if(key =='labelclass'){
			      			  $label.attr('class',value);
			      		  }else{
			      			  eval("$input[0]."+key+"='"+value+"'");
			      			  if(key=='id')
			      				eval("$label[0].for='"+value+"'");
			      		  }
		      		  }
	      		  }
	      	  	}
	      	  var $formrow = $('<div>');
	      	  $('<div class="form-row">').appendTo($formrow);
	      	  $label.appendTo($formrow.find('.form-row'));
	      	  $input.appendTo($formrow.find('.form-row'));
	      	  $formrow.appendTo(tmp);
	      	  tmp += $formrow.html();
	      	}
	        $.templates('configtemplate',tmp);
	        var html = $.render.configtemplate($.i18n.map);
	        return $(html);
    	}
    },
    close: function() {
      this._super('close');
    }
  });
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
