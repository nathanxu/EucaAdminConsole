package net.owlgroup.ea.cloudmanagement.action;


import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import net.owlgroup.ea.bean.KeyValueBean;
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
public class UserGroupAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private ParserRequestContext parser;

    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context) {
    	try {
    		JSONArray groups = new JSONArray();
    		JSONArray accounts = getAccounts();
    		for (Object object : accounts) {
    			JSONObject account = (JSONObject)object;
    			JSONArray accGroups = (JSONArray)eucaAC.getGroupList(account.getString("accountName")).getData();
//    			for (Object object2 : accGroups) {
//					JSONObject group = (JSONObject)object2;
//					groups.add(group);
//				}
    			groups.addAll(accGroups);
			}
        	context.put("json", groups);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
	private JSONArray getAccounts() {
		EucaConsoleMessage message = eucaAC.getAccountList();
		JSONArray accArr = (JSONArray)message.getData();
		return accArr;
	}
    
    @Function("public")
    public void doAddUserGroup(Context context, @Param(name="account") String account, 
    		@Param(name="group") String group) {
    	
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		EucaConsoleMessage message = eucaAC.createGroup(account, group);
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
    public void doDeleteUserGroup(Context context, @Param(name="json") String json) {
    	JSONArray result = new JSONArray();
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject group = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.delGroup(group.getString("account"), group.getString("group"));
	        	JSONObject obj = new JSONObject();
	        	obj.put("key", group.getString("group"));
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	/*
	        	if (message.getStatus()) {
	        		result.add(new KeyValueBean(group.getString("group"), message.getStatus()));
	        	} else {
	        		result.add(new KeyValueBean(group.getString("group"), message.getStatus()));
	        	}*/
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
    
    @Function("public")
    public void doGetGroupsByAccount(Context context, @Param(name="account") String account) {
    	try {
			JSONArray groups = (JSONArray)eucaAC.getGroupList(account).getData();
        	context.put("json", groups);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doManageUser(Context context, @Param(name="account") String account,
    		@Param(name="group") String group, @Param(name="user") String users) {
    	
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		JSONArray groupUsers = (JSONArray)eucaAC.getGroupUserList(account, group).getData();
    		for (Object object : groupUsers) {
				JSONObject u = (JSONObject)object;
				EucaConsoleMessage message = eucaAC.delGroupUser(account, group, u.getString("userName"));
				if(!message.getStatus()) {
					result.put("state", false);
					result.put("message", message.getErrMessage());
					context.put("json", result);
					return;
				}
			}
    		if (users != null) {
    			String[] userArr = users.split(",");
    			for (String user : userArr) {
    				EucaConsoleMessage message = eucaAC.addGroupUser(account, group, user);
    				if(!message.getStatus()) {
    					result.put("state", false);
    					result.put("message", message.getErrMessage());
    					context.put("json", result);
    					return;
    				}
				}
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
