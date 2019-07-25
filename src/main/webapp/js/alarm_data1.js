var stationId = $('#stationId').val()
var accessToken = getToken();
var user = getUser();
var dataLike;
var dataId = [];

var tagData = [];
var tagId;
var nId;
var dId;
var oId;
var sId;
var dataLikeId = [];
//var tagName;

$(function() {
	toolTips();
})

alarmList();
//getDataList();
var searchBox = new Vue({
	el: '.search',
	data: {
		searchId: ''
	}
})

//获取警告列表
function alarmList() {
	var data = {
		access_token: accessToken
	};
	allData(data)
};

function allData(data) {
	$(".IContent").html("");
	$.ajax({
		url: globalurl + '/v1_0_0/station/' + stationId + '/dataConfig',
		dataType: 'JSON',
		type: 'get',
		data: data,
		async: false,
		crossDomain: true == !(document.all),
		success: function(data) {
			//			console.log(data)
			if (data.length > 0) {
				var str = "";
				dataId = [];
				for (var i = 0; i < data.length; i++) {
					data[i].title = data[i].data_name
					Dom(data[i], i); //创建动态Dom						
					dataId.push(data[i].data_id)
				}
				dataLikeId = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].data_tag) {
						dataLikeId.push(data[i].data_tag)
					}
				}
				dataLike = data;
				//				console.log(dataLike)
				//				console.log(dataId)
				//				console.log(dataLikeId)
				if ($("#searchId").val() != "") {
					searchThing($("#searchId"))
				}
				toolTips();
				selectedData();
				getDataList();
			}
		}
	})
}
//模糊查询
function searchThing(obj) {
	$(".IContent").html("");
	var q = 0;
	for (var i = 0; i < dataLike.length; i++) {
		dataLike[i].title = dataLike[i].data_name
			//		console.log(dataLike[i].title)
		if (dataLike[i].title.search(obj.val()) != -1) {
			Dom(dataLike[i], q);
			q++;
		}
		dataId.push(dataLike[i].data_id);
	}
	if ($("#searchId").val() == "") {
		alarmList();
	}
	toolTips();
	//	MQTTconnect(dataId);
}

//动态创建DOM拼接
function Dom(data, i) {
	if (data.data_value == undefined) {
		data.data_value = "-";
	}
	if (data.data_time == undefined) {
		data.data_time = "-";
	}
	if (data.data_unit == undefined || data.data_unit == "-") {
		data.data_unit = "";
	}
	str = '<div class="alarmList greenBg" id="' + data.data_id + '">' +
		'<div class="alarmTop">' + data.data_name + '</div>' +
		'<div class="alarmContent">' +
		'<p>' +
		'</p>' +
		'<span class="dataValue">' + data.data_value + '</span>' +
		'<span class="dataUnit">' + data.data_unit + '</span>' +
		'<span class="dataTime">' + data.data_time + '</span>' +
		'</div>' +
		'<div class="alarmFooter">' +
		'<ul>' +
		'</ul>' +
		'</div>' +
		'</div>'
	$(".IContent").append(str);
	//判断是否已选择数据标签
	var op = "";
	if (data.tag_name) {
		op = '<span id="' + data.data_tag + '" class="tagName" style="margin-right:10px;">' + data.tag_name + '</span>' +
			'<span id="' + data._id + '" class="fa fa-tags" data-toggle="tooltip" data-placement="top" title="标签"></span>'
	} else {
		op = '<span class="tagName" style="margin-right:10px;">未配置</span>' +
			'<span class="fa fa-tags" data-toggle="tooltip" data-placement="top" title="标签"></span>'
	}
	$('.alarmList p').eq(i).append(op)
		//判断是否已设置告警值
	var oLi = "";
	for (var j = 0; j < 2; j++) {
		if (data.threshold == undefined || data.threshold[j] == undefined || (data.threshold[j].upper_value == "+∞" && data.threshold[j].lower_value == "-∞") || (data.threshold[j].upper_value == "" && data.threshold[j].lower_value == "")) {

			oLi = '<li>' +
				'<div class="dataLeft">未配置' +
				'</div>' +
				'<div class="dataRight">' +
				'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData(' + data.data_id + ',' + j + "," + i + ')"></i>' +
				'</div>' +
				'</li>'

		} else {
			if (data.threshold[j].lower_value == "-∞") {
				data.threshold[j].lower_value = "'-∞'";

			}
			if (data.threshold[j].upper_value == "+∞") {
				data.threshold[j].upper_value = "'+∞'";
			}
			oLi = '<li>' +
				'<div class="dataLeft">' +
				'<span>' + (data.threshold[j].lower_value) + '</span>  ~  ' +
				'<span>' + (data.threshold[j].upper_value) + '</span>' +
				'</div>' +
				'<div class="dataRight">' +
				'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="modify(' + data.data_id + "," + data.threshold[j].lower_value + "," + data.threshold[j].upper_value + "," + j + "," + i + ')"></i>' +
				'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="alarmDel(' + data.data_id + "," + data.threshold[j].lower_value + "," + data.threshold[j].upper_value + "," + j + "," + i + ')"></i>' +
				'</div>' +
				'</li>'
		}
		$(".alarmFooter ul").eq(i).append(oLi);
	}
}

