package net.owlgroup.ea.cloudmanagement.action;


import java.text.SimpleDateFormat;
import java.util.Date;

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
public class PolicyAction {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Resource
	private ParserRequestContext parser;

	@Resource
	private EucaAdminConsole eucaAC;

	@Function("public")
	public void doQuery(Context context) {
		try {
			JSONArray policies = new JSONArray();
			JSONArray accounts = getAccounts();
			for (Object object : accounts) {
				JSONObject account = (JSONObject) object;
				EucaConsoleMessage message = eucaAC
						.getAccountPolicyList(account.getString("accountName"));
				JSONArray accPolices = (JSONArray) message.getData();
				for (Object object2 : accPolices) {
					JSONObject policy = (JSONObject) object2;
					policy.put("type", "Account Policy");
					policy.put("element", account.getString("accountName"));
					policies.add(policy);
				}
			}
			JSONArray groups = getGroups();
			for (Object object : groups) {
				JSONObject group = (JSONObject) object;
				EucaConsoleMessage message = eucaAC.getGroupPolicyList(
						group.getString("groupAccount"),
						group.getString("groupName"));
				JSONArray grpPolices = (JSONArray) message.getData();
				for (Object object2 : grpPolices) {
					JSONObject policy = (JSONObject) object2;
					policy.put("type", "Group Policy");
					policy.put("element", group.getString("groupName"));
					policies.add(policy);
				}
			}
			JSONArray users = getUsers();
			for (Object object : users) {
				JSONObject user = (JSONObject) object;
				EucaConsoleMessage message = eucaAC.getUserPolicyList(
						user.getString("userAccount"), 
						user.getString("userName"));
				JSONArray usrPolices = (JSONArray) message.getData();
				for (Object object2 : usrPolices) {
					JSONObject policy = (JSONObject) object2;
					policy.put("type", "User Policy");
					policy.put("element", user.getString("userName"));
					policies.add(policy);
				}
			}
			context.put("json", policies);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
	}
	private JSONArray getAccounts() {
		EucaConsoleMessage message = eucaAC.getAccountList();
		JSONArray accArr = (JSONArray) message.getData();
		return accArr;
	}

	private JSONArray getGroups() {
		JSONArray groups = new JSONArray();
		JSONArray accounts = getAccounts();
		for (Object object : accounts) {
			JSONObject account = (JSONObject) object;
			JSONArray accGroups = (JSONArray) eucaAC.getGroupList(
					account.getString("accountName")).getData();
			for (Object object2 : accGroups) {
				JSONObject group = (JSONObject) object2;
				groups.add(group);
			}
		}
		return groups;
	}

	private JSONArray getUsers() {
		JSONArray users = new JSONArray();
		JSONArray accArr = getAccounts();
		for (Object object : accArr) {
			JSONObject account = (JSONObject) object;
			JSONArray accUsers = (JSONArray) eucaAC.getUserList(
					account.getString("accountName")).getData();
			users.addAll(accUsers);
		}
		return users;
	}

	@Function("public")
	public void doAddAccountPolicy(Context context, @Param(name = "account") String account,
			@Param(name = "actionName") String action, @Param(name = "resource") String resource,
			@Param(name = "effect") String effect, @Param(name = "name") String name,
			@Param(name = "condition") String condition) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String version = format.format(new Date());
			String sid = System.currentTimeMillis() + "";
			//String content = "{\"Version\":"+ version +",\"Statement\":[{\"Sid\":"+ sid +",\"Effect\":"+ effect +",\"Action\":"+ action +",\"Resource\":"+ resource +"}]}";
			String content = "{\"Version\":\""+ version +"\",\"Statement\":[{\"Sid\":\""+ sid +"\",\"Effect\":\""+ effect +"\",\"Action\":\""+ action +"\",\"Resource\":\""+ resource +"\"";
			if (condition!=null && !condition.isEmpty())
			{
				content +=",\"Condition\":"+condition+"}]}";
			} else {
				content +="}]}";
			}
			EucaConsoleMessage message = eucaAC.addAccountPolicy(account, name, content);
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
	public void doAddGroupPolicy(Context context, @Param(name = "account") String account,
			@Param(name = "group") String group, @Param(name = "actionName") String action,
			@Param(name = "resource") String resource, @Param(name = "effect") String effect,
			@Param(name = "name") String name, @Param(name = "condition") String condition) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String version = format.format(new Date());
			String sid = System.currentTimeMillis() + "";
			String content = "{\"Version\":\""+ version +"\",\"Statement\":[{\"Sid\":\""+ sid +"\",\"Effect\":\""+ effect +"\",\"Action\":\""+ action +"\",\"Resource\":\""+ resource +"\"";
			if (condition!=null && !condition.isEmpty())
			{
				content +=",\"Condition\":"+condition+"}]}";
			} else {
				content +="}]}";
			}
			System.out.println(content);
			EucaConsoleMessage message = eucaAC.addGroupPolicy(account, group, name, content);	
			if(!message.getStatus()) {
				result.put("state", false);
				result.put("message", message.getErrMessage());
			}
			//boolean result =  message.getStatus();
			context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
	}
	
