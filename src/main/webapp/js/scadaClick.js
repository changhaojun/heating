/**
 * 此文件包含组件点击事件的操作。点击事件会自动调用elClick方法，可以通过this.data("tag")获取组件的tag
 */

/**
 * 获取鼠标在页面上的位置
 * @param ev		触发的事件
 * @return			x:鼠标在页面上的横向位置, y:鼠标在页面上的纵向位置
 */
function getMousePoint() {
	// 定义鼠标在视窗中的位置
	var point = {
		x: 0,
		y: 0
	};
	// 如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
	if (typeof window.pageYOffset != 'undefined') {
		point.x = window.pageXOffset;
		point.y = window.pageYOffset;
	}
	// 如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离
	// IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat
	else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
		point.x = document.documentElement.scrollLeft;
		point.y = document.documentElement.scrollTop;
	}
	// 如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度
	else if (typeof document.body != 'undefined') {
		point.x = document.body.scrollLeft;
		point.y = document.body.scrollTop;
	}

	// 加上鼠标在视窗中的位置
	point.x += event.clientX;
	point.y += event.clientY;

	// 返回鼠标在视窗中的位置
	return point;
}
//组件单击事件，用于显示统计小窗口
var elClick = function() {
	var tagId = this.data("tag");
	if ($("#token").val()) {
		WebViewBridge.send(tagId.toString());
		return;
	}
	console.log(tagId);
	//图表展示
	if (tagId == 6) {
		layer.open({
			type: 2,
			title: $("#stationName").val(),
			shadeClose: true,
			skin: 'layui-layer-lan',
			shade: 0.8,
			area: ['80%', '80%'],
			content: '/list/chart?station_id=' + $("#stationId").val() + "&station_name=" + $("#stationName").val() + "&tagLevel=3&num=1" //iframe的url
		})

	} else {
		//开关下发
		var dataValue;
		//console.log(currentData)
		for (var i = 0; i < currentData.length; i++) {
			if (tagId == currentData[i].data_tag) {
				dataValue = currentData[i].data_value;
			}
		}
		if (tagId == 1) {
			var str = '<div class="listContent">' +
				'<div class="contentTop">' +
				'<div class="on-off">' +
				'<button type="button" class="Iopen  Iactive" onclick="give(' + this.data("tag") + ',0)">关闭</button>' +
				'<div class="off">' +
				'<div class="circle ">' +
				'</div>' +
				'</div>' +
				'<button type="button" class="Iclose Iclose" onclick="give(' + this.data("tag") + ',1)">打开</button>' +
				'</div>' +
				'</div>' +
				'<div class="contentBottom">' +
				'<span class="fa fa-clock-o"></span>' +
				'</div>' +
				'</div>';
			layer.open({
				type: 1,
				title: "下发",
				skin: 'layui-layer-lan', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area: ['350px', '200px'],
				content: str
			});
			if (dataValue) {
				$(".circle").css({
					"left": "25px"
				}); //这是到右边
			}
		}
		//单个下发和批量下发
		if (tagId == 2) {
			only(this.data("tag"), dataValue);
		}

	}
	event.cancelBubble = true; //点击事件不再向下传递
};
var delValue;

function give(tag, value) {
	if (typeof(value) != "undefined") {
		if (value) {
			$(".circle").css({
				"left": "25px"
			}); //这是到右边
		} else {
			$(".circle").css({
				"left": "0px"
			}); //这是到左边
		}
	}
	layer.confirm("<font size='4'>确认下发？</font>", {
		skin: 'title-class',
		shade: [0.7, '#ffffff']
	}, function(index) {
		layer.close(index);

		var token = $("#token").val() ? $("#token").val() : top.getToken();

		$.ajax({
			url: globalurl + "/v1_0_0/stationIssued",
			dataType: 'JSON',
			data: {
				access_token: token,
				station_id: $("#stationId").val(),
				tag_id: tag,
				data_value: $(".dial").val()
			},
			type: 'POST',
			success: function(data) {
				//console.log(data);
				if (data.issued.result == 1) {
					$("#sleep_box").hide();
					layer.alert("下发成功！", {
						end: function() {
							layer.closeAll();
						}
					});
				} else {
					$("#sleep_box").hide();
					layer.alert("下发失败！");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.alert("下发失败！");
			}
		});
	});
}
//关闭弹出的控制框和图标框
function closeBox() {
	fFunc.$("chart").style.display = "none";
	fFunc.$("controller").style.display = "none";
}
//批量下发
function more(tag, value) {
	//console.log(tag)
	var titleStr = '<i onclick="only(' + tag + "," + value + ')">下发</i><i class="layui-layer-tabnow" >批量下发</i>';
	layer.closeAll();
	layer.open({
		type: 2,
		title: titleStr,
		shadeClose: true,
		skin: 'layui-layer-lan',
		area: ['82%', '90%'],
		content: '/list/controller?station_id=' + $("#stationId").val() + '&tag_id=' + tag //iframe的url
	});
}
//下发
function only(tag, value) {
	var titleStr = '<i class="layui-layer-tabnow">下发</i><i onclick="more(' + tag + "," + value + ')">批量下发</i>';
	var str = '<div class="listContent">' +
		'<div class="contentTop">' +
		'<div class="water">' +
		'<div class="finfosoft-ring board-ring">' +
		'<canvas></canvas>' +
		'<input type="text" value="' + value + '" class="dial"/>' +
		'</div>' +
		'<button type="button"id="give" onclick="give(' + tag + "," + value + ')">下发</button>' +
		'</div>' +
		'</div>' +
		'<div class="contentBottom">' +
		'<span class="fa fa-clock-o"></span>' +
		'</div>' +
		'</div>';
	layer.closeAll();
	layer.open({
		type: 1,
		title: titleStr,
		skin: 'layui-layer-lan', //样式类名
		closeBtn: 1, //不显示关闭按钮
		anim: 2,
		shadeClose: true, //开启遮罩关闭
		area: ['350px', '280px'],
		content: str,
		end: function() {
			delValue = $(".dial").val();
		}

	});
	new Finfosoft.Ring({
		el: '.board-ring',
		startDeg: 150,
		endDeg: 30,
		lineWidth: 20,
		//		bgColor: '#0055ff',
		mainColor: '#1AB394'
			//		initVal: this.input.value
	});
}