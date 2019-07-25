package com.finfosoft.heating.list;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.kit.StrKit;
import com.jfinal.plugin.activerecord.Record;

public class ListController extends Controller{
	private static Logger log=Logger.getLogger(ListController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
//		String companyId=company.get("_id");
//		setAttr("companyId", companyId);
		
		render("data_list.html");
	}
	@Clear()
	public void chart() throws UnsupportedEncodingException{//图表
		String stationId=getPara("station_id");
		String stationName=getPara("station_name");
		String stationNum=getPara("num");
		String tagLevel=getPara("tagLevel");
		
		setAttr("stationId", stationId);
		setAttr("stationName", java.net.URLDecoder.decode(stationName, "UTF-8"));
		setAttr("stationNum", stationNum);
		setAttr("tagLevel", tagLevel);
		render("data_chart.html");
	}
	
	@Clear()
	public void group() throws UnsupportedEncodingException{//组态
		
//		String token=getPara("accessToken");
//		setAttr("accessToken", token);		
//		

		String stationName=getPara("station_name");
		String stationId=getPara("station_id");
		String scadaId=getPara("_id");
		setAttr("stationId",stationId);
		if(StrKit.notBlank(stationName)){
			setAttr("stationName", java.net.URLDecoder.decode(stationName, "UTF-8"));
		}
		setAttr("scadaId",scadaId);
		render("view_scada.html");
	}
	
	@Clear()
	public void controller() throws UnsupportedEncodingException{//批量下发
		String stationId=getPara("station_id");
		String tagId=getPara("tag_id");
		String token=getPara("accessToken");
		setAttr("accessToken", token);
		setAttr("stationId", stationId);
		setAttr("tagId", tagId);
		render("batch_Delivery.html");
	}
	
	@Clear()
	public void strategy() throws UnsupportedEncodingException{//控制策略
		String stationId=getPara("station_id");
		String name=getPara("name");
		setAttr("stationId", stationId);
		setAttr("name", name);
		render("control_strategy.html");
	}
	@Clear()
	public void companyList() throws UnsupportedEncodingException{//列表模糊查询
		String level=getPara("level");
		String inputVal=getPara("inputVal");
		String companyCode=getPara("companyCode");
		String companyId=getPara("companyId");
		setAttr("inputVal", java.net.URLDecoder.decode(inputVal, "UTF-8"));
		setAttr("level", level);
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("list_serch.html");
	}
	@Clear()
	public void alarm() throws UnsupportedEncodingException{//列表模糊查询
		String stationId=getPara("station_id");
		String name=getPara("name");
		String companyCode=getPara("companyCode");
		setAttr("stationId", stationId);
		setAttr("name", name);
		setAttr("companyCode", companyCode);
		render("singlestation_alarm.html");
	}
}
