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
  // global variable
  if (! $.eucaData){
	$.eucaData = {};
  }
  var support_url = '';
  var admin_url = '';
  var initData = '';
  var redirected = false;
  $(document).ready(function() {
	  $.when( // this is to synchronize a chain of ajax calls 
		$.ajax({
		    type:"POST",
		    url:"ea.init.InitAction$query.json",
		    dataType:"json",
		    success: function(data, textStatus){ 
		          eucalyptus.i18n({'language':data.language});
		          eucalyptus.help({'language':data.language}); // loads help files
		          support_url = data.support_url;
		          admin_url = data.admin_url;
		    },
		    error: function(data, textStatus){
		    }
		  })).done(function(out){
		        if(redirected)
		            return;

		          // check browser's version
		          var supportedBrowser = false;
		          if (($.browser.msie && parseInt($.browser.version, 10) > 8)
		              || ($.browser.mozilla && parseInt($.browser.version, 10) > 14)) {
		             supportedBrowser = true;
		          } else if ($.browser.webkit) {
		            userAgent = navigator.userAgent.toLowerCase();
		            rwebkit = new RegExp("webkit/([0-9]+)");
		            res = rwebkit.exec(userAgent);
		            if (res && res[1] > 535)
		              supportedBrowser = true;
		          }
		          if (!supportedBrowser)
		            alert($.i18n.map.unsupported_browser);

		          setupAjax(30000);
		                  
	            $.ajax({ type:"POST",
	                url:"ea.login.LoginAction$query.json", 
	              dataType:"json",
	              async:"false",
	              success: function(out, textStatus, jqXHR){
	            	  if(out.logined){
	  	                $.extend($.eucaData, {'g_session':out.global_session, 'u_session':out.user_session});
		                eucalyptus.main($.eucaData);
	            	  }else{
	  		            var $main = $('html body').find('.euca-main-outercontainer .inner-container');
	  		            $main.login({ 'support_url' : support_url, 'admin_url' : admin_url, doLogin : function(evt, args) {
	  		              var tok = args.param.account+':'+args.param.username+':'+args.param.password;
	  		              var hash = toBase64(tok);
	  		              var remember = (args.param.remember!=null)?"yes":"no";
	  		              $.ajax({
	  		                type:"POST",
	  		                url:"ea.login.LoginAction$query.json",
	  		                data:{
	  		                	remember:remember,
	  		                	authorization:hash
	  		                }, 
	  		                beforeSend: function (xhr) { 
	  		                  $main.find('#euca-main-container').append(
	  		                     $('<div>').addClass('spin-wheel').append( 
	  		                      $('<img>').attr('src','images/dots32.gif'))); // spinwheel
	  		                   $main.find('#euca-main-container').show();
	  		                },
	  		                dataType:"json",
	  		                async:"false",
	  		                success: function(out, textStatus, jqXHR) {
	  		                  //setupAjax(out.global_session.ajax_timeout);
	  		                  $.extend($.eucaData, {'g_session':out.global_session, 'u_session':out.user_session});
	  		                  args.onSuccess($.eucaData); // call back to login UI
	  		                  if (args.param.account.substring(args.param.account.length-13) == 'amazonaws.com') {
	  		                    IMG_OPT_PARAMS = '&Owner=self';
	  		                  }
	  		                },
	  		                error: function(jqXHR, textStatus, errorThrown){
	  		                  var $container = $('html body').find(DOM_BINDING['main']);
	  		                  $container.children().detach(); // remove spinwheel
	  		                  args.onError(errorThrown);
	  		                }
	  		             });
	  		           }});
	  		         }
	              },
	              error: function(jqXHR, textStatus, errorThrown){
	                logout();
	              }
	            });		          
		      }); // end of done	
  }); // end of document.ready
})(jQuery,
   window.eucalyptus ? window.eucalyptus : window.eucalyptus = {});
