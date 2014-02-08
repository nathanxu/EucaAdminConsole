package net.owlgroup.webx.valve;

import static com.alibaba.citrus.turbine.util.TurbineUtil.getTurbineRunData;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Properties;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.owlgroup.ea.pub.LoginConstant;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.citrus.service.configuration.ProductionModeAware;
import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.turbine.TurbineRunDataInternal;
import com.alibaba.citrus.util.StringEscapeUtil;
import com.alibaba.citrus.util.StringUtil;

/**
 * 
 * NtlmLoginValve对IE用户做AD集成认证，认证失败则转向登录页做手工认证。
 * <p>
 * Date: 2012-08-30,18:15:05 +0800
 * 
 * @author Song Sun
 * @version 1.0
 */
public class UserLoginValve extends AbstractValve implements LoginConstant, ProductionModeAware {

    static final Log log = LogFactory.getLog(UserLoginValve.class);

    public void setInitParameters(Properties prop) {
        loginPage = prop.getProperty("loginPage", "/jsp/login.jsp");
        ignorePath = prop.getProperty("ignorePath", null);
    }

    @Resource
    private HttpServletRequest req;

    @Resource
    private HttpServletResponse resp;

    boolean productionMode;

    String loginPage;
    String ignorePath;

    public void invoke(PipelineContext pipelineContext) throws Exception {
        TurbineRunDataInternal tr = (TurbineRunDataInternal) getTurbineRunData(req);
        if (ignorePath == null || !String.valueOf(tr.getTarget()).startsWith(ignorePath)) {

            String user = null;
            HttpSession session = req.getSession();
            Object o = session.getAttribute(LOGIN_USER_SESSION_KEY);
            if (o instanceof String) {
                user = (String) o;
            }
            String msg = req.getHeader("Authorization");
            if (user == null) {
                System.out.println(req.getRequestURI() + " - " + req.getSession().getId() + " - " + msg);
                String u = req.getParameter("username");
                try {
                    String pw = req.getParameter("password");
                    if (u != null || pw != null) {
                        u = uncrypt(StringEscapeUtil.unescapeURL(user), "1q2w");
                        pw = uncrypt(StringEscapeUtil.unescapeURL(pw), "1q2w");
                        user = authenticate(u, pw);
                    }
                    req.setAttribute("username", user);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
                if (user == null) {
                    sendToLoginPage(null);
                } else {
                    log.debug("userId -> " + user);
                    session = req.getSession(true);
                    session.setAttribute(LOGIN_USER_SESSION_KEY, user);
                    req.setAttribute(LOGIN_USER_SESSION_KEY, user);
                }
            }
        }

        pipelineContext.invokeNext();
    }

    /*-
    function crypt(s, t) {
    var k = 0x39;
    for (i = 0; i < t.length; i++) {
    k ^= t.charCodeAt(i);
    }
    var r = "";
    for (i = 0; i < s.length; i++) {
    r = r.concat(String.fromCharCode(k ^ s.charCodeAt(i)));
    }
    return r;
    }
     */
    String uncrypt(String s, String t) {
        // ## change here when login.jsp changed
        char k = 0x39;
        for (int i = 0; i < t.length(); i++) {
            k ^= t.charAt(i);
        }
        StringBuffer r = new StringBuffer();
        for (int i = 0; i < s.length(); i++) {
            r.append((char) (k ^ s.charAt(i)));
        }
        return r.toString();
    }

    String authenticate(String u, String p) {
        // TODO do real auth here
        if ("admin".equals(u) && "admin".equals(p)) {
            return u;
        }
        return null;
    }

    void sendToLoginPage(String errorId) {
        TurbineRunDataInternal tr = (TurbineRunDataInternal) getTurbineRunData(req);
        tr.setTarget(loginPage);
        String sp = req.getServletPath();
        if (sp != null && sp.length() > 1 && "1".equals(req.getParameter("bp.jump"))) {
            System.out.println(req.getServletPath() + "?" + req.getQueryString());
            System.out.println(req.getServletPath());
            req.setAttribute("bp.jump", req.getServletPath() + "?" + req.getQueryString());
        }
        tr.setAction(null); // ## bug: 已转至登陆页，无须执行既定action
        if (errorId != null)
            req.setAttribute("errorId", errorId);
        String userId = req.getParameter("username");
        if (userId == null && !productionMode) {
            userId = "superadmin";
            req.setAttribute("username", userId);
        }
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    public void setProductionMode(boolean productionMode) {
        this.productionMode = productionMode;
    }

    public static void main(String... args) {
        System.out.println(StringUtil.bytesToString(DigestUtils.md5("superadmin123456")));
    }
}
