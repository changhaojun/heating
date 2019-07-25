$.allData = {
	resultBox: "",
	initDate: "",
	startTime: "",
	companyCode: $("#companyCode").val(),
	companyId: $("#companyId").val(),
	accesstoken: getToken(),
	searchLike: "",
	yesterdy: "",
	berforeYesterday: "",
	today: "",
	stationId: "",
	Tr: "",
	dateTime: ""
}
$.fn.extend({
	heightAuto: function() {
		$(this).toggle(500);
	}

})
$.extend({
	init: function() {

		$.MASK();
		$.todyDate();
		$.shadeShow();

		$(".theader .date").val($.allData.initDate)
		$.bootstrapTables();
		$.printsThis();
		$.getChildCompany();
		$.stationFor(1)
		$.Layer();
		$.likeStation();
		$.selectStation();
		$.todayData();
		$.renturnTop();
		$.stationIsNull();
	},
	//出现遮罩
	shadeShow: function() {
		$(".layui-layer-shade").show();
	},
	addZero: function(s) {
		return s < 10 ? '0' + s : s;
	},
	//初始化日期
	todyDate: function() {
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var date = myDate.getDate();
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds();
		$.allData.startTime = year + "$" + $.addZero(month) + "$" + ($.addZero(date)) + "$" + ($.addZero(h - h)) + ":" + ($.addZero(m - m)) + ":" + ($.addZero(s - s));
		$.allData.today = $.allData.startTime;
		$(".theader button").eq(0).attr("date", $.allData.today)
		$.allData.yesterdy = year + "$" + $.addZero(month) + "$" + ($.addZero(date - 1)) + "$" + ($.addZero(h - h)) + ":" + ($.addZero(m - m)) + ":" + ($.addZero(s - s));
		$.allData.berforeYesterday = year + "$" + $.addZero(month) + "$" + ($.addZero(date - 2)) + "$" + ($.addZero(h - h)) + ":" + ($.addZero(m - m)) + ":" + ($.addZero(s - s));
		$.allData.initDate = year + '-' + $.addZero(month) + "-" + $.addZero(date);
		$(".theader button").eq(1).attr("date", $.allData.yesterdy);
		$(".theader button").eq(2).attr("date", $.allData.berforeYesterday)
		$.allData.dateTime = $.allData.initDate;
		$.DATE();
	},
	//日期插件
	DATE: function() {
		$('.date').daterangepicker({
			singleDatePicker: true,
			startDate: $.allData.dateTime
		}, function(start, end) {
			$.allData.startTime = new Date(start).getFullYear() + "$" + $.addZero(new Date(start).getMonth() + 1) + "$" + $.addZero(new Date(start).getDate()) + "$" + $.addZero(new Date(start).getHours()) + ":" + $.addZero(new Date(start).getMinutes()) + ":" + $.addZero(new Date(start).getSeconds());
			$.nullTable();
			$.tipLayer();
			$.dataStation();
			$(".theader button").css({
				"background": "#fff",
				"color": "#1c9c83"
			})
		});
	},
	//layer=>弹窗
	Layer: function() {
		$.allData.resultBox = layer.open({
			type: 1,
			title: "选择换热站",
			skin: 'layui-layer-molv',
			shadeClose: false,
			shade: 0.5,
			area: ['300px', '336px'],
			content: $('.confirmInfo')
		})
	},
	//layer=>提示
	tipLayer: function() {
		layer.msg('数据加载中,请耐心等待...', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
	},
	//弹窗
	MASK: function() {
		$('.tTop').delegate('button', 'click', function() {
			$.Layer();
		})
	},
	//清空table数据正在加载中
	nullTable: function() {
		$("#dtuList tbody").html("");
	},
	//选择换热站
	selectStation: function() {
		$('.selectedUl').delegate('.tag', 'click', function() {
			layer.closeAll();
			$.nullTable();
			$.tipLayer();
			$.buttonStyle($(".theader button").eq(0));
			$(".tTop button span").html($(this).html());
			$.allData.stationId = $(this).attr("station_id");
			$.allData.startTime = $.allData.today;
			$(".date").val($.allData.initDate)
			$.dataStation();
			if ($("#searchData").val() != "") {
				$.allData.searchLike = "";
				$("#searchData").val("")
				$.getChildCompany();
				$.stationFor(1);
			}
		})
	},
	//导出
	bootstrapTables: function() {
		$(".excel_o").click(function() {
			excel_o.href = tableToExcel('dtuList')
			$("#excel_o").attr("download", "单站监测")
		});
	},
	//打印
	printsThis: function() {
		$(".print").click(function(event) {
			$(".tcontent").printThis({
				debug: false,
				importCSS: true,
				importStyle: true,
				printContainer: true,
				pageTitle: "实时监测",
				removeInline: true,
				printDelay: 000,
				header: null,
				formValues: false,
				doctypeString: '<!DOCTYPE html>'
			});
		});
	},
	//获取分公司
	getChildCompany: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/allChildCompany",
			dataType: "JSON",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accesstoken,
				company_code: $.allData.companyCode,
				company_id: $.allData.companyId
			},
			success: function(data) {

				$.pageRomance(data);

			}
		})

	},
	//循环获取换热站
	stationFor: function(n) {
		for (var i = 0; i < $(".selectedUl li").length; i++) {
			$.allData.companyCode = $(".selectedUl li").eq(i).attr("company_code")
			$.getStation(n);

		}
		$(".selectedUl li").on("click", function() {
			$(this).find("div").heightAuto();
		});
	},
	//页面渲染for
	pageRomance: function(data) {
		if (data.length != 0) {
			var strOl = "";
			for (var i = 0; i < data.length; i++) {
				strOl += "<li company_code='" + data[i].company_code + "'><span ><i class='fa fa-caret-right'style='margin-right:10px'></i>" + data[i].company_name + "</span><div></div></li>"
			}
			$(".selectedUl").html(strOl);
		} else {
			$.allData.companyCode = $("#companyCode").val();
			$(".selectedUl").html("")
		}

	},
	//获取换热站
	getStation: function(n) {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stations",
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accesstoken,
				company_code: $.allData.companyCode,
				pageNumber: 0,
				pageSize: 0,
				like: '{"station_name":"' + $.allData.searchLike + '"}'
			},
			success: function(data) {

				if (n == 1) {
					$.romanceStation(data);
				} else {
					$.resultStation(data);
				}

			}
		})
	},
	//渲染换热站
	romanceStation: function(data) {
		if (data.station != undefined) {
			for (var i = 0; i < data.station.length; i++) {
				for (var j = 0; j < $(".selectedUl li").length; j++) {
					if (data.station[i].company_code == $(".selectedUl li").eq(j).attr("company_code")) {
						$(".selectedUl li").eq(j).find("div").append("<p class='tag' station_id='" + data.station[i].station_id + "'>" + data.station[i].station_name + "</p>")
					}
				}
			};
		} else {
			$(".selectedUl li").html("");

		}
	},
	//模糊查询换热站
	likeStation: function() {
		$("#searchData").on("keypress", function(ev) {
			if (ev.keyCode == 13 && $("#searchData").val() != "") {
				$.allData.searchLike = $("#searchData").val();
				$.allData.companyCode = $("#companyCode").val();
				$.getStation(2);
			} else if (ev.keyCode == 8 || ev.keyCode == 13 || $("#searchData").val() == "") {
				$.allData.searchLike = "";
				$.allData.companyCode = $("#companyCode").val();
				$.getChildCompany();
				$.stationFor(1);
			}

		})
		$(".fa-search").on("click", function() {
			if ($("#searchData").val() != "") {
				$.allData.searchLike = $("#searchData").val();
				$.allData.companyCode = $("#companyCode").val();
				$.getStation(2);
			} else if ($("#searchData").val() == "") {
				$.allData.searchLike = "";
				$.allData.companyCode = $("#companyCode").val();
				$.getChildCompany();
				$.stationFor(1);
			}
		})
	},
	//模糊查询结果
	resultStation: function(data) {

		var strOl = "";
		if (data.station == undefined) {
			$(".selectedUl").html("")
		} else {
			for (var i = 0; i < data.station.length; i++) {
				strOl += "<li station_id='" + data.station[i].station_id + "' class='tag'>" + data.station[i].station_name + "</li>"
			}
			$(".selectedUl").html(strOl);
		}

	},
	//获取换热站数据
	dataStation: function() {
		var data = 'data={"station_id":"' + $.allData.stationId + '","day":"' + $.allData.startTime + '"}';
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationsDatas?access_token=" + $.allData.accesstoken,
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data: data,
			success: function(data) {
				layer.closeAll();
				$.dataRomance(data)
			}
		})
	},
	//数据渲染
	dataRomance: function(data) {
		var Td = "";
		for (var i = 0; i < data.length; i++) {
			var time = data[i].time;
			time = time.split(":")[0];
			if (data[i].value == "-") {
				Td = "";
				for (var j = 0; j < 12; j++) {
					Td += "<td>-</td>";
				}
			} else {
				Td = "";
				for (var j = 0; j < data[i].value.length; j++) {
					Td += "<td>" + data[i].value[j] + "</td>";
				}
			}
			$.allData.Tr += "<tr><td>" + time + "时</td>" + Td + "</tr>";
		}
		$("#dtuList tbody").html($.allData.Tr);
		$.allData.Tr = "";
	},
	//今天,昨天,前天按钮样式
	buttonStyle: function(that) {
		that.css({
			"background": "#1c9c83",
			"color": "#fff"
		}).siblings("button").css({
			"background": "#fff",
			"color": "#1c9c83"
		});
	},
	//今天,昨天,前天的数据
	todayData: function() {
		$(".theader button").on("click", function() {
			$.buttonStyle($(this));

			$.allData.startTime = $(this).attr("date");
			$.allData.dateTime = $(this).attr("date").split("$")[0] + "-" + $(this).attr("date").split("$")[1] + "-" + $(this).attr("date").split("$")[2]
			$(".date").val($.allData.dateTime)
			$.nullTable();
			$.tipLayer();
			$.dataStation();
			$.DATE();
			console.log($.allData.dateTime);

		})
	},
	//返回顶部
	renturnTop: function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > 100) {
				$(".returnTop").fadeIn(1500);
			} else {
				$(".returnTop").fadeOut(1500);
			}
		});
		//当点击跳转链接后，回到页面顶部位置
		$(".returnTop").click(function() {
			$('body,html').animate({
					scrollTop: 0
				},
				1000);
			return false;
		});
	},
	//换热站为空判断
	stationIsNull: function() {
		$(".layui-layer-close").on("click", function() {
			layer.closeAll();
			if ($(".tTop button span").html() == "") {
				layer.msg('请先选择换热站', {
					time: 2000,
					icon: 7,
					shade: [0.7, '#000']
				}, function() {
					$.Layer();
					$.allData.companyCode = $("#companyCode").val();
					$.getChildCompany();
					$.stationFor(1)
				});
			}
		})
	}

});
$.init();