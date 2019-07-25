    $(document).ready(function() {
    	var authorityManage = top.getUser().company_code.length;
    	if (authorityManage < 11) {
    		$(".changeIndex").empty();
    		createElement(0, true);
    		getcompanyMessage(2, 0);
    	} else {
    		$(".changeIndex").empty();
    		createElement(0, true);
    		getcompanyMessage(2, 1);
    	}
    });

    //用来保存地址、令牌、表示权限的字段
    //		    var globalurl = "http://121.42.253.149:18816" ;
    //		    var accesstoken = "59029d22320e0f107cd99c8d" ;
    var accesstoken = getToken(),
    	switchValue = true,
    	switchKey = true,
    	switchIndex = true,
    	FlagIndex = true,
    	BranchIndex = true,
    	StationIndex = true,
    	RinkIndex = true,
    	//用来保存地图的级别信息
    	savemapLevel = [],
    	rinkMap = [],
    	//用来保存地图位置和名字的数组
    	res = [],
    	latCoord = [],
    	branchRes = [],
    	stationRes = [],
    	saveCompanyId = {};
    //用来保存悬浮物里面的内容及悬浮值
    var savekindName;
    var imgName;
    var offsetTop = null;
    var offsetLeft = null;
    var mapzoom = 0;
    var maplevel = 0;
    //边界颜色值
    var strokeColor = ["#54d0b7", "#0f6e40", "#1e88e5"];

    //初始化地图   
    var map = new BMap.Map("map", {
    	enableMapClick: false
    });
    map.disableDoubleClickZoom(true);
    map.enableScrollWheelZoom();
    map.enableAutoResize();
    var styleJson = [{
    		"featureType": "building",
    		"elementType": "alls",
    		"stylers": {
    			"hue": "#f3f3f3",
    			"visibility": "on",
    		}
    	}, {
    		"featureType": "poi",
    		"elementType": "labels",
    		"stylers": {
    			"visibility": "off",
    		}
    	}, {
    		"featureType": "road",
    		"elementType": "all",
    		"stylers": {
    			"visibility": "on",
    		}
    	}, {
    		"featureType": "highway",
    		"elementType": "all",
    		"stylers": {
    			"visibility": "off",
    		}
    	},

    ]
    map.setMapStyle({
    	styleJson: styleJson
    });

    //set marker type 初始化marker类型
    function addMarker(state, point, index, flagX, text, showColor) {
    	if (state == 0) {
    		var myIcon = new BMap.Icon("../img/mark_red.png", new BMap.Size(350, 71));
    	} else if (state == 1) {
    		var myIcon = new BMap.Icon("../img/mark_green.png", new BMap.Size(350, 71));
    	} //换热站掉线处理
    	else if (state == 2) {
    		var myIcon = new BMap.Icon("../img/mark_outline.png", new BMap.Size(350, 71));
    	}
    	var marker = new BMap.Marker(point, {
    		icon: myIcon
    	});
    	//数据图标的入口(点击地图上的marker显示相应的数据图表)
    	if (flagX == 0) {
    		if (marker.addEventListener) {
    			//							marker.addEventListener("click",showcompanyCharts);
    			marker.addEventListener("mouseover", showcompanyInfo);
    		} else if (marker.attachEvent) {
    			//						    marker.attachEvent("onclick",showcompanyCharts);
    			marker.addEventListener("onmouseover", showcompanyInfo);
    		}
    	} else if (flagX == 1) {
    		if (marker.addEventListener) {
    			//							marker.addEventListener("click",showchildrencompanyCharts);
    			marker.addEventListener("mouseover", showchildrencompanyInfo);
    		} else if (marker.attachEvent) {
    			//						    marker.attachEvent("onclick",showchildrencompanyCharts);
    			marker.addEventListener("onmouseover", showchildrencompanyInfo);
    		}
    	} else {
    		if (flagX == 2) {
    			if (marker.addEventListener) {
    				//							marker.addEventListener("click",showAreaCharts);
    				marker.addEventListener("mouseover", showAreaInfo);
    			} else if (marker.attachEvent) {
    				//						    marker.attachEvent("onclick",showAreaCharts);
    				marker.addEventListener("onmouseover", showAreaInfo);
    			}
    		} else if (flagX == 3) {
    			if (marker.addEventListener) {
    				//							marker.addEventListener("click",showStateCharts);
    				marker.addEventListener("mouseover", showStateInfo);
    			} else if (marker.attachEvent) {
    				//						    marker.attachEvent("onclick",showStateCharts);
    				marker.addEventListener("onmouseover", showStateInfo);
    			}
    		}
    	}
    	var label = new BMap.Label(text, {
    		offset: new BMap.Size(200, 14)
    	});
    	label.setStyle({
    		color: showColor,
    		border: "none",
    		backgroundColor: "none",
    		lineHeight: "5px",
    		textAlign: "center",
    		height: "20px",
    		textIndent: "1px",
    	})
    	marker.setLabel(label);
    	map.addOverlay(marker);
    	marker.enableMassClear();
    	label.enableMassClear();
    }

    //动态加载指标列表
    function createElement(mapLevel, flag) {
    	$.ajax({
    		url: globalurl + "/v1_0_0/tags",
    		type: "get",
    		dataType: "JSON",
    		crossDomain: true == !(document.all),
    		async: false,
    		data: {
    			access_token: accesstoken,
    			level: mapLevel,
    		},
    		success: function(data) {
    			for (var x = 0; x < data.station_tag.length; x++) {
    				if (flag == true) {
    					if (data.station_tag[x].tag_name == "实际能耗") {
    						$(".changeIndex").append("<div class='indexShow' style='float:left;'>" +
    							"<label class='text'>" +
    							"<input type='radio'  name='change' onclick=getMessage(" + data.station_tag[x]._id + ") checked>" + data.station_tag[x].tag_name + "" +
    							"</label>" +
    							"</div>"
    						);
    					} else {
    						$(".changeIndex").append("<div class='indexShow' style='float:left;'>" +
    							"<label class='text'>" +
    							"<input type='radio'  name='change' onclick=getMessage(" + data.station_tag[x]._id + ")>" + data.station_tag[x].tag_name + "" +
    							"</label>" +
    							"</div>"
    						);
    					}
    				} else if (flag == false) {
    					if (data.station_tag[x].tag_name == "实际能耗") {
    						$(".changeIndex").append("<div class='indexShow' style='float:left;'>" +
    							"<label class='text'>" +
    							"<input type='radio'  name='change' onclick=changeIndex(" + data.station_tag[x]._id + ") checked>" + data.station_tag[x].tag_name + "" +
    							"</label>" +
    							"</div>"
    						);
    					} else {
    						$(".changeIndex").append("<div class='indexShow' style='float:left;'>" +
    							"<label class='text'>" +
    							"<input type='radio'  name='change' onclick=changeIndex(" + data.station_tag[x]._id + ")>" + data.station_tag[x].tag_name + "" +
    							"</label>" +
    							"</div>"
    						);
    					}
    				}

    			}
    		}

    	});
    }

    //2、存储指标的容器 (避免标签累加)
    function getcompanyMessage(tagValue, levelMap) {
    	//1、先清除地图上的覆盖物
    	map.clearOverlays();
    	//2.请求数据
    	$.ajax({
    		url: globalurl + '/v1_0_0/mapShow',
    		dataType: "JSON",
    		type: "get",
    		crossDomain: true == !(document.all),
    		async: false,
    		data: {
    			access_token: accesstoken,
    			tag: tagValue,
    			level: levelMap,
    		},
    		success: function(data) {
    			//设置全局变量的值
    			switchKey = false;
    			if (data.data[0].company_name) {
    				//1.设置地图的中心及显示级别
    				if (data.data.length > 1) {
    					companyId = [];
    					for (var i = 0; i < data.data.length; i++) {
    						companyId.push(data.data[i].company_id);
    					}
    					saveCompanyId = JSON.stringify(companyId);
    				} else {
    					var lat = parseFloat(data.data[0].location.split(",")[0]);
    					var lng = parseFloat(data.data[0].location.split(",")[1]);
    					map.centerAndZoom(new BMap.Point(lat, lng), 12);
    				}
    				//2.格式化数据
    				for (var i = 0; i < data.data.length; i++) {

    					var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    					latCoord.push(data.data[i].location.split(",")[1]);
    					res.push({
    						name: data.data[i].company_id,
    						value: latCoord.pop(),
    						keyValue: data.data[i].company_name,
    						TagValue: tagValue,
    						MapLevel: levelMap,
    					});
    					//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    					if (data.data[i].data_value != 0 && data.data[i].data_unit != null) {
    						valueShow = data.data[i].data_value + data.data[i].data_unit + "" + data.data[i].company_name;
    					} else {
    						valueShow = "暂无数据     " + data.data[i].company_name;
    					}
    					if (data.data[i].status == 0) {
    						addMarker(0, Point, i, levelMap, valueShow, "#473f3c");
    					} else if (data.data[i].status == 1) {
    						addMarker(1, Point, i, levelMap, valueShow, "#3c4d48");
    					}
    					//绘制分公司区域
    					if (levelMap == 1) {
    						createLine(data.data[i].company_id, strokeColor[i]);
    					}
    				}
    				//3.保存地图的级别信息
    				rinkMap.push(levelMap);
    				//4.设置悬浮内容
    				savekindName = ["能耗", "图表"];
    				imgName = ["../img/data0.png", "../img/data1.png"];
    				offsetTop = 40;
    				offsetLeft = 210;
    			} else if (data.data[0].branch_name) {
    				//1.格式化数据
    				for (var i = 0; i < data.data.length; i++) {
    					var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    					latCoord.push(data.data[i].location.split(",")[1]);
    					branchRes.push({
    						name: data.data[i].branch_id,
    						value: latCoord.pop(),
    						keyValue: data.data[i].branch_name,
    						TagValue: tagValue,
    						MapLevel: levelMap,
    					});
    					//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    					if (data.data[i].data_value != 0 && data.data[i].data_unit != null) {
    						valueShow = data.data[i].data_value + data.data[i].data_unit + "" + data.data[i].branch_name;
    					} else {
    						valueShow = "暂无数据     " + data.data[i].branch_name;
    					}
    					if (data.data[i].status == 0) {
    						addMarker(0, Point, i, 2, valueShow, "#473f3c");
    					} else if (data.data[i].status == 1) {
    						addMarker(1, Point, i, 2, valueShow, "#3c4d48");
    					}
    				}
    				//2.保存地图的级别信息
    				rinkMap.push(levelMap);
    				//3.设置悬浮内容
    				savekindName = ["能耗", "图表", "水压图"];
    				imgName = ["../img/data0.png", "../img/data1.png", "../img/data2.png"];
    				offsetTop = 50;
    				offsetLeft = 210;
    				mapzoom = 1;
    				maplevel = 1;
    			} else if (data.data[0].heating_station_name) {
    				//1.格式化数据
    				for (var i = 0; i < data.data.length; i++) {
    					var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    					latCoord.push(data.data[i].location.split(",")[1]);
    					stationRes.push({
    						name: data.data[i].station_id,
    						value: latCoord.pop(),
    						keyValue: data.data[i].heating_station_name,
    						TagValue: tagValue,
    						MapLevel: levelMap,
    					});
    					//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    					if (data.data[i].data_value != 0 && data.data[i].data_unit != null) {
    						valueShow = data.data[i].data_value + data.data[i].data_unit + "" + data.data[i].heating_station_name;
    					} else {
    						valueShow = "暂无数据     " + data.data[i].heating_station_name;
    					}
    					if (data.data[i].status == 0 && data.data[i].is_onLine == 1) {
    						addMarker(0, Point, i, 3, valueShow, "#473f3c");
    					} else if (data.data[i].status == 1 && data.data[i].is_onLine == 0) {
    						addMarker(2, Point, i, 3, valueShow, "#3c4d48");
    					}

    				}
    				//2.保存地图的级别信息
    				rinkMap.push(levelMap);
    				//3.设置悬浮内容
    				savekindName = ["图表", "档案"];
    				imgName = ["../img/data1.png", "../img/data3.png"];
    				offsetTop = 40;
    				offsetLeft = 210;
    				mapzoom = 2;
    			} else {
    				layer.msg("网络原因，请刷新！");
    			}
    		}
    	});
    }

    // 切换指标时执行的函数
    function getMessage(value) {
    	if (switchKey == true) {} else if (switchKey == false) {
    		if (value) {
    			var mapRink = rinkMap.pop();
    			getcompanyMessage(value, mapRink);
    		}
    	}
    }

    //文本框获得或失去焦点事件
    changeInput();

    function changeInput() {
    	$("#searchFunction").on({
    		"focus": function() {
    			if ($(this).val("") == "请搜索") {
    				$(this).val("");
    			}
    		},
    		"blur": function() {
    			$(this).val("请搜索");
    		}
    	});

    }

    //点击搜索按钮实现搜索功能
    $("#searchPicture").click(function() {
    	judgeMaplevel();
    });

    //回车实现搜索功能
    function search(ev, tagValue, levelMap) {
    	var e = ev || window.event;
    	if (e.keyCode == 13) {
    		judgeMaplevel();
    	}
    }

    //根据地图级别进行搜索功能的实现
    function judgeMaplevel() {
    	var iptValue = $("#searchFunction").val();
    	if (iptValue == '请搜索') {
    		if (savemapLevel.length > 0) {
    			$("#messageTable").empty();
    			var mapRink = savemapLevel.pop();
    			$(".changeIndex").empty();
    			if (mapRink == "undefined" || mapRink == 0) {
    				createElement(0, true);
    				getcompanyMessage(2, 0);
    			} else if (mapRink == 1) {
    				createElement(0, true);
    				getcompanyMessage(2, 1);
    			} else if (mapRink == 2) {
    				createElement(1, true);
    				getcompanyMessage(2, 2);
    			} else if (mapRink == 3) {
    				createElement(2, true);
    				getcompanyMessage(2, 3);
    			}
    		} else {
    			layer.msg("搜索内容不能为空！");
    		}
    	} else {
    		var mapRink = rinkMap.pop();
    		savemapLevel.push(mapRink);
    		searchFunction(2, mapRink);
    	}
    }

    //针对搜索内容切换指标
    function changeIndex(data) {
    	if (switchIndex == true) {} else if (switchIndex == false) {
    		if (data) {
    			searchFunction(data, mapzoom);
    		}
    	}
    }

    //搜索功能的实现
    function searchFunction(tagValue, levelMap) {
    	//匹配汉字和空格的正则表达式
    	var regTest = /^[\u4e00-\u9fa5_0-9]+$/;
    	var iptValue = $("#searchFunction").val();
    	flagIndex = true,
    		branchIndex = true,
    		stationIndex = true,
    		rinkIndex = true;
    	//用户输入验证，通过验证进行查询结果的返回
    	if (iptValue) {
    		if (regTest.test(iptValue)) {
    			$.ajax({
    				url: globalurl + '/v1_0_0/mapShow',
    				dataType: "JSON",
    				type: "get",
    				crossDomain: true == !(document.all),
    				async: false,
    				data: {
    					access_token: accesstoken,
    					tag: tagValue,
    					level: levelMap,
    					name: iptValue,
    				},
    				success: function(data) {
    					//设置全局变量的值
    					switchIndex = false;
    					var strokeColor = ["#00bcd4", "#0f6e40", "#1e88e5"];
    					if (data.data.length > 0) {
    						if (data.data[0].company_name) {
    							//1、清空地图上的覆盖物
    							map.clearOverlays();
    							//2、格式化地图的显示
    							if (levelMap == 0) {
    								if (FlagIndex == true) {
    									$(".changeIndex").empty();
    									createElement(0, false);
    								}
    								if (flagIndex == true) {
    									$("#messageTable").empty();
    									for (var i = 0; i < data.data.length; i++) {
    										//将查询符合的数据放入容器中
    										$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow(" + data.data[i].location + "," + levelMap + ")>" + data.data[i].company_name + "</li>");
    									}
    								}
    								FlagIndex = false;
    								flagIndex = false;
    							} else if (levelMap == 1) {
    								if (RinkIndex == true) {
    									$(".changeIndex").empty();
    									createElement(0, false);
    								}
    								if (rinkIndex == true) {
    									$("#messageTable").empty();
    									for (var i = 0; i < data.data.length; i++) {
    										//将查询符合的数据放入容器中
    										$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow(" + data.data[i].location + "," + levelMap + ")>" + data.data[i].company_name + "</li>");
    									}
    								}
    								RinkIndex = false;
    								rinkIndex = false;
    							}
    							for (var i = 0; i < data.data.length; i++) {
    								var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    								latCoord.push(data.data[i].location.split(",")[1]);
    								res.push({
    									name: data.data[i].company_id,
    									value: latCoord.pop(),
    									keyValue: data.data[i].company_name,
    									TagValue: tagValue,
    									MapLevel: levelMap,
    								});
    								//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    								if (data.data[i].data_value != 0) {
    									valueShow = data.data[i].data_value + data.data[i].data_unit + data.data[i].company_name;
    								} else {
    									valueShow = "暂无数据     " + data.data[i].company_name;
    								}
    								if (data.data[i].status == 0) {
    									addMarker(0, Point, i, levelMap, valueShow, "#473f3c");
    								} else if (data.data[i].status == 1) {
    									addMarker(1, Point, i, levelMap, valueShow, "#3c4d48");
    								}
    								//绘制分公司区域
    								if (levelMap == 1) {
    									createLine(data.data[i].company_id, strokeColor[i]);
    								}
    							}

    						} else if (data.data[0].branch_name) {
    							//清除地图上所有的覆盖物
    							map.clearOverlays();
    							//将查询符合的数据放入容器
    							if (BranchIndex == true) {
    								$(".changeIndex").empty();
    								createElement(1, false);
    							}
    							if (branchIndex == true) {
    								$("#messageTable").empty();
    								for (var i = 0; i < data.data.length; i++) {
    									$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow(" + data.data[i].location + "," + levelMap + ")>" + data.data[i].branch_name + "</li>");
    								}
    							}
    							BranchIndex = false;
    							branchIndex = false;
    							//1.格式化数据
    							for (var i = 0; i < data.data.length; i++) {
    								var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    								latCoord.push(data.data[i].location.split(",")[1]);
    								branchRes.push({
    										name: data.data[i].branch_id,
    										value: latCoord.pop(),
    										keyValue: data.data[i].branch_name,
    										TagValue: tagValue,
    										MapLevel: levelMap,
    									})
    									//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    								if (data.data[i].data_value != 0) {
    									valueShow = data.data[i].data_value + data.data[i].data_unit + data.data[i].branch_name;
    								} else {
    									valueShow = "暂无数据     " + data.data[i].branch_name;
    								}
    								if (data.data[i].status == 0) {
    									addMarker(0, Point, i, 2, valueShow, "#473f3c");
    								} else if (data.data[i].status == 1) {
    									addMarker(1, Point, i, 2, valueShow, "#3c4d48");
    								}
    							}
    						} else if (data.data[0].heating_station_name) {
    							//清空地图上的覆盖物
    							map.clearOverlays();
    							if (StationIndex == true) {
    								$(".changeIndex").empty();
    								createElement(2, false);
    							}
    							if (stationIndex == true) {
    								$("#messageTable").empty();
    								for (var i = 0; i < data.data.length; i++) {
    									//将查询符合的数据放入容器中
    									$("#messageTable").append("<li style='cursor:pointer;color:white;font-size:12px;' onclick=centerShow(" + data.data[i].location + "," + levelMap + ")>" + data.data[i].heating_station_name + "</li>")
    								}
    							}
    							StationIndex = false;
    							stationIndex = false;
    							//1.格式化数据
    							for (var i = 0; i < data.data.length; i++) {
    								var Point = new BMap.Point(data.data[i].location.split(",")[0], data.data[i].location.split(",")[1]);
    								latCoord.push(data.data[i].location.split(",")[1]);
    								stationRes.push({
    									name: data.data[i].station_id,
    									value: latCoord.pop(),
    									keyValue: data.data[i].heating_station_name,
    									TagValue: tagValue,
    									MapLevel: levelMap,
    								});
    								//如果有数据，地图标志由名字与能耗数据填充，否则显示名字与暂无数据
    								if (data.data[i].data_value != 0) {
    									valueShow = data.data[i].data_value + data.data[i].data_unit + "  234" + data.data[i].heating_station_name;
    								} else {
    									valueShow = "暂无数据     " + data.data[i].heating_station_name;
    								}
    								if (data.data[i].status == 0 && data.data[i].is_onLine == 1) {
    									addMarker(0, Point, i, 3, valueShow, "#473f3c");
    								} else if (data.data[i].status == 1 && data.data[i].is_onLine == 0) {
    									addMarker(2, Point, i, 3, valueShow, "#3c4d48");
    								}
    							}
    						}
    					} else {
    						layer.msg("当前地图范围内没有符合关键字的搜索内容！");
    						changeInput();
    					}
    				}
    			});
    		} else {
    			layer.msg("请输入符合的关键字进行查询！");
    			changeInput();
    		}
    	}
    }

    //针对返回的搜索信息进行处理,点击某个内容放置到地图的中心位置
    function centerShow(value, data, num) {
    	var lat = parseFloat(value);
    	var lng = parseFloat(data);
    	if (num == 0) {
    		map.setCenter(new BMap.Point(lat, lng));
    		$("#messageTable").empty();
    	} else if (num == 1) {
    		map.setCenter(new BMap.Point(lat, lng));
    		$("#messageTable").empty();
    	} else if (num == 2) {
    		map.setCenter(new BMap.Point(lat, lng));
    		$("#messageTable").empty();
    	} else if (num == 3) {
    		map.setCenter(new BMap.Point(lat, lng));
    		$("#messageTable").empty();
    	}
    }

    //鼠标滚轮进入不同级别
    map.addEventListener("zoomend", function() {
    	var mapLevel = map.getZoom();
    	if (mapLevel > 5 && mapLevel < 12) {
    		//1、先清除地图上的覆盖物
    		map.clearOverlays();
    		//2.加载标签列表
    		$(".changeIndex").empty();
    		createElement(0, true);
    		//3.加载数据
    		getcompanyMessage(2, 0);
    	} else if (mapLevel > 12 && mapLevel < 14) {
    		//1、先清除地图
    		clearMapthing();
    		//2.加载标签列表
    		$(".changeIndex").empty();
    		createElement(0, true);
    		//3.加载数据
    		getcompanyMessage(2, 1);
    	} else if (mapLevel > 14 && mapLevel < 16) {
    		//1、先清除地图
    		clearMapthing();
    		//2.加载标签列表
    		$(".changeIndex").empty();
    		createElement(1, true);
    		//3.加载数据
    		getcompanyMessage(2, 2);
    		//4.绘制边界
    		addLine();
    	} else if (mapLevel > 18 && mapLevel < 21) {
    		//1、先清除地图
    		clearMapthing();
    		//2.加载标签列表
    		$(".changeIndex").empty();
    		createElement(2, true);
    		//3.加载数据
    		getcompanyMessage(2, 3);
    		//4.绘制边界
    		addLine();
    	}

    });

    //清空地图的覆盖物、搜索内容 、文本信息
    function clearMapthing() {
    	//切换层级时，清除地图上的覆盖物和容器，并且让搜索的文本框内容为空
    	map.clearOverlays();
    	$("#messageTable").empty();
    	changeInput();
    }

    //地图点击进入数据图标的函数入口
    function showcompanyCharts(ev) {
    	showCharts(ev, res);
    }

    function showchildrencompanyCharts(ev) {
    	showCharts(ev, res);
    }

    function showAreaCharts(ev) {
    	showCharts(ev, branchRes);
    }

    function showStateCharts(ev) {
    	showCharts(ev, stationRes);

    }

    //获取点击覆盖物的Id值、名字、地图级别、标签的ID值，并调用弹窗函数
    function showCharts(ev, resName) {
    	var resource = findRes(ev, resName);
    	var showId = resource.showId;
    	var showName = resource.showName;
    	var showTag = resource.showTag - 1;
    	var showLevel = resource.showLevel;
    	console.info(showTag);
    	layerOpen(showName, showId, showTag, showLevel)
    }

    //获取点击marker绑定的值
    function findRes(ev, showRes) {
    	var ev = ev || window.event;
    	var p = ev.target || ev.srcElement;
    	var markerPositionlat = p.getPosition().lat;
    	if (markerPositionlat) {
    		for (var x = 0; x < showRes.length; x++) {
    			if (showRes[x].value == markerPositionlat) {
    				showId = showRes[x].name;
    				showName = showRes[x].keyValue;
    				showTag = showRes[x].TagValue;
    				showLevel = showRes[x].MapLevel;
    			}
    		}
    		return {
    			showId: showId,
    			showName: showName,
    			showTag: showTag,
    			showLevel: showLevel
    		};
    	}
    }

    //鼠标悬浮显示弹窗信息
    function showcompanyInfo(ev) {
    	showmyCompOverlay(ev);
    }

    function showchildrencompanyInfo(ev) {
    	showmyCompOverlay(ev);
    }

    function showAreaInfo(ev) {
    	showmyCompOverlay(ev);
    }

    function showStateInfo(ev) {
    	showmyCompOverlay(ev);
    }

    //自定义覆盖物对象
    var myCompOverlay;
    //鼠标经过显示悬浮物体
    function showmyCompOverlay(ev) {
    	var ev = ev || window.event;
    	var p = ev.target || ev.srcElement;
    	var Positionlat = p.getPosition().lat;
    	var Positionlng = p.getPosition().lng;
    	if (myCompOverlay) {
    		map.removeOverlay(myCompOverlay);
    	}
    	myCompOverlay = new ComplexCustomOverlay(new BMap.Point(Positionlng, Positionlat));
    	map.addOverlay(myCompOverlay);
    }

    //鼠标悬浮自定义覆盖物
    function ComplexCustomOverlay(point) {
    	this._point = point;
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map) {
    	this._map = map;
    	var div = this._div = document.createElement("div");
    	div.style.position = "absolute";
    	div.style.color = "white";
    	div.style.height = "auto";
    	div.style.padding = "2px";
    	div.style.lineHeight = "18px";
    	div.style.whiteSpace = "nowrap";
    	div.style.MozUserSelect = "none";
    	div.style.fontSize = "12px"
    	for (var i = 0; i < savekindName.length; i++) {
    		var divs = this._span = document.createElement("div");
    		divs.style.width = "100px";
    		divs.style.height = "40px";
    		divs.style.overflow = "hidden";
    		divs.innerHTML = '<span class="showDetails" onclick="openlayers(' + i + ',' + mapzoom + ')">' + savekindName[i] + '</span><img src=' + imgName[i] + ' style="float:right;"  >';
    		div.appendChild(divs);
    	}
    	var that = this;
    	map.getPanes().labelPane.appendChild(div);
    	return div;
    }

    //获取该覆盖物的位置
    ComplexCustomOverlay.prototype.getPosition = function() {
    	return this._point;
    };
    // 自定义覆盖物添加事件方法
    ComplexCustomOverlay.prototype.addEventListener = function(event, fun) {
    	this._div['on' + event] = fun;
    }

    //在地图上绘制自定义覆盖物
    ComplexCustomOverlay.prototype.draw = function() {
    	var map = this._map;
    	var pixel = map.pointToOverlayPixel(this._point);
    	this._div.style.left = pixel.x - offsetLeft + "px";
    	this._div.style.top = pixel.y - offsetTop + "px";
    }

    //添加分公司边界
    function createLine(companyid, strokeColor) {
    	$.ajax({
    		url: globalurl + "/v1_0_0/child_company_boundary",
    		dataType: "JSON",
    		type: "get",
    		crossDomain: true == !(document.all),
    		async: false,
    		data: {
    			access_token: accesstoken,
    			company_id: saveCompanyId,
    		},
    		success: function(data) {
    			for (var x = 0; x < data.data_boundray.length; x++) {
    				if (companyid == data.data_boundray[x].child_company_loc_id) {
    					var mapPoint = [];
    					for (var i = 0; i < data.data_boundray[x].child_company_loc.length; i++) {
    						if (data.data_boundray[x].child_company_loc[i]) {
    							var locationLat = data.data_boundray[x].child_company_loc[i].split(",")[0];
    							var locationLng = data.data_boundray[x].child_company_loc[i].split(",")[1];
    							mapPoint.push(new BMap.Point(locationLat, locationLng));
    						}
    					}
    					var polygon = new BMap.Polygon(mapPoint, {
    						strokeColor: strokeColor,
    						strokeWeight: 2,
    						strokeOpacity: 1
    					}); //创建多边形
    					map.addOverlay(polygon);
    				}
    			}
    		}

    	});
    }

    //绘制分公司边界
    function addLine() {
    	for (var x = 0; x < strokeColor.length; x++) {
    		createLine(companyId[x], strokeColor[x])
    	}
    }

    //点击悬浮物按钮进入到不同弹窗
    function openlayers(value) {
    	var point = myCompOverlay.getPosition();
    	var pointLat = point.lat;
    	if (mapzoom == 0) {
    		if (value == 0) {
    			var resource = findIndex(pointLat, res);
    			var showId = resource.showId;
    			var showName = resource.showName;
    			showconsumeLayer(showId, showName, maplevel);
    		} else {
    			var resource = findIndex(pointLat, res);
    			var showId = resource.showId;
    			var showName = resource.showName;
    			var showTag = resource.showTag - 1;
    			var showLevel = resource.showLevel;
    			layerOpen(showName, showId, showTag, showLevel)
    		}
    	} else if (mapzoom == 1) {
    		if (value == 0) {
    			var resource = findIndex(pointLat, branchRes);
    			var showId = resource.showId;
    			var showName = resource.showName;
    			showconsumeLayer(showId, showName, maplevel);
    		} else if (value == 1) {
    			var resource = findIndex(pointLat, res);
    			var showId = resource.showId;
    			var showName = resource.showName;
    			var showTag = resource.showTag - 1;
    			var showLevel = resource.showLevel;
    			layerOpen(showName, showId, showTag, showLevel);
    		} else if (value == 2) {
    			var getRes = findIndex(pointLat, branchRes);
    			var showId = getRes.showId;
    			var showName = getRes.showName;
    			showBranchLayer(showId, showName);
    		}
    	} else if (mapzoom == 2) {
    		if (value == 0) {
    			var resource = findIndex(pointLat, res);
    			var showId = resource.showId;
    			var showName = resource.showName;
    			var showTag = resource.showTag - 1;
    			var showLevel = resource.showLevel;
    			layerOpen(showName, showId, showTag, showLevel);
    		} else if (value == 1) {
    			var getRes = findIndex(pointLat, stationRes);
    			var showId = getRes.showId;
    			showStationLayer();
    		}

    	}
    }

    //通过坐标去获取相应的打开图表的参数值
    function findIndex(markerPositionlat, showRes) {
    	if (markerPositionlat) {
    		for (var x = 0; x < showRes.length; x++) {
    			if (showRes[x].value == markerPositionlat) {
    				showId = showRes[x].name;
    				showName = showRes[x].keyValue;
    				showTag = showRes[x].TagValue;
    				showLevel = showRes[x].MapLevel;
    			}
    		}
    		return {
    			showId: showId,
    			showName: showName,
    			showTag: showTag,
    			showLevel: showLevel
    		};
    	}
    }

    //点击覆盖物出弹窗
    function layerOpen(showName, showId, showTag, showLevel) {
    	showLevel <= 1 ? showLevel = 1 : showLevel = showLevel;
    	layer.open({
    		type: 2,
    		title: "数据图表",
    		closeBtn: 1,
    		skin: 'layui-layer-lan',
    		shade: 0.8,
    		shadeClose: true,
    		moveType: 2,
    		area: ['70%', '63%'],
    		content: "/list/chart?station_name=" + showName + "&station_id=" + showId + "&num=" + showTag + "&tagLevel=" + showLevel //iframe的url
    	});
    }

    //点击档案标签显示弹窗
    function showStationLayer() {
    	layer.open({
    		type: 2,
    		title: '换热站档案',
    		skin: 'layui-layer-molv',
    		shadeClose: true,
    		shade: 0.6,
    		moveType: 2,
    		area: ['65%', '80%'],
    		content: "/map/station?station_id=" + showId
    	});
    }

    //点击显示水压图弹窗
    function showBranchLayer(showId, showName) {
    	layer.open({
    		type: 2,
    		title: '水压图',
    		skin: 'layui-layer-molv',
    		shadeClose: true,
    		shade: 0.6,
    		moveType: 2,
    		area: ['70%', '80%'],
    		content: "/map/waterChart?branch_Id=" + showId + "&branch_name=" + showName
    	});
    }

    //点击显示水压图弹窗
    function showconsumeLayer(showId, showName, maplevel) {
    	console.log(showId)
    	layer.open({
    		type: 2,
    		title: '能耗图',
    		skin: 'layui-layer-molv',
    		shadeClose: false,
    		shade: 0.6,
    		moveType: 2,
    		area: ['70%', '80%'],
    		content: "/map/consumeChart?show_id=" + showId + "&show_name=" + showName + "&maplevel=" + maplevel
    	});
    }