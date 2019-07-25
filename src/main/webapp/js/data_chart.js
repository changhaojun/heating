var stationId = $("#stationId").val();
var hotNum = $("#hotNum").val(); //默认选中的标签的id
var tagLevel = $("#tagLevel").val(); //标签级别
var startTime, endTime;
var accessToken = getToken();
var idArr = []; //标签id
var onOff = true;
var chartArr = []; //存放每一次请求到的所有图表信息
var dataUnit = []; //存放每一次请求到的单位
var maxMin = []; //存放图表数据的最大值和最小值
var obj = []; //存放图表的value
var unitNme = []; //存放转化成汉字的单位
var objData = []; //存放每一个y轴的数据
var legendData = []; //存放每一个图标的lengend
var series = []; //存放每一个y轴的数据
var idName = ""; //存放不同级别的id名
var tagName;

var startHours, endHours;

//获取当前时间
function fn(s) {
	return s < 10 ? '0' + s : s
}
//创建时间对象
var myDate = new Date();
//获取当前的年
var year = myDate.getFullYear();
//获取当前的月(0-11)
var month = myDate.getMonth() + 1;
//获取日(1-31)
var day = myDate.getDate();
//获取小时(0-23)
var hour = myDate.getHours();
//获取分(0-59)
var minute = myDate.getMinutes();
var second = myDate.getSeconds();
var timeCatre = "";

function fn1(flag) {
	return flag > 12 ? 'PM' : 'AM'
}
//hour<12 ? timeCatre="AM":timeCatre="PM";

//转换初始化时间值的格式
startTime = year + "$" + fn(month) + "$" + fn(day)+ "$" + fn(hour - hour) + ":" + fn(minute - minute)+":"+fn(second-second);
endTime = year + "$" + fn(month) + "$" + fn(day)+ "$" + fn(hour) + ":" + fn(minute )+":"+fn(second);
initstartTime = year + '-' + fn(month) + "-" + fn(day) + ' ' + fn1(hour - hour) + ' ' + fn(hour - hour) + ':' + fn(minute - minute);
initendTime = year + '-' + fn(month) + "-" + fn(day) + ' ' + fn1(hour) + ' ' + '23:59';
$("#reservationtime").val(initstartTime + " - " + initendTime);

chartTag();
//获取图标的标签
function chartTag() {
	tagLevel = parseInt(tagLevel) - 1;
	$.ajax({
		type: "get",
		datatype: "json",
		crossDomain: true == !(document.all),
		url: globalurl + '/v1_0_0/tags',
		data: {
			access_token: accessToken,
			level: tagLevel
		},
		success: function(data) {
			//			console.log(data);
			tags = data;
			for (var i = 0; i < tags.length; i++) {
				idArr.push(tags[i].tag_id);
				var tagList = '<li id="' + tags[i].tag_id + '" onclick="chartData(&apos;' + tags[i].tag_id + '&apos;)">' + tags[i].tag_name + '</li>';
				$(".selectData").append(tagList);
			}
			$(".selectData").find("#" + hotNum).addClass("selectFocus");
			chartData(hotNum)
				//			console.log(hotNum)
		}
	});
}
//点击获取时间
$(document).ready(function() {
		$('#reservationtime').daterangepicker({
			showWeekNumbers: false, //是否显示第几周  
			timePicker: true, //是否显示小时和分钟  
			timePickerIncrement: 30, //时间的增量，单位为分钟  
			format: 'YYYY-MM-DD A hh:mm', //显示格式
			language: 'zh-CN' //显示中文
		}, function(start, end, label) {
			startDay = new Date(start).getFullYear() + "$" + fn(new Date(start).getMonth() + 1) + "$" + fn(new Date(start).getDate());
			endDay = new Date(end).getFullYear() + "$" + fn(new Date(end).getMonth() + 1) + "$" + fn(new Date(end).getDate());
			startHour = new Date(start).getFullYear() + "$" + fn(new Date(start).getMonth() + 1) + "$" + fn(new Date(start).getDate()) + "$" + fn(new Date(start).getHours()) + ":" + fn(new Date(start).getMinutes()) + ":" + fn(new Date(start).getSeconds());
			endHour = new Date(end).getFullYear() + "$" + fn(new Date(end).getMonth() + 1) + "$" + fn(new Date(end).getDate()) + "$" + fn(new Date(end).getHours()) + ":" + fn(new Date(end).getMinutes()) + ":" + fn(new Date(end).getSeconds());

			startSec = fn(new Date(start).getHours()) + ":" + fn(new Date(start).getMinutes()) + ":" + fn(new Date(start).getSeconds());
			endSec = fn(new Date(end).getHours()) + ":" + fn(new Date(end).getMinutes()) + ":" + fn(new Date(end).getSeconds());

			var startDays = startTime.substring(0, 10)
			var endDays = endTime.substring(0, 10)

			//          console.log(startTime)
			//          console.log(endTime)
			//          console.log(startHour)
			//          console.log(endHour)

			if (startTime.length == 10) {
				if (startHours == undefined) {
					if (startSec == '00:00:00' && endSec == '23:59:59') {
						if (startDay == startDays && endDay == endDays) {

						} else {
							startTime = startDay;
							endTime = endDay;
							changeDate()
						}
					} else {
						startTime = startHour;
						endTime = endHour;
						changeHour()
					}
				} else {
					if (startSec == startHours && endSec == endHours) {
						if (startDay == startDays && endDay == endDays) {

						} else {
							startTime = startDay;
							endTime = endDay;
							changeDate()
						}
					} else {
						startTime = startHour;
						endTime = endHour;
						changeHour()
					}
				}
			} else {
				startHours = startTime.substring(11, 20)
				endHours = endTime.substring(11, 20)
				if (startSec == startHours && endSec == endHours) {
					if (startDay == startDays && endDay == endDays) {

					} else {
						startTime = startDay;
						endTime = endDay;
						changeDate()
					}
				} else {
					startTime = startHour;
					endTime = endHour;
					changeHour()
				}
			}
		})
	})
	//天发生改变图表的变化
