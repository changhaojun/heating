var user = getUser();
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

var accesstoken = getToken();
var log_type = [];
var logtype;
var isSearch = false;
//用来保存地址、令牌、表示权限的字段
$(function() {
	getType();
});
//获取当前应该显示的类型
function getType(value) {
	log_type.push(value);
	logtype = log_type.pop();
	if (typeof(logtype) == "undefined" || logtype == 0) {
		$('#searchId').val('')
		$('#logTable').bootstrapTable("removeAll");
		$('#logTable').bootstrapTable("refresh", queryParams);
		$(".oboxList").hide();
		$(".boxList").show();
		getlogTable();
	} else {
		$('#searchId').val('')
		$('#ologTable').bootstrapTable("removeAll");
		$('#ologTable').bootstrapTable("refresh", queryParams);
		$(".boxList").hide();
		$(".oboxList").show();
		getologTable();
	}
}

//搜索实现
function searchLog() {
	isSearch = true;
	$('#logTable').bootstrapTable("removeAll");
	$('#logTable').bootstrapTable("refresh", queryParams);
	$('#ologTable').bootstrapTable("removeAll");
	$('#ologTable').bootstrapTable("refresh", queryParams);
	isSearch = false;
};
//获取表格数据
function getlogTable() {
	$('#logTable').bootstrapTable({
		method: 'get',
		url: globalurl + "/v1_0_0/log",
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
			if (value.code == 400005) {
				getlogTable();
				$('#logTable').bootstrapTable("refresh", queryParams)
			}
		},
		columns: $.columns()[1]
	})
	$('#logTableCopy').bootstrapTable({
		method: 'get',
		url: globalurl + "/v1_0_0/log",
		sidePagination: 'server', //设置为服务器端分页
		pagination: true, //是否分页
		search: false, //显示搜索框
		pageSize: 0, //每页的行数 
		pageNumber: 1,
		showRefresh: false,
		showToggle: false,
		showColumns: false,
		//			    pageList:[10,15,20, 25],
		queryParams: queryParams,
		striped: true, //条纹
		onLoadSuccess: function(value) {
			if (value.code == 400005) {
				getlogTable();
				$('#logTableCopy').bootstrapTable("refresh", queryParams)
			}
		},
		columns: $.columns()[1]
	})
}
//不同类型的表格
function getologTable() {
	$('#ologTable').bootstrapTable({
		method: 'get',
		url: globalurl + "/v1_0_0/log",
		sidePagination: 'server', //设置为服务器端分页
		pagination: true, //是否分页
		search: false, //显示搜索框
		pageSize: 9, //每页的行数 
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
		columns: $.columns()[0]
	})
	$('#ologTableCopy').bootstrapTable({
		method: 'get',
		url: globalurl + "/v1_0_0/log",
		sidePagination: 'server', //设置为服务器端分页
		pagination: true, //是否分页
		search: false, //显示搜索框
		pageSize: 0, //每页的行数 
		pageNumber: 1,
		showRefresh: false,
		showToggle: false,
		showColumns: false,
		//			    pageList:[10,15,20, 25],
		queryParams: queryParams,
		striped: true, //条纹
		onLoadSuccess: function(value) {
			//			    	console.info(value);
			if (value.code == 400005) {
				getlogTable();
				$('#ologTableCopy').bootstrapTable("refresh", queryParams)
			}
		},
		columns: $.columns()[0]
	})
}

//向后台传递的函数
function queryParams(params) {
	//			console.log(logtype)
	//			console.log(startTime)
	//			console.log(endTime)
	return {
		pageNumber: isSearch ? 0 : params.offset, //第几页
		pageSize: params.limit, //每页的条数
		access_token: accesstoken,
		company_code: user.company_code,
		start_time: startTime,
		end_time: endTime,
		//				tag_id:'5',
		log_type: typeof(logtype) == "undefined" ? 0 : logtype,
		user_id: logtype == undefined || logtype == 0 ? user.user_id : null,
		key_name: '{"station_name":"' + $('#searchId').val() + '"}',
	}
}

