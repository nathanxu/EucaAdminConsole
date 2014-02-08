package net.owlgroup.ea.tag.action;

import javax.annotation.Resource;

import net.owlgroup.ea.login.bean.LoginData;
import net.owlgroup.ea.tag.bean.TagData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class TagAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        TagData td = new TagData();
        context.put("json", td);
    }

}
