var accessToken = getToken();
var user = getUser();
var datas = [];
var searchData = [];
var heatTogg = true;
var point;
var zoom;
var s;

$(function() {
	getHeatStand()
	event1($("#searchId"), "请输入关键字查找");
	searchContent();
	clickDragend();
	searched();
	toggRoll();
})

//初始化地图
var map = new BMap.Map('allMap', {
	minZoom: 11,
	maxZoom: 17,
	enableMapClick: false
})
//map.centerAndZoom('西安', 12)
map.disableDoubleClickZoom(true);
map.enableScrollWheelZoom();
map.enableAutoResize();
var styleJson = [{
		"featureType": "building",
		"elementType": "alls",
		"stylers": {
			"hue": "#f3f3f3",
			"visibility": "on"
		}
	}, {
		"featureType": "poi",
		"elementType": "labels",
		"stylers": {
			"visibility": "off"
		}
	}, {
		"featureType": "road",
		"elementType": "all",
		//				"elementType": "geometry.stroke",
		"stylers": {
			//			   			"color":"#ff0000",
			"visibility": "on"
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
})

//	//获取换热站
function getHeatStand() {
	layer.msg('数据加载中...', {
		icon: 16,
		shade: 0.01,
		time: -1
	});
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/stationAllDatas?tag_id=20,10',
		data: {
			access_token: accessToken,
			company_code: user.company_code
		},
		success: function(data) {
			//				console.log(data)
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].lng && data[i].lat) {
						if (data[i].data != null) {
							if (data[i].data['1gw'] != null) {
								data[i].count_one = data[i].data['1gw']
							} else {
								data[i].count_one = '无数据'
							}
							if (data[i].data['2gw'] != null) {
								data[i].count = data[i].data['2gw']
							} else {
								data[i].count = '无数据'
							}
						} else {
							data[i].count = '无数据'
							data[i].count_one = '无数据'
						}
						datas.push(data[i])
					}
				}
				
				//					console.log(datas)
				layer.closeAll() //关闭layer弹窗
				view(datas);
				addMarker(datas)
			} else {
				layer.msg('暂无数据', {
					icon: 0,
					time: 2000
				})
			}
		}
	})
}

//动态设置地图中心点以及等级
function view(datas) {
	var minLat = datas[0].lat;
    var maxLat = datas[0].lat;
    var minLng = datas[0].lng;
    var maxLng = datas[0].lng;
    for (var i = 0; i < datas.length; i++) {
        minLat = datas[i].lat < minLat ? datas[i].lat : minLat;
        maxLat = datas[i].lat > maxLat ? datas[i].lat : maxLat;
        minLng = datas[i].lng < minLng ? datas[i].lng : minLng;
        maxLng = datas[i].lng > maxLng ? datas[i].lng : maxLng;
    }
    try {
        map.setViewport([new BMap.Point(minLng, minLat), new BMap.Point(maxLng, maxLat)]);
    } catch (e) {
        alert(e);
    }
//	var view = map.getViewport(eval(heatDatas));
//	var mapZoom = view.zoom;
//	var centerPoint = view.center;
//	map.centerAndZoom(centerPoint, mapZoom);
}

