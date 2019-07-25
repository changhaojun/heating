package com.finfosoft.heating.common;


import com.finfosoft.heating.alarm.AlarmController;
import com.finfosoft.heating.analysis.AnalysisController;
import com.finfosoft.heating.basicInfo.BasicInfoController;
import com.finfosoft.heating.frame.FrameController;
import com.finfosoft.heating.homepage.HomepageController;
import com.finfosoft.heating.info.InfoController;
import com.finfosoft.heating.information.InformationController;
import com.finfosoft.heating.list.ListController;
import com.finfosoft.heating.log.LogController;
import com.finfosoft.heating.login.LoginController;
import com.finfosoft.heating.thematic.ThematicController;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.render.ViewType; 


public class heatingConfig extends JFinalConfig{
	@Override
	public void configConstant(Constants me) {
		//PropKit.use("lanyue_config.txt");
		me.setDevMode(true);
		me.setViewType(ViewType.FREE_MARKER);
		me.setBaseViewPath("/page");
	}

	@Override
	public void configRoute(Routes me) {
		me.add("/", LoginController.class);                        //登录页面
		me.add("/frame",FrameController.class,"/");                //框架页面
		me.add("/homePage",HomepageController.class,"/");          //首页	
		me.add("/list",ListController.class,"/");	               //列表展现
		me.add("/log",LogController.class,"/");	                   //操作日志
		me.add("/alarm",AlarmController.class,"/");	               //历史告警
		//me.add("/data_chart",ChartController.class,"/");
		//me.add("/energy",EnergyController.class,"/");
		//me.add("/heating",HeatingController.class,"/");
		me.add("/boxlist",InfoController.class,"/");              //换热站配置
		//me.add("/pressure",PressureController.class,"/");
		me.add("/analysis",AnalysisController.class,"/");         //统计分析
		me.add("/thematic",ThematicController.class,"/");         //专题分析
		me.add("/information",InformationController.class,"/");   //角色管理
		me.add("/basicInfo",BasicInfoController.class,"/");   	  //基础信息管理

	} 
	
	@Override
	public void configPlugin(Plugins me) {
		// TODO Auto-generated method stub
		//mongodb插件
//		MongodbPlugin mongodbPlugin;
//		if(PropKit.getBoolean("db_auth", false)){
//			mongodbPlugin = new MongodbPlugin(PropKit.get("db_host"), PropKit.getInt("db_port"), PropKit.get("db_name"),PropKit.get("db_user"),PropKit.get("db_pass"));
//		}else{
//			mongodbPlugin = new MongodbPlugin(PropKit.get("db_host"), PropKit.getInt("db_port"), PropKit.get("db_name"));
//		} 
//		me.add(mongodbPlugin);
		
	}

	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub
		me.add(new AuthInterceptor());
		me.add(new GlobalAttrInterceptor());
		
	}

	@Override
	public void configHandler(Handlers me) {
		// TODO Auto-generated method stub
		
	}
	public static void main(String[] args) {
		JFinal.start("src/main/webapp", 8080, "/", 5);
	}
}
