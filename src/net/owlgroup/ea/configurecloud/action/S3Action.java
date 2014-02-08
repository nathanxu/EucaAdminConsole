package net.owlgroup.ea.configurecloud.action;



import javax.annotation.Resource;

import net.owlgroup.ea.login.bean.LoginData;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.service.requestcontext.parser.ParserRequestContext;
import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.dataresolver.Params;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

@Function()
public class S3Action {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;

    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context,
        @Params LoginData entity) {
        EucaConsoleMessage consoleMessage = eucaAC.getS3ServiceProperties();
        JSONArray result = (JSONArray)consoleMessage.getData();
        context.put("json", result);

    }
    
    @Function("public")
    public void doSave(Context context, @Param(name="json") String json) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		JSONArray props = JSONArray.fromObject(json);
    		//boolean result = true;	
    		for (Object object : props) {
    			
				JSONObject prop = (JSONObject)object;
				System.out.println(prop.getString("key"));
				EucaConsoleMessage message = eucaAC.modifyS3ServiceProperty(prop.getString("key"), prop.getString("value"));
				if (!message.getStatus()) {
					logger.error(message.getErrMessage());
					result.put("state", false);
					result.put("message",message.getErrMessage());
					break;
				}
					
			}
    		context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message",e.getMessage());
			context.put("json", result);
		}
    }
    

}