//添加marker
function addMarker(points) {
	map.clearOverlays()
		// 获取经纬度范围参数
	var bs = map.getBounds(); //获取可视区域
	var bssw = bs.getSouthWest(); //可视区域左下角
	var bsne = bs.getNorthEast(); //可视区域右上角
	var topLat = bsne.lat;
	var bottomLat = bssw.lat;
	var leftLng = bssw.lng;
	var rightLng = bsne.lng;
	//获取可是区域内的数据
	var points1 = []
	for (var j = 0; j < points.length; j++) {
		if (points[j].lng >= leftLng && points[j].lng <= rightLng && points[j].lat >= bottomLat && points[j].lat <= topLat) {
			points1.push(points[j])
		}
	}
	searchData = points1
		//		console.log(points1)
		//添加热力图
	heatmapOverlay = new BMapLib.HeatmapOverlay({
		"radius": 20
	});
	map.addOverlay(heatmapOverlay)
	heatmapOverlay.setDataSet({
		data: points1,
		max: 100
	});

	var marker;
	var se;
	var en;
	for (var i = 0; i < points1.length; i++) {
		en = points1[i].count

		//标注的样式
		//			var max=100;
		//			var min=0;
		//			var color0=0;
		//			var color1=180;
		//			if(en){
		//				if(en>(min+(max-min)/2)){
		//					color0=180,
		//					color1=180-(en-min+(max-min)/2)*180/(max-min)/2;
		//				}else{
		//					color1=180,
		//					color0=(en-min)*180/((max-min)/2);
		//				}
		//			}
		//			var s="rgb("+parseInt(color0)+","+parseInt(color1)+",21)";
		//标注样式
		var n = i < 20 ? 10 : 5
		if (en == '无数据') {
			s = "#828080"
		}
		if (en < 0) {
			s = "#05ba74"
		}
		if (en >= 0 && en < 10) {
			s = "#05ba74"
		}
		if (en >= 10 && en < 20) {
			s = "#64d102"
		}
		if (en >= 20 && en < 30) {
			s = "#a4df06"
		}
		if (en >= 30 && en < 40) {
			s = "#d2df06"
		}
		if (en >= 40 && en < 50) {
			s = "#ffd800"
		}
		if (en >= 50 && en < 60) {
			s = "#ffc600"
		}
		if (en >= 60 && en < 70) {
			s = "#ffa200"
		}
		if (en >= 70 && en < 80) {
			s = "#ff8400"
		}
		if (en >= 80 && en < 90) {
			s = "#d94e1d"
		}
		if (en >= 90 && en <= 100) {
			s = "#ca1414"
		}
		if (en > 100) {
			s = "#ca1414"
		}

		point = new BMap.Point(points1[i].lng, points1[i].lat)
		marker = new BMap.Marker(point, {
			icon: new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
				scale: n, //图标缩放大小
				fillColor: s, //填充颜色
				fillOpacity: 1, //填充透明度
				strokeColor: s
			})
		})
		map.addOverlay(marker)
		hide_overlay(marker)
		addLabel(marker, points1, i)
		toggDrag(marker)
		if (heatTogg == true) {
			openHeatmap()
			hide_overlay(marker)
		} else {
			show_overlay(marker)
			closeHeatmap()
		}
	}
}

