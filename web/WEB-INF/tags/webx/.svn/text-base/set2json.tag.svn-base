<%@tag trimDirectiveWhitespaces="true" %>
<%@tag body-content="empty" language="java" pageEncoding="UTF-8"%>
<%@tag import="java.util.*"%>
<%@tag import="org.apache.commons.logging.*"%>
<%@tag import="net.owlgroup.webx.tag.TagUtil"%>
<%@attribute name="name" required="true"%>
<%@attribute name="valueField" required="false"%>
<%@attribute name="textField" required="false"%>
<%!static final Log log = LogFactory.getLog(TagUtil.class);%>
<%--
        <w:set2json name="bpJobs"/>
        
        =>>
        
		[
			{key:key1,value:'key1'},
			{key:key2,value:'key2'}
		]
 --%>
<%
    try {
        if (valueField == null) {
            valueField = "key";
        }
        if (textField == null) {
            textField = "value";
        }
        Object obj = TagUtil.getBean(request, name);
        Collection c = null;
        if (obj instanceof Collection) {
            c = (Collection) obj;
        } else if (obj instanceof Map) {
            c = ((Map) obj).keySet();
        }
        out.print("[");
        if (c != null) {
            boolean first = true;
            for (Object key : c) {
                if (!first) {
                    out.print(",");
                }
                String value = TagUtil.escapeJson(key);
                key = TagUtil.escapeJson(key);
                out.print("{" + valueField + ":'" + key + "',"
                    + textField + ":'" + value + "'}");
                first = false;
            }
        }
        out.print("]");
    } catch (Exception e) {
        log.warn(e.getMessage(), e);
        out.print("[{key:0,value:'" + name + "未定义?'},]");
    }
%>
