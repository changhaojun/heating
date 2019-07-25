package com.finfosoft.heating.log;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class LogController extends Controller{
	private static Logger log=Logger.getLogger(LogController.class);
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		render("operate_log.html");
	}
}
