package com.finfosoft.heating.info;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.finfosoft.heating.homepage.HomepageController;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class InfoController extends Controller{
	private static Logger log=Logger.getLogger(InfoController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
//		String companyId=company.get("_id");
//		setAttr("companyId", companyId);
		
		render("box_list.html");
	}
	@Clear()
	public void bindDatas() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		String stationName=getPara("stationName");
		setAttr("stationId", stationId);
		setAttr("stationName",stationName);
		render("bind_dataSource.html");
	}
	@Clear()
	public void alarmDatas() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		String stationName=getPara("stationName");
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		setAttr("stationName",stationName);
		render("alarm_data.html");
	}
	
	@Clear()
	public void transferDatas() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		String stationName=getPara("stationName");
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		setAttr("stationName",stationName);
		render("heat_transfer.html");
	}
	
	@Clear()
	public void transferInfo() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		String companyCode=getPara("company_code");
		String companyId=getPara("company_id");
		System.err.println("stationId:"+stationId);
		System.err.println("companyCode:"+companyCode);
		setAttr("stationId", stationId);
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("heat_info.html");
	}
	
	@Clear()
	public void editor() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		
		String scadaId=getPara("_id");
		setAttr("scadaId", scadaId);
		System.err.println("scadaId:"+scadaId);
		render("editor_scada.html");
	}
	@Clear()
	public void add() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		render("add_scada.html");
	}
}







