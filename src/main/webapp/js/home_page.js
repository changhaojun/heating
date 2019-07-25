var accessToken = getToken();
var allData = {
	companyCode: getUser().company_code,
	userId: getUser().user_id,
	companyId: getUser().company_id,
	listData: {},
	size: 0,
	animateNum: 0,
	timer: null,
	distance: 0,
	chartData: [],
	trendData: [],
	chartLine: {},
	chartCircle: [],
	trendChart: {},
	colors: ['#5ca5b4', '#f4bf30', "#8cc9b9"],
	cityId: getUser().city_id,
	startTime: '', //天气的开始时间
	endTime: '', //天气的结束时间
	fontColor: ""
}
$.fn.extend({
	animateList: function() {
		var num = 0;
		var topDis = $(".slideList").height();
		allData.timer = setInterval(function() {
			num++;
			if (num >= allData.animateNum) {
				num = 0;
				$(".slideList").parent().css("top", topDis);
			}
			allData.distance = num * topDis;
			$(".slideList").parent().animate({
				top: -allData.distance + "px"
			}, "slow");
		}, 2000);
	},
	clearTimer: function() {
		$(this).on({
			'mouseover': function() {
				clearInterval(allData.timer);
			},
			'mouseout': function() {
				if (allData.animateNum == 1) {
					clearInterval(allData.timer);
				} else {
					$(".carousel ul").animateList();
				}
			}
		})
	},
	topChart: function(chartData, n) {
		var name = '';
		switch (n) {
			case 0:
				name = '二网供温';
				break;
			case 1:
				name = '一网温差';
				break;
			case 2:
				name = '二网温差';
				break;
		}
		allData.chartLine = echarts.init($(this)[0]);
		option = {
			color: allData.colors,
			tooltip: {
				trigger: 'axis',
				/* axisPointer: { // 坐标轴指示器，坐标轴触发有效
				     type: 'cross'// 默认为直线，可选为：'line' | 'shadow'|'cross'
				 }*/

			},
			grid: {
				height: "90%",
				width: "90%",
				bottom: '5%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				// boundaryGap: false,//折线与坐标轴的距离为0
				axisTick: {
					alignWithLabel: true //保证刻度线与刻度标签的对齐
				},
				//  splitLine: { show: true }, //去除网格中的坐标线
				axisLine: {
					lineStyle: {
						color: allData.colors[n]
					}
				},
				axisLabel: { //改变想轴label的字体样式
					//interval:0,
					textStyle: {
						color: '#bbbbbb'
					}
				},
				data: function() {

					var result = [];
					for (var i = 0; i < chartData.length; i++) {

						result.push(chartData[i].station_name);
					}

					return result;
				}()
			}],
			yAxis: [{
					type: 'value',
					axisLine: {
						lineStyle: {
							color: allData.colors[n]
						}
					},
					splitLine: {
						show: true,
						lineStyle: { //改变网格的样式
							color: "#eee",
							width: 1,
							type: 'solid'
						}
					},
					axisLabel: {
						textStyle: { //改变想轴label的字体样式
							color: '#bbbbbb'
						},
						// formatter: '{value}℃'
					}
				}, {
					type: 'value',

					splitLine: {
						show: false
					}, //去除网格中的坐标线
					axisLine: { //改变轴的颜色
						lineStyle: {
							color: allData.colors[n]
						}
					},
					axisLabel: {
						//rotate:-45,//倾斜度 -90 至 90 默认为0
						//formatter: '{value}万㎡',
						textStyle: {
							fontSize: 12, // 让字体变大
							fontFamily: "Microsoft YaHei",
							color: '#bbbbbb'
						}
					}
				},

			],
			series: [{
				name: name,
				type: 'bar',
				yAxisIndex: 0,
				//smooth:true,//使折线平滑
				itemStyle: { //改变柱状图的颜色以及透明度
					normal: {
						color: allData.colors[n],
						opacity: 0.5
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < chartData.length; i++) {
						result.push(chartData[i].data_value);
					}
					return result;
				}()
			}, {
				name: '面积',
				type: 'line',
				yAxisIndex: 1,
				areaStyle: {
					normal: {
						color: allData.colors[n],
						opacity: 0.55
					}
				},
				itemStyle: {
					normal: {
						color: allData.colors[n],
						lineStyle: {
							color: allData.colors[n],
							opacity: 0
						}
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < chartData.length; i++) {
						result.push(chartData[i].total_area);
					}
					return result;
				}()
			}]
		};
		allData.chartLine.setOption(option)
	},
	//热量趋势图
	heaTrendChart: function() {
		allData.trendChart = echarts.init($(this)[0]);
		var colors = ['#f4b905', '#67adb9'];
		option = {
			color: colors, //重新定义颜色
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'cross' // 默认为直线，可选为：'line' | 'shadow' | 'cross'
				}
			},
			legend: {
				data: ['热耗量', '最高温度', '最低温度'] //图表标题
			},
			grid: {
				left: '3%',
				right: '4%',
				height: '75%',
				bottom: 6,
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				//boundaryGap : false,//使折线图与坐标轴无距离
				axisLabel: {
					interval: 0,
					//rotate:-45
					textStyle: {
						fontSize: 12, // 让字体变大
						fontFamily: "Microsoft YaHei",
						color: "#bbb"
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < allData.trendData.length; i++) {
						var m = allData.trendData[i].data_time.toString().indexOf('-') + 1;
						result.push(allData.trendData[i].data_time.slice(m));
					}
					return result;
				}()
			}],
			yAxis: [{
				type: 'value',
				//splitLine: { show: false }, //去除网格中的坐标线
				name: '热量',
				splitLine: {
					show: true,
					lineStyle: { //改变网格的样式
						color: "#eee",
						width: 1,
						type: 'solid'
					}
				},
				axisLine: { //改变轴的颜色
					lineStyle: {
						color: '#1ab394'
					}
				},
				axisLabel: { //调整x轴的lable
					//rotate:-45,//倾斜度 -90 至 90 默认为0
					formatter: '{value}GJ',
					textStyle: {
						fontSize: 12, // 让字体变大
						fontFamily: "Microsoft YaHei",
						color: "#1ab394"
					}
				}
			}, {
				type: 'value',
				name: '温度',
				splitLine: {
					show: false
				}, //去除网格中的坐标线
				axisLine: { //改变轴的颜色
					lineStyle: {
						color: '#f7c85c'
					}
				},
				axisLabel: {
					//rotate:-45,//倾斜度 -90 至 90 默认为0
					formatter: '{value}℃',
					textStyle: {
						fontSize: 12, // 让字体变大
						fontFamily: "Microsoft YaHei",
						color: "#f7c85c"
					}
				}
			}, ],
			series: [{
				name: '最高温度', //tips名称
				type: 'bar', //图表形状
				//	stack: '压力',//表示可堆叠
				barGap: '-100%',
				yAxisIndex: 1,
				itemStyle: { //改变柱状图的颜色以及透明度
					normal: {
						opacity: 0.8
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < allData.trendData.length; i++) {
						result.push(allData.trendData[i].temp_high);
					}
					return result;
				}()
			}, {
				name: '最低温度',
				type: 'bar',
				yAxisIndex: 1,
				//	stack: '压力',
				itemStyle: { //改变柱状图的颜色以及透明度
					normal: {
						opacity: 0.8
					}
				},
				data: function() {
					var result = [];
					for (var i = 0; i < allData.trendData.length; i++) {
						result.push(allData.trendData[i].temp_low);
					}
					return result;
				}()
			}, {
				name: '热耗量',
				type: 'line',
				yAxisIndex: 0,
				smooth: true, //使折线平滑
				data: function() {
					var result = [];
					for (var i = 0; i < allData.trendData.length; i++) {
						result.push(allData.trendData[i].data_value);
					}
					return result;
				}(),
				itemStyle: { //折线拐点的样式
					normal: {
						color: '#1ab394', //折线拐点的颜色
					}
				},

			}]
		};

		allData.trendChart.setOption(option);

	},
	nomalOnlineChart: function(data, n) {
		var abnormalData = "";
		var normalData = "";
		var abnormal = "";
		var normal = "";
		var oneColor = ['#ec465a', '#8ac0ca'];
		var twoColor = ["#9d9d9d", "#1ab394"];
		switch (n) {
			case 0:
				abnormalData = data.abnormalCount, abnormal = "异常", normalData = data.normalCount, normal = "正常", color = oneColor;
				break;
			case 1:
				abnormalData = data.offlineCount, abnormal = "掉线", normalData = data.onlineCount, normal = "在线", color = twoColor;
				break;
		}
		allData.chartCircle = echarts.init($(this)[0]);		
		option = {
			color: color,
			series: [{
				hoverAnimation: false,
				name: '访问来源',
				type: 'pie',
				radius: ['45%', '60%'],
				label: {
					normal: {
						formatter: '  {b} \n{d}%  ',
						rich: {

							b: {
								fontSize: 12,
								lineHeight: 14,

							},
							per: {
								color: '#eee',
								backgroundColor: '#334455',
								padding: [7, 5],
								borderRadius: 2
							}
						}
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '12',
							fontWeight: 'normal',
						}
					}
				},
				data: [{
					value: abnormalData,
					name: abnormal
				}, {
					value: normalData,
					name: normal
				}]
			}]
		};
		allData.chartCircle.setOption(option);
	},
	//关注信息打开组态
	scada: function(id, name, scadaId) {
		$(this).click(function() {
			if (scadaId) {
				layer.open({
					type: 2,
					title: name,
					closeBtn: 1,
					shadeClose: true,
                    maxmin:true,
					skin: 'layui-layer-lan',
					shade: 0.8,
					area: ['90%', '90%'],
					content: "/list/group?_id=" + scadaId + "&station_id=" + id + "&station_name=" + encodeURIComponent(name) //iframe的url
				});
			} else {
				layer.msg('暂无组态', {
					icon: 0,
					time: 1000
				})
			}
		})

	}

});

