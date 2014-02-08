package net.owlgroup.ea.alarms.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.alarms.bean.AlarmBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class AlarmAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryAlarms(Context context) {
        List<AlarmBean> alarms = new ArrayList<>();
        context.put("json", alarms);
    }
}
