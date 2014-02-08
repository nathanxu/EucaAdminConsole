package net.owlgroup.ea.configurations.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.configurations.bean.LaunchConfigurationBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class LaunchConfigurationAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryLaunchConfigurations(Context context) {
        List<LaunchConfigurationBean> configurations = new ArrayList<>();
        context.put("json", configurations);
    }
}
