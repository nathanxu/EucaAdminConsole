package net.owlgroup.ea.balancers.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.balancers.bean.BalancerBean;
import net.owlgroup.ea.balancers.bean.BalancersBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class BalancerAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryBalancers(Context context) {
        BalancersBean balancersBean = new BalancersBean();
        List<BalancerBean> balancers = new ArrayList<>();
        balancersBean.setResults(balancers);
        context.put("json", balancersBean);
    }
}
