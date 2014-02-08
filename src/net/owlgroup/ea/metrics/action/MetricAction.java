package net.owlgroup.ea.metrics.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.metrics.bean.ListMetricBean;
import net.owlgroup.ea.metrics.bean.ListMetricsBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class MetricAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryMetrics(Context context) {
        ListMetricsBean listMetricsBean = new ListMetricsBean();
        List<ListMetricBean> listMetrics = new ArrayList<>();
        listMetricsBean.setResults(listMetrics);
        context.put("json", listMetricsBean);
    }
}
