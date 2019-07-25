package com.finfosoft.heating.frame;

import org.apache.log4j.Logger;

import com.finfosoft.heating.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class FrameController extends Controller{
	private static Logger log=Logger.getLogger(FrameController.class);
	
	private static FrameService frameService=new FrameService();
	/**
	 * 框架首页
	 */
	public void index(){
		render("index.html");
	}
	
	/**
	 * 
	 * @Title: getUser
	 * @Description:
	 *    作用:获取用户信息
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年1月24日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear
	public void getUser(){
		//Record result=new Record();
		Record user=getSessionAttr(Constants.SESSION_USER);
		//result.set("user", user);
		renderJson(user);
	}
	/**
	 * 
	 * @Title: saveToken
	 * @Description:
	 *    作用:将授权获得的返回参数存至session
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2016年11月30日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear
	public void saveToken(){
		Record info=new Record();
		info.set("refresh_token", getPara("refresh_token"));
		info.set("access_token", getPara("access_token"));
		info.set("expires_time", getPara("expires_time"));
		setSessionAttr(Constants.SESSION_TOKEN,info);
		Record result=new Record();
		result.set("result", 1);
		renderJson(result);
	}
	
	/**
	 * 
	 * @Title: getToken
	 * @Description:
	 *    作用:将授权获得的返回参数存至session
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2016年11月30日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear
	public void getToken(){
		Record token=getSessionAttr(Constants.SESSION_TOKEN);	
		renderJson(token);
	}
}
