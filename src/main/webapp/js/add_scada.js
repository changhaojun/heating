var allData = {
	accessToken: getToken(),
	user: getUser(),
	stationId: $('#stationId').val(),
	//新增
	parentData: {
		access_token: getToken(),
		system: 2,
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
					//				console.log(allData.parentData)
					//父层向子层传递信息
				$('#scada').attr('src', 'http://114.215.46.56:18822/scada').on('load', function() {
					//					console.log(allData.parentData)
					$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
				})
				callback && callback();
			}
		})
	},
	getDataFromChild: function() {
		//父层接收子层信息
		$(window).on('message', function(ev) {
			//			console.log(ev.originalEvent.data); //从子层传回的数据
			//code = 200, 新增成功 //返回组态id,  //code = 201, 修改成功  ,  //code = 500, 直接返回  //code = 300, 鼠标点击数据标签后的事件
			if (ev.originalEvent.data.code == 200) {
				var scadaId = ev.originalEvent.data.data._id
				$.ajax({
					type: "post",
					url: globalurl + '/v1_0_0/station/' + allData.stationId + '/datas',
					dataType: "JSON",
					crossDomain: true == !(document.all),
					data: {
						access_token: allData.accessToken,
						scada_id: scadaId
					},
					success: function(data) {
						//						console.log(data)
						if (data.code == 200) {
							self.location.href = '/boxlist'
						}
					}
				})
			} else if (ev.originalEvent.data.code == 500) {
				self.location.href = '/boxlist'
			}
		});
	}
})
$.init();