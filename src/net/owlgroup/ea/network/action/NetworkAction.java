package net.owlgroup.ea.network.action;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;


public class NetworkAction {
	
	@Resource
    private EucaAdminConsole eucaAC;
	
	Logger logger = LoggerFactory.getLogger(getClass());
    @Function("public")
    public void doQueryMode(Context context) {
        try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
    		EucaConsoleMessage modeMsg = eucaAC.getNetworkMode();
    		JSONArray modeArr = (JSONArray)modeMsg.getData();
    		JSONObject mode = (JSONObject)modeArr.get(0);
            context.put("json", mode);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doQueryProps(Context context, @Param(name="mode") String mode) {
        try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
    		EucaConsoleMessage propslMsg = eucaAC.getNetworkModeProperties(mode);
    		System.out.println(propslMsg.toJson().toString());
    		JSONArray props = (JSONArray)propslMsg.getData();
            context.put("json", props);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doSave(Context context, @Param(name="mode") String mode, 
    		@Param(name="json") String json) {
        JSONObject result = new JSONObject();
    	try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
            JSONArray props = JSONArray.fromObject(json);
    		EucaConsoleMessage message  = eucaAC.modifyNetworkMode(mode);
    		if (!message.getStatus()) {
    			result.put("state", false);
				result.put("message",message.getErrMessage());
    			context.put("json", result);
    			return;
    		}
    		for (Object object : props) {
    			JSONObject prop = (JSONObject)object;
    			EucaConsoleMessage propsStatus = eucaAC.modifyNetwrokModeProperty(
    					mode, prop.getString("key"), prop.getString("value"));
    			if (!propsStatus.getStatus()) {
    				result.put("state", false);
    				result.put("message",propsStatus.getErrMessage());
        			context.put("json", result);
    				return;
    			}
			}
            context.put("json", true);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message",e.getMessage());
			context.put("json", result);
		}
    }
}