function changeDate() {
	echarts.init(document.getElementById("chartContent")).clear();
	chartArr = [];
	legendData = [];
	maxMin = [];
	//	console.log(startTime)
	//	console.log(endTime)
	var tagId = [];
	for (var j = 0; j < $(".selectData").find("li").length; j++) {
		if ($(".selectData").find("li").eq(j).hasClass("selectTag")) {
			tagId.push($(".selectData").find("li").eq(j).attr('id'))
		}
	}
	for (var i = 0; i < tagId.length; i++) {
		$.ajax({
			type: "get",
			dataType: "json",
			crossDomain: true == !(document.all),
			url: globalurl + '/v1_0_0/dayDatas',
			async: false,
			data: {
				access_token: accessToken,
				_id: stationId,
				start_time: startDay,
				end_time: endDay,
				tag_id: tagId[i],
				level: $("#tagLevel").val()
			},
			success: function(data) {
				//				console.log(data)
				if (data.length == 0) {

				} else {
					chartArr.push(data);
					for (var j = 0; j < tags.length; j++) {
						if (tagId[i] == tags[j].tag_id) {
							legendData.push(tags[j].tag_name)
						}
					}
					maxMin.push(data[data.length - 1]);
					initChart(legendData)
				}
			}

		})
	}
}
//小时发生变化
function changeHour() {
	echarts.init(document.getElementById("chartContent")).clear();
	chartArr = [];
	legendData = [];
	maxMin = [];
	//	console.log(startTime)
	//	console.log(endTime)
	var tagId = [];
	for (var j = 0; j < $(".selectData").find("li").length; j++) {
		if ($(".selectData").find("li").eq(j).hasClass("selectTag")) {
			tagId.push($(".selectData").find("li").eq(j).attr('id'))
		}
	}
	for (var i = 0; i < tagId.length; i++) {
		$.ajax({
			type: "get",
			dataType: "json",
			crossDomain: true == !(document.all),
			url: globalurl + '/v1_0_0/hourDatas',
			async: false,
			data: {
				access_token: accessToken,
				_id: stationId,
				start_time: startHour,
				end_time: endHour,
				level: $("#tagLevel").val(),
				tag_id: tagId[i]
			},
			success: function(data) {
				//				console.log(data)
				if (data.length == 0) {

				} else {
					if (data.code != 400003) {
						chartArr.push(data);
						for (var j = 0; j < tags.length; j++) {
							if (tagId[i] == tags[j].tag_id) {
								legendData.push(tags[j].tag_name)
							}
						}
						maxMin.push(data[data.length - 1]);
						initChart(legendData)
					}
				}
			}
		})
	}
}
//当前图表以及点击标签生成图表
function chartData(id) {
	$(".selectData").find("li").removeClass("selectFocus");
	$("#" + id).toggleClass("selectTag");
	if (startTime.length == 10) {
		if ($("#" + id).hasClass("selectTag") || $("#" + id).hasClass("selectFocus")) {
			$.ajax({
				type: "get",
				datatype: "json",
				url: globalurl + "/v1_0_0/dayDatas",
				crossDomain: true == !(document.all),
				data: {
					access_token: accessToken,
					_id: stationId,
					tag_id: id,
					start_time: startTime,
					end_time: endTime,
					level: $("#tagLevel").val()
				},
				success: function(data) {
					//					console.log(data)
					if (data.length == 0 || data[data.length - 1].max_value == null) {
						layer.msg('该段时间内没有数据,请重新选择！', {
							icon: 2,
							time: 1000
						})
					} else {
						chartArr.push(data);
						legendData.push($("#" + id).html());
						maxMin.push(data[data.length - 1]);
						initChart(legendData);
					}
				}
			})
		} else {
			if ($(".selectData").find("li").is('.selectTag')) {
				for (var j = 0; j < chartArr.length; j++) {
					if (id == chartArr[j][0].tag_id) {
						chartArr.splice(j, 1)
						legendData.splice(j, 1)
						maxMin.splice(j, 1)
					}
				}
				initChart(legendData);
			} else {
				echarts.init(document.getElementById("chartContent")).clear();
				chartArr = [];
				legendData = [];
				maxMin = [];
			}
		}
	} else {
		if ($("#" + id).hasClass("selectTag") || $("#" + id).hasClass("selectFocus")) {
			$.ajax({
				type: "get",
				datatype: "json",
				url: globalurl + '/v1_0_0/hourDatas',
				crossDomain: true == !(document.all),
				data: {
					access_token: accessToken,
					_id: stationId,
					tag_id: id,
					start_time: startTime,
					end_time: endTime,
					level: $("#tagLevel").val()
				},
				success: function(data) {
					//					console.log(data)

					if (data.length == 0 || data[data.length - 1].max_value == null) {
						layer.msg('该段时间内没有数据,请重新选择！', {
							icon: 2,
							time: 1000
						})
					} else {
						chartArr.push(data);
						legendData.push($("#" + id).html());
						maxMin.push(data[data.length - 1]);
						initChart(legendData);
					}
				}
			})
		} else {
			if ($(".selectData").find("li").is('.selectTag')) {
				for (var j = 0; j < chartArr.length; j++) {
					if (id == chartArr[j][0].tag_id) {
						chartArr.splice(j, 1)
						legendData.splice(j, 1)
						maxMin.splice(j, 1)
					}
				}
				initChart(legendData);
			} else {
				echarts.init(document.getElementById("chartContent")).clear();
				chartArr = [];
				legendData = [];
				maxMin = [];
			}
		}
	}
}

