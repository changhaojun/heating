//var globalurl="http://192.168.1.109";
//var globalurl="http://121.42.253.149:18816";
var accessToken = getToken();
//var accessToken="59312dae624d47000583555b";
var xAxisData = []; //存放x轴的数据*/
var tagId = []; //存放标签id
var legendData = []; //存放每一个图标的lengend 
var series = []; //存放每一个标签的数据
var timeData = []; //存放时间
var showId = $("#showId").val();
var maplevel = $("#maplevel").val();
var showName = $("#showName").val();
if (maplevel == 0) {
	showId = "58c20d5f9aa7a32554f770df";
} else {
	showId = "58c20d5f9aa7a32554f770ab";
}
//获取标签
labelCompany();

function labelCompany() {
	$.ajax({
		type: "get",
		url: globalurl + "/v1_0_0/tags",
		dataType: "json",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			level: 0
		},
		success: function(data) {
			//console.log(data)
			tagId = [];
			for (var i = 2; i < data.station_tag.length; i++) {
				var listStr = '<li><b></b>' + data.station_tag[i].tag_name + '</li>'
				$(".selectData").append(listStr);
				tagId.push(data.station_tag[i]._id);
				legendData.push(data.station_tag[i].tag_name);
			}

		}
	});
}

//获取折线图的数据
lineChartData();

function lineChartData() {
	if (maplevel == 0) {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/energy",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				console.log(data);
				lineChart(data)
			}
		});
	} else {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/energy",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				branch_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				console.log(data);
				lineChart(data)
			}
		});
	}

}
//绘制折线图
function lineChart(data) {
	var m = 0
		//console.log(data)
	for (var i in data) {
		series.push({
			name: legendData[i],
			type: 'line',
			smooth: true, //使折线平滑
			// areaStyle:{ normal: {} },//添加图表背景色
			data: data[i].data_value,
			lineStyle: {
				normal: {
					width: 2,
					borderWidth: 10
				}
			}
		});
	}
	timeData = data[1].create_date;
	var newArr = [];
	for (j = 0; j < timeData.length; j++) {
		newArr.push(timeData[j].split(" ")[0]);
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
		grid: {
			left: '2%',
			right: '2%',
			bottom: '6%',
			containLabel: true //使图表随轴增多变化
				//backgroundColor:"#f2d6b8"//给图表设置背景色
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: newArr
		},
		yAxis: {
			type: 'value',
			name: "能耗",
			splitLine: {
				show: false
			}, //去除网格中的坐标线
			axisLabel: {
				//rotate:-45,//倾斜度 -90 至 90 默认为0  
				formatter: '{value}GJ'
			}
		},
		series: series
	};
	myChart.setOption(option, true);
	myChart.hideLoading();
}
//绘制南丁格尔图
diagram();

function diagram() {
	if (maplevel == 0) {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/branchNightingaleCharts",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				//console.log(data);
				for (var i in data) {
					var listStr = '<li><p>' + data[i].tag_name + '</p><div id="diagramChart' + i + '"></div></li>';
					$('#diagram ol').append(listStr)
					diagramChart(i, data[i])
				}
			}
		});
	} else {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/station_chart",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				branch_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				//console.log(data);
				for (var i in data) {
					var listStr = '<li><p>' + data[i].tag_name + '</p><div id="diagramChart' + i + '"></div></li>';
					$('#diagram ol').append(listStr)
					diagramChart(i, data[i])
				}
			}
		});
	}

}

function diagramChart(i, data) {
	//console.log(data)
	var myChart = echarts.init(document.getElementById('diagramChart' + i));
	var dataInfo = [];
	for (var j in data._avg) {
		dataInfo.push({
			value: data._avg[j].data_value,
			name: data._avg[j]._name
		})
	}
	//console.log(dataInfo)
	option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		calculable: true,
		series: [{
			name: '能耗分析',
			type: 'pie',
			radius: [20, 100],
			roseType: 'area',
			label: { //控制是否出现指标
				normal: {
					show: true
				},
				emphasis: {
					show: true,
					length: 3
				}
			},
			labelLine: {
				normal: {
					/*lineStyle: {
					    color: 'rgba(0, 0, 0, 0.3)'
					},*/
					smooth: 0.2,
					length: 5,
					length2: 5
				}
			},
			data: dataInfo
		}]
	};
	myChart.setOption(option);
}

//绘制雷达图
mapRadar()

function mapRadar() {
	if (maplevel == 0) {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/radae_chart",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				//console.log(data);
				mapRadarChart(data);
			}
		});
	} else {
		$.ajax({
			type: "get",
			datatype: "json",
			url: globalurl + "/v1_0_0/radae_chart",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				branch_id: showId,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				//console.log(data);
				mapRadarChart(data);
			}
		});
	}

}

function mapRadarChart(data) {
	var myChart = echarts.init(document.getElementById('mapRadarContent'));
	var value = [];
	var indicator = [];
	var max = data.pop();
	// console.log(data)
	for (var i in data) {
		value.push(data[i].data_value);
		indicator.push({
			name: legendData[i],
			max: max.max_value
		});
	}
	option = {
		tooltip: {},
		radar: {
			//shape: 'circle',
			indicator: indicator,
			name: {
				textStyle: {
					color: '#595959'
				}
			}
		},
		series: [{
			//name: '预算 vs 开销（Budget vs spending）',//tips的标题
			name: '能耗分析',
			type: 'radar',
			// areaStyle: {normal: {}},
			data: [{
				value: value
			}]
		}]
	};
	myChart.setOption(option);
}