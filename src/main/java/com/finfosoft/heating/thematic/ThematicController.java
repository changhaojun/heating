package com.finfosoft.heating.thematic;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;



public class ThematicController extends Controller{
	private static Logger log=Logger.getLogger(ThematicController.class);
	private static ThematicService heatingService=new ThematicService();

	
	
	/**
	 * @Title: heating
	 * @Description:
	 *    作用:打开供热地图
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年7月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void index(){
		render("heating.html");
	}

	/**
	 * @Title: energy
	 * @Description:
	 *    作用:打开能耗地图
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年7月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	
	@SuppressWarnings("unused")
	public void energy(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
//		String companyId=company.get("_id");
//		setAttr("companyId", companyId);
	
		render("energy.html");
	}
	
	/**
	 * @Title: energyChart
	 * @Description:
	 *    作用:打开能耗地图图表
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年7月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	
	@Clear()
	public void energyChart() throws UnsupportedEncodingException{
		String showId=getPara("show_id");
		String companyCode=getPara("company_code");
		String maplevel=getPara("maplevel");
		System.err.println("showId:"+showId);
		System.err.println("companyCode:"+companyCode);
		System.err.println("maplevel:"+maplevel);
		setAttr("showId", showId);
		setAttr("companyCode",companyCode);
		setAttr("maplevel",maplevel);
		render("pop_energy.html");
	}
	
	/**
	 * @Title: presssure
	 * @Description:
	 *    作用:打开水压地图
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年7月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	
	public void pressure(){
		render("presssure.html");
	}
	
	/**
	 * @Title: waterChart
	 * @Description:
	 *    作用:打开水压地图图表
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年7月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear()
	public void waterChart() throws UnsupportedEncodingException{
		String stationId=getPara("stationId");
		String stationName=getPara("stationName");
		System.err.println("stationName:"+stationName);
		System.err.println("stationId:"+stationId);
		setAttr("stationId", stationId);
		setAttr("stationName", java.net.URLDecoder.decode(stationName, "UTF-8"));
		render("histogram.html");
	}
}
