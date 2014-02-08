package net.owlgroup.ea.cloudmanagement.action;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

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


public class CapacityReportAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Resource
    private EucaAdminConsole eucaAC;

    @Function("public")
    public void doQuery(Context context, @Param(name="from") String from,
    		@Param(name="to") String to) {
    	try {
    		Date start = new Date();
    		Date end = new Date();
    		if (from == null || to == null) {
    			end = new Date();
    			Calendar calendar = Calendar.getInstance();
    			calendar.setTime(end);
    			calendar.add(Calendar.DATE, -1);    //得到前一天
    			start = calendar.getTime();
    		} else {
    			SimpleDateFormat fmt=new SimpleDateFormat("MM/dd/yyyy"); 
    			start = fmt.parse(from);
    			end = fmt.parse(to);
    		}

            EucaConsoleMessage message = eucaAC.genCapacityReport(start, end);
        	if (!message.getStatus()) {
        		logger.error(message.getErrMessage());
        		return;
        	}
        	JSONObject object = (JSONObject)message.getData();
        	JSONArray resluts = object.getJSONArray("reports");
			context.put("json", resluts);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
		}
    }
}
