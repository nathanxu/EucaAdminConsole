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
public class UserAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private EucaAdminConsole eucaAC;
    
    @Function("public")
    public void doQuery(Context context) {
    	try {
    		JSONArray users = new JSONArray();
        	JSONArray accArr = getAccounts();
        	for (Object object : accArr) {
        		JSONObject account = (JSONObject)object;
				JSONArray accUsers = (JSONArray)eucaAC.getUserList(account.getString("accountName")).getData();
				users.addAll(accUsers);
			}
			context.put("json", users);
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
    public void doAddUser(Context context, @Param(name="account") String account,
    		@Param(name="group") String group, @Param(name="name") String name) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		EucaConsoleMessage message = eucaAC.createUser(account, group, name);
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
    public void doDeleteUser(Context context, @Param(name="json") String json) {
    	JSONArray result = new JSONArray();
    	try {
    		//List<KeyValueBean> result = new ArrayList<KeyValueBean>();
    		JSONArray items = JSONArray.fromObject(json);
	        for (Object object : items) {
	        	JSONObject user = (JSONObject)object;
	        	EucaConsoleMessage message = eucaAC.delUser(user.getString("account"), user.getString("user"));
	        	JSONObject obj = new JSONObject();
	        	obj.put("key", user.getString("user"));
	        	obj.put("value", message.getStatus());
	        	obj.put("desc", message.getErrMessage());
	        	result.add(obj);
	        	/*
	        	if (message.getStatus()) {
	        		result.add(new KeyValueBean(user.getString("user"), message.getStatus()));
	        	} else {
	        		result.add(new KeyValueBean(user.getString("user"), message.getStatus()));
	        	} */
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
    public void doQueryUserGroup(Context context, @Param(name="account") String account, 
    		@Param(name="user") String user) {
    	try {
    		EucaConsoleMessage message = eucaAC.getUserGroupList(account, user);
			JSONArray groups = (JSONArray)message.getData();
			context.put("json", groups);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doGetUsersByAccount(Context context, @Param(name="account") String account) {
    	try {
			JSONArray groups = (JSONArray)eucaAC.getUserList(account).getData();
        	context.put("json", groups);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doManageUserGroup(Context context, @Param(name="account") String account, 
    		@Param(name="group") String groups, @Param(name="user") String user) {
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
    		EucaConsoleMessage preGoupsMsg = eucaAC.getUserGroupList(account, user);
        	JSONArray preGoups = (JSONArray)preGoupsMsg.getData();
        	for (Object object : preGoups) {
        		JSONObject group = (JSONObject)object;
        		EucaConsoleMessage message = eucaAC.delGroupUser(account, group.getString("groupName"), user);
				if (!message.getStatus()) {
					result.put("state", false);
					result.put("message", message.getErrMessage());
					context.put("json", result);
					return;
				}
        	} 
        	if (groups != null) {
        		String[] newGroups = groups.split(",");
            	for (String group : newGroups) {
            		EucaConsoleMessage message = eucaAC.addGroupUser(account, group, user);
            		if (!message.getStatus()) {
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
    
    @Function("public")
    public void doGetUsersByGroup(Context context, @Param(name="account") String account,
    		@Param(name="group") String group) {
    	try {
			JSONArray users = (JSONArray)eucaAC.getGroupUserList(account, group).getData();
			context.put("json", users);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
}
