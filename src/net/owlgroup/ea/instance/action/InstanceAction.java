package net.owlgroup.ea.instance.action;


import javax.annotation.Resource;

import net.owlgroup.ea.instance.bean.InstanceData;
import net.owlgroup.ea.login.bean.LoginData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class InstanceAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        InstanceData id = new InstanceData();
        context.put("json", id);
    }

}
