var accessToken = getToken();
var user = getUser();
var datas = [];
var searchData = []; //查询数据
var heatTogg = true; //是否显示热力图
var conEnergyData = []; //分公司数据
var code = user.company_code; //公司code
var s;
var zoom; //地图等级
var areas = 0; //初始化总公司的供热面积
var counts = 0;

$(function() {
	getHeatStand()
	allCompany()
	event1($("#searchId"), "请输入关键字查找");
	searchContent();
	clickDragend();
	searched();
	toggRoll()
})

//初始化地图
var map = new BMap.Map('allMap', {
	minZoom: 11,
	maxZoom: 17,
	enableMapClick: false
})
map.centerAndZoom('西安', 12)
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
})

//获取所有换热站
function getHeatStand() {
	layer.msg('数据加载中...', {
		icon: 16,
		shade: 0.01,
		time: -1
	});
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/stationAllDatas?tag_id=4',
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
							if (data[i].data.rd != null) {
								data[i].count = data[i].data.rd
							} else {
								data[i].count = '无数据'
							}
						} else {
							data[i].count = '无数据'
						}
						datas.push(data[i])
					}
				}
				
                
				for (var j = 0; j < datas.length; j++) {
					if (datas[j].count != '无数据') {
						counts = counts + datas[j].count
					}
					areas = areas + (datas[j].total_area) * 1
				}
				//					console.log(datas)
				layer.closeAll() //关闭layer弹窗
				view(datas)
				addMarker(datas)
				er = (counts / datas.length).toFixed(2)
				aa = areas

				$('.top .citychangeopt span').attr('id', user.company_code)
				$('.energy i').empty()
				$('.area i').empty()
				$('.energy i').append(er + "KJ/㎡")
				$('.area i').append(parseInt(aa / 10000) + "万㎡")
				$('.top .citychangeopt span').html(user.company_name.substring(0, 2))
				$('.listTop u span').html(user.company_name).attr('id', user.company_code)
				getCompany()
					//					callback && callback();
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
	//      console.log(view)
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
	if (points1 != '') {
		//添加热力图
		heatmapOverlay = new BMapLib.HeatmapOverlay({
			"radius": 20
		});
		map.addOverlay(heatmapOverlay)
		heatmapOverlay.setDataSet({
			data: points1,
			max: 1
		});
	}

	var marker;
	var se;
	var en, ar;
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
		if (en >= 0 && en < 1000) {
			s = "#05ba74"
		}
		if (en >= 1000 && en < 2000) {
			s = "#64d102"
		}
		if (en >= 2000 && en < 3000) {
			s = "#a4df06"
		}
		if (en >= 3000 && en < 4000) {
			s = "#d2df06"
		}
		if (en >= 4000 && en < 5000) {
			s = "#ffd800"
		}
		if (en >= 5000 && en < 6000) {
			s = "#ffc600"
		}
		if (en >= 6000 && en < 7000) {
			s = "#ffa200"
		}
		if (en >= 7000 && en < 8000) {
			s = "#ff8400"
		}
		if (en >= 8000 && en < 9000) {
			s = "#d94e1d"
		}
		if (en >= 9000 && en <= 10000) {
			s = "#ca1414"
		}
		if (en > 10000) {
			s = "#ca1414"
		}

		var point = new BMap.Point(points1[i].lng, points1[i].lat)
		marker = new BMap.Marker(point, {
				icon: new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
					scale: n, //图标缩放大小
					fillColor: s, //填充颜色
					fillOpacity: 1, //填充透明度
					strokeColor: s
				})
			})
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
	//给marker添加提示
	var str = '',
		label;
	if (points1[i].count == '无数据') {
		count = '无数据'
	} else {
		count = points1[i].count.toFixed(2) + 'KJ/㎡'
	}
	if (points1[i].total_area == undefined) {
		area = '无数据'
	} else {
		area = points1[i].total_area + '㎡'
	}

	str = '<div>' +
		'<span style="font-size:14px; color:#1ab394;">' + points1[i].station_name + '</span>' + '<br>' +
		'<span>' + "热单耗: " + count + '</span>' + '&nbsp;&nbsp;' + '<br>' +
		'<span>' + "供热面积: " + area + '</span>'
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
		fontSize: "10px",
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
	var standName = points1[i].station_name
	var stationId = points1[i].station_id
	marker.addEventListener('click', function() {
		showconsumeLayer(stationId, standName, 3, 0)
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

			if (code == user.company_code) {
				if (zoom < 16) {
					heatTogg = true;
					addMarker(datas)
				} else {
					heatTogg = false;
					addMarker(datas)
				}
			} else {
				if (zoom < 16) {
					heatTogg = true;
					addMarker(conEnergyData)
				} else {
					heatTogg = false;
					addMarker(conEnergyData)
				}
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
		//			console.log(code)
		if ($('#searchId').val() == '请输入关键字查找' || $('#searchId').val() == '') {

			$('#searchId').blur()
			$('.cardlist').empty()
			$('.cardlist').css('padding', 0)

			if (code == user.company_code) {
				if (zoom < 16) {
					heatTogg = true;
					addMarker(datas)
				} else {
					heatTogg = false;
					addMarker(datas)
				}
			} else {
				if (zoom < 16) {
					heatTogg = true;
					addMarker(conEnergyData)
				} else {
					heatTogg = false;
					addMarker(conEnergyData)
				}
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
		//			console.log(code)
		//			console.log(zoom)
		if (code == user.company_code) {
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
					//					console.log(datas)
			}
		} else {
			if (zoom < 16) {
				heatTogg = true;
				addMarker(conEnergyData)
			} else {
				heatTogg = false;
				addMarker(conEnergyData)
			}
			if (datas.length > 0) {
				var str = ''
				$('.cardlist').empty()
				$('.cardlist').css('padding', 0)
					//					console.log(conEnergyData)
			}
		}
	} else {
		if (code == user.company_code) {
			searchData = []
			for (var i = 0; i < datas.length; i++) {
				if (datas[i].station_name.search($('#searchId').val()) != -1) {
					searchData.push(datas[i])
				}
			}
		} else {
			//				console.log(conEnergyData)
			searchData = []
			for (var i = 0; i < conEnergyData.length; i++) {
				if (conEnergyData[i].station_name.search($('#searchId').val()) != -1) {
					searchData.push(conEnergyData[i])
				}
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
		var str = '';
		for (var m = 0; m < searchData.length; m++) {
			var stationId = searchData[m].station_id
			var standName = searchData[m].station_name

			if (searchData[m].count == '无数据') {
				sCount = '无数据'
			} else {
				sCount = searchData[m].count.toFixed(2) + 'KJ/㎡'
			}
			if (searchData[m].total_area == undefined) {
				sArea = '无数据'
			} else {
				sArea = searchData[m].total_area + '㎡'
			}

			str = '<a href="javascript:;" onclick="showconsumeLayer(&apos;' + searchData[m].station_id + '&apos;,&apos;' + searchData[m].station_name + '&apos;,&apos;' + 3 + '&apos;,&apos;' + 0 + '&apos;)">' +
				'<li>' +
				'<p>' + searchData[m].station_name + '</p>' +
				'<p>' +
				'<span>' + '热单耗: ' + sCount + '</span>' + '<br>' +
				'<span>' + '供热面积: ' + sArea + '</span>' +
				'</p>' +
				'</li>' +
				'</a>';
			$('.cardlist').append(str)
			if (searchData.length > 0) {
				$('.cardlist').css('padding', 0)
			} else {
				$('.cardlist').css('padding', '5px 10px')
			}
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

//获取分公司
function getCompany() {
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/allChildCompany',
		data: {
			access_token: accessToken,
			company_code: user.company_code
		},
		success: function(data) {
			//				console.log(data)
			if (data) {
				comData = data
				var str = ''
				for (var i = 0; i < data.length; i++) {
					str = '<li class="sLi">' +
						'<span class="sCom" id="' + data[i].company_code + '" data-code="' + data[i].company_id + '" onclick="getCompanyEnergy(&apos;' + data[i].company_code + '&apos;)"  title="' + data[i].company_name + '">' + data[i].company_name + '</span>' +
						'</li>';
					$('.company_ul').append(str)
				}
			}
		}
	})
}

//获取分公司下的换热站
function getCompanyEnergy(id) {
	layer.msg('数据加载中...', {
		icon: 16,
		shade: 0.01,
		time: -1
	});
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/stationAllDatas?tag_id=4&company_code=' + id + '',
		data: {
			access_token: accessToken
		},
		success: function(data) {
			//				console.log(data)
			layer.closeAll();
			code = id
			conEnergyData = []; //每个分公司下的换热站数据
			if (data.length > 0) {
				var conEr = 0,
					conAa = 0;
				for (var i = 0; i < data.length; i++) {
					if (data[i].lng && data[i].lat) {
						if (data[i].data != null) {
							if (data[i].data.rd != null) {
								data[i].count = data[i].data.rd
							} else {
								data[i].count = '无数据'
							}
						} else {
							data[i].count = '无数据';
						}
						conEnergyData.push(data[i])
					}
				}
				for (var j = 0; j < conEnergyData.length; j++) {
					if (conEnergyData[j].count != '无数据') {
						conEr = conEr + conEnergyData[j].count
					}
					conAa = conAa + (conEnergyData[j].total_area) * 1
				}
				//					console.log(conEnergyData)

				$('.listTop u span').removeClass('sColor')
				$('.sLi span').removeClass('sColor')
				$('#' + id).addClass('sColor')
				var cName = $('#' + id).html()
				var index = $('#' + id).attr('data-code')
				$('.top .citychangeopt span').html('')
				$('.top .citychangeopt span').html($('#' + id).html().substring(0, 2))
				$('.top .citychangeopt span').attr('id', id)
				$('.top .citychangeopt span').attr('data-code', index)

				er = (conEr / conEnergyData.length).toFixed(2)
				aa = conAa

				$('.energy i').html('')
				$('.area i').html('')
				$('.energy i').append(er + 'KJ/㎡')
				$('.area i').append(parseInt(aa / 10000) + "万㎡")
				$('#searchId').val('请输入关键字查找')
				$('.cardlist').empty()
				heatTogg = true
				view(conEnergyData);
				addMarker(conEnergyData)
			} else {
				$('.listTop u span').removeClass('sColor')
				$('.sLi span').removeClass('sColor')
				$('#' + id).addClass('sColor')
				var cName = $('#' + id).html()
				var index = $('#' + id).attr('data-code')
				$('.top .citychangeopt span').html('')
				$('.top .citychangeopt span').html($('#' + id).html().substring(0, 2))
				$('.top .citychangeopt span').attr('id', id)
				$('.top .citychangeopt span').attr('data-code', index)

				$('.energy i').html('无数据')
				$('.area i').html('无数据')

				$('#searchId').val('请输入关键字查找')
				$('.cardlist').empty()

				heatTogg = true
				view(conEnergyData);
				addMarker(conEnergyData)
			}
		}
	})
}

//点击总公司样式
function allCompany() {
	$('.listTop u span').click(function() {
		$('.sLi span').removeClass('sColor')
		$(this).addClass('sColor')
		code = $(this).attr('id')

		$('.top .citychangeopt span').html('')
		$('.top .citychangeopt span').html($(this).html().substring(0, 2))
		view(datas)
		addMarker(datas)

		er = (counts / datas.length).toFixed(2)
		aa = areas
		$('.top .citychangeopt span').attr('id', user.company_code)
		$('.energy i').empty()
		$('.area i').empty()
		$('.energy i').append(er + "KJ/㎡")
		$('.area i').append(parseInt(aa / 10000) + "万㎡")

		$('#searchId').val('请输入关键字查找')
		$('.cardlist').empty()
	})
}

//点击图标显示图表
function cLog() {
	if ($('.top .citychangeopt span').attr('id') == user.company_code) {
		var comId = user.company_id
		var comName = user.company_name
		var companyCode = user.company_code
		showconsumeLayer(comId, comName, 1, companyCode)
	} else {
		var comId = $('.top .citychangeopt span').attr('data-code')
		var comName1 = $('.top .citychangeopt span').html()
		var comName = comName1 + '分公司'
		var companyCode = $('.top .citychangeopt span').attr('id')
		showconsumeLayer(comId, comName, 2, companyCode)
	}
}
$('.clog img').click(function() {
	cLog()
})

//点击显示水压图弹窗
function showconsumeLayer(showId, showName, maplevel, companyCode) {
	//  	console.log(showId)
	//  	console.log(companyCode)
	layer.open({
		type: 2,
		title: showName + '能耗',
		skin: 'layui-layer-molv',
		shadeClose: true,
		shade: 0.5,
		moveType: 2,
		area: ['70%', '83%'],
		content: "/thematic/energyChart?show_id=" + showId + "&maplevel=" + maplevel + "&company_code=" + companyCode
	});
}