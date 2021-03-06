package net.owlgroup.ea.login.action;

import java.io.UnsupportedEncodingException;

import javax.annotation.Resource;
import javax.mail.Session;
import javax.security.auth.login.LoginException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.owlgroup.ea.login.bean.LoginData;
import net.owlgroup.ea.login.bean.LoginUser;
import net.owlgroup.ea.login.bean.UserSession;
import net.owlgroup.ea.pub.LoginConstant;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

@Function()
public class LoginAction  implements
LoginConstant{
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;

    @Resource
    private HttpServletRequest req;
    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) throws LoginException {
        LoginData ld = new LoginData();
        
        LoginUser user = null;
        HttpSession session = req.getSession(false);
        if (session != null) {
            Object o = session.getAttribute(LOGIN_USER_SESSION_KEY);
            if (o instanceof LoginUser) {
                user = (LoginUser) o;
                ld.setLogined(true);
            }
        }else{
            ld.setLogined(false);
        }
        String authorization = entity.getAuthorization();
        if (authorization != null) {
            byte[] bytes = null;
            try {
                bytes = Base64.decodeBase64(authorization
                    .getBytes("ISO-8859-1"));
            } catch (UnsupportedEncodingException e) {
            }
            if (bytes != null) {
                try {
                    String s = new String(bytes, "ISO-8859-1");
                    if (s.indexOf(":") > 0) {
                        String[] sa = s.split(":");
                        if (user == null) {
                            user = new LoginUser();
                        }
                        EucaConsoleMessage message = eucaAC.login(sa[0], sa[1], sa[2]);
                        if (message.getStatus()) {
                        	user.setAccount(sa[0]);
                            user.setUsername(sa[1]);
                            user.setPassword(sa[2]);
                            session = req.getSession(true);
                            session.setAttribute(LOGIN_USER_SESSION_KEY,user);
                            UserSession usession = new UserSession();
                            usession.setAccount(sa[0]);
                            usession.setUsername(sa[1]);
                            ld.setUser_session(usession);
                            
                        } else {
                        	throw new LoginException();
                        }
                    }
                } catch (UnsupportedEncodingException e) {
                }
            }
        }
        context.put("json", ld);
    }
}