//添加label提示
function addLabel(marker, points1, i) {
	//给marker添加提示label
	var str = '',
		label;
	if (points1[i].count_one == '无数据' || points1[i].count_one == undefined) {
		count1 = '无数据'
	} else {
		count1 = points1[i].count_one.toFixed(2) + '℃'
	}
	if (points1[i].count == '无数据' || points1[i].count == undefined) {
		count2 = '无数据'
	} else {
		count2 = points1[i].count + '℃'
	}
	str = '<div>' +
		'<span style="font-size:14px; color:#1ab394;">' + points1[i].station_name + '</span>' + '<br>' +
		'<span>' + "一网供温:" + count1 + '</span>' + '&nbsp;&nbsp;' + '<br>' +
		'<span>' + "二网供温:" + count2 + '</span>'
	'</div>'

	if (i < 20) {
		label = new BMap.Label(str, {
			offset: new window.BMap.Size(35, -45)
		});
	} else {
		label = new BMap.Label(str, {
			offset: new window.BMap.Size(25, -55)
		});
	}

	label.setStyle({
		display: "none",
		borderColor: "#ccc",
		padding: "5px"
	})
	marker.setLabel(label)

	//给marker添加label1(点的值)
	if (points1[i].count == '无数据' || points1[i].count == undefined) {
		p1 = '-'
	} else {
		if ((points1[i].count.toString()).indexOf('.') == -1) {
			p1 = points1[i].count
		} else {
			p1 = Math.round(points1[i].count)
		}
	}

	var label1 = new BMap.Label(p1)
	label1.setStyle({
		fontSize: "13px",
		color: "#fff",
		border: "none",
		backgroundColor: "none",
		marginLeft: "-3px",
		lineHeight: "30px",
		textAlign: "center",
		height: "35px",
		width: "35px"
	})
	if (i < 20) {
		marker.setLabel(label1)
	}

	//给point添加label2(点的名称)
	var opts = {
		position: point, // 指定文本标注所在的地理位置
		offset: new BMap.Size(-20, 36) //设置文本偏移量
	}
	var label2 = new BMap.Label(points1[i].station_name.length <= 4 ? points1[i].station_name : points1[i].station_name.substring(0, 4) + ' ...', opts)
	label2.setStyle({
		color: "#fff",
		fontSize: "10px",
		borderRadius: "10px",
		backgroundColor: s,
		padding: "3px",
		border: "none",
		width: "60px",
		textAlign: "center"
	})

	if (i < 20) {
		marker.setLabel(label2)
	}

	//鼠标经过marker事件
	marker.addEventListener('mouseover', function() {
			label.setStyle({
				display: "block"
			})
			marker.setTop(true, 27000000)
		})
		//鼠标离开marker事件
	marker.addEventListener('mouseout', function() {
			label.setStyle({
				display: "none"
			})
			marker.setTop(false)
		})
		//鼠标点击marker事件
	var stationName = points1[i].station_name
	var stationId = points1[i].station_id
	marker.addEventListener('click', function() {
		if (points1[i].scada_id) {
			var scadaId = points1[i].scada_id
			delivery(stationName, stationId, scadaId)
		} else {
			deliveryAlert()
		}
	})
}

//隐藏marker
function hide_overlay(marker) {
	marker.hide()
}
//显示marker
function show_overlay(marker) {
	marker.show()
}

if (!isSupportCanvas()) {
	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
}

//是否显示热力图
function openHeatmap() {
	heatmapOverlay.show();
	heatTogg = true;
}

function closeHeatmap() {
	heatmapOverlay.hide();
	heatTogg = false;
}

//判断浏览区是否支持canvas
function isSupportCanvas() {
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}
//根据上次显示的类型判断是否显示热力图
function toggDrag(marker) {
	if (heatTogg == true) {
		openHeatmap()
		hide_overlay(marker)
	} else {
		show_overlay(marker)
		closeHeatmap()
	}
}
//根据zoom判断是否显示marker或热力图
function toggRoll() {
	map.addEventListener("zoomend", function(e) {
		zoom = map.getZoom()
			//  		console.log(zoom)
		if ($('#searchId').val() == '请输入关键字查找' || $('#searchId').val() == '') {
			$('#searchId').blur()
			$('.cardlist').empty()
			$('.cardlist').css('padding', 0)

			if (zoom < 16) {
				heatTogg = true;
				addMarker(datas)
			} else {
				heatTogg = false;
				addMarker(datas)
			}
		} else {
			//  			console.log(searchData)
			searchEnergy()
		}
	})
}

//鼠标点击、拖动的监听事件
function clickDragend() {
	map.addEventListener("click", function(e) {

		})
		//鼠标拖动的监听事件
	map.addEventListener('dragend', function(e) {
		if ($('#searchId').val() == '请输入关键字查找' || $('#searchId').val() == '') {

			$('#searchId').blur()
			$('.cardlist').empty()
			$('.cardlist').css('padding', 0)

			if (zoom < 16) {
				heatTogg = true;
				addMarker(datas)
			} else {
				heatTogg = false;
				addMarker(datas)
			}
		} else {
			searchEnergy()
		}
	})
}

