var allData = {
	accessToken: getToken(),
	user: getUser(),
	stationId: $('#stationId').val(),
	//查看
	stationName:$('#stationName').val(),
	parentData: {
		access_token: getToken(),
		scada_id: $('#scadaId').val()
	},
}
var Vue = new Vue({
	el:'#layui-layer-iframe2',
	data:{
		nopas:false
	},
})
$.extend({
	init: function() {
		$.getData(function() {
			//mqtt推送来数据后执行刷新数据标签
			//			$('#scada').get(0).contentWindow.postMessage(row,'*');

			//			})
		});
		$.messageFromChild();
	},
	getData: function(callback) {
		$.ajax({
				type: "get",
				url: globalurl + '/v1_0_0/station/' + allData.stationId + '/datas',
				dataType: "JSON",
				crossDomain: true == !(document.all),
				data: {
					access_token: allData.accessToken
				},
				success: function(data) {
					//				console.log(data)
					allData.datas = data
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
					//初始化数据标签
					$('#scada').attr('src', 'http://114.215.46.56:18822/scada').on('load', function() {
						$(this).get(0).contentWindow.postMessage(rows, '*');
						//					console.log(rows)
					})
					callback && callback();
				}
			})
			//给子层传递参数获取组态页面
		$('#scada').attr('src', 'http://114.215.46.56:18822/scada').on('load', function() {
			$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
			//console.log(allData.parentData)
		})
	},
	//点击标签事件
	messageFromChild: function() {
		$(window).on('message', function(ev) {
			if (ev.originalEvent.data.code == 300) {
				allData.dataTag = '';
				allData.dataValue = '';
				var label = ev.originalEvent.data.data.label_id;
				for (var i = 0; i < allData.datas.length; i++) {
					if (label == allData.datas[i].data_id) {
						allData.dataTag = allData.datas[i].tag_id
						allData.dataValue = allData.datas[i].data_value
						allData.dataId = allData.datas[i].data_id
					}
				}
				//				console.log(allData.dataTag)
				if (allData.dataTag == 0) {
					//下发
					$.only(allData.dataTag, allData.dataValue, allData.dataId);
				} else {
					//图表
					layer.open({
						type: 2,
						title: $("#stationName").val(),
						shadeClose: true,
						skin: 'layui-layer-lan',
						shade: 0.8,
						area: ['80%', '80%'],
						content: '/list/chart?station_id=' + $("#stationId").val() + "&station_name=" + $("#stationName").val() + "&tagLevel=3&num=" + allData.dataTag //iframe的url
					})
				}
			}

		})
	},
	give: function(tag, value, id) {
		var issuePassword = sessionStorage.getItem("issuePassword");
		var noPassword = '';
		var errorPassword = '';
		if(errorPassword == true || issuePassword == null){
			noPassword = true;
		}
		
		var noPassWordStr = "<div v-show='nopas' class='noPassword'><span class='issuedPasswordTitle'>下发密码:</span><input class='issuedPassword' placeholder = '请输入下发密码'/></div>";
		var hasPasswordStr = "<div clsss='hasPassword'>确认下发?</div>"
		layer.confirm(noPassword==false?hasPasswordStr:noPassWordStr, {
			skin: 'title-class',
			shade: [0.7, '#ffffff']
		}, function(index) {
			var inputIssuePassword = $('.issuedPassword').val();
			layer.close(index);
			var token = $("#token").val() ? $("#token").val() : top.getToken();
			issuePassword = noPassword == false?issuePassword:inputIssuePassword;
			
			$.ajax({
				url: globalurl + "/v1_0_0/stationIssued",
				dataType: 'JSON',
				data: {
					issue_password:issuePassword,
					access_token: allData.accessToken,
					station_id: allData.stationId,
					tag_id: tag,
					data_value: $(".dial").val()
				},
				type: 'POST',
				success: function(data) {
					//	console.log(data);
					
					allData.row = [];
					var datas = {};
					if (data.issued.result == 1) {					
						$("#sleep_box").hide();
						layer.msg("下发成功！", {
							icon: 1,
							time: 1000,
							end: function() {
								for (var i = 0; i < allData.datas.length; i++) {
									if (allData.datas[i].data_id == id) {
										allData.datas[i].data_value = $(".dial").val();
									}
								}
								layer.closeAll();
							}
						});
						//组织数据向子层传递信息
						datas.label_id = id
						datas.label_value = $(".dial").val()
						allData.row.push(datas)
							//						console.log(allData.row)
						$('#scada').get(0).contentWindow.postMessage(allData.row, '*');
						//存储密码
						sessionStorage.setItem("issuePassword", issuePassword);
					} else {
						$("#sleep_box").hide();
						layer.msg("下发失败！");
						errorPassword = true;
					}
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg("下发失败！");
				}
			});
		});
	},
	//批量下发
	more: function(tag, value, id) {
		var titleStr = '<i onclick="$.only(' + tag + "," + value + ',' + id + ')">下发</i><i class="layui-layer-tabnow" >批量下发</i>';
		layer.closeAll();
		layer.open({
			type: 2,
			title: titleStr,
			shadeClose: true,
			skin: 'layui-layer-lan',
			area: ['82%', '90%'],
			content: '/list/controller?station_id=' + $("#stationId").val() + '&tag_id=' + tag //iframe的url
		});
	},
	//单个下发
	only: function() {
		layer.closeAll();
		self.location.href ='/list/strategy?station_id=' + allData.stationId + '&name=' + encodeURIComponent(allData.stationName)
	}

//		var titleStr = '<i class="layui-layer-tabnow">下发</i><i onclick="$.more(' + tag + "," + value + ',' + id + ')">批量下发</i>';
//		var str = '<div class="listContent">' +
//			'<div class="contentTop">' +
//			'<div class="water">' +
//			'<div class="finfosoft-ring board-ring">' +
//			'<canvas></canvas>' +
//			'<input type="text" value="' + value + '" class="dial"/>' +
//			'</div>' +
//			'<button type="button"id="give" onclick="$.give(' + tag + "," + value + ',' + id + ')">下发</button>' +
//			'</div>' +
//			'</div>' +
//			'<div class="contentBottom">' +
//			//								'<span class="fa fa-clock-o"></span>'+
//			'</div>' +
//			'</div>';
//		layer.closeAll();
//		layer.open({
//			type: 1,
//			title: titleStr,
//			skin: 'layui-layer-lan', //样式类名
//			closeBtn: 1, //不显示关闭按钮
//			anim: 2,
//			shadeClose: true, //开启遮罩关闭
//			area: ['350px', '270px'],
//			content: str,
//			end: function() {
//
//			}
//		});
//		new Finfosoft.Ring({
//			el: '.board-ring',
//			startDeg: 150,
//			endDeg: 30,
//			lineWidth: 20,
//			mainColor: '#1AB394'
//		});

	
})
$.init();

//订阅后台的推送消息
function MQTTconnect() {
	console.log("订阅程序开始执行");
	var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	var options = {
		timeout: 1000,
		onSuccess: onConnect,
		onFailure: function(message) {
			setTimeout(MQTTconnect, 10000000);
		}
	};
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	if (username != null) {
		options.userName = username;
		options.password = password;
	}
	client.connect(options);
	// connect the clien
}

// called when the client connects
//	function onConnect() {
//	    console.log("onConnect");
//	    topic = company_id;
//	    client.subscribe(topic);
//	}
function onConnect() {
	console.log("onConnect");
	for (var i = 0; i < data.length; i++) {
		//		  	console.log("订阅第"+i+"个主题");
		//		  	console.log(data[i]);
		topic = data[i] + "";
		client.subscribe(topic);
	}
}
// called when the client loses its connection
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}

// called when a message arrives
function onMessageArrived(message) {
	var topic = message.destinationName;
	var payload = message.payloadString;
	var dataConfig = JSON.parse(payload)
		//console.log(dataConfig)

}