//初始化提示框
function toolTips() {
	$('[data-toggle="tooltip"]').tooltip();
	topColor($(".alarmFooter ul li .fa"), "#effaf6", "#1ab394");
	topColor($(".alarmContent p .fa"), "#effaf6", "#1ab394");
}

function topColor(obj, color, fontcolor) {
	obj.on("mouseover", function() {
		$(".tooltip-inner").css({
			"background-color": color,
			"color": fontcolor
		});
		$(".tooltip.top .tooltip-arrow").css("border-top-color", color);
	})
}

//获取数据标签列表
function getDataList() {
	$.ajax({
		url: globalurl + '/v1_0_0/tags?level=2',
		dataType: 'JSON',
		type: 'get',
		data: {
			access_token: accessToken
		},
		async: false,
		success: function(data) {
			//			console.log(data)
			tagData = [];
			//			if(data.station_tag.length>0){
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					data[i].state = 0
					tagData.push(data[i])
				}
				//				console.log(tagData)
				for (var i = 0; i < tagData.length; i++) {
					for (var j = 0; j < dataLikeId.length; j++) {
						if (tagData[i].tag_id == dataLikeId[j]) {
							tagData[i].state = 1
						}
					}
				}
				//				console.log(tagData)
				$('.selectedUl').empty();
				var str = ''
				for (var i = 0; i < tagData.length; i++) {
					if (tagData[i].state == 0) {
						str = '<li class="tag" id="' + tagData[i].tag_id + '">' +
							'<span>' + tagData[i].tag_name + '</span>' +
							'</li>'
						$('.selectedUl').append(str)
					}
				}
			}
		}
	})
}

function selectedData() {
	$('.alarmList').delegate('.fa-tags', 'click', function() {
		sId = '';
		dId = '';
		oId = $(this).parents('.alarmList').attr('id')
		dId = $(this).attr('id')
		if ($(this).prev().attr('id')) {
			sId = $(this).prev().attr('id')
		}
		//		console.log(sId)
		resultBox = layer.open({
			type: 1,
			title: "选择数据标签",
			skin: 'layui-layer-molv',
			shadeClose: true,
			shade: 0.5,
			area: ['300px', '336px'],
			content: $('.confirmInfo')
		})
	})
}

//选择数据标签
$('.selectedUl').delegate('.tag', 'click', function() {
	tagId = $(this).attr('id')
	_id = oId
		//		console.log(tagId)
	layer.close(resultBox)
	var data = "{'data_id':" + _id + ",'tag_id':" + tagId + ",'station_id':'" + stationId + "'}"
	var data = {
		"data": data,
		"access_token": window.accessToken
	};
	ajax(data);
	tagId = '';
})

//取消配置的数据标签
$('.confirmInfo .fix').find('p span').click(function() {
	//	console.log(nId)
	//	console.log(sId)
	if (sId == '') {
		layer.msg('该标签未配置', {
			icon: 2
		})
	} else {
		$.ajax({
			url: globalurl + '/v1_0_0/dataConfig?access_token=' + window.accessToken + '&_id=' + dId + '',
			dataType: 'JSON',
			type: 'delete',
			data: {
				//				access_token:window.accessToken,
				//				tag_id:sId
			},
			async: false,
			crossDomain: true == !(document.all),
			success: function(data) {
				//				console.log(data)
				layer.close(resultBox)
				if (data.code == 200) {
					layer.msg('取消成功', {
						icon: 1,
						time: 1000
					}, function() {
						alarmList()
					})
				} else {
					layer.msg(data.error, {
						icon: 2,
						time: 1000
					}, function() {
						alarmList()
					})
				}
			}
		})
	}
	sId = '';
	nId = '';
})

