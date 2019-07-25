
//项目中所有页面公用的代码(获取token,获取新token)
// var globalurl="http://139.129.235.9:18816";
var globalurl="http://114.215.46.56:18816";
//var globalurl = "http://192.168.1.108:8088";
var accessToken;
var refreshToken;
var expires_time;
var user;
var layerOne;

//添加
var mqttHostIP = "139.129.235.9"
var mqttName = "admin"
var mqttWord = "finfosoft123"
var portNum = '61723'

//获取token
var getToken = function(callBack) {
	if (!accessToken) {
		$.ajax({
			url: '/frame/getToken',
			dataType: 'JSON',
			type: 'GET',
			async: false,
			success: function(data) {
				//console.log(data)
				accessToken = data.access_token;
				refreshToken = data.refresh_token;
				expires_time = data.expires_time;
				callBack && callBack();
				//console.log(accessToken);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getNewToken();
			}
		})

	}
	if (new Date(expires_time).getTime() <= new Date().getTime()) {
		getNewToken();
	}
	//console.log(accesstoken);
	return accessToken;
}

var getUser = function(callBack) {
	if (!user) {
		$.ajax({
			url: '/frame/getUser',
			dataType: 'JSON',
			type: 'GET',
			async: false,
			success: function(data) {
				//console.log(data)
				user = data;
				callBack && callBack()
			}
		})
	}
	return user;
}

//获取新的token
var getNewToken = function() {
	$.ajax({
		url: globalurl + '/authorize/refresh_token',
		type: 'GET',
		dataType: 'JSON',
		async: false,
		data: {
			refresh_token: refreshToken,
			client_id: 'admin',
			client_secret: 'admin',
			grant_type: "refresh_token",
		},
		success: function(data) {
			if (data.code == 200) {
				accessToken = data.access_token;
				refreshToken = data.refresh_token;
				$.ajax({
					url: itemName + "/frame/saveToken",
					data: data,
					dataType: "JSON",
					async: false,
					type: "POST",
					success: function(json) {}
				})
			}
		}
	})

}
