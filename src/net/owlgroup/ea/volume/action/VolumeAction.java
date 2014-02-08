package net.owlgroup.ea.volume.action;


import javax.annotation.Resource;

import net.owlgroup.ea.login.bean.LoginData;
import net.owlgroup.ea.volume.bean.VolumeData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class VolumeAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        VolumeData vd = new VolumeData();
        context.put("json", vd);
    }

}
