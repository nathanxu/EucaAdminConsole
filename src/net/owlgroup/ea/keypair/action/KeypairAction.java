package net.owlgroup.ea.keypair.action;


import java.util.ArrayList;

import javax.annotation.Resource;

import net.owlgroup.ea.keypair.bean.KeypairData;
import net.owlgroup.ea.login.bean.LoginData;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;

@Function()
public class KeypairAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;


    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        KeypairData kd = new KeypairData();
        ArrayList<KeypairData> results = new ArrayList<KeypairData>();
        results.add(new KeypairData());
        kd.setResults(results);
        context.put("json", kd);
    }

}
