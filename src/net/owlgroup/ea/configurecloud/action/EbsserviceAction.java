package net.owlgroup.ea.configurecloud.action;


import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

@Function()
public class EbsserviceAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;

    @Resource
    private EucaAdminConsole eucaAC;
    
    @Function("public")
    public void doQuery(Context context) {
    	try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
            JSONArray result = new JSONArray();
    		JSONArray clusters = (JSONArray)eucaAC.describeServices("cluster", null, null, null).getData();
    		for (Object object : clusters) {
    			JSONObject cluster = (JSONObject)object;
    			String partition = cluster.getString("partition");
    			EucaConsoleMessage ebsMsg = eucaAC.getEbsServiceProperties(partition);
    			JSONArray ebsArr = (JSONArray)ebsMsg.getData();
				for (Object obj : ebsArr) {
					JSONObject ebs = (JSONObject) obj;// ebsArr.get(0);
					ebs.put("partition", partition);

					// result.add(ebsArr);
					result.add(ebs);
				}
    			
    		}
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doModify(Context context, @Param(name="partition") String partition, @Param(name="name") String name, 
    		@Param(name="value") String value) {
    	JSONObject result = new JSONObject();
    	result.put("state", true);
    	try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
    		EucaConsoleMessage messg = eucaAC.modifyEbsServiceProperty(partition, name, value);
    		
    		//boolean result = messg.getStatus();
    		if (!messg.getStatus()) {
    			logger.error(messg.getErrMessage());	
    			result.put("state", false);
    			result.put("message", messg.getErrMessage());
    		}
    		context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
    }
}
