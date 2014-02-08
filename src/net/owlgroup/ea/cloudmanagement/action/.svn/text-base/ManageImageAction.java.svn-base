package net.owlgroup.ea.cloudmanagement.action;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import net.owlgroup.ea.bean.KeyValueBean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.dataresolver.Param;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;

@Function()
public class ManageImageAction {
    
    protected Logger logger = LoggerFactory.getLogger(getClass());
    
    @Resource
    private EucaAdminConsole eucaAC;


    @Function("public")
    public void doQuery(Context context){
    	try {
			EucaConsoleMessage message = eucaAC.getImages(null);
			if (message.getStatus()) {
				context.put("json", message.getData());
			} else {
				context.put("json", false);
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doModify(Context context, @Param(name="items") String items,
    		@Param(name="isPublic") boolean isPublic){
    	try {
	        EucaAdminConsole console = new EucaAdminConsole();
	        List<KeyValueBean> result = new ArrayList<KeyValueBean>();
	        console.setUsemock(true);    	
	        String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.modifyImage(name, isPublic);
	        	result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
    
    @Function("public")
    public void doDelete(Context context, @Param(name="items") String items){
    	try {
	        List<KeyValueBean> result = new ArrayList<KeyValueBean>();
	        String[] names = items.split(",");
	        for (String name : names) {
	        	EucaConsoleMessage message = eucaAC.deregisterImage(name);
	        	result.add(new KeyValueBean(name, message.getStatus()));
			}
	        context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
}
