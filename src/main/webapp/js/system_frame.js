new Vue({
	el:'#wrapper',
	data:{
		issuedShow:false,
		accesstoken:'',
		mobile:'',
		updatePeriod:0,
	},
	methods:{
		//显示下发密码弹框
		issuedBtn:function (){
			
			this.issuedShow=true;
			this.accesstoken = getToken();
			$(".pop-username").css("border-color", "#ccc");			
			this.$http.get(globalurl+'/v1_0_0/issuePasswords',{
	              access_token:this.accesstoken
	          }).then(
	            function (res) {
	                // 处理成功的结果
	         		this.mobile = res.data.mobile;
	         		this.updatePeriod =res.data.update_period;	         		
	            },function (res) {}
        	);
        	
		},
		//关闭下发密码弹框
		close:function (){
			this.issuedShow=false;
		},
		//保存下发密码配置
		submitConfig:function(){
			if(this.updatePeriod==''){
				$('#updatePeriod').css("border-color", "#e11818");
				layer.msg('密码更新周期不能为空', {
						icon: 0,
						time: 2000
				});
				return;		
			}
			if(!(/^1[34578]\d{9}$/.test(this.mobile))){
				layer.msg('手机号码有误，请重填', {
						icon: 0,
						time: 2000
				});
				return;	
			}
			Vue.http.options.emulateJSON = true;
			this.$http.put(globalurl+'/v1_0_0/issuePasswords',{				
				  access_token:this.accesstoken,	
				  mobile:this.mobile,	                            
	              update_period:this.updatePeriod				  
	          }).then(
	            function (res) {
	                // 处理成功的结果	         		
	         		if(res.data.code!=200){
	         			layer.msg(res.data.error, {
						icon: 0,
						time: 2000
						});
	         		}else{
	         			layer.msg('保存成功', {
						icon: 1,
						time: 2000
						});
	         			this.issuedShow=false;
	         			
	         		}
	            },function (res) {}
        	  );
		},
		getPassword:function(){
			Vue.http.options.emulateJSON = true;
			this.$http.post(globalurl+'/v1_0_0/issuePasswords',{				
				  access_token:this.accesstoken,	
				  mobile:this.mobile,	                            	             			  
	          }).then(
	            function (res) {
	                // 处理成功的结果	         		
	         		if(res.data.code!=200){
	         			layer.msg(res.data.error, {
						icon: 0,
						time: 2000
						});
	         		}else{
	         			layer.msg('密码获取成功', {
						icon: 1,
						time: 2000
						});
	         			this.issuedShow=false;
	         			
	         		}
	            },function (res) {}
        	  );
		}
	}
})
$("#mobile").focus(function() {
	//layer.closeAll("tips");
	$(this).css("border-color", "#ccc");
});
//验证电话号码
$("#mobile").blur(function() {
	if ($(this).val() == "") {
		layer.tips("手机号码不能为空", $(this), {
			tips: 1,
		});
		$(this).css("border-color", "#e11818");
	} else {
		$(this).css("border-color", "#1ab394");
	}
	if(!(/^1[34578]\d{9}$/.test($(this).val()))){
		layer.tips("手机号码有误，请重填", $(this), {
			tips: 1,
		});
		$(this).css("border-color", "#e11818");
	} else {
		$(this).css("border-color", "#1ab394");
	}
});
//验证密码周期
$("#updatePeriod").focus(function() {
	$(this).css("border-color", "#ccc");
});
$("#updatePeriod").blur(function() {
	if ($(this).val() == "") {
		layer.tips("获取密码周期不能为空", $(this), {
			tips: 1,
		});
		$(this).css("border-color", "#e11818");
	} else {
		$(this).css("border-color", "#1ab394");
	}
});

getUser();
$(".userName").append("欢迎您，" + user.fullname)

var accesstoken = getToken();
var companyCode;
getCompany();
var flag = -1;
var accesstoken = getToken();
//导航列表的显示
$(".settingList").on({
	"mouseenter": function() {
		$(this).find("ol").stop().slideDown(500);
	},
	"mouseleave": function() {
		$(this).find("ol").stop().slideUp("fast");
	}
});
//弹窗位置的固定
setPos($(".pop"));

function setPos(obj) {
	var iObjWidth = $(obj).width();
	var iObjHeight = $(obj).height();
	var iWinWidth = $(window).width();
	var iWinHeight = $(window).height();
	$(obj).css({
		'left': (iWinWidth - iObjWidth) / 2,
		'top': (iWinHeight - iObjHeight) / 2
	});
}

