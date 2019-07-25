package com.finfosoft.heating.operation;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class operationController extends Controller{
	private static Logger log=Logger.getLogger(operationController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
//		String companyId=company.get("_id");
//		setAttr("companyId", companyId);
		render("mapshow.html");
	}
	
	@Clear()
	public void chart() throws UnsupportedEncodingException{
		String stationId=getPara("station_id");
		String stationName=getPara("station_name");
		String stationNum=getPara("num");
		String tagLevel=getPara("tagLevel");
		System.err.println("stationId:"+stationId);
		System.err.println("stationName:"+stationName);
		System.err.println("stationNum:"+stationNum);
		System.err.println("tagLevel:"+tagLevel);
		setAttr("stationId", stationId);
		setAttr("stationName", java.net.URLDecoder.decode(stationName, "UTF-8"));
		setAttr("stationNum", stationNum);
		setAttr("tagLevel", tagLevel);
		render("data_chart.html");
	}
	
}
