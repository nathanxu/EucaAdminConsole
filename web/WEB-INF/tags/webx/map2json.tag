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
        <w:map2json name="BP_SYS_PARAM.PARAM_TYPE"/>
        
        =>>
        
		[
			{key:1,value:'布尔型'},
			{key:2,value:'整数'},
			{key:3,value:'浮点数'},
			{key:4,value:'字符串'},
			{key:5,value:'日期'}
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
        Map map = (Map) TagUtil.getBean(request, name);
        out.print("[");
        if (map != null) {
            boolean first = true;
            for (Object key : map.keySet()) {
                if (!first) {
                    out.print(",");
                }
                String value = TagUtil.escapeJson(map.get(key));
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
