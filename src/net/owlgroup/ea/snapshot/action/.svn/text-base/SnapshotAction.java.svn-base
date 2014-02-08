package net.owlgroup.ea.snapshot.action;


import javax.annotation.Resource;

import net.owlgroup.ea.login.bean.LoginData;
import net.owlgroup.ea.snapshot.bean.SnapshotData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class SnapshotAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        SnapshotData sd = new SnapshotData();
        context.put("json", sd);
    }

}