//个人信息的修改
$(".personInfo dl:eq(0)").on({
	"mouseenter": function() {
		$(".personMsg").stop().slideDown(500);
	},
	"mouseleave": function() {
		$(".personMsg").stop().slideUp(500);
	}
});
//修改密码
$(".personMsg a:nth-child(1)").click(function() {
	$('.pop').filter('.step1').removeClass('hidden');
	$('.pop-mask').removeClass('hidden');
});
//关闭弹窗
$(".maskClose").click(function() {
	$('.pop').addClass('hidden');
	$('.pop-mask').addClass('hidden');
	$(".pop-username").val("");
	$(".pop-username").css("border-color", "#ccc");
	layer.closeAll("tips");
});
//修改时确认密码
//旧密码
$(".passwordOld").focus(function() {
	//layer.closeAll("tips");
	$(this).css("border-color", "#ccc");
});
$(".passwordOld").blur(function() {
	if ($(".passwordOld").val() == "") {
		layer.tips("原密码不能为空", $(this), {
			tips: 1,
		});
		$(this).css("border-color", "#e11818");
	} else {
		$(this).css("border-color", "#1ab394");
	}
});
//新密码
var passText = "";
$(".passwordNew ").blur(function() {
	var passReg = /[a-zA-Z\d+]{6,16}/;
	passText = $(this).val();
	if (passReg.test(passText) == false) {
		layer.tips("密码为6-16位!", $(this), {
			tips: 1,
		});
		$(this).css("border-color", "#e11818");
	} else {
		$(this).css("border-color", "#1ab394");
	}
});
$(".passwordNew").focus(function() {
	//layer.closeAll("tips");
	$(this).css("border-color", "#ccc");
});
//确认新密码
$(".passwordConfirm").blur(function() {
	$(this).css("border-color", "#1ab394");
});
$(".passwordConfirm ").focus(function() {
	//
	$(this).css("border-color", "#ccc");
});
//修改密码弹窗内确定事件
$(".pop-submit").click(function() {
	var passReg = /[a-zA-Z\d+]{6,16}/;
	passText = $(".passwordNew").val();
	if ($(".passwordOld").val() == "") {
		//$(this).next().show().html("原密码不能为空!");
		$(this).css("border-color", "#e11818");
	} else if (passReg.test(passText) == false) {
		//$(".passwordNew").next().show().html("密码为6-16位!");
		$(".passwordNew").css("border-color", "#e11818");
	} else {
		editPassword();
	}
});
//修改密码
function editPassword() {
	$.ajax({
		type: "put",
		crossDomain: true == !(document.all),
		url: globalurl + "/v1_0_0/users",
		datatype: "json",
		data: {
			//old_password:dataPass,
			old_password: $(".oldPassword .pop-username").val(),
			new_password: $(".newPassword .pop-username").val(),
			confirm_password: $(".confirmPassword .pop-username").val(),
			access_token: accesstoken,
			_id: user.user_id
		},
		success: function(data) {
			//				console.info(data)
			$(".popMsg").show();
			if (data.code == 400011) {
				$(".errorMsg i").addClass("error");
				$(".errorMsg span").html(data.error).css("color", "#f55659");
				$(".passwordOld ").val("");
				$(".passwordOld ").css("border-color", "#f55659");
			} else {
				if (data.code == 400012) {
					$(".errorMsg i").addClass("error");
					$(".errorMsg span").html(data.error).css("color", "#f55659");
					$(".passwordNew ").val("");
					$(".passwordConfirm ").val("");
					$(".passwordNew ").css("border-color", "#f55659");
					$(".passwordConfirm ").css("border-color", "#f55659");
				} else {
					$(".errorMsg i").removeClass("error");
					$(".errorMsg span").html(data[1]).css("color", "#1ab394");
					$(".popMsg_content button").click(function() {
						$('.pop').addClass('hidden');
						$('.pop-mask').addClass('hidden');

					});
					$(".pop-username").val("");

				}

			}
		}
	});
}
//导航的数据交互
var dataNav = [];
getNavData()

function getNavData() {
	$.ajax({
		type: 'get',
		crossDomain: true == !(document.all),
		url: globalurl + "/v1_0_0/resources",
		datatype: 'json',
		data: {
			access_token: accesstoken,
			user_id: user.user_id
		},
		success: function(data) {
			//console.log(data)
			var strNav = "";
			if (data.length > 0) {
				for (var i = 0; i < data.length; i++) {
					if (data[i].is_navigation > 0) {
						var navURL = "javascript:;"
						if (data[i].is_navigation == 1) {
							navURL = data[i].resource_url;
						}
						var dataJson = '{"resourceName":"' + data[i].resource_name + '","resourceUrl":"' + navURL + '","dataNum":"' + i + '"}';
						dataJson = JSON.parse(dataJson);
						dataNav.push(dataJson);
					}
				}
				for (var j in dataNav) {
					strNav = $('<li class="changeLi"><a  href="' + dataNav[j].resourceUrl + '" target="iframe0">' +
						dataNav[j].resourceName + '</a><ol class="nav_list"></ol></li>');

					$('#side-menu').append(strNav);
					var m = dataNav[j].dataNum;
					if (data[m].children_resource.length) {
						var childStr = "";
						for (var t = 0; t < data[m].children_resource.length; t++) {
							if (data[m].children_resource[t].is_navigation > 0) {
								var childData = data[m].children_resource[t];
								childStr += '<li><a class="J_menuItem" href="' + childData.resource_url + '" data-index="0" target="iframe0">' + childData.resource_name + '</a></li>';

							}
						}
						$(".changeLi .nav_list").eq(j).append(childStr);
					}
				}

			}
			$('.changeLi').each(function(i, ele) {
				$(this).on({
					"mouseenter": function() {
						$(".nav_list").eq(i).stop().slideDown(500);
					},
					"mouseleave": function() {
						$(".nav_list").eq(i).stop().slideUp(500);
					},
					'click': function() {
						$(this).addClass('active').siblings().removeClass('active')
					}
				})
			});
			//给第一个li添加点击事件
			$("#side-menu li").eq(0).find("a").attr("id", "mapPage");
			document.getElementById('mapPage').click();

		}
	});
}
$(".popMsg_content button,.popMsg .pop-close").click(function() {
	$(".popMsg").hide();
});

