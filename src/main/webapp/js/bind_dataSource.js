var accessToken = getToken();
var user = getUser();
var selectedId = [];
var datas = []; //存放所有的设备
var classData = []; //存放所选角色的设备
var selectedData = [];
var searchData = [];

$(function() {
	allData();
	DevList();
	addClass();
})

//获取已选数据列表
function DevList() {
	$.ajax({
		url: globalurl + "/v1_0_0/dataSources?station_id=" + $('#stationId').val(),
		dataType: 'JSON',
		type: 'get',
		async: false,
		data: {
			access_token: accessToken
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			//			console.log(data)
			if (!data || data.length == 0) {
				$(".selectedUl").html("");
			} else {
				var str = "";
				for (var i = 0; i < data.length; i++) {
					str = "<li id='" + data[i].device_id + "' onclick='colseDev(&apos;" + data[i].device_id + "&apos;)' >" +
						"<span>" + data[i].device_name + "</span>" +
						"<span>&times;</span>" +
						"</li>"
					$(".selectedUl").append(str);
					selectedId.push(data[i].device_id)
				}
				//				console.log(selectedId)
			}

		}
	})
}

//移除已选的设备
function colseDev(id) {
	$("#" + id + "").remove();
	$(".optionalList #" + id + "").prev().removeClass("selectdFont").addClass("disabledFont");
	$(".optionalList #" + id + "").removeClass("selectdIcon").addClass("disabledIcon");
	$(".optionalList #" + id + "").parent("div").removeClass("selectdLi").addClass("disabledLi");
	$(".optionalList #" + id + "").html("+");

	for (var i = 0; i < selectedId.length; i++) {
		if (id == selectedId[i]) {
			selectedId.splice(i, 1)
		}
	}
	//	console.log(selectedId)
}
//选择设备角色
function addClass() {
	$(".infoList .fa").click(function() {
		if ($(this).attr("class") == "fa fa-circle-o") {
			$(this).removeClass("fa-circle-o").addClass("fa-check-circle");
		} else {
			$(this).removeClass("fa-check-circle").addClass("fa-circle-o");
		}
		classData = [];
		for (var i = 0; i < $(".infoList .fa").length; i++) {
			if ($(".infoList .fa").eq(i).attr('class') == 'fa fa-check-circle') {
				classData.push(i + 1)
			}
		}
		selectedList()
		dataList(selectedData)
			//		console.log(classData)
	})

}
//选择设备
function selectDev(id) {
	//	console.log($("#"+id+"").html())

	if ($("#" + id + "").html() == "+") {
		$("#" + id + "").prev().removeClass("disabledFont").addClass("selectdFont");
		$("#" + id + "").removeClass("disabledIcon").addClass("selectdIcon");
		$("#" + id + "").parent("div").removeClass("disabledLi").addClass("selectdLi");
		$("#" + id + "").html("已选");
		str1 = "<li id='" + id + "' onclick='colseDev(&apos;" + id + "&apos;)'>" +
			"<span>" + $("#" + id + "").parent(".selectdLi").find(".selectdFont").html() + "</span>" +
			"<span>" + "&times;" + "</span>" +
			"</li>"
		$("#selectedUl").append(str1);
		selectedId.push(id)

	} else {
		layer.msg('抱歉该设备已添加过', {
			icon: 7
		});
	}
}

//保存设备
function saveData() {
	var data = [];
	for (var i = 0; i < $(".selectedUl li").length; i++) {
		decviceId = $(".selectedUl li").eq(i).attr("id")
		decviceName = $(".selectedUl li").eq(i).find('span').eq(0).html()
		Idata = {
			"device_id": decviceId,
			"device_name": decviceName
		};
		data.push(Idata);
	}
	data = {
			data: data
		}
		//	console.log(JSON.stringify(data))
	$.ajax({
		url: globalurl + "/v1_0_0/dataSources?station_id=" + $('#stationId').val(),
		dataType: 'JSON',
		type: 'post',
		async: false,
		data: {
			access_token: accessToken,
			data: JSON.stringify(data)
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			//			console.log(data)
			if (data.code == 200) {
				/*layer.msg("保存成功",{
					icon:1
				})*/
				layer.msg(data.error, {
					icon: 1,
					end: function() {
						self.location.href = '/boxlist'
					}
				});
			} else {
				layer.msg(data.success, {
					icon: 2
				});
			}
		},
		error: function(data) {
			layer.msg(data.error, {
				icon: 2
			});
		}
	})
}

//模糊查询
function screenDev() {
	searchData = [];
	for (var i = 0; i < selectedData.length; i++) {
		if (selectedData[i].device_name.search($('#searchData').val()) != -1) {
			searchData.push(selectedData[i])
		}
	}
	//	console.log(selectedData)
	//	console.log(searchData)
	dataList(searchData)
}
//获取换热站设备列表
function allData() {
	$.ajax({
		type: "get",
		url: "http://114.215.46.56:18825/v1/devices",
		async: true,
		data: {
			access_token: accessToken,
			filter: '{"customer_id":"' + user.customer_id + '"}'
		},
		success: function(data) {
			//			console.log(data)
			if (data.rows.length == 0) {
				$(".optionalList").html("<span class='nonedata'>暂无数据</span>");
			} else {
				for (var i = 0; i < data.rows.length; i++) {
					datas.push(data.rows[i])
				}
				//				console.log(datas)
				selectedData = datas
				dataList(selectedData)
			}
		}
	})

}

function dataList(data) {
	$(".optionalList").empty()
	var screenList = "";
	for (var i = 0; i < data.length; i++) {
		if (selectedId.indexOf(data[i]._id) != -1) {
			screenList = '<div class="selectdLi" onclick="selectDev(&apos;' + data[i]._id + '&apos;)">' +
				'<div class="selectdFont">' + data[i].device_name + '</div>' +
				'<div class="selectdIcon"  id="' + data[i]._id + '">已选</div>' +
				'</div>';
			$(".optionalList").append(screenList);
		} else {
			screenList = '<div class="disabledLi" onclick="selectDev(&apos;' + data[i]._id + '&apos;)">' +
				'<div class="disabledFont">' + data[i].device_name + '</div>' +
				'<div class="disabledIcon"  id="' + data[i]._id + '">+</div>' +
				'</div>';
			$(".optionalList").append(screenList);
		}

	}
}

function selectedList() {
	selectedData = [];
	for (var i = 0; i < classData.length; i++) {
		for (j = 0; j < datas.length; j++) {
			if (classData[i] == datas[j].device_kind) {
				selectedData.push(datas[j])
			}
		}
	}
}

//input禁止输入字母空格
function space(obj) {
	obj.val(obj.val().replace(/\s/g, ''))
}