package net.owlgroup.webx.valve;

import static com.alibaba.citrus.turbine.TurbineConstant.ACTION_MODULE;
import static com.alibaba.citrus.turbine.util.TurbineUtil.getTurbineRunData;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import javax.annotation.Resource;

import com.alibaba.citrus.service.moduleloader.Module;
import com.alibaba.citrus.service.moduleloader.ModuleLoaderException;
import com.alibaba.citrus.service.moduleloader.ModuleLoaderService;
import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.PipelineException;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.turbine.TurbineRunDataInternal;
import com.alibaba.citrus.turbine.util.FunctionUtil;
import com.alibaba.citrus.util.StringUtil;

/**
 * 执行action module，通常用来处理用户提交的表单。
 */
public class PerformActionValve extends AbstractValve {
    final Log log = LogFactory.getLog(getClass());

    @Resource
    private HttpServletRequest request;

    @Resource
    private ModuleLoaderService moduleLoaderService;

    public void invoke(PipelineContext pipelineContext) throws Exception {
        TurbineRunDataInternal rundata = (TurbineRunDataInternal) getTurbineRunData(request);
        // 检查重定向标志，如果是重定向，则不需要将页面输出。
        if (!rundata.isRedirected()) {
            String action = rundata.getAction();
            // 如果找到action，则执行之。
            if (!StringUtil.isEmpty(action)) {
                String actionKey = "_action_" + action;

                // 防止重复执行同一个action。
                if (rundata.getRequest().getAttribute(actionKey) == null) {
                    rundata.getRequest().setAttribute(actionKey, "executed");

                    try {
                        Module module = moduleLoaderService.getModule(
                            ACTION_MODULE, action);
                        // ## sunsong
                        FunctionUtil.authorize(moduleLoaderService, module,
                            rundata.getRequest());
                        module.execute();
                    } catch (ModuleLoaderException e) {
                        throw new PipelineException(
                            "Could not load action module: " + action, e);
                    } catch (Exception e) {
                        throw new PipelineException(
                            "Failed to execute action module", e);
                    }
                }
            } else {
                String uri = request.getRequestURI();
                if (uri != null) {
                    int i = uri.lastIndexOf('/') + 1;
                    int j = uri.lastIndexOf('.');
                    if (j > i) {
                        String cmd = uri.substring(i, j);
                        int k = cmd.indexOf('$');
                        action = k < 0 ? cmd : cmd.substring(0, k);
                        String method = k < 0 ? null : cmd.substring(k + 1);
                        if (!StringUtil.isEmpty(action)) {
                            rundata.setAction(action);
                            String actionKey = "_action_" + action;

                            // 防止重复执行同一个action。
                            if (rundata.getRequest().getAttribute(actionKey) == null) {
                                rundata.setActionEvent(method);
                                rundata.getRequest().setAttribute(
                                    "_action_event_submit_do_", method);
                                rundata.getRequest().setAttribute(actionKey,
                                    "executed");

                                try {
                                    Module module = moduleLoaderService
                                        .getModule(ACTION_MODULE, action);
                                    // ## sunsong
                                    FunctionUtil.authorize(moduleLoaderService,
                                        module, rundata.getRequest());
                                    module.execute();
                                } catch (ModuleLoaderException e) {
                                    throw new PipelineException(
                                        "Could not load action module: "
                                            + action, e);
                                } catch (Exception e) {
                                    throw new PipelineException(
                                        "Failed to execute action module", e);
                                }
                            }
                        }
                    }
                }
            }
        }

        pipelineContext.invokeNext();
    }
}
