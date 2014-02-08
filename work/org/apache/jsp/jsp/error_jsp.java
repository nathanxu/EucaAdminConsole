package org.apache.jsp.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.io.*;

public final class error_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.AnnotationProcessor _jsp_annotationprocessor;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_annotationprocessor = (org.apache.AnnotationProcessor) getServletConfig().getServletContext().getAttribute(org.apache.AnnotationProcessor.class.getName());
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    Throwable exception = org.apache.jasper.runtime.JspRuntimeLibrary.getThrowable(request);
    if (exception != null) {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=ISO-8859-1");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\">\r\n");
      out.write("<title>Error</title>\r\n");
      out.write("<style>\r\n");
      out.write("\tbody{font-size:12px;}\r\n");
      out.write("\ta{text-decoration:none;color:#55aaff;}\t\r\n");
      out.write("</style>\r\n");
      out.write("<script>\r\n");
      out.write("\tfunction detail(oa){\r\n");
      out.write("\t\tvar doc= document.getElementById(\"diverror\");\r\n");
      out.write("\t\tif(doc.style.display==\"none\"){\r\n");
      out.write("\t\t\tdoc.style.display='block';\r\n");
      out.write("\t\t\toa.innerText=\"收起>>\";\r\n");
      out.write("\t\t}else{\r\n");
      out.write("\t\t\tdoc.style.display='none';\r\n");
      out.write("\t\t\toa.innerText=\"详细>>\";\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("</script>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
      out.write("\t<div>\r\n");
      out.write("\t<div>\r\n");
      out.write("\t\t<h3>对不起，系统出错了！</h3>\r\n");
      out.write("\t</div>\r\n");
      out.write("\t您所访问的页面不存在或遇到错误，请与系统的管理员联系！<a href=\"#\" onclick=\"detail(this);return false;\">详细>></a></div>\r\n");
      out.write("\t<div id=\"diverror\" style=\"display:none;\">\r\n");
      out.write("\t<pre>\r\n");

    PrintWriter pw = new PrintWriter(out);
    Throwable t = com.alibaba.citrus.webx.util.ErrorHandlerHelper.getInstance(request).getException();
    t.printStackTrace(pw);

      out.write("\r\n");
      out.write("</pre>\r\n");
      out.write("</div>\r\n");
      out.write("</body>\r\n");
      out.write("</html>");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else log(t.getMessage(), t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
