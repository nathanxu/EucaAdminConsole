package net.owlgroup.ea.cloud.action;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import net.owlgroup.ea.bean.KeyValueBean;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

public class CloudComponentsAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private EucaAdminConsole eucaAC;
    
    @Function("public")
    public void doQueryControllers(Context context) {
    	//String s = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.100\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster01\",\"detail\":\"\"}";
		//JSONObject j1 = JSONObject.fromObject(s);
		
		EucaConsoleMessage consoleMessage = eucaAC.describeServices(
				"eucalyptus", null, null, null);
		JSONArray result = (JSONArray) consoleMessage.getData();
		
		//result.add(j1);
		//result.add(j1);
		//result.add(j1);
		//result.add(j1);
		//result.add(j1);
		//result.add(j1);
		//result.add(j1);
		context.put("json", result);
	}

	@Function("public")
    public void doAddController(Context context, @Param(name="host") String host, 
    		@Param(name="name") String name, @Param(name="hostUser") String hostUser,
    		@Param(name="password") String password) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
	        EucaConsoleMessage message = eucaAC.registerCLC(host, name, hostUser, password);	
	        if(!message.getStatus()) {
	        	result.put("state", false);
	        	result.put("message",message.getErrMessage());
	        }
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
        	result.put("message",e.getMessage());
			context.put("json", result);
		}
    }
    
    @Function("public")
    public void doDeleteController(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.deregisterCLC(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doEnableController(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.enableService(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doDisableController(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.disableService(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doQueryWalruses(Context context) {
		EucaConsoleMessage consoleMessage = eucaAC.describeServices("walrus", null, null, null);
		JSONArray result = (JSONArray)consoleMessage.getData();
        context.put("json", result);
    }
    
    @Function("public")
    public void doAddWalrus(Context context, @Param(name="host") String host, 
    		@Param(name="name") String name, @Param(name="hostUser") String hostUser,
    		@Param(name="password") String password) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
	        EucaConsoleMessage message = eucaAC.registerWalrus(host, name, hostUser, password);	
	        if(!message.getStatus()) {
	        	result.put("state", false);
	        	result.put("message",message.getErrMessage());
	        }
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
        	result.put("message",e.getMessage());
			context.put("json", result);
		}
    }
    
    @Function("public")
    public void doDeleteWalrus(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.deregisterWalrus(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doEnableWalrus(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.enableService(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doDisableWalrus(Context context, @Param(name="items") String items) {
		try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
			JSONArray result = new JSONArray();
			String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.disableService(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
}
