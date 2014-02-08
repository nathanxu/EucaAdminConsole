package net.owlgroup.ea.zones.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.zones.bean.ZoneBean;
import net.owlgroup.ea.zones.bean.ZonesBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class ZoneAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryAvailabilityZones(Context context) {
        ZonesBean zonesBean = new ZonesBean();
        List<ZoneBean> list = new ArrayList<ZoneBean>();
        list.add(new ZoneBean());
        zonesBean.setResults(list);
        context.put("json", zonesBean);
    }
}
