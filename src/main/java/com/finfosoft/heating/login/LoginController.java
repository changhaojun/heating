package com.finfosoft.heating.login;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.finfosoft.heating.common.AuthInterceptor;
import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class LoginController extends Controller{
	private static Logger log=Logger.getLogger(LoginController.class);
	private static LoginService loginService=new LoginService();
	@Clear()
	public void index(){
		HttpSession session=getSession();
		if(session!=null){
			session.removeAttribute(Constants.SESSION_USER);
			session.removeAttribute(Constants.SESSION_COMPANY);
			session.removeAttribute(Constants.SESSION_TOKEN);
		}
		render("login.html");
	}
	
	@Clear()
	public void findback(){
		String accessToken=getPara(0);
		setAttr("accessToken", accessToken);
		render("findback.html");
	}
	/**
	 * 登录操作
	 */
	@Clear(AuthInterceptor.class)
	public void login(){
		//登录用户信息保存到session中
		Map<String, Object> userMap=(Map<String,Object>)JSON.parse(getPara("data"));
		//保存用户信息
		Record info=new Record();
		info.set("roles", userMap.get("roles"));
		info.set("username", userMap.get("username"));
		info.set("fullname", userMap.get("fullname"));
		info.set("user_id", userMap.get("user_id"));
		info.set("resources", userMap.get("resources"));
		info.set("company_id", userMap.get("company_id"));
		info.set("company_code", userMap.get("company_code"));
		info.set("customer_id", userMap.get("customer_id"));
		info.set("company_name", userMap.get("company_name")); 
		info.set("status", userMap.get("status"));
		info.set("city_id", userMap.get("city_id"));
		setSessionAttr(Constants.SESSION_USER,info);
		System.out.println(userMap.get("company_name"));
		//保存token信息
		info=new Record();
		info.set("refresh_token", userMap.get("refresh_token"));
		info.set("access_token", userMap.get("access_token"));
		info.set("expires_time", userMap.get("expires_time"));
		setSessionAttr(Constants.SESSION_TOKEN,info);

		//定向到系统首页
		Record result=new Record();
		result.set("code", 200);
		renderJson(result);
	}
	
	private Map<String, Object> getParaMap(String string) {
		// TODO Auto-generated method stub
		return null;
	}

	public void logout(){
		HttpSession session=getSession();
		if(session!=null){
			session.removeAttribute(Constants.SESSION_USER);
			session.removeAttribute(Constants.SESSION_COMPANY);
			session.removeAttribute(Constants.SESSION_TOKEN);
		}
		render("login.html");
	}
	
	
}
