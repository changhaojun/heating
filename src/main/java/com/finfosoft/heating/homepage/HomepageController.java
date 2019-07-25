package com.finfosoft.heating.homepage;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class HomepageController extends Controller{
	private static Logger log=Logger.getLogger(HomepageController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
//		String companyId=company.get("_id");
//		setAttr("companyId", companyId);
		render("home_page.html");
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
	
	@Clear()
	public void station() throws UnsupportedEncodingException{
		String stationId=getPara("station_id");
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		render("station_files.html");
	}
	@Clear()
	public void waterChart() throws UnsupportedEncodingException{
		String branchId=getPara("branch_id");
		String branchName=getPara("branch_name");
		System.err.println("branchName:"+branchName);
		setAttr("branchId", branchId);
		setAttr("branchName", java.net.URLDecoder.decode(branchName, "UTF-8"));
		render("histogram.html");
	}
	
	@Clear()
	public void consumeChart() throws UnsupportedEncodingException{
		String showId=getPara("show_id");
		String showName=getPara("show_name");
		String maplevel=getPara("maplevel");
		System.err.println("showId:"+showId);
		System.err.println("showName:"+showName);
		System.err.println("maplevel:"+maplevel);
		setAttr("showId", showId);
		setAttr("showName", showName);
		setAttr("maplevel",maplevel);
		render("energy_chart.html");
	}
}



