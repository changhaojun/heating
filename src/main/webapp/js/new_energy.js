//var globalurl="http://121.42.253.149:18816";
//var globalurl='http://192.168.1.109';
var accessToken = getToken();
//var accessToken="59312dae624d47000583555b";
var yAxisData = []; //存放x轴的数据*/
var tagId = [7, 8, 9]; //存放标签id
var legendData = []; //存放每一个图标的lengend 
var series = []; //存放每一个标签的数据
var seriesData = []; //
var timeData = []; //存放时间
var showId = $("#showId").val();
var maplevel = $("#maplevel").val();
var showLevel = $("#maplevel").val();
var showName = $("#showName").val();
if (maplevel == 0 || maplevel == 1) {
	maplevel = 0;
} else {
	maplevel = 1;
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
			level: 2
		},
		success: function(data) {
			//console.log(data)
			//tagId=[];
			for (var i = 6; i < data.station_tag.length; i++) {
				legendData.push(data.station_tag[i].tag_name);
				//tagId.push(data.station_tag[i]._id);
			}
		}
	});
}

//获取折线图的数据
lineChartData();

function lineChartData() {
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/heatingSeason",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			_id: showId,
			tag_id: '[2,7]',
			level: maplevel
		},
		success: function(data) {
			//console.log(data);
			//console.log(data[0].list1)
			seriesData = [];
			timeData = [];
			for (var i in data[0].list1) {
				timeData.push(data[0].list1[i].create_date);
				seriesData.push(data[0].list1[i].data_value);
				yAxisData.push(data[0].list2[i].data_value);
			}

		}
	});

}
//绘制折线图
lineChart();

function lineChart() {
	//		console.log(seriesData)
	var colors = ['#1AB394', '#26c6da', '#ffa726'];
	var myChart = echarts.init(document.getElementById('chartContent'));
	option = {
		color: colors,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: legendData,
		},
		dataZoom: [{
				show: true,
				realtime: true,
				start: 75,
				end: 100
			},

		],
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			axisLine: {
				onZero: false
			},
			data: timeData.map(function(str) {
				return str.replace(' ', '\n')
			})
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
				name: legendData[0],
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 1
					}
				},
				data: seriesData,
				markPoint: {
					data: [{
						type: 'max',
						name: '最大值'
					}, {
						type: 'min',
						name: '最小值'
					}]
				},
				markLine: {
					data: [{
						type: 'average',
						name: '平均值'
					}]
				}
			}, {
				name: legendData[1],
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 1
					}
				},
				data: [],
			}, {
				name: legendData[2],
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 1
					}
				},
				data: [],
			}

		]
	}
	myChart.setOption(option);

}
//折线面积图
areaData();

function areaData() {
	var myChart = echarts.init(document.getElementById('hotContent'));
	var colors = ['#1AB394'];
	option = {
		color: colors,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ["热耗"]
		},
		dataZoom: [{
				show: true,
				realtime: true,
				start: 75,
				end: 100
			},

		],
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			axisLine: {
				onZero: false
			},
			data: timeData.map(function(str) {
				return str.replace(' ', '\n')
			})
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
				name: '热耗',
				type: 'line',
				animation: false,
				smooth: true,
				areaStyle: {
					normal: {}
				},
				lineStyle: {
					normal: {
						width: 5
					}
				},
				data: yAxisData,
			}

		]
	}
	myChart.setOption(option);

}

//绘制南丁格尔图

if (showLevel == 0) {
	console.log(showLevel)
	$('#diagram').show();
	diagram();
} else {
	//console.log(showLevel)
	$('#diagram').hide();
}

function diagram() {
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/parentCompanyNightingaleCharts",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			company_id: showId,
			tag_id: '[7,8,9]'
		},
		success: function(data) {
			//console.log(data);
			for (var i in data) {
				if (data[i]._avg.length > 0) {
					var listStr = '<li><p>' + data[i].tag_name + '</p><div id="diagramChart' + i + '"></div></li>';
					$('#diagram ol').append(listStr)
					diagramChart(i, data[i])
				}

			}
		}
	});

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
					lineStyle: {
						color: 'rgba(0, 0, 0, 0.3)'
					},
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
//统计数据展示
dataShow();

function dataShow() {
	//console.log(tagId)

	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/energy_count",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			_id: showId,
			tag_id: '[7,8,9]',
			level: maplevel
		},
		success: function(data) {
			//console.log(data);
			if (data) {
				for (var i in data) {
					if (data[i].heat_per_area_new.length > 0) {
						var listStr = '<li><dl><dt>' + data[i].tag_name + '</dt><dd><span>' + data[i].heat_per_area_new + 'J</span><b>2015 Year</b></dd>' + '<dd><span>' + data[i].heat_per_area_old + 'J</span><b>2016 Year</b></dd></dl></li>';
						$(".pull-right ul").append(listStr);
					} else {
						data[i].heat_per_area_new = '暂无数据';
						data[i].heat_per_area_old = '暂无数据';
						var listStr = '<li ><dl><dt>' + data[i].tag_name + '</dt><dd><span style="font-size:16px;margin-top: 18px;">' + data[i].heat_per_area_new + '</span><b>2015 Year</b></dd>' + '<dd><span style="font-size:16px;margin-top: 18px;">' + data[i].heat_per_area_old + '</span><b>2016 Year</b></dd></dl></li>';
						$(".pull-right ul").append(listStr);
					}

				}
			}

			/*var listStr='<li><dl><dt>'+data.tag_name+'</dt><dd><span>'+data.heat_per_area_new+'J</span><b>2017 Year</b></dd>'
				+'<dd><span>'+data.heat_per_area_old+'J</span><b>2017 Year</b></dd></dl></li>';
			$(".pull-right li").eq(0).before(listStr);*/
		}
	});
}