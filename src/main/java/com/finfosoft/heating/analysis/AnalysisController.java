package com.finfosoft.heating.analysis;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
public class AnalysisController extends Controller{
	private static Logger analysis=Logger.getLogger(AnalysisController.class);
	private static AnalysisService analysisService=new AnalysisService();
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		String status=company.get("company_name");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("status", status);
		render("daily_report.html");
	}
	/**
	 * 
	 * @Title: daily_report
	 * @Description:
	 *    作用:打开单站监测页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void singleStation(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("real_data.html");
	}
	
	
	
	public void monthly(){
		Record company=getSessionAttr(Constants.SESSION_USER);
//		String companyCode=company.get("company_code");
//		String companyId=company.get("company_id");
//		setAttr("companyCode", companyCode);
//		setAttr("companyId", companyId);
		render("month_report.html");
	}
	
	public void Interval(){
		Record company=getSessionAttr(Constants.SESSION_USER);
//		String companyCode=company.get("company_code");
//		String companyId=company.get("company_id");
//		setAttr("companyCode", companyCode);
//		setAttr("companyId", companyId);
		render("free_report.html");
	}
}
