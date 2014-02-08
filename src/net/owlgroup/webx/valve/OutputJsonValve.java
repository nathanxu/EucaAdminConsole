package net.owlgroup.webx.valve;

import static com.alibaba.citrus.turbine.util.TurbineUtil.getTurbineRunData;

import java.io.IOException;
import java.io.Writer;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.configuration.ProductionModeAware;
import com.alibaba.citrus.service.pipeline.PipelineContext;
import com.alibaba.citrus.service.pipeline.support.AbstractValve;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.TurbineRunData;
import com.alibaba.citrus.turbine.TurbineRunDataInternal;
import com.alibaba.citrus.util.StringUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

public class OutputJsonValve extends AbstractValve implements
    ProductionModeAware {
    Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private HttpServletRequest request;

    private boolean productionMode;

    /**
     * 设置content type。
     */
    protected void setContentType(TurbineRunData rundata) {
        // 设置content type，不需要设置charset，因为SetLocaleRequestContext已经设置了charset。
        // 避免覆盖别人设置的contentType。
        if (StringUtil.isEmpty(rundata.getResponse().getContentType())) {
            rundata.getResponse().setContentType("text/html;charset=UTF-8");
        }
    }

    public void invoke(PipelineContext pipelineContext) throws Exception {
        TurbineRunData rundata = getTurbineRunData(request);
        Context ctx = ((TurbineRunDataInternal) rundata).getContext();

        // 检查重定向标志，如果是重定向，则不需要将页面输出。
        if (!rundata.isRedirected()) {
            setContentType(rundata);
            Object obj = ctx.get("json");
            if (obj != null) {
                if (productionMode && !logger.isDebugEnabled()) {
                    writeJsonText(rundata, obj);
                } else {
                    outputJsonText(rundata, obj);
                }
            }
            rundata.getResponse().getWriter().close();
        }

        pipelineContext.invokeNext();
    }

    private void writeJsonText(TurbineRunData rundata, Object obj) throws IOException {
        Writer w = rundata.getResponse().getWriter();
        JSON.writeJSONString(w, obj,
            // SerializerFeature.PrettyFormat,
            SerializerFeature.BrowserCompatible,
            SerializerFeature.DisableCircularReferenceDetect,
            SerializerFeature.QuoteFieldNames,
            SerializerFeature.UseDateTimeFormat,
            SerializerFeature.WriteTabAsSpecial,
            SerializerFeature.WriteMapNullValue);
    }

    protected void outputJsonText(TurbineRunData rundata, Object obj) throws IOException {
        String s = JSON.toJSONString(
            obj,
            // SerializerFeature.PrettyFormat,
            SerializerFeature.BrowserCompatible,
            SerializerFeature.DisableCircularReferenceDetect,
            SerializerFeature.QuoteFieldNames,
            SerializerFeature.UseDateTimeFormat,
            SerializerFeature.WriteTabAsSpecial,
            SerializerFeature.WriteMapNullValue);
        String str = s;
        if (str.length() > 1024) {
            str = str.substring(0, 500)
                + "... | too long to print! length = " + str.length();
        }
        if (productionMode) {
            logger.debug(str);
        } else {
            logger.info(str);
        }
        rundata.getResponse().getWriter().write(s);
        // om.writeValue(rundata.getResponse().getWriter(), obj);
        /*-
        
        Writer w = productionMode ? rundata.getResponse().getWriter() : new StringWriter();
        JSON.writeJSONString(w, obj,
            // SerializerFeature.PrettyFormat,
            SerializerFeature.QuoteFieldNames,
            SerializerFeature.UseDateTimeFormat,
            SerializerFeature.WriteTabAsSpecial,
            SerializerFeature.WriteMapNullValue);
        if (!productionMode) {
            String str = ((StringWriter) w).toString();
            rundata.getResponse().getWriter().write(str);
            if (str.length() > 1024) {
                str = str.substring(0, 500)
                    + "... | too long to print! length = " + str.length();
            }
            logger.debug(str);
        }
         */
    }

    public void setProductionMode(boolean productionMode) {
        this.productionMode = productionMode;
    }
}
