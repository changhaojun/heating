$.allData = {
	accesstoken: getToken(),
	startTime: "",
	endTime: "",
	initstartTime: "",
	initendTime: "",
	heatEachart: [],
	chartData: "",
	resultId: "",
	user: getUser()
}
$.fn.extend({
	Eachart: function() {
		$.allData.heatEachart = echarts.init($(this)[0]);
		option = {
			tooltip: {
				position: 'top',
				formatter: function(p) {
					var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
					return format + ': ' + p.data[1];
				}
			},
			visualMap: {
				min: 0,
				max: $.allData.chartData.maxCount,
				calculable: true,
				orient: 'vertical',
				left: '570',
				bottom: "50"
			},

			calendar: $.calendar()[0],
			series: $.calendar()[1]
		}
		$.allData.heatEachart.setOption(option);
	}

});
$.extend({
	init: function() {
		$("#backStation").html($("#stationName").val());
		$.backStation();

		$.initDate();

		$.heatEachart();
		$.resultInfo();
		$.sureInfo();
		$.DATE();
		$.getalarmTable();
	},

	backStation: function() {
		//回到换热站
		$("#backStation").click(function() {
			//history.back(-1);
			$(window.parent.document).find(".layui-layer").hide();
			$(window.parent.document).find(".layui-layer-shade").hide();
			$(window.parent.document).find("html").css('overflow', 'auto');

		});
	},
	//初始化时间
	initDate: function() {
		//获取时间

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
		$.allData.startTime = year + "$" + $.addZero(month) + "$" + ($.addZero(date - date + 1)) + "$" + ($.addZero(h - h)) + ":" + ($.addZero(m - m)) + ":" + ($.addZero(s - s));
		$.allData.endTime = year + "$" + $.addZero(month) + "$" + ($.addZero(date)) + "$" + ($.addZero(h)) + ":" + ($.addZero(m)) + ":" + ($.addZero(s));
		$.allData.initstartTime = year + '-' + $.addZero(month) + "-" + $.addZero(date - date + 1) + " AM " + $.addZero(h - h) + ':' + $.addZero(m - m);
		$.allData.initendTime = year + '-' + $.addZero(month) + "-" + $.addZero(date) + " " + flag + " " + $.addZero(h) + ':' + $.addZero(m);
		$("#reservationtime").val($.allData.initstartTime + ' ' + ' - ' + ' ' + $.allData.initendTime)
	},
	addZero: function(s) {
		return s < 10 ? '0' + s : s;
	},

	//日期插件
	DATE: function() {
		$('#reservationtime').daterangepicker({
			timePicker: true,
			timePickerIncrement: 30,
			format: 'YYYY-MM-DD A h:mm '
		}, function(start, end, label) {
			start = new Date(start).getFullYear() + "$" + $.addZero(new Date(start).getMonth() + 1) + "$" + $.addZero(new Date(start).getDate()) + "$" + $.addZero(new Date(start).getHours()) + ":" + $.addZero(new Date(start).getMinutes()) + ":" + $.addZero(new Date(start).getSeconds());
			end = new Date(end).getFullYear() + "$" + $.addZero(new Date(end).getMonth() + 1) + "$" + $.addZero(new Date(end).getDate()) + "$" + $.addZero(new Date(end).getHours()) + ":" + $.addZero(new Date(end).getMinutes()) + ":" + $.addZero(new Date(end).getSeconds());
			$.allData.startTime = start;
			$.allData.endTime = end;
			$('#alarmTable').bootstrapTable("refresh", $.queryParams);
			$.heatEachart();
		})
	},
	getalarmTable: function() {
		$('#alarmTable').bootstrapTable({
			method: 'get',
			url: globalurl + "/v1_0_0/alarmHistory",
			sidePagination: 'server', //设置为服务器端分页
			pagination: true, //是否分页
			search: false, //显示搜索框
			pageSize: 9, //每页的行数 
			pageNumber: 1,
			showRefresh: false,
			showToggle: false,
			showColumns: false,
			pageList: [10, 15, 20, 25],
			queryParams: $.queryParams,
			striped: true, //条纹
			onLoadSuccess: function(value) {
				//			    	console.info(value);
				if (value.code == 400005) {
					//					$('#alarmTable').bootstrapTable("refresh", $.queryParams())
				}
				$.resultInfo();
			},
			columns: [{
					title: "换热站名称",
					valign: "middle",
					field: "station_name",
					align: "center",
					formatter: showFormatter

				}, {
					title: "告警指标", //标题
					field: "alarm_name", //键名
					valign: "middle",
					align: "center",
				}, {
					title: "告警值", //标题
					field: "data_value", //键名
					valign: "middle",
					align: "center",
				},

				{
					field: "start_time",
					title: "开始时间",
					valign: "middle",
					align: "center",
				}, {
					field: "end_time",
					title: "结束时间",
					valign: "middle",
					align: "center",
				}, {
					field: "full_name",
					title: "处理人",
					valign: "middle",
					align: "center",
				}, {
					field: "handle_result",
					title: "处理结果",
					valign: "middle",
					align: "center",
					formatter: $.layerFormatter()
				}
			]
		})
	},

	//传递参数
	queryParams: function() {
		return {
			pageNumber: 0, //第几页
			pageSize: 1, //每页的条数
			access_token: $.allData.accesstoken,
			start_time: $.allData.startTime,
			end_time: $.allData.endTime,
			station_id: $("#stationId").val(),
			company_code: $("#companyCode").val(),
		};
	},
	//根据延迟时间发送请求
	heatEachart: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/alarmCount",
			async: true,
			data: {
				access_token: $.allData.accesstoken,
				station_id: $("#stationId").val(),
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				$.allData.chartData = data;
				$('#heatEachart').Eachart();

			}
		})
	},
	//图表参数
	getVirtulData: function() {
		var data = [];
		for (var time = 0; time < $.allData.chartData.data.length; time++) {
			data.push([
				$.allData.chartData.data[time].data,
				$.allData.chartData.data[time].value
			]);
		}
		return data;
	},
	//图表参数
	calendar: function() {
		var first = $.allData.chartData.data[0].data;
		first = first.split("-")[0];
		var last = $.allData.chartData.data[$.allData.chartData.data.length - 1].data;
		last = last.split("-")[0];
		var data = [];
		if (first == last) {
			data = [
				[{
					left: 100,
					cellSize: [20, 'auto'],
					bottom: 30,
					orient: 'vertical',
					range: first
				}],
				[{
					type: 'heatmap',
					coordinateSystem: 'calendar',
					calendarIndex: 0,
					data: $.getVirtulData()
				}]
			]
		} else {
			data = [
				[{
					left: 100,
					cellSize: [20, 'auto'],
					bottom: 30,
					orient: 'vertical',
					range: first,
					dayLabel: {
						margin: 5,
						nameMap: 'cn'
					},
			        monthLabel:{
			            nameMap: 'cn'
			        }
				}, {
					left: 350,
					cellSize: [20, 'auto'],
					bottom: 30,
					orient: 'vertical',
					range: last,
					dayLabel: {
						margin: 5,
						nameMap: 'cn'
					},
			        monthLabel:{
			            nameMap: 'cn'
			        }
				}],
				[{
					type: 'heatmap',
					coordinateSystem: 'calendar',
					calendarIndex: 0,
					data: $.getVirtulData()
				}, {
					type: 'heatmap',
					coordinateSystem: 'calendar',
					calendarIndex: 1,
					data: $.getVirtulData()
				}]
			]
		}
		return data
	},
	//格式化操作序列
	layerFormatter: function(value) {
		return "<span class='fa fa-book resultFa' style='color:#19b393' data-toggle='tooltip' data-placement='top'></span>"

	},
	//点击图标
	resultInfo: function() {
		$('.resultFa').on('click', function() {
			$.allData.resultId = $(this).parent().parent().children().eq(0).find('span').attr('id')
			$.ajax({
				type: "get",
				url: globalurl + "/v1_0_0/alarmHistory",
				async: true,
				data: {
					access_token: $.allData.accesstoken,
					alarm_history_id: $.allData.resultId
				},
				success: function(data) {
					//console.log(data)
					$.openResult(data)
				}
			});
		})
	},
	//根据返回的数据是否处理做判断
	openResult: function(resultData) {
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
	},

	//点击处理按钮触发事件
	//验证用户输入的信息是否正确
	sureInfo: function() {
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
						access_token: $.allData.accesstoken,
						data: $('.infoDetails').val(),
						alarm_history_id: $.allData.resultId,
						fullname: $.allData.user.fullname
					},
					success: function(data) {
						//console.info(data);
						layer.msg("处理成功", {
							icon: 1
						});
						setTimeout(function() {
							layer.close(resultBox);
						}, 200);
						//$('#alarmList').bootstrapTable("refresh",$.queryParams())
					}
				});
			} else {
				layer.msg("请输入合法的字符");
			}

		})
	}
});
$.init();
//格式化显示数据
function showFormatter(index, value, rows) {
	return "<span id=" + value.log_id + ">" + value.station_name + "</span>"
}