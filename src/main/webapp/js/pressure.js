var accessToken = getToken();
var user = getUser();
var datas = [];
var searchData = [];
var heatTogg = true;
var s;
//var marker;

$(function() {
	getHeatStand()
	event1($("#searchId"), "请输入关键字查找");
	searchContent();
	clickDragend();
	searched();
	toggRoll()
})

//初始化地图
var map = new BMap.Map('allMap', {
	maxZoom: 18,
	minZoom: 11,
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

//获取换热站
function getHeatStand() {
	layer.msg('数据加载中', {
		icon: 16,
		shade: 0.01,
		time: -1
	});
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/stationAllDatas?tag_id=12',
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
							if (data[i].data['1gy'] != null) {
								data[i].count = data[i].data['1gy']
							} else {
								data[i].count = '-'
							}
						} else {
							data[i].count = '-'
						}
						datas.push(data[i])
					}
				}
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
				//					for(var i=0;i<data.length;i++){
				//						for(var j=0;j<data[i].value.length;j++){
				//							if(data[i].value[j].data_tag==12){
				//								if(data[i].value[j].data_value==null){
				//									data[i].count='-'
				//								}else{
				//									data[i].count=data[i].value[j].data_value;
				//								}
				//							}
				//						}
				//					}
				//					console.log(datas)
				layer.closeAll() //关闭layer弹窗
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
		max: 1
	});

	var marker;
	var se;
	var en, ar;
	for (var i = 0; i < points1.length; i++) {
		if (points1[i].count) {
			en = points1[i].count

		}
		if (points1[i].totalArea) {
			ar = points1[i].totalArea
		} else {
			ar = "-"
		}
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
		if (en == "-") {
			s = "#828080"
		}
		if (en < 0) {
			s = "#05ba74"
		}
		if (en >= 0 && en < 0.1) {
			s = "#05ba74"
		}
		if (en >= 0.1 && en < 0.2) {
			s = "#64d102"
		}
		if (en >= 0.2 && en < 0.3) {
			s = "#a4df06"
		}
		if (en >= 0.3 && en < 0.4) {
			s = "#d2df06"
		}
		if (en >= 0.4 && en < 0.5) {
			s = "#ffd800"
		}
		if (en >= 0.5 && en < 0.6) {
			s = "#ffc600"
		}
		if (en >= 0.6 && en < 0.7) {
			s = "#ffa200"
		}
		if (en >= 0.7 && en < 0.8) {
			s = "#ff8400"
		}
		if (en >= 0.8 && en < 0.9) {
			s = "#d94e1d"
		}
		if (en >= 0.9 && en <= 1) {
			s = "#ca1414"
		}
		if (en > 1) {
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
			offset: new BMap.Size(-16, 36) //设置文本偏移量
		}
		var label2 = new BMap.Label(points1[i].station_name.substring(0, 4), opts)
		label2.setStyle({
			color: "#fff",
			fontSize: "10px",
			borderRadius: "10px",
			backgroundColor: s,
			padding: "3px",
			border: "none",
			width: "55px",
			textAlign: "center"
		})
		if (i < 20) {
			//	        	console.log(i)
			marker.setLabel(label2)
		}
		map.addOverlay(marker)
		hide_overlay(marker)
		addLabel(marker, points1, i)
		toggDrag(marker)
			//          toggRoll(marker)
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
	var str = '';
	if (points1[i].count == '-' || points1[i].count == undefined) {
		count1 = '无数据'
	} else {
		count1 = points1[i].count + 'Mpa'
	}
	str = '<div>' +
		'<span style="font-size:14px; color:#1ab394;">' + points1[i].station_name + '</span>' + '<br>' +
		'<span>' + "一网供压:" + count1 + '</span>' + '&nbsp;&nbsp;' +
		'</div>'
	var label = new BMap.Label(str, {
		offset: new window.BMap.Size(40, -45)
	});
	label.setStyle({
		display: "none",
		borderColor: "#ccc",
		padding: "5px"
	})
	marker.setLabel(label)

	//给marker添加label1(点的值)
	var label1 = new BMap.Label(points1[i].count)
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
	//		marker.setLabel(label1)

	//给point添加label2(点的名称)
	/*var opts = {
			position : point,    // 指定文本标注所在的地理位置
			offset   : new BMap.Size(-16, 36)    //设置文本偏移量
		}
        var label2 = new BMap.Label(points1[i].station_name.substring(0,4),opts)
        label2.setStyle({
		    color:"#fff",
		    fontSize : "10px",
		    borderRadius:"10px",
		    backgroundColor:s,
		    padding:"3px",
		    border: "none",
		    width:"55px",
		    textAlign: "center"   
        })
        if(i<20){
        	marker.setLabel(label2)
        }*/

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
	marker.addEventListener('click', function() {
		showBranchLayer(points1[i].station_id, points1[i].station_name)
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
		var zoom = map.getZoom()
			//console.log(zoom)
		if ($('#searchId').val() == '请输入关键字查找' || $('#searchId').val() == '') {
			if (zoom < 17) {
				heatTogg = true;
				addMarker(datas)
			} else {
				heatTogg = false;
				addMarker(datas)
			}
		} else {
			//console.log(searchData)
			searchEnergy()
				//	    		heatTogg=false;
				//	    		addMarker(searchData)
		}
	})
}

