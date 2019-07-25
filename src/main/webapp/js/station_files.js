    //用来保存系统下参数数量
    var system_num = [];
    var flag = true;
    var a = 0;
    //进入页面首先默认显示换热站信息
    $(".navName a").eq(0).attr("class", "aActive");
    getStationFiles();

    //加载换热站信息
    $('.navName a').eq(0).click(function() {
    	$(".navName a").eq(0).attr("class", "aActive");
    	$("#showstateMessage h3").eq(0).show();
    	$(".navName a").eq(1).removeAttr("class", "aActive");
    	$("#showstateMessage h3").eq(1).hide();
    	getStationFiles();
    });

    //加载换热站参数项
    $('.navName a').eq(1).click(function() {
    	$(".navName a").eq(1).attr("class", "aActive");
    	$("#showstateMessage h3").eq(1).show();
    	$(".navName a").eq(0).removeAttr("class", "aActive");
    	$("#showstateMessage h3").eq(0).hide();
    	getStationSystemIndex();
    	a = 1;
    });

    //加载换热站档案数据
    function getStationFiles() {
    	$.ajax({
    		url: globalurl + "/v1_0_0/heating_station_file",
    		type: "get",
    		dataType: "JSON",
    		crossDomain: true == !(document.all),
    		async: false,
    		data: {
    			access_token: getToken(),
    			station_id: $("#stationId").val(),
    		},
    		success: function(data) {
    			system_num.push(data.system_num);
    			var exchange_type = null;
    			if (eval('(' + data.exchange_type + ')') == 1) {
    				exchange_type = "水水换热";
    			} else {
    				exchange_type = "汽水换热";
    			}
    			//判断数据数组是否存在
    			$(".otherInfo .textInput").val(judgeData(data.remark))
    			$(".code").val(judgeData(data._id));
    			$(".name").val(judgeData(data.heating_station_name));
    			$(".factory").val(judgeData(data.create_company));
    			$(".time").val(judgeData(data.input_time));
    			$(".rink").val(judgeData(exchange_type));
    			$(".number").val(judgeData(data.system_num));
    			$(".zone").val(judgeData(data.total_area));
    			$(".location").val(judgeData(data.location));
    			$(".oneR").val(judgeData(data.pipe_main_size));
    			$(".twoR").val(judgeData(data.pipe_branch_size));
    			$(".ip").val(judgeData(data.plc_ip));
    			$(".high").val(judgeData(data.station_elevation));
    		}
    	})
    }

    //加载换热站系统参数

    function getStationSystemIndex() {
    	$.ajax({
    		url: globalurl + "/v1_0_0/heating_station_params",
    		type: "get",
    		dataType: "JSON",
    		crossDomain: true == !(document.all),
    		async: false,
    		data: {
    			access_token: getToken(),
    			station_id: $("#stationId").val(),
    		},
    		success: function(data) {
    			if (data.params.length == 0) {
    				layer.msg("该换热站暂时没有具体的系统参数值，即刻完善，请稍后！");
    				$(".systemInfoTitle font").html("系统1参数");
    			} else if (data.params.length == 1) {
    				//1.格式化数据
    				var data = data.params[0];
    				var forUse;
    				if (eval('(' + data.for_purpose + ')') == 1) {
    					forUse = '采暖';
    				} else {
    					forUse = '生活用水';
    				}
    				$(".systemInfoTitle font").html("系统1参数");
    				$(".use").val(judgeData(forUse));
    				$(".scope").val(judgeData(data.for_scope));
    				$(".one").val(judgeData(data.pipe_main_size));
    				$(".two").val(judgeData(data.pipe_branch_size));
    				$(".kindof").val(judgeData(data.plate_type));
    				$(".squre").val(judgeData(data.plate_area));
    				$(".quality").val(judgeData(data.plate_num));
    				$(".hotnum").val(judgeData(data.plate_heat));
    				$(".recycle").val(judgeData(data.recycle_pump_power));
    				$(".recycleflow").val(judgeData(data.recycle_pump_flow));
    				$(".supplypower").val(judgeData(data.supply_pump_power));
    				$(".supplyflow").val(judgeData(data.supply_pump_flow));
    			} else {
    				//1.DOM操作
    				var systemnumIndex = system_num.pop();
    				var newSystemPart = $("#showstateMessage .partTwo").html();
    				if (a == 0) {
    					for (var x = 1; x < systemnumIndex; x++) {
    						$("#showstateMessage .partTwo").append(newSystemPart);
    					}
    				}
    				//2.格式化数据
    				for (var x = 0; x < data.params.length; x++) {
    					var forUse;
    					if (eval('(' + data.params[x].for_purpose + ')') == 1) {
    						forUse = '采暖';
    					} else {
    						forUse = '生活用水';
    					}
    					$(".systemInfoTitle font").eq(x).html("系统" + (x + 1) + "参数");
    					$("#showstateMessage .partTwo .use").eq(x).val(judgeData(forUse));
    					$("#showstateMessage .partTwo .scope").eq(x).val(judgeData(data.params[x].for_scope));
    					$("#showstateMessage .partTwo .one").eq(x).val(judgeData(data.params[x].pipe_main_size));
    					$("#showstateMessage .partTwo .two").eq(x).val(judgeData(data.params[x].pipe_branch_size));
    					$("#showstateMessage .partTwo .kindof").eq(x).val(judgeData(data.params[x].plate_type));
    					$("#showstateMessage .partTwo .squre").eq(x).val(judgeData(data.params[x].plate_area));
    					$("#showstateMessage .partTwo .quality").eq(x).val(judgeData(data.params[x].plate_num));
    					$("#showstateMessage .partTwo .hotnum").eq(x).val(judgeData(data.params[x].plate_heat));
    					$("#showstateMessage .partTwo .recycle").eq(x).val(judgeData(data.params[x].recycle_pump_power));
    					$("#showstateMessage .partTwo .recycleflow").eq(x).val(judgeData(data.params[x].recycle_pump_flow));
    					$("#showstateMessage .partTwo .supplypower").eq(x).val(judgeData(data.params[x].supply_pump_power));
    					$("#showstateMessage .partTwo .supplyflow").eq(x).val(judgeData(data.params[x].supply_pump_flow));
    				}
    			}
    		}
    	})

    }

    //判断参数数值是否存在
    function judgeData(data) {
    	if (data) {
    		return data;
    	} else if (data == null || typeof(data) == "undefined") {
    		return "暂无数据";
    	}
    }