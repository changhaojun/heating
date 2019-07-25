var allData = {
	accessToken: getToken(),
	user: getUser(),
	stationId: $('#stationId').val(),
	//修改
	parentData: {
		access_token: getToken(),
		scada_id: $('#scadaId').val(),
		scada_config: {
			data_list: [ //基础数据
				{
					label_id: '', //数据id
					label_name: '', //数据名称
					label_value: '', //数据值
					label_unit: '' //数据单位
				}
			]
		}
	}
}

$.extend({
	init: function() {
		$.getData(function() {
			$.getDataFromChild();
		})
	},
	getData: function(callback) {
		$.ajax({
			type: "get",
			url: globalurl + '/v1_0_0/station/' + allData.stationId + '/datas',
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				access_token: allData.accessToken,
			},
			success: function(data) {
				//				console.log(data)
				var rows = []
				for (var i = 0; i < data.length; i++) {
					var datas = {}
					if (data[i].data_unit == 'm³/h') {
						data[i].data_unit = 'm3/h'
					}
					datas.label_id = data[i].data_id;
					datas.label_name = data[i].tag_name;
					datas.label_value = data[i].data_value;
					datas.label_unit = data[i].data_unit;
					rows.push(datas)
				}
				allData.parentData.scada_config.data_list = rows
				$('#scada').attr('src', 'http://114.215.46.56:18822/scada').on('load', function() {
					$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
					//					console.log(allData.parentData)
				})
				callback && callback();
			}
		})
	},
	getDataFromChild: function() {
		$(window).on('message', function(ev) {
			//			console.log(ev.originalEvent.data); //从子层传回的数据
			//code = 200, 新增成功 //返回组态id,  //code = 201, 修改成功 ,  //code = 500, 直接返回
			if (ev.originalEvent.data.code == 201) {
				self.location.href = '/boxlist'
			} else if (ev.originalEvent.data.code == 500) {
				self.location.href = '/boxlist'
			}
		});
	}
});

$.init();