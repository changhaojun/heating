//console.log($(window.parent.document).find("#scada"));
//下发表
function deliveryData() {
	new Finfosoft.Ring({
		el: '.board-ring2',
		startDeg: 150,
		endDeg: 30,
		lineWidth: 20,
		//		bgColor: '#0055ff',
		mainColor: '#1AB394'
			//		initVal: this.input.value
	});
}
var stationId = $("#stationId").val();
var tagId = $("#tagId").val();
var accessToken = getToken();
var row = [];
var datas;
//var tag=1;
var stationIdArr = [];

getData()
	//获取数据标签
function getData() {
	$.ajax({
		type: "get",
		url: globalurl + '/v1_0_0/station/' + stationId + '/datas',
		dataType: "JSON",
		crossDomain: true == !(document.all),
		data: {
			access_token: accessToken
		},
		success: function(data) {
			//console.log(data)
			datas = data;
		}
	})
}

/*批量下发*/
batchData();

function batchData() {
	$.ajax({
		type: "get",
		dataType: "json",
		crossDomain: true == !(document.all),
		url: globalurl + "/v1_0_0/issuedStaionData",
		data: {
			station_id: stationId,
			tag_id: tagId,
			access_token: accessToken
		},
		success: function(data) {
			//			console.log(data)
			var canvas = '<canvas></canvas><input type="text" value="' + data.data_value + '" class="dial"/>'
			$(".board-ring2").append(canvas);
			deliveryData();
			$(".deliveryDate span").html(data.data_time);
			var listData = "";
			stationIdArr = [];
			for (var i in data.issued) {
				if (data.issued[i].data_value == null) {
					data.issued[i].data_value = '-'
				} else {
					data.issued[i].data_value = data.issued[i].data_value + '%'
				}
				listData += '<li><dl><dt>' + data.issued[i].station_name + '</dt><dd><span class="dataNum">' +
					data.issued[i].data_value + '<i class="selectImg" ></i></span><span class="dataDate">' +
					data.issued[i].data_time + '</span></dd></dl></li>';
				stationIdArr.push(data.issued[i].station_id);
			}
			$(".batchRight>ol").append(listData);
			selectStation()
		}
	});
}
//切换背景图
//	var onOff=1;
//	function backImg(i){
//		/*stationIdArr=stationIdArr.join(",");
//		console.log(stationIdArr);*/
//		if(onOff==1){
//			$(".batchRight ol").find("i").eq(i).removeClass("selectImg");
//			$(".batchRight ol").find("i").eq(i).addClass("selectImg2");
//			onOff=0;
//		}else{
//			$(".batchRight ol").find("i").eq(i).removeClass("selectImg2");
//			$(".batchRight ol").find("i").eq(i).addClass("selectImg");
//			onOff=1;
//		}
//		
//	}

//选择换热站
function selectStation() {
	$(".batchRight>ol i").on('click', function() {
		//			console.log($(this).attr('class'))
		if ($(this).attr('class') == 'selectImg') {
			$(this).removeClass("selectImg");
			$(this).addClass("selectImg2");
		} else {
			$(this).removeClass("selectImg2");
			$(this).addClass("selectImg");
		}
	})
}

//批量下发
$(".deliveryBtn").click(function() {
	var sele = [];
	for (var i = 0; i < $(".batchRight ol").find("i").length; i++) {
		if ($(".batchRight ol").find("i").eq(i).hasClass("selectImg")) {
			sele.push(stationIdArr[i])
		}
	}
	//
	sele = sele.join(",");
	//console.log(sele);
	
	
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
		issuePassword = noPassword == false?issuePassword:inputIssuePassword;
		layer.close(index);
		$.ajax({
			url: globalurl + "/v1_0_0/stationIssued",
			dataType: 'JSON',
			data: {
				issue_password:issuePassword,
				access_token: accessToken,
				station_id: sele,
				tag_id: tagId,
				data_value: typeof(value) != "undefined" ? value : $(".dial").val()
			},
			type: 'POST',
			success: function(data) {
				//console.log(data);
				row = [];
				var childData = {};
				if (data.issued.result == 1) {
					$("#sleep_box").hide();
					layer.msg("下发成功！", {
						icon: 1,
						time: 1000,
						end: function() {
							$(window.parent.document).find(".layui-layer").css("display", "none");
							$(window.parent.document).find(".layui-layer-shade").css("display", "none");
						}
					});

					//组织数据 获取父级页面中的元素
					for (var i = 0; i < datas.length; i++) {
						if (tagId == datas[i].data_tag) {
							childData.label_id = datas[i].data_id
							childData.label_value = typeof(value) != "undefined" ? value : $(".dial").val()
							row.push(childData)
						}
					}
					//存储密码
					sessionStorage.setItem("issuePassword", issuePassword);
					$(window.parent.document).find("#scada").get(0).contentWindow.postMessage(row, '*');
				} else {
					$("#sleep_box").hide();
					layer.msg("下发失败！");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg("下发失败！");
			}
		});
		layer.closeAll();
	});
});