//模糊查询
function searchEnergy() {
	var iptval = $('#searchId').val()
	if ($('#searchId').val() == '' || $('#searchId').val() == '请输入关键字查找') {
		if (zoom < 16) {
			heatTogg = true;
			addMarker(datas)
		} else {
			heatTogg = false;
			addMarker(datas)
		}
		if (datas.length > 0) {
			var str = ''
			$('.cardlist').empty()
			$('.cardlist').css('padding', 0)
				//				console.log(datas)
		}
	} else {
		searchData = []
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].station_name.search($('#searchId').val()) != -1) {
				searchData.push(datas[i])
			}
		}

		//			console.log(searchData)
		if (searchData.length == 0) {
			layer.msg('没有该搜索内容 ', {
				icon: 0
			})
		}
		heatTogg = false
		addMarker(searchData)
		$('.cardlist').empty()
		var str = ''
		if (searchData.length != 0) {
			for (var m = 0; m < searchData.length; m++) {

				if (searchData[m].count_one == '无数据' || searchData[m].count_one == undefined) {
					count1 = '无数据'
				} else {
					count1 = searchData[m].count_one.toFixed(2) + '℃'
				}
				if (searchData[m].count == '无数据' || searchData[m].count == undefined) {
					count2 = '无数据'
				} else {
					count2 = searchData[m].count + '℃'
				}

				if (searchData[m].scada_id) {
					str = '<a href="javascript:;" onclick="delivery(&apos;' + searchData[m].station_name + '&apos;,&apos;' + searchData[m].station_id + '&apos;,&apos;' + searchData[m].scada_id + '&apos;)">' +
						'<li>' +
						'<p>' + searchData[m].station_name + '</p>' +
						'<p>' +
						'<span>' + '一网供温:' + count1 + '</span>' +
						'<span>' + '二网供温:' + count2 + '</span>' +
						'</p>' +
						'</li>' +
						'</a>';
					$('.cardlist').append(str)
				} else {
					str = '<a href="javascript:;" onclick="deliveryAlert()">' +
						'<li>' +
						'<p>' + searchData[m].station_name + '</p>' +
						'<p>' +
						'<span>' + '一网供温:' + count1 + '</span>' +
						'<span>' + '二网供温:' + count2 + '</span>' +
						'</p>' +
						'</li>' +
						'</a>';
					$('.cardlist').append(str)
				}
				$('.cardlist').css('padding', '5px 10px')
			}
		} else {
			$('.cardlist').css('padding', 0)
		}
	}
}
//input 失焦、获焦判断
function event1(obj, str) {
	obj.on({
		"focus": function() {
			if (obj.val() == str) {
				obj.val("");
			}
		},
		"keyup": function(event) {
			if (event.keyCode == 32) {
				obj.val(obj.val().replace(/\s/g, ''))
			}
		}
	});
	obj.on("blur", function() {
		if (obj.val() == "") {
			obj.val(str);
		}
	})
}
//	event1($("#searchId"),"请输入关键字查找")

//按回车键查找,点击搜索图标查询
function searched() {
	$("#searchId").on("keyup", function(event) {
		if (event.keyCode == 13) {
			searchEnergy()
		}
	})
	$('#search_button').click(function() {
		searchEnergy()
	})
}

//搜索
function searchContent() {
	$('.city_inner').click(function() {
		$('.company_name').toggle()
		$('.city_inner em').attr('background', 'url(url)')
	})
	$('.fa').click(function() {
		$('.company_name').hide()
	})
}

//组态页面
function delivery(stationName, stationId, _id) {
	layer.open({
		type: 2,
		title: stationName,
		closeBtn: 1,
		shadeClose: false,
		skin: 'layui-layer-lan',
		shade: 0.8,
		area: ['90%', '90%'],
		content: "/list/group?station_name=" + stationName + "&station_id=" + stationId + "&_id=" + _id
	});
}

//无组态提示
function deliveryAlert() {
	layer.msg('暂无组态', {
		icon: 0,
		time: 1000
	})
}