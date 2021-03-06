package net.owlgroup.ea.cluster.action;

import java.util.ArrayList;
import java.util.List;

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


public class StorageAction {
	protected Logger logger = LoggerFactory.getLogger(Logger.class);
	
	@Resource
    private EucaAdminConsole eucaAC;
	
    @Function("public")
    public void doQueryStorages(Context context) {
    	try {
            JSONArray result = new JSONArray();
    		JSONArray scArray = (JSONArray)eucaAC.describeServices("storage", null, null, null).getData();
    		for (Object object : scArray) {
    			JSONObject sc = (JSONObject)object;
    			String partition = sc.getString("partition");
    			EucaConsoleMessage bmMsg = eucaAC.getBlockManager(partition);
    			JSONArray bmArr = (JSONArray)bmMsg.getData();
    			JSONObject bm = (JSONObject)bmArr.get(0);//1 sc only has 1 bm
    			EucaConsoleMessage bmDetailMsg = eucaAC.getBlockManagerProperties(partition, bm.getString("value"));
    			JSONArray bmDetails = (JSONArray)bmDetailMsg.getData();
    			List<String> bmDetailList = new ArrayList<>();
    			for (Object object2 : bmDetails) {
    				JSONObject bmDetail = (JSONObject)object2;
    				bmDetailList.add(bmDetail.getString("value"));
    			}
    			bm.put("partition", partition);
    			bm.put("params", bmDetailList);
    			result.add(bm);
    			
    		}
            context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doQueryByPartition(Context context, @Param(name="partition") String partition) {
        try {
        	System.out.println(partition);
    		EucaConsoleMessage message = eucaAC.getBlockManager(partition);
    		System.out.println(message.toJson().toString());
    		JSONArray storageArr = (JSONArray)message.getData();
    		JSONObject storage = (JSONObject)storageArr.get(0);
            context.put("json", storage);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doQueryProps(Context context, @Param(name="partition") String partition, 
    		@Param(name="mode") String mode) {
        try {
    		EucaConsoleMessage propslMsg = eucaAC.getBlockManagerProperties(partition, mode);
    		JSONArray props = (JSONArray)propslMsg.getData();
            context.put("json", props);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doSave(Context context, @Param(name="partition") String partition, 
    		@Param(name="mode") String mode, @Param(name="json") String json) {
    	
    	JSONObject result = new JSONObject();
		result.put("state", true);
    	try {
            JSONArray props = JSONArray.fromObject(json);
    		EucaConsoleMessage message  = eucaAC.modifyBlockManager(partition, mode);
    		if (!message.getStatus()) {
    			result.put("state", false);
    			result.put("message", message.getErrMessage());
    			context.put("json", result);
    			return;
    		}
    		for (Object object : props) {
    			JSONObject prop = (JSONObject)object;
    			EucaConsoleMessage propsStatus = eucaAC.modifyBlockManagerProperty(
    					partition, prop.getString("key"), prop.getString("value"));
    			if (!propsStatus.getStatus()) {
    				result.put("state", false);
        			result.put("message", propsStatus.getErrMessage());
    				context.put("json", result);
    				return;
    			}
			}
            context.put("json", true);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", result);
		}
    }
}
