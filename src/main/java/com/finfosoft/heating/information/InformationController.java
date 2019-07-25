package com.finfosoft.heating.information;

import com.finfosoft.heating.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Record;



public class InformationController  extends Controller{
	private static Logger information=Logger.getLogger(InformationController.class);
	private static InformationService informationService=new InformationService();
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		String status=company.get("company_name");
		String customerId=company.get("customer_id");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("status", status);
		setAttr("customerId", customerId);
		render("user_manage.html");
	}
	/**
	 * 
	 * @Title: role
	 * @Description:
	 *    作用:打开角色管理页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void role(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		String customerId=company.get("customer_id");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId", customerId);
		render("role_manage.html");
	}
	/**
	 * 
	 * @Title: role
	 * @Description:
	 *    作用:打开供热季管理页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void heatingSeason(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		String customerId=company.get("customer_id");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId", customerId);
		render("heatingSeason_manage.html");
	}
	/**
	 * 
	 * @Title: role
	 * @Description:
	 *    作用:打开支线管理页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void branch(){
		Record company=getSessionAttr(Constants.SESSION_USER);
		String companyCode=company.get("company_code");
		String companyId=company.get("company_id");
		String customerId=company.get("customer_id");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId", customerId);
		render("branch_manage.html");
	}
}
