package net.owlgroup.ea.node.action;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.owlgroup.ea.bean.KeyValueBean;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

public class NodeAction {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Resource
    private EucaAdminConsole eucaAC;
	
    @Function("public")
    public void doQueryNodes(Context context) {
    	String s1 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.101\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster01\",\"detail\":\"\"}";
    	String s2 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.102\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster01\",\"detail\":\"\"}";
    	String s3 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.103\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    	String s4 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.104\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster02\",\"detail\":\"\"}";
    	String s5 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.105\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    	String s6 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.106\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";
    	String s7 = "{\"name\":\"node_01\",\"hostName\":\"192.168.1.107\",\"fullName\":\"arn:euca:eucalyptus:cluster01:cluster:cc_01:node1/\",\"type\":\"cluster\",\"state\":\"enable\",\"partition\":\"cluster03\",\"detail\":\"\"}";


		EucaConsoleMessage consoleMessage = eucaAC.describeServices("node", null, null, null);
		JSONArray result = (JSONArray)consoleMessage.getData();
		//result.add(JSONObject.fromObject(s1));
		//result.add(JSONObject.fromObject(s2));
		//result.add(JSONObject.fromObject(s3));
		//result.add(JSONObject.fromObject(s4));
		//result.add(JSONObject.fromObject(s5));
		//result.add(JSONObject.fromObject(s6));
		//result.add(JSONObject.fromObject(s7));
        context.put("json", result);
    }
    
    @Function("public")
    public void doAddNode(Context context, @Param(name="host") String host,
    		@Param(name="partition") String partition, @Param(name="hostUser") String hostUser,
    		@Param(name="password") String password) {
    	JSONObject result = new JSONObject();
    	result.put("state", true);
    	try {
            EucaConsoleMessage message = eucaAC.registerNode(host, partition, hostUser, password);	
            if(!message.getStatus()) {
            	result.put("state", false);
            	result.put("message", message.getErrMessage());
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
    public void doDeleteNode(Context context, @Param(name="json") String json) {
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray result = new JSONArray();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject item = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.deregisterNode(item.getString("name"), item.getString("partition"));
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
    public void doEnableNode(Context context, @Param(name="items") String items) {
		
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
    public void doDisableNode(Context context, @Param(name="items") String items) {
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
