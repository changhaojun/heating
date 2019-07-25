package com.finfosoft.heating.alarm;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class AlarmController extends Controller{
	private static Logger alarm=Logger.getLogger(AlarmController.class);
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		render("alarm_manage.html");
	}
	@Clear()
	public void bindData() throws UnsupportedEncodingException{
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		render("bind_dataSource.html");
	}
}
