package net.owlgroup.ea.scalings.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.scalings.bean.ScalingGroupBean;
import net.owlgroup.ea.scalings.bean.ScalingGroupsBean;
import net.owlgroup.ea.scalings.bean.ScalingInstanceBean;
import net.owlgroup.ea.scalings.bean.ScalingInstancesBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class ScalingAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryAutoScalingGroups(Context context) {
        ScalingGroupsBean scalingsBean = new ScalingGroupsBean();
        List<ScalingGroupBean> scalings = new ArrayList<>();
        scalingsBean.setResults(scalings);
        context.put("json", scalingsBean);
    }
    
    @Function("public")
    public void doQueryAutoScalingInstances(Context context) {
        ScalingInstancesBean scalingsBean = new ScalingInstancesBean();
        List<ScalingInstanceBean> scalings = new ArrayList<>();
        scalingsBean.setResults(scalings);
        context.put("json", scalingsBean);
    }
}