//查找数据标签
function searchData(obj1) {
	$('.selectedUl').empty()
	for (var i = 0; i < tagData.length; i++) {
		if (tagData[i].tag_name.search(obj1.val()) != -1) {
			str = '<li class="tag" id="' + tagData[i]._id + '">' +
				'<span>' + tagData[i].tag_name + '</span>' +
				'</li>'
			$('.selectedUl').append(str)
		}
	}
}

//添加数据
function addData(_id, Iindex, dataIndex) {
	var Iindex = Iindex;
	var dataIndex = dataIndex;
	layer.alert('<input type="text" id="dataMin" placeholder="请输入最小值" onkeyup="if(event.keyCode==32){space($(this))}"/>  ~ ' +
		'<input type="text" id="dataMax" placeholder="请输入最大值" onkeyup="if(event.keyCode==32){space($(this))}"/>', {
			title: '添加警告',
			btn: "保存",
			area: ['400px'],
			skin: 'demo-class'
		},
		function(index) {
			var text = /^[-+]?[0-9]+(\.[0-9]+)?$/;
			var sign = $("#dataMin").val().split("-")[1];
			if ($("#dataMin").val() == "" && $("#dataMax").val() == "") {
				layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
					tips: [1, '#ff787c'],
					time: 2000
				});
			} else if (text.test($("#dataMin").val()) || text.test($("#dataMax").val())) {
				if (($("#dataMin").val().indexOf("-") == -1 && $("#dataMax").val().indexOf("-") == -1 && Number($("#dataMin").val()) >= Number($("#dataMax").val()) && $("#dataMax").val() != "") || ($("#dataMin").val().indexOf("-") == 0 && $("#dataMax").val().indexOf("-") == 0 && Number($("#dataMin").val().split("-")[1]) <= Number($("#dataMax").val().split("-")[1]) && $("#dataMax").val() != "") || ($("#dataMin").val().indexOf("-") == -1 && $("#dataMax").val().indexOf("-") == 0 && $("#dataMax").val() != "" && $("#dataMin").val() != "")) {
					//				console.log($("#dataMin").val()+$("#dataMax").val())
					layer.tips('最大值不能比最小值小', $("#dataMax"), {
						tips: [1, '#ff787c'],
						time: 2000
					});
				} else {
					if (tagId == '' && $('.alarmList').eq(dataIndex).find('p span:nth-child(1)').html() == '未配置') {
						layer.msg('请选择数据标签', {
							icon: 2
						})
						layer.close()
					} else {
						tagId = $('.alarmList').eq(dataIndex).find('p span:nth-child(1)').attr('id')
						nId = $('.alarmList').eq(dataIndex).find('p span:nth-child(2)').attr('id')
							//					console.log(tagId)
							//					console.log(nId)
						var data = "{'threshold':" + indexData(Iindex, dataIndex) + ",'data_id':" + _id + ",'tag_id':" + tagId + ",'station_id':'" + stationId + "','_id':'" + nId + "'}"
						var data = {
							"data": data,
							"access_token": window.accessToken
						};
						ajax(data);
						varLike(_id, $("#dataMin").val(), $("#dataMax").val(), Iindex, dataIndex)
						tagId = '';
						nId = '';
					}
				}
			} else {
				layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
					tips: [1, '#ff787c'],
					time: 2000
				});
			}
		})
}
//点击添加或者修改设置Dom节点
function varLike(_id, min, max, Iindex, dataIndex) {
	var dataLine = $(
		'<div class="dataLeft">' +
		'<span>' + min + '</span>  ~  ' +
		'<span>' + max + '</span>' +
		'</div>' +
		'<div class="dataRight">' +
		'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="modify(' + _id + "," + min + "," + max + "," + Iindex + "," + dataIndex + ')"></i>' +
		'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="alarmDel(' + _id + "," + min + "," + max + "," + Iindex + "," + dataIndex + ')"></i>' +
		'</div>'
	)
	$('#' + _id).find('p span:nth-child(1)').html(dataLike.tag_name)

	$('#' + _id).find('li').eq(Iindex).empty();
	$('#' + _id).find('li').eq(Iindex).append(dataLine)
}
//判定最大值最小值是否为空
function spaceData() {
	if ($("#dataMax").val() == "") {
		var dataMax = JSON.stringify("");
	} else {
		dataMax = $("#dataMax").val();
	}
	if ($("#dataMin").val() == "") {
		var dataMin = JSON.stringify("");
	} else {
		dataMin = $("#dataMin").val()
	}
	if (dataMax == "+∞") {
		dataMax = "'+∞'";
	}
	if (dataMin == "-∞") {
		dataMin = "'-∞'"
	}
	return [dataMin, dataMax]
}
//判定最大值最小值是否为未配置
function setData(Iindex, dataIndex) {
	if ($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html() != "未配置") {
		var IdataMin = $(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
		var IdataMax = $(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();

	} else {
		IdataMin = JSON.stringify("");
		IdataMax = JSON.stringify("");
	}
	return [IdataMin, IdataMax]
}
//当前数据的第几个下标
function indexData(Iindex, dataIndex) {
	if (Iindex == 1) {
		var othreshold = "[" +
			"{" +
			"lower_value: " + setData(Iindex, dataIndex)[0] + "," +
			"upper_value: " + setData(Iindex, dataIndex)[1] +
			"}," +
			"{" +
			"lower_value: " + spaceData()[0] + "," +
			"upper_value: " + spaceData()[1] +
			"}" +
			"]";
	} else {
		var othreshold = "[" +
			"{" +
			"lower_value: " + spaceData()[0] + "," +
			"upper_value: " + spaceData()[1] +

			"}," +
			"{" +
			"lower_value:" + setData(Iindex, dataIndex)[0] + "," +
			"upper_value:" + setData(Iindex, dataIndex)[1] +
			"}" +
			"]";
	}
	return othreshold;
}
//修改数据
function modify(_id, min, max, Iindex, dataIndex) {
	var Iindex = Iindex;
	var dataIndex = dataIndex;

	layer.alert('<input type="text" id="dataMin" value="' + min + '" onkeyup="if(event.keyCode==32){space($(this))}"/>  ~ ' +
		'<input type="text" id="dataMax" value="' + max + '"  onkeyup="if(event.keyCode==32){space($(this))}"/>', {
			title: '修改警告',
			btn: "保存",
			area: ['400px'],
			btnAlign: 'c',
			skin: 'demo-class'
		},
		function(index) {
			var text = /^[-+]?[0-9]+(\.[0-9]+)?$/;
			if ($("#dataMin").val() == "" && $("#dataMax").val() == "") {
				layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
					tips: [1, '#ff787c'],
					time: 2000
				});
			} else if (text.test($("#dataMin").val()) || text.test($("#dataMax").val())) {
				if (($("#dataMin").val().indexOf("-") == -1 && $("#dataMax").val().indexOf("-") == -1 && Number($("#dataMin").val()) >= Number($("#dataMax").val()) && $("#dataMax").val() != "") || ($("#dataMin").val().indexOf("-") == 0 && $("#dataMax").val().indexOf("-") == 0 && Number($("#dataMin").val().split("-")[1]) <= Number($("#dataMax").val().split("-")[1]) && $("#dataMax").val() != "") || ($("#dataMin").val().indexOf("-") == -1 && $("#dataMax").val().indexOf("-") == 0 && $("#dataMax").val() != "" && $("#dataMin").val() != "")) {
					//					console.log($("#dataMin").val()+$("#dataMax").val())
					layer.tips('最大值不能比最小值小', $("#dataMax"), {
						tips: [1, '#ff787c'],
						time: 2000
					});
				} else {
					//					console.log(tagId)
					tagId = $('.alarmList').eq(dataIndex).find('p span:nth-child(1)').attr('id')
					nId = $('.alarmList').eq(dataIndex).find('p span:nth-child(2)').attr('id')
					var data = "{'threshold':" + indexData(Iindex, dataIndex) + ",'data_id':" + _id + ",'tag_id':" + tagId + ",'station_id':'" + stationId + "','_id':'" + nId + "'}"
					var data = {
						"data": data,
						"access_token": window.accessToken
					};
					ajax(data);
					varLike(_id, $("#dataMin").val(), $("#dataMax").val(), Iindex, dataIndex)
					tagId = '';
					nId = '';
				}
			} else {
				layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
					tips: [1, '#ff787c'],
					time: 2000
				});
			}
		})
}
//清除数据
function alarmDel(_id, min, max, Iindex, dataIndex) {
	var Iindex = Iindex;
	var dataIndex = dataIndex;
	layer.confirm("<font size='2'>确定清除该数据？</font>", {
		icon: 7,
		skin: 'del-class'
	}, function(index) {
		//		console.log($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html())
		if ($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html() == "未配置") {
			var IdataMin = JSON.stringify("");
			var IdataMax = JSON.stringify("");

		} else {
			var IdataMin = $(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
			var IdataMax = $(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();
		}
		if (Iindex == 1) {
			var othreshold = "[" +
				"{" +
				"lower_value: " + IdataMin + "," +
				"upper_value: " + IdataMax +
				"}," +
				"{" +
				"lower_value: ''," +
				"upper_value: ''" +
				"}" +
				"]";
		} else {
			var othreshold = "[" +
				"{" +
				"lower_value: ''," +
				"upper_value: ''" +

				"}," +
				"{" +
				"lower_value:" + IdataMin + "," +
				"upper_value:" + IdataMax +
				"}" +
				"]";
		}
		tagId = $('.alarmList').eq(dataIndex).find('p span:nth-child(1)').attr('id')
		nId = $('.alarmList').eq(dataIndex).find('p span:nth-child(2)').attr('id')
			//			console.log(tagId)
		var data = "{'threshold':" + othreshold + ",'data_id':" + _id + ",'tag_id':" + tagId + ",'station_id':'" + stationId + "','_id':'" + nId + "'}"
		var data = {
			"data": data,
			"access_token": window.accessToken
		};
		ajax(data);
		tagId = '';
		nId = '';

		var dataLine = $(
			'<div class="dataLeft">未配置' +
			'</div>' +
			'<div class="dataRight">' +
			'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData(' + _id + ',' + Iindex + "," + dataIndex + ')"></i>' +
			'</div>'
		)
		$('#' + _id).find('li').eq(Iindex).empty();
		$('#' + _id).find('li').eq(Iindex).append(dataLine)
	})

}
//ajax函数的调用
function ajax(data) {
	$.ajax({
		url: globalurl + '/v1_0_0/dataConfig',
		data: data,
		dataType: 'JSON',
		type: 'put',
		crossDomain: true == !(document.all),
		success: function(data) {
			//			console.log(data)
			if (data.code == 200) {
				layer.msg(data.error, {
					icon: 1,
					time: 1000
				}, function() {
					alarmList();
				})
			} else {
				layer.msg(data.error, {
					icon: 2,
					time: 1000
				}, function() {
					alarmList();
				})
			}
		},
		error: function(data) {
			//			console.log(data)
			layer.msg("添加失败", {
				icon: 2,
				time: 1000
			}, function() {
				alarmList();
			})
		}
	})
}

//input禁止输入字母空格
function space(obj) {
	obj.val(obj.val().replace(/\s/g, ''))
}

//订阅
/*var client; 
var topic;
var data;
function MQTTconnect(dataIds) {
  console.log("订阅程序开始执行");
	var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	client = new Paho.MQTT.Client(mqttHost, Number(portNum), "server" + parseInt(Math.random() * 100, 10));
	data = dataIds;  
	  var options = {
			  timeout: 1000,
			  onSuccess: onConnect,
			  onFailure: function (message) {
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
function onConnect() {
  console.log("onConnect");
  for(var i=0;i<data.length;i++){
	  console.log("订阅第"+i+"个主题");
	  console.log(data[i]);
	  topic=data[i]+"";
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
  var dataConfig=JSON.parse(payload)
  var dataId=dataConfig.data_id
  console.info(dataConfig)
  var dataValue;
  if(dataConfig.port_type=="DO"||dataConfig.port_type=="DI"){
  	dataValue=dataConfig.battery.split('$')[dataConfig.data_value]
  }else{
  	dataValue=dataConfig.data_value
  }
	$('#'+dataId).find('.dataValue').text(dataValue);
	$('#'+dataId).find('.dataTime').text(dataConfig.data_time);
	if(dataConfig.status==1){
		$('#'+dataId).addClass("greenBg");
	}else if(data==0){
		$('#'+dataId).addClass("grayBg");
	}else{
		$('#'+dataId).addClass("redBg");
	}
}*/