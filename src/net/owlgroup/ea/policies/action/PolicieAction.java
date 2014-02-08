package net.owlgroup.ea.policies.action;

import java.util.ArrayList;
import java.util.List;

import net.owlgroup.ea.policies.bean.PolicieBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;

public class PolicieAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQueryPolicies(Context context) {
        List<PolicieBean> policies = new ArrayList<>();
        context.put("json", policies);
    }
}
