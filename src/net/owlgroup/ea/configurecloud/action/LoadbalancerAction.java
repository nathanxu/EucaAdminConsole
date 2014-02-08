package net.owlgroup.ea.configurecloud.action;



import java.util.ArrayList;
import java.util.List;

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
public class LoadbalancerAction {
    
    
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context) {
    	try {
    		JSONArray result = (JSONArray)eucaAC.getLoadBalancerImage().getData();
//    		for (Object object : result) {
//				JSONObject balancer = (JSONObject)object;
//				List<String> temp = new ArrayList<String>();
//				temp.add(balancer.getString(""));
////				eucaAC.geta
//			}
    		
    		JSONObject lbJson = (JSONObject) result.get(0);
    		String lbImageId = lbJson.getString("value");
    		JSONArray images = (JSONArray)eucaAC.getImages(null).getData();
    		JSONArray ret = new JSONArray();
    		for(Object obj:images) {
    			JSONObject image = (JSONObject) obj;
    			if (image.get("imageId").toString().equals(lbImageId)) {
    				image.put("isLBimage", true);
    			} else {
    				image.put("isLBimage", false);
    			}	
    			ret.add(image);
    		}
    		context.put("json", ret);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
    
    @Function("public")
    public void doSetDefault(Context context, @Param(name="image") String image) {
    	JSONObject result = new JSONObject();
    	result.put("state", true);
    	try {
    		EucaConsoleMessage message = eucaAC.modifyLoadBalancerImage(image);
    		if (!message.getStatus()) {
    			result.put("state", false);
    			result.put("message", message.getErrMessage());
    		}
    		context.put("json",result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			result.put("state", false);
			result.put("message", e.getMessage());
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doInstall(Context context) {
    	JSONObject result = new JSONObject();
    	result.put("state", true);
    	try {
    		EucaConsoleMessage message = eucaAC.installBalancerImage();
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
