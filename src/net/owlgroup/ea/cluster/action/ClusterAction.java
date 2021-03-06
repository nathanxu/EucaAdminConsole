package net.owlgroup.ea.cluster.action;

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

public class ClusterAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());
    
    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQueryClustercontrollers(Context context) {
    	try {
    		String s1 = "{\"name\":\"cc_01\",\"hostName\":\"192.168.1.101\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster01\",\"detail\":\"\"}";
    		String s2 = "{\"name\":\"cc_02\",\"hostName\":\"192.168.1.102\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    		String s3 = "{\"name\":\"cc_03\",\"hostName\":\"192.168.1.103\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    		String s4 = "{\"name\":\"cc_04\",\"hostName\":\"192.168.1.104\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    		String s5 = "{\"name\":\"cc_05\",\"hostName\":\"192.168.1.105\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    		String s6 = "{\"name\":\"cc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster05\",\"detail\":\"\"}";
    		String s7 = "{\"name\":\"cc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster06\",\"detail\":\"\"}";
    		String s8 = "{\"name\":\"cc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster07\",\"detail\":\"\"}";
    		String s9 = "{\"name\":\"cc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster08\",\"detail\":\"\"}";
    		String s10 = "{\"name\":\"cc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster09\",\"detail\":\"\"}";
    		
    		EucaConsoleMessage consoleMessage = eucaAC.describeServices("cluster", null, null, null);
    		JSONArray result = (JSONArray)consoleMessage.getData();
    		/*
    		result.add(JSONObject.fromObject(s1));
    		result.add(JSONObject.fromObject(s2));
    		result.add(JSONObject.fromObject(s3));
    		result.add(JSONObject.fromObject(s4));
    		result.add(JSONObject.fromObject(s5));
    		result.add(JSONObject.fromObject(s6));
    		result.add(JSONObject.fromObject(s7));
    		result.add(JSONObject.fromObject(s8));
    		result.add(JSONObject.fromObject(s9));
    		result.add(JSONObject.fromObject(s10));
    		*/
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doAddClustercontroller(Context context, @Param(name="host") String host, 
    		@Param(name="name") String name, @Param(name="partition") String partition, 
    		@Param(name="hostUser") String hostUser, @Param(name="password") String password) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
            EucaConsoleMessage message = eucaAC.registerCC(host, name, partition, hostUser, password);	
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
    public void doDeleteClustercontroller(Context context, @Param(name="json") String json) {
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray result = new JSONArray();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject item = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.deregisterCC(item.getString("name"), item.getString("partition"));
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",item.getString("name"));
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	/*
	        	if (message.getStatus()) {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	} else {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	} */
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doEnableClustercontroller(Context context, @Param(name="items") String items) {
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
    public void doDisableClustercontroller(Context context, @Param(name="items") String items) {
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
    public void doQueryStoragecontrollers(Context context) {
    	try {
    		String s1 = "{\"name\":\"sc_01\",\"hostName\":\"192.168.1.101\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster01\",\"detail\":\"\"}";
    		String s2 = "{\"name\":\"sc_02\",\"hostName\":\"192.168.1.102\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    		String s3 = "{\"name\":\"sc_03\",\"hostName\":\"192.168.1.103\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    		String s4 = "{\"name\":\"sc_04\",\"hostName\":\"192.168.1.104\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    		String s5 = "{\"name\":\"sc_05\",\"hostName\":\"192.168.1.105\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    		String s6 = "{\"name\":\"sc_06\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster04\",\"detail\":\"\"}";

    		
    		EucaConsoleMessage consoleMessage = eucaAC.describeServices("storage", null, null, null);
    		JSONArray result = (JSONArray)consoleMessage.getData();
    		/*
    		result.add(JSONObject.fromObject(s1));
    		result.add(JSONObject.fromObject(s2));
    		result.add(JSONObject.fromObject(s3));
    		result.add(JSONObject.fromObject(s4));
    		result.add(JSONObject.fromObject(s5));
    		result.add(JSONObject.fromObject(s6)); 
    		*/
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doAddStoragecontroller(Context context,@Param(name="host") String host, 
    		@Param(name="name") String name, @Param(name="partition") String partition, 
    		@Param(name="hostUser") String hostUser, @Param(name="password") String password) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
            EucaConsoleMessage message = eucaAC.registerSC(host, name, partition, hostUser, password);	
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
    public void doDeleteStoragecontroller(Context context, @Param(name="json") String json) {
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray result = new JSONArray();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject item = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.deregisterSC(item.getString("name"), item.getString("partition"));
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",item.getString("name"));
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	/*
	        	if (message.getStatus()) {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	} else {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	}*/
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doEnableStoragecontroller(Context context, @Param(name="items") String items) {
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
    public void doDisableStoragecontroller(Context context, @Param(name="items") String items) {
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
    public void doQueryVmwarebrokers(Context context) {
    	try {
    		EucaConsoleMessage consoleMessage = eucaAC.describeServices("vmwarebroker", null, null, null);
    		JSONArray result = (JSONArray)consoleMessage.getData();
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doAddVmwarebroker(Context context, @Param(name="host") String host, 
    		@Param(name="name") String name, @Param(name="partition") String partition) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
            EucaConsoleMessage message = eucaAC.registerVMB(host, name, partition);	
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
    public void doDeleteVmwarebroker(Context context, @Param(name="json") String json) {
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray result = new JSONArray();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject item = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.deregisterVMB(item.getString("name"), item.getString("partition"));
	        	JSONObject obj = new JSONObject();
	        	obj.put("key",item.getString("name"));
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	/*
	        	if (message.getStatus()) {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	} else {
	        		result.add(new KeyValueBean(item.getString("name"), message.getStatus()));
	        	}*/
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doEnableVmwarebroker(Context context, @Param(name="items") String items) {
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
    public void doDisableVmwarebroker(Context context, @Param(name="items") String items) {
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

