package net.owlgroup.ea.dashboard.action;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.citrus.turbine.Context;
import com.eucalyptus.admin.EucaAdminConsole;
import com.eucalyptus.admin.console.EucaConsoleMessage;


public class DashBoardAction {
	protected Logger logger = LoggerFactory.getLogger(getClass());
	
	@Resource
    private EucaAdminConsole eucaAC;
	
	public void doQuery(Context context) {
		try {
			EucaConsoleMessage message = eucaAC.getDashBoardData();
			context.put("json", message.getData());
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			context.put("json", false);
		}
	}
}
