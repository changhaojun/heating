var stationId = $("#stationId").val();
var accessToken = getToken();
var chartArr = []; //存放每一次请求到的所有图表信息
var maxMin = []; //存放图表数据的最大值和最小值以及标签信息
var legendData = []; //存放每一个图标的lengend
var series = []; //存放每一个y轴的数
var backData = []; //存放一网回压的数据
var proData = []; //存放一网供压的数据
var backTimeData = []; //存放一网回压时间段的数据
var proTimeData = []; //存放一网供压时间段的数据
var elevData = []; //存放地势标高的数据
var timeData = []; //存放时间段的数据
var xAxisData = []; //存放x轴的数据
var sizeData; //动态获取时间指标
var timeNum; //记录拖拽的时间点
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

//console.log(hour)
hour < 12 ? timeCatre = "AM" : timeCatre = "PM";

//转换初始化时间值的格式
startTime = year + "$" + fn(month) + "$" + (fn(day));
newTime = startTime;
//newTime="2017$04$26";
endTime = year + "$" + fn(month) + "$" + (fn(day));
initstartTime = year + '-' + fn(month) + "-" + fn(day);
$("#reservationtime").val(initstartTime);
//点击获取时间
$('#reservationtime').daterangepicker({
	singleDatePicker: true
}, function(start, end, label) {
	newTime = new Date(start).getFullYear() + "$" + fn(new Date(start).getMonth() + 1) + "$" + fn(new Date(start).getDate());
	chartData();
	setWidth();
	//	toPit();
});

//当前图表以及点击标签生成图表
$("#dragLine").hide();
chartData();

function chartData() {
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/twoWaterPressure",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			_id: stationId,
			time: newTime
		},
		success: function(data) {
			//console.log(data);
			$(".selectData").empty();
			//maxMin=data.pop();//删除最后一个元素
			chartArr = data;
			for (var i in maxMin.tag_name) {
				var listStr = '<li><em></em>' + maxMin.tag_name[i] + '</li>'
				$(".selectData").append(listStr);
				legendData.push(maxMin.tag_name[i]);
			}
			backData = [], proData = [];
			xAxisData = [];
			elevData = [];
			var nullNum = 0;
			//console.log(chartArr.length)
			for (var i in chartArr) {
				xAxisData.push(chartArr[i].station_name);
				backTimeData = [], proTimeData = [];
				if (chartArr[i].back_pressure_value.length == 0 && chartArr[i].back_pressure_value.length == 0) {

					backData.push('')
					proData.push('')
					elevData.push(chartArr[i].station_elevation_value)
					nullNum++;
				} else {
					$("#dragLine").show();
					for (var j = 0; j < chartArr[i].back_pressure_value.length; j++) {
						backTimeData.push(chartArr[i].back_pressure_value[j]); //一网回水所有时间段的数据
						proTimeData.push(chartArr[i].pro_pressure_value[j]); //一网供水所有时间段的数据
					}
					elevData.push(chartArr[i].station_elevation_value); //地势标高
					backData.push(backTimeData);
					proData.push(proTimeData);
					if (chartArr[i].time.length > 0) {
						timeData = chartArr[i].time;
					}
					timeNum = timeData.length - 1;

				}
				if (backData.length == chartArr.length) {
					toPit();
				}
				if (nullNum == chartArr.length) {
					layer.msg('该段时间内没有数据,请重新选择！', {
						icon: 2,
						time: 3000,
					});
					echarts.init(document.getElementById('chartContent')).clear();
					$("#dragLine").hide();
				}
			}

			/*console.log(elevData)
			console.log(xAxisData)
			console.log(backData)
			console.log(proData)*/
		}
	});

}
//动态设置拖拽的总宽度以及动态居中
setWidth();

function setWidth() {
	sizeData = timeData.length;
	if (sizeData > 0) {
		var time, num, spanText;
		var newArr = [];
		//console.log(timeData)

		$(".dragSpan").empty();
		for (i = 0; i < timeData.length; i++) {
			newArr.push(parseInt(timeData[i].substring(11, 13)));
			$(".dragSpan").append("<span>" + newArr[i] + "</span>");
		}

		/*for(i=0;i<newArr.length;i++){
				$("#dragLine").append("<span>"+newArr[i]+"</span>")
			}*/
		var spanWidth = Math.floor($("#dragLine").width() / sizeData);
		$("#dragLine span").css({
			"position": "relative",
			"top": "-14px",
			"width": spanWidth
		});
		var initLeft = $("#dragLine span").eq(sizeData - 1).offset().left - Math.floor($("#dragLine ").offset().left) - 7;
		//	console.log(initLeft)
		if ($("#reservationtime").val() != initstartTime) {
			$("#drag").css({
				"left": initLeft
			});
		}
	}

}

