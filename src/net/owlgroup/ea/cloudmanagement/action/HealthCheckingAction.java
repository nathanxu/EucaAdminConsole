package net.owlgroup.ea.cloudmanagement.action;

import javax.annotation.Resource;

import net.sf.json.JSONArray;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.alibaba.citrus.turbine.util.Function;
import com.eucalyptus.admin.EucaAdminConsole;


public class HealthCheckingAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());
    @Resource
    private EucaAdminConsole eucaAC;
    
    @Function("public")
    public void doQuery(Context context) {
        try {
        	JSONArray result =(JSONArray)eucaAC.monitorComponent().getData();
        	context.put("json", result);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
    }
}
