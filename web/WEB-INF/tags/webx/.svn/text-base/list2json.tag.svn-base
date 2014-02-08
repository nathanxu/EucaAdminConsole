<%@tag trimDirectiveWhitespaces="true"%>
<%@tag body-content="empty" language="java" pageEncoding="UTF-8"%>
<%@tag import="java.util.*"%>
<%@tag import="com.alibaba.fastjson.serializer.SerializerFeature"%>
<%@tag import="com.alibaba.fastjson.JSON"%>
<%@tag import="net.owlgroup.webx.tag.TagUtil"%>
<%@tag import="org.apache.commons.logging.*"%>
<%@tag import="org.ibatis.client.SqlMapClient"%>
<%@attribute name="id" required="true"%>
<%@attribute name="arg1" required="false" rtexprvalue="true"%>
<%@attribute name="arg2" required="false" rtexprvalue="true"%>
<%@attribute name="arg3" required="false" rtexprvalue="true"%>
<%@attribute name="arg4" required="false" rtexprvalue="true"%>
<%!static final Log log = LogFactory.getLog(TagUtil.class);%>
<%--
 data: <w:list2json id="sqlId" arg1="<%=type%>" />
 [{name:'tom', age: 7}]
 --%>
<%
	try {
	    SqlMapClient sqlc = (SqlMapClient) TagUtil.getBean(request, "sqlMapClient");
	
	    Map<String, Object> args = new HashMap<String, Object>();
	    args.put("1", arg1);
	    args.put("2", arg2);
	    args.put("3", arg3);
	    args.put("4", arg4);
	    List<?> list = sqlc.queryForList(id, args);
	    if (list != null && list.size() > 0) {
            String s = JSON.toJSONString(
                list,
                // SerializerFeature.PrettyFormat,
                SerializerFeature.BrowserCompatible,
                SerializerFeature.DisableCircularReferenceDetect,
                SerializerFeature.QuoteFieldNames,
                SerializerFeature.UseDateTimeFormat,
                SerializerFeature.WriteTabAsSpecial,
                SerializerFeature.WriteMapNullValue);
	        out.print(s);
	    } else {
	        out.print("[]");
	    }
	
	} catch (Exception e) {
	    log.warn(e.getMessage(), e);
	    out.print("['" + id + "未定义?']");
	}
%>
