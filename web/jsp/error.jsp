<%@ page contentType="text/html; charset=ISO-8859-1"
	pageEncoding="UTF-8" isErrorPage="true"%>
<%@ page import="java.io.*"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Error</title>
<style>
	body{font-size:12px;}
	a{text-decoration:none;color:#55aaff;}	
</style>
<script>
	function detail(oa){
		var doc= document.getElementById("diverror");
		if(doc.style.display=="none"){
			doc.style.display='block';
			oa.innerText="收起>>";
		}else{
			doc.style.display='none';
			oa.innerText="详细>>";
		}
	}
</script>
</head>
<body>
	<div>
	<div>
		<h3>对不起，系统出错了！</h3>
	</div>
	您所访问的页面不存在或遇到错误，请与系统的管理员联系！<a href="#" onclick="detail(this);return false;">详细>></a></div>
	<div id="diverror" style="display:none;">
	<pre>
<%
    PrintWriter pw = new PrintWriter(out);
    Throwable t = com.alibaba.citrus.webx.util.ErrorHandlerHelper.getInstance(request).getException();
    t.printStackTrace(pw);
%>
</pre>
</div>
</body>
</html>