<%@tag trimDirectiveWhitespaces="true" %>
<%@tag body-content="empty" dynamic-attributes="arg" pageEncoding="UTF-8"%>
<%@tag import="java.util.*"%>
<%@tag import="org.apache.commons.logging.*"%>
<%@tag import="net.owlgroup.webx.tag.TagUtil"%>
<%@tag import="net.owlgroup.webx.i18n.ResourceBundle"%>
<%@attribute name="id" required="true" rtexprvalue="true"%>

<%!static final Log log = LogFactory.getLog(TagUtil.class);%>
<%--
        <w:message id="add.err" arg0=""/>
        
        =>>
        
		特权内容
 --%>
<%
	if (id != null) {
	    Object[] objs = null;
	    try {
	        String s = ResourceBundle.getJspDirBundle(request,
	            (PageContext) getJspContext()).get(id);
	        out.write(s);
	    } catch (Exception e) {
	        log.warn(e.getMessage(), e);
	    }
	}
%>