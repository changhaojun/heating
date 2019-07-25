var accesstoken = getToken();
var user = getUser();
var resultId
var logId = []

//var startTime
//var endTime
//var initstartTime
//var initendTime
var isSearch = false;
$(function() {
		getAlarmList();
	})
	//MQTTconnect();

//添加
//获取时间
function p(s) {
	return s < 10 ? '0' + s : s;
}
var myDate = new Date();
var year = myDate.getFullYear();
var month = myDate.getMonth() + 1;
var date = myDate.getDate();
var h = myDate.getHours(); //获取当前小时数(0-23)
var m = myDate.getMinutes(); //获取当前分钟数(0-59)
var s = myDate.getSeconds();
var flag = "";
if (h >= 12) {
	flag = "PM";
} else {
	flag = "AM";
}
startTime = year + "$" + p(month) + "$" + (p(date - date + 1)) + "$" + (p(h - h)) + ":" + (p(m - m)) + ":" + (p(s - s));
endTime = year + "$" + p(month) + "$" + (p(date)) + "$" + (p(h)) + ":" + (p(m)) + ":" + (p(s));
initstartTime = year + '-' + p(month) + "-" + p(date - date + 1) + " AM " + p(h - h) + ':' + p(m - m);
initendTime = year + '-' + p(month) + "-" + p(date) + " " + flag + " " + p(h) + ':' + p(m);
$("#reservationtime").val(initstartTime + ' ' + ' - ' + ' ' + initendTime)

//日期插件格式化
//	$('.form_datetime').datepicker({
//		   format: "yyyy-mm-dd",
//  });

//针对历史告警的搜索
function searchAlarm() {
	isSearch = true;
	$('#alarmList').bootstrapTable("removeAll");
	$('#alarmList').bootstrapTable("refresh", queryParams);
	$('#normalTable').bootstrapTable("removeAll");
	$('#normalTable').bootstrapTable("refresh", queryParams);
	isSearch = false;

};

function getType(value) {
	var log_type = [];
	var logtype;
	log_type.push(value);
	logtype = log_type.pop();
	if (typeof(logtype) == "undefined" || logtype == 0) {
		$('#searchId').val('')
		$('#alarmList').bootstrapTable("removeAll");
		$('#alarmList').bootstrapTable("refresh", queryParams);
		$(".oboxList").hide();
		$(".boxList").show();
		getAlarmList();
	} else {
		$('#searchId').val('')
		$('#normalTable').bootstrapTable("removeAll");
		$('#normalTable').bootstrapTable("refresh", queryParams);
		$(".boxList").hide();
		$(".oboxList").show();
		$.getnormalTable();
	}
}

//选择时间触发事件
//      $("#startDate").blur(function(){
//			$('#alarmList').bootstrapTable("refresh",queryParams);
//			$('#alarmList').bootstrapTable("refresh",queryParams);
//		})
//		
//	   $("#endDate").blur(function(){
//			$('#alarmList').bootstrapTable("refresh",queryParams);
//			$('#alarmList').bootstrapTable("refresh",queryParams);
//		})

//获取历史告警列表
function getAlarmList() {
	$('#alarmList').bootstrapTable({
		method: 'get',
		url: globalurl + "/v1_0_0/alarmHistory",
		sidePagination: 'server', //设置为服务器端分页
		pagination: true, //是否分页
		search: false, //显示搜索框
		pageSize:10, //每页的行数
		pageNumber: 1,
		showRefresh: false,
		showToggle: false,
		showColumns: false,
		pageList: [10, 15, 20, 25],
		queryParams: queryParams,
		striped: true, //条纹
		onLoadSuccess: function(value) {
			//		    	console.log(value)
			for (var i = 0; i < value.rows.length; i++) {
				logId.push(value.rows[i].log_id)
			}
			//		    	console.log(logId)
			if (value.code == 400005) {
				$('#alarmList').bootstrapTable("refresh", queryParams)
			}
			$('[data-toggle="tooltip"]').tooltip();
			resultInfo()
		},
		columns: [{
				title: "换热站",
				field: "station_name",
				valign: "middle",
				align: "left",
				formatter: showFormatter //对本列数据做格式化
			}, {
				title: "告警指标",
				field: "alarm_name",
				valign: "middle"
			}, {
				title: "告警值", //标题
				field: "data_value", //键名
				valign: "middle"
			},
			/*{
			    title: "告警状态",//标题
			    field: "handle_result",//键名
			    valign:"middle",
			    formatter: resultFormatter//对本列数据做格式化
			},*/
			{
				title: "处理人",
				field: "full_name",
				valign: "middle",
				formatter: NameFormatter
			}, {
				title: "发生时间",
				field: "start_time",
				valign: "middle"

			}, {
				title: "结束时间",
				field: "end_time",
				valign: "middle",
				align: "left",
				//	                        formatter: endtimeFormatter  
			}, {
				title: "确认信息",
				field: "log_id",
				valign: "middle",
				align: "center",
				formatter: layerFormatter //对本列数据做格式化
			}
		],
	})
}