$.extend({
	init: function() {
		$.concernData();
		$(".carousel ul").clearTimer();
		$.getAllData();
		$.getTopData();
		$.allChart();
		$.progressBar();
		$.heaTrend();
		$.weatherData();
		$.nomalOnline();
		$.oneChart();
	},
	//获取关注的信息
	concernData: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/followStation",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken
			},
			success: function(data) {
				if (data.length) {
					allData.size = data.length;
					allData.animateNum = Math.ceil(allData.size / 5);
					allData.listData = data;
					var result = [];
					for (var i = 0, len = data.length; i < len; i += 5) {
						result.push(data.slice(i, i + 5));
					}
					for (var i = 0; i < allData.animateNum; i++) {
						var listStr = '<li class="slideList"><ol></ol></li>';
						$(".carousel ul").append(listStr)
						for (var j in result[i]) {
							var value = '';
							if (result[i][j].data_value == null) {
								value = "暂无数据";
							} else {
								value = result[i][j].data_value + "℃";
							}
							if (result[i][j].abnormity_id !== null) {
								abnormity_id = '<i style="background:url(../img/abnormal.png) no-repeat">异常</i>';
								fontColor = "abnormalColor";
							} else {
								abnormity_id = "";
								fontColor = "normalColor";
							}
							var str = '<li class="' + fontColor + '"><span>' + result[i][j].station_name + '</span><span>' + abnormity_id + '</span><span>' + result[i][j].tag_name + '</span>' + '<span>' + value + '</span></li>';
							$(".slideList ol").eq(i).append(str);
							$(".slideList ol").eq(i).find('li').eq(j).scada(result[i][j].station_id, result[i][j].station_name, result[i][j].scada_id)
						}
					}
					$(".carousel ul").animateList();
					if (allData.animateNum == 1) {
						clearInterval(allData.timer);
					}
				} else {
					clearInterval(allData.timer);
				}

			}
		})
	},
	//获取总信息的数据
	getAllData: function() {
		var codeLength = allData.companyCode.split("").length;
		if (codeLength == 6) {
			data = {
				access_token: accessToken,
				company_code: allData.companyCode
			}
		} else {
			data = {
				access_token: accessToken,
				company_id: allData.companyId,
				company_code: allData.companyCode
			}
		}
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/totalData",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: data,
			success: function(data) {
				if (data.allSatationEnergy.cumulative_heat != null) {
					$(".sumData .unit").show();
					$('.sumData').find('em').html(data.allSatationEnergy.cumulative_heat);
				} else {
					$('.sumData').find('em').html('暂无数据');
					$(".sumData .unit").hide();
				}
				if (data.allSatationEnergy.hot_energy != null) {
					$(".yesterday .unit").show();
					$('.yesterday').find('em').html(data.allSatationEnergy.hot_energy);
				} else {
					$('.yesterday').find('em').html("暂无数据");
					$(".yesterday .unit").hide();
				}
				if (data.allSatations.stationCounts != null) {
					$(".stsationNum .unit").show();
					$('.stsationNum').find('em').html(data.allSatations.stationCounts);
				} else {
					$('.stsationNum').find('em').html("暂无数据");
					$(".stsationNum .unit").hide();
				}
				if (data.allSatations.total_erea != null) {
					$(".area .unit").show();
					$('.area').find('em').html(data.allSatations.total_erea);
				} else {
					$('.area').find('em').html("暂无数据");
					$(".area .unit").hide();
				}
				if (data.weekDatas != null) {
					$(".weekData .unit").show();
					$('.weekData').find('em').html(data.weekDatas);
				} else {
					$('.weekData').find('em').html("暂无数据");
					$(".weekData .unit").hide();
				}
				if (data.monthDatas != null) {
					$(".monthData .unit").show();
					$('.monthData').find('em').html(data.monthDatas);
				} else {
					$('.monthData').find('em').html("暂无数据");
					$(".monthData .unit").hide();
				}

			}
		});
	},
	//top图表的数据
	getTopData: function() {
		var tagId = [20, 14, 24]
		for (var i = 0; i < tagId.length; i++) {
			$.doAjax(tagId[i], "desc")
		}
	},
	doAjax: function(tagID, sort) {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationTopData",
			dataType: "json",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_code: allData.companyCode,
				tag_id: tagID,
				sort: sort
			},
			success: function(data) {

				allData.chartData.push(data)

				if (data != '') {}

			}
		});
	},
	//单个点击获取单个top数据
	oneChart: function() {

		$("button").on("click", function() {
			$(this).parent(".title").find("button").removeClass();
			$(this).addClass($(this).attr("color") + "Color");
			allData.chartData = [];
			var index = $(this).parents(".title").parent().index();
			$.doAjax($(this).attr("tag_id"), $(this).attr("sort"));
			$("#" + $(this).parents(".title").next().attr("id")).topChart(allData.chartData[0], index)
		})
	},
	//所有的图表
	allChart: function() {
		$('#netsChart').topChart(allData.chartData[0], 0);
		$('#rangeChart').topChart(allData.chartData[1], 1);
		$('#networkChart').topChart(allData.chartData[2], 2);
	},
	//天气的数据
	weatherData: function() {
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
		allData.startTime = year + "$" + fn(month) + "$" + (fn(day)) + '$00:00:00';
		allData.endTime = year + "$" + fn(month) + "$" + (fn(day) + 3) + '$00:00:00';

		$.ajax({
			type: "get",
			url: "http://114.215.46.56:18825/v1/weathers",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				city_id: allData.cityId,
				start_time: allData.startTime,
				end_time: allData.endTime
			},
			success: function(data) {
				//console.log(data[0])
				$('.todayWeather em').html(data[0].weather);
				$('.todayWeather>.temperature').html(data[0].templow + '~' + data[0].temphigh + '℃');
				$('.todayWeather .weatherStatus').css('background', 'url(../img/weathercn02/' + data[0].img + '.png) no-repeat center');
				for (var i = 0; i < 2; i++) {
					$('.statusWeather').eq(i).find('em').html(data[0].daily[i].day.weather);
					$('.tomorrowWeather').eq(i).find('.temperature').html(data[0].daily[i].night.templow + '~' + data[0].daily[i].day.temphigh + '℃');
				}
			}
		});
	},
	//异常，掉线
	nomalOnline: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/abnormalCount",
			async: true,
			data: {
				access_token: accessToken,
				company_code: allData.companyCode,
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				$(".normalAbnormal").nomalOnlineChart(data, 0);
			}
		});
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/offline",
			async: true,
			data: {
				access_token: accessToken,
				company_code: allData.companyCode,
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				$(".onlineDrop").nomalOnlineChart(data, 1);
			}
		});
	},

	//top进度条数据
	progressBar: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationTopData",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_code: allData.companyCode,
				tag_id: '1',
				level: 3
			},
			success: function(data) {
				//console.log(data);
				var oWidth; //获取最大值的宽度
				var per1 = [1];
				for (var i in data) {
					var n = parseInt(i) + 1;
					if (n <= 4) {
						per1.push(parseInt(data[n].data_value) / parseInt(data[0].data_value));
					}
					var listStr = '<li data-per="' + per1[i] + '"><label>' + data[i].station_name + '</label>' + '<div class="circle"></div><div class="circleColor"></div>' + '<div class="progressLine"></div><div class="progressColor"></div>' + '<i>' + Number(data[i].data_value).toFixed(2) + 'GJ</i><span>' + data[i].total_area + '&nbsp;&nbsp;万㎡</span></li>';
					$('.heatConsum ul').append(listStr);
					oWidth = $('.heatConsum li .progressColor').eq(0).width();
					//console.log(oWidth);
					if (i >= 1) {
						var ratio = $('.heatConsum li').eq(i).attr('data-per');
						$('.heatConsum li .progressColor').eq(i).css('width', ratio * oWidth);
					}
				}
			}
		});
	},
	//热量趋势图
	heaTrend: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/heatTrendChart",
			async: true,
			data: {
				access_token: accessToken,
				company_code: allData.companyCode,
				city_id: allData.cityId,
				company_id :allData.companyId
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				//console.log(data)
				if (data) {
					allData.trendData = data;
					//console.log(allData.trendData)
					$('#trendChart').heaTrendChart();
				} else {
					$('#trendChart').append('<h4>暂无数据</h4>');
				}
			}
		});
	},
});
$.init()