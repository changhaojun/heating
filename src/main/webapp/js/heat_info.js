var accessToken = getToken();
var stationId = $('#stationId').val();
//console.log(getUser())
var code = getUser().company_code.split("");
var companyCode, companyId;
if (code.length == 6) {
	companyCode = $('#companyCode').val();
	companyId = $("#companyId").val();
} else {
	companyCode = getUser().company_code;
	companyId = getUser().company_id;
}

/*var globalurl="http://192.168.1.109";
//var globalurl="http://121.42.253.149:18816";
var accessToken ="59520b36685a490006cf38fa";
*/
var allData = {
	//换热站ID
	stationId: $('#stationId').val(),
	//换热站参数信息
	stationData: {
		station_name: "",
		create_company: "",
		create_date: "",
		heat_purpose: 0,
		exchange_type: 0,
		lat: "", //纬度
		lng: "", //经度
		heat_type: 0,
		total_area: "",
		station_elevation: "",
		building_area: "",
		building_count: "",
		building_sum: "",
		control_type: 0,
		heat_consumer: "",
		heat_source_distance: "",
		heat_station_type: 0,
		houses: "",
		residential_area: "",
		system_form: 0,
		remark: "请输入备注信息",
		_id: "",
	},
	stationLoc: {
		station_loc: "",
	},
	map: '',
	myIcon: "",
	local: '',
	selectBranch: 0,
	branchId: '' //选中支线id
};
var point;
$extend = $.fn.extend({
	//聚焦失焦颜色变化
	borderColor: function() {
		$(this).focus(function() {
			$(this).css('borderColor', '#1ab394');
		});
		$(this).blur(function() {
			$(this).css('borderColor', '#e5e6e7');
		});
		return $(this);
	},
	//回车键响应
	enterKey: function(callBack) {
		$(this).keyup(function(ev) {
			if (ev.which === 13) {
				$(this).blur();
				callBack && callBack.call($(this));
			}
			return false;
		});
	},
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function(ev) {
			if (ev.keyCode == 32) {
				$(this).val($(this).val().replace(/\s/g, ''));
				eval('allData.' + $(this).attr('datasrc') + '=$(this).val()');
			}

		});
	},
	//非数字限制输入
	numOnly: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/[^0-9-]/g, ''));
			//eval('allData.' + $(this).attr('datasrc') + '=$(this).val()');
		});
	},
	//非时间限制输入
	timeOnly: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, ''));
			//eval('allData.' + $(this).attr('datasrc') + '=Number($(this).val())');
		});
	},
	//提交按钮状态相应
	changeTip: function(content) {
		$(this).html(content);
	},
	//数据提交
	mainSubmit: function() {
		$(this).attr('isright', 'false');
		$.isEmpty($('.dataInfo'), $(this));
		//console.log(allData)
		if ($(this).attr('isright') === 'false') {
			return;
		} else {
			$(this).attr('disabled', true);
		};
		$(this).changeTip('正在保存，请稍后...');
		$.saveAjax();
	},
	remarks: function() {
		$(this).focus(function() {
			if ($(this).val() == "请输入备注信息") {
				$(this).val("");
			}
		});
		$(this).blur(function() {
			if ($(this).val() == "") {
				$(this).val("请输入备注信息")
			}
		});
		//return $(this);
	},
	//正则判断
	reg: function() {
		var regTime = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
		$(this).blur(function() {
			if (!regTime.test($(this).val())) {
				$(this).val("");
			}
		})
		return $(this)
	},
	//判断支线哪一个选中
	selectBranch: function() {
		$(this).change(function() {
			allData.selectBranch = 1;
			allData.branchId = $(this).find('option:selected').attr('data_id');
			allData.stationData.branch_id = allData.branchId
		})
	}

});

