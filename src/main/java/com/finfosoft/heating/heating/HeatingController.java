package com.finfosoft.heating.heating;

import java.io.UnsupportedEncodingException;

import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;

public class HeatingController extends Controller{
	public void index(){
		render("heating.html");
	}
	
	/**
	 * 
	 * @Title: presssure
	 * @Description:
	 *    作用:打开水压地图
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void presssure(){
		render("presssure.html");
	}
	
	@Clear()
	public void waterChart() throws UnsupportedEncodingException{
		String branchId=getPara("branchId");
		String branchName=getPara("branchName");
		System.err.println("branchName:"+branchName);
		System.err.println("branchId:"+branchId);
		setAttr("branchId", branchId);
		setAttr("branchName", java.net.URLDecoder.decode(branchName, "UTF-8"));
		render("histogram.html");
	}
}
