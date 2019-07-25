var accessToken = getToken();
var allData = {
	//换热站ID
	stationId: $('#stationId').val(),
	//换热站参数信息
	stationData: {
		network_path: "",
		plan_heating_index: "",
		plate_area: "",
		plate_heat: "",
		plate_type: 0,
		recycle_pump_flow: "",
		recycle_pump_headup: "",
		recycle_pump_power: "",
		supply_pump_flow: "",
		supply_pump_headup: "",
		supply_pump_power: "",
		theory_heat_load: "",
		two_network_path: "",
		_id: ""
	}
};
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
			eval('allData.' + $(this).attr('datasrc') + '=Number($(this).val())');
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
			if ($(this).attr('isright') === 'false') {
				return;
			} else {
				$(this).attr('disabled', true);
			};
			$(this).changeTip('正在保存，请稍后...');
			$.saveAjax();
			//$.doPortAjax();
		}
		//将请求回来的数据写入input

});

$.extend({
	//获取数据
	init: function() {
		var device = new Vue({
			el: '#demo',
			data: allData,
			methods: $extend
		});
		$('input').limitSpacing();
		$("input ,select").borderColor();
		$('input').filter('[num-limit=limit]').numOnly();
		$.getData();
		$('#main-submit').click(function() {
			$(this).mainSubmit();
		});
		$(".location").click(function() {
			self.location.href = '/boxlist';
		});
	},
	getData: function() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/station/' + allData.stationId + '/params',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken
			},
			success: function(data) {
				//console.log(data);
				if (data.params.length > 0) {
					allData.stationData = data.params[0];
				}

			}

		});
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
		//console.log(allData.stationData.plate_type)
		//				switch (allData.stationData.plate_type){
		//					case "可拆卸办事换热器" :allData.stationData.plate_type=1 ; break;
		//					case "焊接板式换热器" :allData.stationData.plate_type=2 ; break;
		//					case "螺旋板式换热器" :allData.stationData.plate_type=3 ; break;
		//					case "板卷式换热器":allData.stationData.plate_type= 4; break;
		//				}
		$.ajax({
			type: 'put',
			dataType: 'json',
			url: globalurl + '/v1_0_0/params',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				data: JSON.stringify(allData.stationData),
				station_id: allData.stationId
			},
			success: function(data) {
				//console.log(data);
				switch (data.code) {
					case 200:
						layer.msg(data.error, {
							icon: 1,
							end: function() {
								self.location.href = '/boxlist';
							}
						});
						break;
					case 40017:
						layer.msg(data.error, {
							icon: 2,
							end: function() {
								$('#main-submit').html("保存配置");
							}
						});
				}
			}

		});
	},
	//判断是否有未填写项目
	isEmpty: function(parent, target) {
		$.each(parent.find('input'), function() {
			if ($(this).attr('empty')) {
				$(this).focus();
				$(this).css('borderColor', '#ff787b');
				$.layerTip($(this), $(this).attr('warning'));
				target.attr('isright', 'false');
				return false;
			} else {
				target.attr('isright', 'true');
			}
		});
	},

});

$.init();