//鼠标点击、拖动的监听事件
function clickDragend() {
	map.addEventListener("click", function(e) {
		$('input').blur()
		$('.cardlist').hide()
	});
	//鼠标拖动的监听事件
	map.addEventListener('dragend', function(e) {
		$('input').blur();
		$('.cardlist').hide() // 这里的this就是map实例
		if ($('#searchId').val() == '请输入关键字查找') {
			addMarker(datas)
		} else {
			addMarker(searchData)
			searchEnergy()
		}
	})
}

//模糊查询
function searchEnergy() {
	var iptval = $('#searchId').val()
	if ($('#searchId').val() == '' || $('#searchId').val() == '请输入关键字查找') {
		heatTogg = true
		addMarker(datas)
		if (datas.length > 0) {
			var str = ''
			$('.cardlist').empty()
			$('.cardlist').css('padding', 0)
				//console.log(datas)
				/*for(var m=0;m<datas.length;m++){
					var stationId=datas[m].station_id
					var standName=datas[m].station_name
					str='<a href="javascript:;" onclick="showconsumeLayer(&apos;'+datas[m].station_id+'&apos;,&apos;'+datas[m].station_name+'&apos;,&apos;'+2+'&apos;)">'+
		                '<li>'+
		                    '<p>'+datas[m].station_name+'</p>'+
		                    '<p>'+
		                        '<span>'+'一网供温:'+datas[m].count_one+'℃'+'</span>'+
		                        '<span>'+'二网供温:'+datas[m].count+'℃'+'</span>'+
		                    '</p>'+
		                '</li>'+
		            '</a>';
			        $('.cardlist').append(str);
			        $('.cardlist').css('padding','5px 10px');
				}*/
		}
	} else {
		searchData = []
		for (var i = 0; i < datas.length; i++) {
			if (datas[i].station_name.search($('#searchId').val()) != -1) {
				searchData.push(datas[i])
				var str = ''
			}
		}
		//console.log(searchData)
		heatTogg = false
		addMarker(searchData)
		$('.cardlist').empty()
		for (var m = 0; m < searchData.length; m++) {
			var stationId = searchData[m].station_id
			var standName = searchData[m].station_name
			str = '<a href="javascript:;" onclick="showBranchLayer(&apos;' + searchData[m].station_id + '&apos;,&apos;' + searchData[m].station_name + '&apos;)">' +
				'<li>' +
				'<p>' + searchData[m].station_name + '</p>' +
				'<p>' +
				'<span>' + '一网供压:' + searchData[m].count + 'Mpa' + '</span>' +
				'</p>' +
				'</li>' +
				'</a>';
			$('.cardlist').append(str)
			$('.cardlist').css('padding', '5px 10px')
		}
		//console.log($('.cardlist li').length)
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
	$('input').focus(function() {
		$('.cardlist').show()
	})
}
//点击显示水压图弹窗
function showBranchLayer(showId, showName) {
	layer.open({
		type: 2,
		title: '水压图',
		skin: 'layui-layer-molv',
		shadeClose: true,
		shade: 0.6,
		move: false,
		area: ['70%', '75%'],
		content: "/thematic/waterChart?stationId=" + showId + "&stationName=" + encodeURIComponent(showName)
	});
}