$.extend({
	//获取数据
	init: function() {
		//创建时间对象
		var device = new Vue({
			el: '#demo',
			data: allData,
			methods: $extend
		});
		$('input').limitSpacing();
		$("input ,select,textarea").borderColor();

		$('#create_date').daterangepicker({
			singleDatePicker: true,
			startDate: moment()
		}, function(start, end) {
			//console.log(start)
			allData.stationData.create_date = new Date(start).getFullYear() + "-" + $.addZero(new Date(start).getMonth() + 1) + "-" + $.addZero(new Date(start).getDate());
			//console.log(allData.stationData.create_date)
		});
		$('input').filter('[num-limit=limit]').numOnly();
		$('input').filter('[time-limit=limit]').reg();
		$.getData();
		$('#main-submit').click(function() {
			$(this).mainSubmit();
		});
		$(".location").click(function() {
			self.location.href = '/boxlist';
		})
		$("textarea").remarks();
		$("i.fa-map-marker").click(function() {
			$.layerMap();
		});
		$.getBranchData()
	},
	getData: function() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/station/' + stationId + '/files',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken
			},
			success: function(data) {
				//console.log(data);
				/*switch (data.heat_purpose){
					case 1 :data.heat_purpose="采暖" ; break;
					case 2 :data.heat_purpose="生活热水" ; break;
				}
				switch (data.exchange_type){
					case 1 :data.exchange_type="水水换热" ; break;
					case 2 :data.exchange_type="水汽换热" ; break;
				}
				switch (data.heat_type){
					case 1 :data.heat_type="地暖" ; break;
					case 2 :data.heat_type="散热器" ; break;
				}*/
				if (data.remark == null) {
					data.remark = "请输入备注信息";
				}
				//data.station_loc='经度：'+data.lng+',纬度：'+data.lat;
				if (data.lng == null) {
					allData.stationLoc.station_loc = "请输入地理坐标";
				} else {
					allData.stationLoc.station_loc = '经度：' + data.lng + ',纬度：' + data.lat;
				}
				allData.stationData = data;
				allData.branchId = allData.stationData.branch_id;
			}

		});
	},
	addZero: function(s) {
		return s < 10 ? '0' + s : s;
	},
	//工具类->layer提示
	layerTip: function(focusElem, message) {
		layer.tips(message, focusElem, {
			tips: [1, '#ff787b'],
			time: 3000,
			tipsMore: true
		});
	},
	//保存修改信息
	saveAjax: function() {
		//	allData.stationData.station_loc=allData.local;
		/*switch (allData.stationData.heat_purpose){
			case "采暖" :allData.stationData.heat_purpose=1 ; break;
			case "生活热水" :allData.stationData.heat_purpose=2 ; break;
		}
		switch (allData.stationData.exchange_type){
			case "水水换热" :allData.stationData.exchange_type=1 ; break;
			case "水汽换热" :allData.stationData.exchange_type=2 ; break;
		}
		switch (allData.stationData.heat_type){
			case "地暖" :allData.stationData.heat_type=1 ; break;
			case "散热器" :allData.stationData.heat_type=2 ; break;
		}*/
		if (allData.stationData.remark == "请输入备注信息") {
			allData.stationData.remark = null;
		}
		allData.stationData.create_date = $("#create_date").val();
		//				console.log(allData.branchId)
		$.ajax({
			type: 'put',
			dataType: 'json',
			url: globalurl + '/v1_0_0/files',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				data: JSON.stringify(allData.stationData),
				company_code: companyCode,
				company_id: companyId,
				branch_id: allData.branchId
			},
			success: function(data) {
				//console.log(data);
				switch (data.code) {
					case 200:
						layer.msg(data.success, {
							icon: 1,
							end: function() {
								self.location.href = '/boxlist';
							}
						});
						break;
					case 400017:
						layer.msg(data.error, {
							icon: 2,
							end: function() {
								window.location.reload() //刷新当前页面
							}
						});
				}
			}

		});
	},
	//判断是否有未填写项目
	isEmpty: function(parent, target) {
		$.each(parent.find('input'), function(i) {
			if ($(this).attr('empty')) {
				$(this).focus();
				$(this).css('borderColor', '#ff787b');
				if ($(this).attr('type') == 'text') {
					$.layerTip($(this), $(this).attr('warning'));
				} else {
					$.layerTip($(this).next(), $(this).attr('warning'));

				}
				target.attr('isright', 'false');
				return false;

			} else {
				if ($('#branchName').val() == '请选择所属支线' && i == 6) {
					$('#branchName').focus();
					console.log(this)
					$('#branchName').css('borderColor', '#ff787b');
					$.layerTip($('#branchName'), '请选择所属支线');
					target.attr('isright', 'false');
					return false;
				} else {
					target.attr('isright', 'true');
				}
			}
		});

	},
	//点击地理图标的弹窗事件
	layerMap: function() {
		var str = '<div id="allmap"></div>';
		layer.open({
			type: 1,
			title: '选择地理坐标',
			skin: 'layui-layer-lan', //样式类名
			closeBtn: 1, //不显示关闭按钮
			anim: 2,
			shadeClose: true, //开启遮罩关闭
			area: ['70%', '60%'],
			move: false,
			content: str,
			end: function() {

				//delValue=$(".dial").val();
			}
		});
		$.mapshow();
	},
	//地图的初始化
	mapshow: function() {
		var lng;
		var lat;
		allData.map = new BMap.Map("allmap"); // 创建Map实例
		allData.map.centerAndZoom('西安', 12)
		allData.map.disableDoubleClickZoom(true); //双击放大
		allData.map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
		allData.map.enableAutoResize(); //启用自动适应容器尺寸变化，默认启用
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
			"featureType": "road", //公路
			"elementType": "all",
			"stylers": {
				"visibility": "off",
			}
		}, {
			"featureType": "highway", //地铁
			"elementType": "all",
			"stylers": {
				"visibility": "off",
			}
		}]
		allData.map.setMapStyle({
			styleJson: styleJson
		});
		allData.myIcon = new BMap.Icon("../img/marker_icon.png", new BMap.Size(30, 40));
		var marker;

		point = new BMap.Point(allData.stationData.lng, allData.stationData.lat)
		marker = new BMap.Marker(point, {
			icon: allData.myIcon
		})
		allData.map.addOverlay(marker);
		//		            function showInfo(e){
		//						alert(e.point.lng + ", " + e.point.lat);
		//					}
		//					allData.map.addEventListener("click", showInfo);
		allData.map.addEventListener("click", $.showInfo);

	},
	showInfo: function(ev) {
		///console.log()
		//console.log(ev.point);
		allData.map.clearOverlays();
		point = new BMap.Point(ev.point.lng, ev.point.lat);
		marker = new BMap.Marker(point, {
			icon: allData.myIcon
		});
		allData.map.addOverlay(marker);
		allData.stationData.lng = ev.point.lng;
		allData.stationData.lat = ev.point.lat;
		//  allData.local=ev.point.lng+','+ev.point.lat;
		allData.stationLoc.station_loc = '经度：' + ev.point.lng + ',纬度：' + ev.point.lat;
	},
	//获取支线
	getBranchData: function() {
		if (companyCode == '/') {
			companyCode = "";
		}
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/branchs',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				company_code: companyCode,
				station_id: stationId
			},
			success: function(data) {
				for (var i in data) {
					$('#branchName').append('<option data_id=' + data[i].branch_id + ' value=' + data[i].branch_name + '>' + data[i].branch_name + '</option>')
					if (allData.stationData.branch_id == data[i].branch_id) {
						$("#branchName").find('option').attr("selected", true);
					}
				}
				$("#branchName").selectBranch();
			}
		})

	}
});

$.init();