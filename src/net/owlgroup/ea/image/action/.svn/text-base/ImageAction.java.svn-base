package net.owlgroup.ea.image.action;


import java.util.ArrayList;

import javax.annotation.Resource;

import net.owlgroup.ea.image.bean.ImageData;
import net.owlgroup.ea.image.bean.StrugImage;
import net.owlgroup.ea.login.bean.LoginData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class ImageAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        ImageData id = new ImageData();
        ArrayList<StrugImage> results = new ArrayList<StrugImage>();
        results.add(new StrugImage());
        id.setResults(results);
        context.put("json", id);
    }

}
