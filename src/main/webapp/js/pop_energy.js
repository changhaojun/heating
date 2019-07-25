var accessToken = getToken();
var yAxisData = []; //存放x轴的数据*/
var tagId = [7, 8, 9]; //存放标签id
var legendData = []; //存放每一个图标的lengend 
var series = []; //存放每一个标签的数据
var seriesData = []; //
var timeData = []; //存放时间
var showId = $("#showId").val();
var maplevel = $("#maplevel").val();
var level = $("#maplevel").val();
var code = getUser().company_code;
var result = []; //记录top数据
//maplevel=1
/*if(maplevel==0  ||maplevel==1){
	maplevel=0;
}else{
	maplevel=1;
}*/

//获取折线图的数据
lineChartData();

function lineChartData() {
	maplevel = maplevel - 1;
	initdata = {
		access_token: accessToken,
		_id: showId,
		company_code: code,
		level: maplevel
	}
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/chart",
		async: true,
		crossDomain: true == !(document.all),
		data: initdata,
		success: function(data) {
			//console.log(data);
			var unitData = [];
			var amountData = [];
			timeData = []
			if (data) {
				for (var i in data) {
					amountData.push(data[i].amount)
					unitData.push(data[i].unit)
					timeData.push(data[i].data_time)
				}
				lineChart(unitData);
				areaData(amountData);
			}
		}
	});
}
//绘制折线图

function lineChart(data) {
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
			data: ['热单耗', '水单耗', '电单耗'],
			x: 'right',
			//			        data:[
			//			            {
			//			            	name:'热单耗',
			//			                icon:'diamond'//'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow
			//			            }   
			//			        ]
		},
		grid: {
			height: '80%',
			bottom: '5%',
			width: '84%',
			containLabel: true,
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			axisLine: {
				onZero: false
			},
			data: timeData
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				formatter: '{value} GJ'
			}
		}],
		series: [{
				name: '热单耗',
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 2
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].unit_rh != null) {
							if (data[i].unit_rh.toString().indexOf(".") != -1) {
								value = Number(data[i].unit_rh).toFixed(2);
							} else {
								value = data[i].unit_rh
							}
							result.push(value);
						}

					}
					return result;
				}()
			}, {
				name: '水单耗',
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 2
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].unit_sh != null) {
							if (data[i].unit_sh.toString().indexOf(".") != -1) {
								value = Number(data[i].unit_sh).toFixed(2);
							} else {
								value = data[i].unit_sh
							}
							result.push(value);
						}

					}
					return result;
				}(),
			}, {
				name: '电单耗',
				type: 'line',
				animation: false,
				smooth: true,
				/*areaStyle: {
				    normal: {}
				},*/
				lineStyle: {
					normal: {
						width: 2
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].unit_dh != null) {
							if (data[i].unit_dh.toString().indexOf(".") != -1) {
								value = Number(data[i].unit_dh).toFixed(2);
							} else {
								value = data[i].unit_dh
							}
							result.push(value);
						}

					}
					return result;
				}()
			}

		]
	}
	myChart.setOption(option);

}
//折线面积图
//areaData();
function areaData(data) {
	var myChart = echarts.init(document.getElementById('hotContent'));
	var colors = ['#1AB394', '#26c6da', '#ffa726'];
	option = {
		color: colors,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ["热耗", "电耗", "水耗"],
			x: 'right'
		},
		grid: {
			height: '80%',
			bottom: '5%',
			width: '86%',
			containLabel: true,
		},
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
			type: 'value',
			axisLabel: {
				formatter: '{value} GJ'
			}
		}],
		series: [{
				name: '热耗',
				type: 'line',
				animation: false,
				//smooth:true,
				stack: '能耗',
				// barGap: '-100%',
				areaStyle: {
					normal: {}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].amount_rh != null) {
							if (data[i].amount_rh.toString().indexOf(".") != -1) {
								value = Number(data[i].amount_rh).toFixed(2);
							} else {
								value = data[i].amount_rh
							}
							result.push(value);
						}
					}
					return result;
				}()
			}, {
				name: '水耗',
				type: 'line',
				animation: false,
				// smooth:true,
				stack: '能耗',
				//barGap: '-100%',
				areaStyle: {
					normal: {}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].amount_sh != null) {
							if (data[i].amount_sh.toString().indexOf(".") != -1) {
								value = Number(data[i].amount_sh).toFixed(2);
							} else {
								value = data[i].amount_sh
							}
							result.push(value);
						}

					}
					return result;
				}()
			}, {
				name: '电耗',
				type: 'line',
				animation: false,
				// smooth:true,
				//barGap: '-100%',
				stack: '能耗',
				areaStyle: {
					normal: {}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < data.length; i++) {
						var value;
						if (data[i].amount_dh != null) {
							if (data[i].amount_dh.toString().indexOf(".") != -1) {
								value = Number(data[i].amount_dh).toFixed(2);
							} else {
								value = data[i].amount_dh
							}
							result.push(value);
						}
					}
					return result;
				}()
			}

		]
	}
	myChart.setOption(option);

}