//图表的数据项和配置
function initChart(legendData) {
	if (chartArr == "") {
		echarts.init(document.getElementById("chartContent")).clear();
		chartArr = [];
		legendData = [];
		maxMin = [];
	} else {
		var yAxis = [];
		series = [];
		objData = [];
		dataUnit = [];
		for (var j = 0; j < chartArr.length; j++) {
			obj = [];
			for (var n = 0; n < chartArr[j].length - 1; n++) {
				obj.push(chartArr[j][n].data_value)
			}
			objData.push(obj);
			if (chartArr.length > 0) {
				dataUnit.push(chartArr[j][0].data_unit);
			}
		}
		//		console.log(dataUnit)
		unitNme = [];
		for (var j = 0; j < legendData.length; j++) {
			var m = -1;
			//将请求到的数据添加到y轴的数据中
			yAxis.push({
				type: 'value',
				name: legendData[j],
				splitLine: {
					show: false
				}, //去除网格中的坐标线
				min: Math.floor(maxMin[j].min_value),
				max: Math.ceil(maxMin[j].max_value),
				offset: 50 * j,
				position: 'left',
				axisLabel: {
					rotate: 45, //倾斜度 -90 至 90 默认为0  
					formatter: '{value}' + dataUnit[j]
				}
			});
			//遍历每一个标签看是否被选中，如果选中绘制折线，没有选中不绘制折线
			series.push({
				name: legendData[j],
				type: 'line',
				smooth: true, //使折线平滑
				yAxisIndex: j,
				//areaStyle:{ normal: {} },//添加图表背景色
				data: objData[j]
			});

		}

		var dateInfo = [];
		for (var i = 0; i < chartArr[0].length - 1; i++) {
			dateInfo.push(chartArr[0][i].create_date)
		}
		var myChart = echarts.init(document.getElementById("chartContent"));
		var option = {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { //刻度指标
					type: 'cross'
				}
			},
			legend: {
				data: legendData
			},
			grid: {
				left: '3%',
				right: '6%',
				bottom: '6%',
				containLabel: true //使图表随轴增多变化
					//backgroundColor:"#f2d6b8"//给图表设置背景色
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: dateInfo
			},
			yAxis: yAxis,
			series: series

		};
		myChart.setOption(option, true);
		myChart.hideLoading();
	}
}