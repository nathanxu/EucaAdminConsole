package net.owlgroup.ea.cloudmanagement.action;


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

@Function()
public class AccountAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context) {
    	try {
        	EucaConsoleMessage message = eucaAC.getAccountList();
        	JSONArray accArr = (JSONArray)message.getData();
			context.put("json", accArr);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doAddAccount(Context context, @Param(name="name") String name) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		EucaConsoleMessage message = eucaAC.createAccount(name);
    		if(!message.getStatus()) {
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
    
    @Function("public")
    public void doDeleteAccount(Context context, @Param(name="items") String items) {
    	JSONArray result = new JSONArray();
    	try {
	        //List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		
	        String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.delAccount(name);
	        	JSONObject obj = new JSONObject();
	        	obj.put("key", name);
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	//result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			JSONObject obj = new JSONObject();
        	obj.put("key", "all");
        	obj.put("value", false);
        	obj.put("desc", e.getMessage());
        	result.add(obj);
			context.put("json", result);
		}
    }

}
