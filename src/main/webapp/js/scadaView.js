// JavaScript Document
var paper, $v;
var deviceId;
var currentData; //记录最新的数据

window.onload = function() {
	if (!Raphael) {
		layer.alert("当前浏览器不支持SVG，请将浏览器升级至IE8以上，谢谢合作！");
		return null;
	}
	try {
		var token = $("#token").val() ? $("#token").val() : top.getToken();
		//console.log(token);
		$.ajax({
			url: globalurl + "/v1_0_0/scadaTemp2d?system_num=1&access_token=" + token,
			type: 'get',
			success: function(data) {
				//console.log(data);
				paper = $("#paper");
				$v = fView("paper", 0).load(data.scada_config);
				$v.zoomsel(data.scada_size.width, data.scada_size.height);
				readDataStart();
			}
		});
	} catch (e) {
		layer.alert(e);
	}
};

//从后台服务中获取一次运行数据赋值到组态
function loadData() {
	var token = $("#token").val() ? $("#token").val() : top.getToken();
	$.ajax({
		url: globalurl + "/v1_0_0/station/" + $("#stationId").val() + "/datas?access_token=" + token,
		type: 'get',
		success: function(data) {
			//console.log(data)
			currentData = data;
			$v.setData(data);
		}
	});
}
//开始读取数据
function readDataStart() {
	loadData();
	updTimer = window.setInterval(loadData, 3000);
}