//绘制top进度

if (maplevel == 2) {
	//console.log(maplevel)
	$('#diagram').hide();

} else {
	//console.log(maplevel)
	$('#diagram').show();
	diagram();
}

function diagram() {
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/stationTopData",
		async: true,
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken,
			company_code: code,
			tag_id: '3,2'
		},
		success: function(data) {
			//console.log(data);
			for (var i = 0; i < data.length; i += 5) {
				result.push(data.slice(i, i + 5))
				var j = i;
				if (j >= 5) {
					j = 1;
				}
				diagramTop(j);
			}
		}
	});

}

function diagramTop(j) {
	//console.log(result)
	var max;
	var oWidth; //获取最大值的宽度

	var per1 = [1],
		per2 = [1];
	for (var i in result[j]) {
		max = Math.max(parseInt(result[j][i].data_value));
		var n = parseInt(i) + 1;
		if (n <= 4) {
			if (result[j][n].data_value == null) {
				result[j][n].data_value = 0
			}
			per1.push(parseInt(result[j][n].data_value) / parseInt(result[j][0].data_value));
		}
		var listStr = '<li data-per="' + per1[i] + '"><label>' + result[j][i].station_name + '</label>' + '<div class="circle"></div><div class="circleColor"></div>' + '<div class="progressLine"></div><div class="progressColor"></div>' + '<i>' + Number(result[j][i].data_value).toFixed(2) + 'GJ</i><span>' + result[j][i].total_area + '&nbsp;&nbsp;万㎡</span></li>';
		$('.heatConsum').eq(j).find('ol').append(listStr);
		oWidth = $('.heatConsum').eq(j).find("li .progressLine").width();
		//console.log(oWidth)
		//console.log(oWidth);
		if (i >= 1) {
			var ratio = $('.heatConsum').eq(j).find('li').eq(i).attr('data-per');
			$('.heatConsum').eq(j).find("li .progressColor").eq(i).css('width', ratio * oWidth);
		}
	}

}
//统计数据展示
dataShow();

function dataShow() {
	//console.log(tagId)
	if (maplevel == 2) {
		data = {
			access_token: accessToken,
			_id: showId
		}
	} else if (maplevel == 1) {
		data = {
			access_token: accessToken,
			_id: showId,
			company_code: code
		}
	} else {
		data = {
			access_token: accessToken,
			company_code: code
		}
	}
	$.ajax({
		type: "get",
		datatype: "json",
		url: globalurl + "/v1_0_0/energyCount",
		async: true,
		crossDomain: true == !(document.all),
		data: data,
		success: function(data) {
			//console.log(data);
			if (data) {
				if (data[0].new_value != null) {
					for (var i in data[0].new_value) {
						$(".pull-right ul li").eq(i).find('b').eq(1).html('2016');
						$(".pull-right ul li").eq(i).find('span').eq(1).html(data[0].new_value[i]);
					}
				} else {
					for (var i = 0; i < 3; i++) {
						$(".pull-right ul li").eq(i).find('b').eq(1).html('2016');
						$(".pull-right ul li").eq(i).find('span').eq(1).html('暂无数据').css({
							"font-size": '20px',
							'margin-top': '14px'
						});
					}
				}
				if (data[0].old_value != null) {
					for (var i in data[0].old_value) {
						$(".pull-right ul li").eq(i).find('b').eq(0).html('2015');
						$(".pull-right ul li").eq(i).find('span').eq(0).html(data[0].old_value[i]);
					}
				} else {
					for (var i = 0; i < 3; i++) {
						$(".pull-right ul li").eq(i).find('b').eq(0).html('2015');
						$(".pull-right ul li").eq(i).find('span').eq(0).html('暂无数据').css({
							"font-size": '20px',
							'margin-top': '14px'
						});
					}
				}
			}
		}
	});
}