//格式化显示数据
function showFormatter(index, value, rows) {
	return "<b>" + (rows + 1) + "</b><span>" + value.station_name + "</span>"
}
//格式化控制策略
function strategyFormatter(index, value, rows) {
	if (value.control_strategy_name == 1) {
		return '<span>室外温度控制</span>'
	} else {
		return '<span>二网回温控制</span>'
	}
}
//格式化状态
function resultFormatter(index, value, rows) {
	if (value.handle_result == 0) {
		return '<span>失败</span>'
	} else {
		return '<span>成功</span>'
	}
}

//选择时间	
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

		$('#logTable').bootstrapTable("refresh", queryParams);
		$('#ologTable').bootstrapTable("refresh", queryParams);

	})
})
$.extend({
	init: function() {
		$.selectWay();
		$.bootstrapTables();
	},
	//选择表格的方式
	selectWay: function() {
		$("button").on("click", function() {
			$("button").removeClass("selected");
			$(this).addClass("selected");
			getType($(this).attr("value"));
		})
	},
	//判断打印，导出的表格
	bootstrapTables: function() {

		$(".excel_o").click(function() {
			let indexId = ($("button").attr("class") === "selected") ? "logTableCopy" : "ologTableCopy";
			let titleText = ($("button").attr("class") === "selected") ? "直接下发" : "控制策略";
			excel_o.href = tableToExcel(indexId)
			$("#excel_o").attr("download", titleText + "操作日志")
		});
		$(".print").click(function(event) {
			let indexId = ($("button").attr("class") === "selected") ? "logTableCopy" : "ologTableCopy";
			let titleText = ($("button").attr("class") === "selected") ? "直接下发" : "控制策略";
			$("#" + indexId).printThis({
				debug: false,
				importCSS: true,
				importStyle: true,
				printContainer: true,
				pageTitle: titleText,
				removeInline: true,
				printDelay: 000,
				header: null,
				formValues: false,
				doctypeString: '<!DOCTYPE html>'
			});
		});
	},
	//图标的参数
	columns: function() {
		return [
			[{
					title: "换热站名称",
					valign: "middle",
					field: "station_name",
					align: "left",
					formatter: showFormatter, //对本列数据做格式化
				}, {
					title: "控制策略", //标题
					field: "control_strategy_name", //键名
					valign: "middle",
					formatter: strategyFormatter //对本列数据格式化
				}, {
					title: "阀门开度", //标题
					field: "target_value", //键名
					valign: "middle"
				},

				{
					field: "oper_time",
					title: "操作时间",
					valign: "middle"
				}, {
					title: "操作结果",
					field: "handle_result",
					valign: "middle",
					formatter: resultFormatter //对本列数据做格式化
				}
			],
			[{
					title: "换热站名称",
					field: "station_name",
					valign: "middle",
					align: "left",
					formatter: showFormatter, //对本列数据做格式化
				}, {
					title: "数据名称", //标题
					field: "data_name", //键名
					valign: "middle"
				}, {
					title: "目标值", //标题
					field: "target_value", //键名
					valign: "middle"
				},

				{
					field: "user_name",
					title: "客户名称",
					valign: "middle"
				}, {
					field: "oper_time",
					title: "操作时间",
					valign: "middle"
				}, {
					title: "操作结果",
					field: "handle_result",
					valign: "middle",
					formatter: resultFormatter //对本列数据做格式化
				}
			]
		]
	}
});
$.init();
//日期插件格式化
//		$('.form_datetime').datepicker({
//			   format: "yyyy-mm-dd",
//	    });

//切换时间触发事件
/*$("#startDate").blur(function(){
			$('#logTable').bootstrapTable("refresh",queryParams);
			$('#ologTable').bootstrapTable("refresh",queryParams);
		})
		
	   $("#endDate").blur(function(){
			$('#logTable').bootstrapTable("refresh",queryParams);
			$('#ologTable').bootstrapTable("refresh",queryParams);
		})*/