	@Function("public")
	public void doAddUserPolicy(Context context, @Param(name = "account") String account,
		    @Param(name = "user") String user, @Param(name = "actionName") String action, 
		    @Param(name = "resource") String resource, @Param(name = "effect") String effect, 
		    @Param(name = "name") String name,@Param(name = "condition") String condition) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			String version = format.format(new Date());
			String sid = System.currentTimeMillis() + "";
			//String content = "{\"Version\":"+ version +",\"Statement\":[{\"Sid\":"+ sid +",\"Effect\":"+ effect +",\"Action\":"+ action +",\"Resource\":"+ resource +"}]}";
			String content = "{\"Version\":\""+ version +"\",\"Statement\":[{\"Sid\":\""+ sid +"\",\"Effect\":\""+ effect +"\",\"Action\":\""+ action +"\",\"Resource\":\""+ resource +"\"";
			if (condition!=null && !condition.isEmpty())
			{
				content +=",\"Condition\":"+condition+"}]}";
			} else {
				content +="}]}";
			}
			EucaConsoleMessage message = eucaAC.addUserPolicy(account, user, name, content);
			if(!message.getStatus()) {
				result.put("state", false);
				result.put("message", message.getErrMessage());
			}
			//boolean result = message.getStatus();
			context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
	}
	
	@Function("public")
	public void doDeleteAccountPolicy(Context context, @Param(name="account") String account, 
			@Param(name="policy") String policy) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			//boolean result = false;
			EucaConsoleMessage message = eucaAC.delAccountPolicy(account, policy);
			//result = message.getStatus();
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
	public void doDeleteGroupPolicy(Context context, @Param(name="account") String account, 
			@Param(name="group") String group, @Param(name="policy") String policy) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			//boolean result = false;
			EucaConsoleMessage message = eucaAC.delGroupPolicy(account, group, policy);	
			if(!message.getStatus()) {
				result.put("state", false);
				result.put("message", message.getErrMessage());
			}
			//result =  message.getStatus();
			context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
	}
	
	@Function("public")
	public void doDeleteUserPolicy(Context context, @Param(name="account") String account,
			@Param(name="user") String user, @Param(name="policy") String policy) {
		JSONObject result = new JSONObject();
		result.put("state", true);
		try {
			//boolean result = false;
			EucaConsoleMessage message = eucaAC.delUserPolicy(account, user, policy);
			if(!message.getStatus()) {
				result.put("state", false);
				result.put("message", message.getErrMessage());
			}
			//result = message.getStatus();
			context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
	}
	
	@Function("public")
	public void doGetPolicysByUser(Context context, @Param(name="user") String user,
			@Param(name="account") String account) {
		try {
			EucaConsoleMessage message = eucaAC.getUserPolicyList(account, user);
			JSONArray usrPolices = (JSONArray) message.getData();
			context.put("json", usrPolices);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
	}
	
	@Function("public")
	public void doGetPolicysByAccount(Context context, @Param(name="account") String account) {
		try {
			EucaConsoleMessage message = eucaAC.getAccountPolicyList(account);
			JSONArray polices = (JSONArray) message.getData();
			context.put("json", polices);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
	}
	
	@Function("public")
	public void doGetPolicysByGroup(Context context, @Param(name="group") String group,
			@Param(name="account") String account) {
		try {
			EucaConsoleMessage message = eucaAC.getGroupPolicyList(account, group);
			JSONArray polices = (JSONArray) message.getData();
			context.put("json", polices);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
	}
}