//传递参数
function queryParams(params) {
	//		console.log(startTime)
	//		console.log(endTime)
	return {
		pageNumber: isSearch ? 0 : params.offset, //第几页
		pageSize: params.limit, //每页的条数
		access_token: accesstoken,
		start_time: startTime,
		end_time: endTime,
		company_code: getUser().company_code,
		key_name: '{"station_name":"' + $('#searchId').val() + '"}',
	};
}

//格式化显示数据
function showFormatter(index, value, rows) {
	return "<b>" + (rows + 1) + "</b><span id=" + value.log_id + ">" + value.station_name + "</span>"
}

//格式化人名显示
function NameFormatter(value) {
	//console.log(value)
	if (value == undefined || value == null) {
		return "<span >-</span>";
	} else {
		return "<span>" + value + "</span>";
	}
}
//格式化数据列
function resultFormatter(value, rows) {
	if (value == undefined || value == null) {
		return '<span class="result untreated">未确认</span>'
	} else {
		return '<span class="result already">已确认</span>'
	}
}

//格式化操作序列
function layerFormatter(value) {
	return "<span class='fa fa-book resultFa' style='color:#19b393' data-toggle='tooltip' data-placement='top'></span>"

}
/*onclick=openResult('"+value+"')*/
//格式化结束时间
function endtimeFormatter(value) {
	if (value == undefined || value == null) {
		return "<span class='endtime'>暂无数据</span>";
	} else {
		return "<span class='endtime'>" + value + "</span>";
	}
}

//点击图标
function resultInfo() {
	$('.resultFa').on('click', function() {
		var This = $(this)
		resultId = $(this).parent().parent().children().eq(0).find('span').attr('id')
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/alarmHistory",
			async: true,
			data: {
				access_token: accesstoken,
				alarm_history_id: resultId
			},
			success: function(data) {
				//console.log(data)
				openResult(data)
			}
		});
	})
}

//根据返回的数据是否处理做判断
function openResult(resultData) {
	var titleMsg;
	if (resultData.handle_result == undefined || resultData.handle_result == null) {
		titleMsg = '提交处理结果';
		$('.infoDetails').val('');
		$('.infoDetails').removeAttr('disabled');
		$('.submitButton').show();
	} else {
		titleMsg = '查看处理结果';
		$('.infoDetails').val(resultData.handle_result);
		$('.infoDetails').attr('disabled', 'disabled');
		$('.submitButton').hide();
	}
	resultBox = layer.open({
		type: 1,
		title: titleMsg,
		skin: 'layui-layer-molv',
		shadeClose: true,
		shade: 0.5,
		area: ['420px'],
		content: $('.confirmInfo')
	})
}

//点击处理按钮触发事件
//验证用户输入的信息是否正确
$('#submitInfo').click(function() {
	//		console.log(resultId)
	var inputValue = $('.infoDetails').val();
	var regTest = /^[\u4e00-\u9fa5_0-9]+$/;
	if (regTest.test(inputValue)) {
		$.ajax({
			type: "put",
			url: globalurl + "/v1_0_0/alarmHistory",
			async: true,
			data: {
				access_token: accesstoken,
				data: $('.infoDetails').val(),
				alarm_history_id: resultId,
				fullname: user.fullname
			},
			success: function(data) {
				//console.info(data);
				layer.msg("处理成功", {
					icon: 1
				});
				setTimeout(function() {
					layer.close(resultBox);
				}, 200);
				$("#kindOperation button:nth-child(1)").addClass("selected");
				//					var alarmNum=$('.msgNum', window.parent.document).text()
				//					$('.msgNum', window.parent.document).text(alarmNum-1)
				$('#alarmList').bootstrapTable("refresh", queryParams)
			}
		});
	} else {
		layer.msg("请输入合法的字符");
	}

})

