package com.finfosoft.heating.basicInfo;

import com.finfosoft.heating.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Record;



public class BasicInfoController  extends Controller{
	private static Logger basicInfo=Logger.getLogger(BasicInfoController.class);
	public void pipeDiameter(){
		render("pipe_info.html");

	}
	public void heatFactory(){		
		render("heat_factory.html");
	}	
	public void pipeHeat(){		
		render("pipe_show.html");
	}
	
}