//图表

function toPit() {
	var myChart = echarts.init(document.getElementById("chartContent"));
	var colors = ['#ce6c49', '#80b2b9', '#1495d6'];

	option = {
		color: colors, //重新定义颜色
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'cross' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
			}
		},
		legend: {
			data: ['供水压力', '回水压力', '地势标高'] //图表标题
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: 60,
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: true,
			axisLabel: {
				interval: 0,
				rotate: -45,
				textStyle: {
					fontSize: 12, // 让字体变大
					fontFamily: "Microsoft YaHei",
					color: "#000"
				}
			},
			data: function() {
				var result = [];
				for (var i = 0; i < xAxisData.length; i++) {
					result.push(xAxisData[i]);
					//console.log(result)
				}
				return result;
			}()
		}],
		yAxis: [{
			type: 'value',
			//splitLine: { show: false }, //去除网格中的坐标线
			name: '压力',
			axisLabel: { //调整x轴的lable
				//rotate:-45,//倾斜度 -90 至 90 默认为0
				formatter: '{value}Kpa',
				textStyle: {
					fontSize: 12, // 让字体变大
					fontFamily: "Microsoft YaHei",
					color: "#000"
				}
			}
		}, {
			type: 'value',
			name: '高度',
			//min: maxMin.station_elevation_min_value,
			//max: maxMin.station_elevation_max_value,
			splitLine: {
				show: false
			}, //去除网格中的坐标线
			axisLabel: {
				//rotate:-45,//倾斜度 -90 至 90 默认为0
				formatter: '{value}m',
				textStyle: {
					fontSize: 12, // 让字体变大
					fontFamily: "Microsoft YaHei",
					color: "#000"
				}
			}
		}, ],
		series: [{
			name: '供水压力', //tips名称
			type: 'bar', //图表形状
			//	stack: '压力',//表示可堆叠
			barGap: '-100%',
			yAxisIndex: 0,
			data: function() {
				var result = [];
				for (var i = 0; i < proData.length; i++) {
					result.push(proData[i][timeNum]);
					//console.log(result)
				}
				return result;
			}()
		}, {
			name: '回水压力',
			type: 'bar',
			yAxisIndex: 0,
			//	stack: '压力',
			data: function() {
				var result = [];
				for (var i = 0; i < backData.length; i++) {
					result.push(backData[i][timeNum]);
					//	console.log(result)
				}
				return result;
			}()
		}, {
			name: '地势标高',
			type: 'line',
			yAxisIndex: 1,
			smooth: true, //使折线平滑
			data: elevData,
			itemStyle: { //折线拐点的样式
				normal: {
					color: '#20aefc', //折线拐点的颜色
				}
			},

		}]
	};

	myChart.setOption(option);
}

//拖拽
drag();

function drag() {
	var disX = 0;
	var disY = 0;
	var $box = $("#drag");
	var oldDIS = 0; //用来记录上一次移动的距离的变量
	var dataTime = []; //记录应当显示那几个小时的数据  暂时分为4段 一次显示6小时数据  小时变化一次重绘一次
	$box.mousedown(function(ev) {

		disX = ev.pageX - $(this).offset().left;
		var maxwid = $("#dragLine").width();
		maxwid1 = $("#drag").width();
		$(document).on({
			"mousemove": function(ev) {
				var moveDis = ev.pageX - disX - $("#dragLine").offset().left
				if (moveDis <= 0) {
					moveDis = 0;
				} else if (moveDis >= (maxwid - maxwid1)) {
					moveDis = maxwid - maxwid1
				};
				$box.css({
					left: moveDis
				});
				//console.log(newDIS)
				if (parseInt(moveDis / (maxwid / sizeData)) != timeNum) {
					//console.log(parseInt(moveDis/(maxwid/sizeData)))
					timeNum = parseInt(moveDis / (maxwid / sizeData));
					toPit();
				}

			},
			"mouseup": function() {
				$(document).off();
			}
		});
		return false;
	});
}