//限制空格输入
function space(obj) {
	obj.val = obj.val(obj.val().replace('/\s/g', ''))
}

var mStartTime
var mEndTime
	//订阅后台的推送消息
function MQTTconnect() {
	//console.log("订阅程序开始执行");
	var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	var options = {
		timeout: 1000,
		onSuccess: onConnect,
		onFailure: function(message) {
			setTimeout(MQTTconnect, 10000000);
		}
	};
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	if (username != null) {
		options.userName = username;
		options.password = password;
	}
	client.connect(options);
	// connect the clien
}

// called when the client connects
//	function onConnect() {
//	    console.log("onConnect");
//	    topic = company_id;
//	    client.subscribe(topic);
//	}
function onConnect() {
	//	    console.log("onConnect");
	topic = "toclient";
	client.subscribe(topic);
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}

// called when a message arrives
function onMessageArrived(message) {
	var topic = message.destinationName;
	var payload = JSON.parse(message.payloadString);
	//	    console.log(payload)
	//	    console.log(typeof payload.start_time)
	//	    $('#alarmList').bootstrapTable("refresh",queryParams);

	if (payload.start_time >= mStartTime && payload.start_time <= mEndTime) {
		for (var j = 0; j < logId.length; j++) {
			if (payload.log_id == logId[i]) {
				$('#alarmList').bootstrapTable("refresh", queryParams);
			}
		}
	}
}

//添加
$(document).ready(function() {
	$('#reservationtime').daterangepicker({
		timePicker: true,
		timePickerIncrement: 30,
		format: 'YYYY-MM-DD A h:mm '
	}, function(start, end, label) {
		start = new Date(start).getFullYear() + "$" + p(new Date(start).getMonth() + 1) + "$" + p(new Date(start).getDate()) + "$" + p(new Date(start).getHours()) + ":" + p(new Date(start).getMinutes()) + ":" + p(new Date(start).getSeconds());
		end = new Date(end).getFullYear() + "$" + p(new Date(end).getMonth() + 1) + "$" + p(new Date(end).getDate()) + "$" + p(new Date(end).getHours()) + ":" + p(new Date(end).getMinutes()) + ":" + p(new Date(end).getSeconds());
		startTime = start;
		endTime = end;
		$('#alarmList').bootstrapTable("refresh", queryParams);
		$('#normalTable').bootstrapTable("refresh", queryParams);
		mStartTime = new Date(start).getFullYear() + "-" + p(new Date(start).getMonth() + 1) + "-" + p(new Date(start).getDate()) + " " + p(new Date(start).getHours()) + ":" + p(new Date(start).getMinutes()) + ":" + p(new Date(start).getSeconds());
		mEndTime = new Date(end).getFullYear() + "-" + p(new Date(end).getMonth() + 1) + "-" + p(new Date(end).getDate()) + " " + p(new Date(end).getHours()) + ":" + p(new Date(end).getMinutes()) + ":" + p(new Date(end).getSeconds());
	})
})
$.extend({
	init: function() {
		$.selectWay();
	},
	selectWay: function() {
		$("button").on("click", function() {
			$("button").removeClass("selected");
			$(this).addClass("selected");
			getType($(this).attr("value"));
		})
	},
	getnormalTable: function() {
		$('#normalTable').bootstrapTable({
			method: 'get',
			url: globalurl + "/v1_0_0/abnormalData",
			sidePagination: 'server', //设置为服务器端分页
			pagination: true, //是否分页
			search: false, //显示搜索框
			pageSize: 10, //每页的行数
			pageNumber: 1,
			showRefresh: false,
			showToggle: false,
			showColumns: false,
			pageList: [10, 15, 20, 25],
			queryParams: queryParams,
			striped: true, //条纹
			onLoadSuccess: function(value) {
				//			    	console.info(value);
				if (value.code == 400005) {
					getlogTable();
					$('#ologTable').bootstrapTable("refresh", queryParams)
				}
			},
			columns: [{
					title: "换热站名称",
					valign: "middle",
					field: "station_name",
					align: "left",
                	formatter: showFormatter //对本列数据做格式化
				}, {
					title: "异常指标", //标题
					field: "data_name", //键名
					valign: "middle",
					align: "center",
				}, {
					title: "异常值", //标题
					field: "data_value", //键名
					valign: "middle",
					align: "center",
				},

				{
					field: "start_time",
					title: "发生时间",
					valign: "middle",
					align: "center",
				}
			]
		})
	}
});
$.init();