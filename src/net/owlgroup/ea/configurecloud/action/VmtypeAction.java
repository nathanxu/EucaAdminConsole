package net.owlgroup.ea.configurecloud.action;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

@Function()
public class VmtypeAction {
    
	@Resource
    private EucaAdminConsole eucaAC;
	
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Function("public")
    public void doQuery(Context context) {
    	try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
    		EucaConsoleMessage consoleMessage = eucaAC.getInstanceTypes(null);
    		JSONArray result = (JSONArray)consoleMessage.getData();
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doModify(Context context, @Param(name="name") String name, @Param(name="disk") Integer disk, 
    		@Param(name="memory") Integer memory, @Param(name="cpu") Integer cpu) {
    	JSONObject result = new JSONObject();
    	result.put("state", true);
    	try {
            //EucaAdminConsole console = new EucaAdminConsole();
            //console.setUsemock(true);
    		EucaConsoleMessage message = eucaAC.modifyInstanceTypes(name, cpu, memory, disk);
    		if (!message.getStatus()) {
    			result.put("state", false);
    			result.put("message", message.getErrMessage());
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
