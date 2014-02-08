package net.owlgroup.webx.valve;

import static com.alibaba.citrus.turbine.util.TurbineUtil.getTurbineRunData;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import net.owlgroup.ea.pub.LoginConstant;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import javax.annotation.Resource;

import com.alibaba.citrus.service.configuration.ProductionModeAware;
import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.service.requestcontext.session.SessionRequestContext;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.util.FunctionUtil;
import com.alibaba.citrus.util.ToStringBuilder;
import com.alibaba.citrus.webx.context.WebxContextLoaderListener;

public class AuditValue extends AbstractValve implements ProductionModeAware {
    final Log log = LogFactory.getLog(getClass());

    @Resource
    private HttpServletRequest request;

    @Resource
    private SessionRequestContext context;

    Map<?, ?> moduleMap;

    public void setModuleMap(Map<?, ?> moduleMap) {
        this.moduleMap = moduleMap;
    }

    boolean productionMode;

    @SuppressWarnings("unchecked")
    public void invoke(PipelineContext pipelineContext) throws Exception {
        try {
            if (!productionMode || WebxContextLoaderListener.IS_TRIAL) {
                ToStringBuilder tsb = new ToStringBuilder(2);
                tsb.append("[");
                tsb.append(request.getRequestURI());
                tsb.append("] locale -> ");
                tsb.append(request.getLocale());
                tsb.append(" From -> ");
                tsb.append(request.getRemoteAddr());
                tsb.append(" Parameters -> ");
                tsb.appendMap(request.getParameterMap());
                log.debug(tsb);
            }
            pipelineContext.invokeNext();
        } finally {
            try {
                Object s = request.getAttribute(FunctionUtil.ParsedParameters);
                if (s instanceof Set<?>) {
                    Set<?> set = (Set<?>) s;
                    Set<?> ps = new LinkedHashSet<Object>(request.getParameterMap().keySet());
                    ps.removeAll(set);
                    if (ps.size() > 0 && log.isDebugEnabled()) {
                        log.debug("Unparsed Parameters -> " + ps);
                    }
                }
            } catch (Exception e) {
                log.warn(e.getMessage(), e);
            }

            boolean enableAudit = !"false".equals(request.getSession().getServletContext()
                .getAttribute("bp.enableAudit"));
            if (productionMode && enableAudit) {
                try {
                    doAudit();
                } catch (Exception e) {
                    log.warn(e.getMessage(), e);
                }
            }
        }
    }

    private void doAudit() {
        TurbineRunData rundata = getTurbineRunData(request);
        String ip = request.getRemoteAddr();
        String url = request.getRequestURL().toString();
        String actionName = rundata.getAction();
        if (request.getAttribute(LoginConstant.LOGIN_USER_SESSION_KEY) != null) {
            actionName = "bp.login";
        }
        if (actionName == null || context.isSessionInvalidated())
            return;

        String moduleName = getModuleName(actionName);
        String user = (String) request.getSession().getAttribute(LoginConstant.LOGIN_USER_SESSION_KEY);
        // 保存日志信息
        AuditLog log = new AuditLog();
        log.setActionName(actionName);
        String funcCode = (String) request.getAttribute("webx.CurrentFunction");
        if (funcCode == null || funcCode.isEmpty()) {
            funcCode = "public";
        }
        log.setFuncCode(funcCode);
        log.setModuleName(moduleName);
        log.setOperationTime(new Date());
        log.setOperationUrl(url);
        log.setRemoteAddr(ip);
        if (null != user) {
            log.setUserId(user);
        }
        this.log.info(log);
    }

    public String getModuleName(String url) {
        while (StringUtils.isNotEmpty(url)) {
            String moduleName = (String) moduleMap.get(url);
            if (moduleName != null)
                return moduleName;
            int subIndex = url.lastIndexOf(".");
            if (subIndex > 0) {
                url = url.substring(0, subIndex);
            } else {
                break;
            }
        }
        return url;
    }

    public void setProductionMode(boolean productionMode) {
        this.productionMode = productionMode;
    }
}