//告警
$("#showAlarmList").click(function() {
	$(this).attr("href", "/alarm");
})

//添加
function getMsgNum() {
	$.ajax({
		type: 'get',
		crossDomain: true == !(document.all),
		url: globalurl + "/v1_0_0/alarmHistory",
		datatype: 'json',
		data: {
			access_token: accesstoken,
			filter: '{"company_id":"' + $('#companyId').val() + '"}'
		},
		success: function(data) {
			//			console.log(data)
			$('.msgNum').text(data.untreated)
		}
	});
}

function p(s) {
	return s < 10 ? '0' + s : s;
}

function GetDateStr1(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	var h = dd.getHours();
	var mm = dd.getMinutes();
	var s = dd.getSeconds();

	return y + "-" + p(m) + "-" + p(d) + " " + p(h) + ":" + p(mm) + ":" + p(s);
}

//获取分公司
function getCompany() {
	$.ajax({
		type: 'get',
		dataType: 'JSON',
		url: globalurl + '/v1_0_0/allChildCompany',
		data: {
			access_token: accessToken,
			company_code: user.company_code,
			company_id :user.company_id
		},
		success: function(data) {
			companyCode = data
			MQTTconnect();
		}
	})
}

//mqtt推送
function MQTTconnect() {
	//console.log("订阅程序开始执行");
	var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	client = new Paho.MQTT.Client(mqttHost, Number(portNum), "server" + parseInt(Math.random() * 100, 10));
	var options = {
		timeout: 1000,
		onSuccess: onConnect,
		onFailure: function(message) {
			setTimeout(MQTTconnect, 100000);
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
	//		connect the clien
}

//called when the client connects
function onConnect() {
	//	    console.log("onConnect");
	for (var i = 0; i < companyCode.length; i++) {
		topic = companyCode[i].company_code;
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
	var nowTime = GetDateStr1(0)
	var topic = message.destinationName;
	var payload = JSON.parse(message.payloadString);

	if (payload.send_time) {
		if (Date.parse(nowTime) - Date.parse(payload.send_time) <= 100000) {
			toastr.options = {
				"closeButton": true,
				"debug": false,
				"progressBar": true,
				"positionClass": "toast-top-right",
				"onclick": null,
				"showDuration": "400",
				"hideDuration": "1000",
				"timeOut": "10000",
				"extendedTimeOut": "10000",
				"showEasing": "swing",
				"hideEasing": "linear",
				"showMethod": "fadeIn",
				"hideMethod": "fadeOut"
			}
			if (payload.abnormity != true) {
				toastr.error('警告 !&nbsp;&nbsp;' + payload.station_name + ' ' + payload.data_name + '达到 ' + payload.data_value + '' + payload.data_unit + '<div class="alarmBtn"><span class="twoHours" onclick="delayDate(' + payload.data_id + ',' + 2 + ')" hours="2" dataId="' + payload.data_id + '">延时2小时</span><span class="fourHours"  hours="4" dataId="' + payload.data_id + '" onclick="delayDate(' + payload.data_id + ',' + 4 + ')">延时4小时</span></div>');
			} else {
				toastr.error('警告 !&nbsp;&nbsp;' + payload.station_name + ' ' + payload.data_name + '达到 ' + payload.data_value + '' + payload.data_unit);
			}

			var alarmNum = $('.msgNum').text();
			$('.msgNum').text(Number(alarmNum) + 1);
		}
	}

}

function delayDate(dataId, hours) {
	$.ajax({
		type: 'post',
		crossDomain: true == !(document.all),
		url: globalurl + "/v1_0_0/extensionNotice",
		datatype: 'json',
		data: {
			access_token: accesstoken,
			delay_until: hours,
			data_id: dataId
		},
		success: function(data) {
			if (data.code == 200) {
				toastr.options = {
					"timeOut": "600",
				}
				toastr.success("设置成功")
			} else {
				toastr.error(data.error)
			}
		}
	});
}
