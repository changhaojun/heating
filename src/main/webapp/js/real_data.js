$.allData = {
	companyCode: $("#companyCode").val(),
	companyId: $("#companyId").val(),
	accesstoken: getToken(),
	tagId: "",
	strTr: "",
	strTd: ""
}
$.fn.extend({})
$.extend({
	init: function() {
		$.bootstrapTables();
		$.printsThis();
		$.getId();
		$.renturnTop();
	},
	bootstrapTables: function() {
		$(".excel_o").click(function() {
			excel_o.href = tableToExcel('dtuList')
			$("#excel_o").attr("download", "实时监测")
		});
	},
	printsThis: function() {
		$(".print").click(function(event) {
			$(".rcontent").printThis({
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
	//获取标签的id
	getId: function() {
		layer.msg('数据加载中,请耐心等待...', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		$.idFor();
	},
	idFor: function() {
		$.againId(3, $("#dtuList thead tr:nth-child(2) td").length);
	},
	againId: function(star, end) {
		for (var i = star; i < end; i++) {
			if ($("#dtuList thead tr:nth-child(2) td").eq(i).attr("id") != undefined) {
				$.allData.tagId += $("#dtuList thead tr:nth-child(2) td").eq(i).attr("id") + ","
			}
		}
		$.allData.data = {
			access_token: $.allData.accesstoken,
			company_code: $.allData.companyCode,
			tag_id: $.allData.tagId
		}
		$.getAjax();
	},
	//获取数据Ajax
	getAjax: function() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationAllDatas",
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data: $.allData.data,
			success: function(data) {
				layer.closeAll();
				$.allData.tagId = "";
				$.dataPeel(data);
			}
		})
	},
	//数据剥离
	dataPeel: function(data) {

		for (var i = 0; i < data.length; i++) {
			if (data[i].data == 'null' || data[i].data ==null) {
				console.log(i+'______________________')
				data_time = "-";
				fm = "-";
				gw1 = "-";
				hw1 = "-";
				gy1 = "-";
				hy1 = "-";
				sl1 = "-";
				ll1 = "-";
				lr1 = "-";
				gw2 = "-";
				hw2 = "-";
				gy2 = "-";
				hy2 = "-";
			} else {
				console.log(i)
				data_time = data[i].data.data_time == null ? "-" : data[i].data.data_time;
				fm = (data[i].data.fm == undefined || data[i].data.fm == 'null') ? "-" : data[i].data.fm;
				gw1 = (data[i].data["1gw"] == undefined || data[i].data["1gw"] == 'null') ? "-" : data[i].data['1gw'];
				hw1 = (data[i].data["1hw"] == undefined || data[i].data["1hw"] == 'null') ? "-" : data[i].data['1hw'];
				gy1 = (data[i].data["1gy"] == undefined || data[i].data["1gy"] == 'null') ? "-" : data[i].data['1gy'];
				hy1 = (data[i].data["1hy"] == undefined || data[i].data["1hy"] == 'null') ? "-" : data[i].data['1hy'];
				sl1 = (data[i].data["1sl"] == undefined || data[i].data["1sl"] == 'null') ? "-" : data[i].data['1sl'];
				ll1 = (data[i].data["1ll"] == undefined || data[i].data["1ll"] == 'null') ? "-" : data[i].data['1ll'];
				lr1 = (data[i].data["1lr"] == undefined || data[i].data["1lr"] == 'null') ? "-" : data[i].data['1lr'];
				gw2 = (data[i].data["2gw"] == undefined || data[i].data["2gw"] == 'null') ? "-" : data[i].data['2gw'];
				hw2 = (data[i].data["2hw"] == undefined || data[i].data["2hw"] == 'null') ? "-" : data[i].data['2hw'];
				gy2 = (data[i].data["2gy"] == undefined || data[i].data["2gy"] == 'null') ? "-" : data[i].data['2gy'];
				hy2 = (data[i].data["2hy"] == undefined || data[i].data["2hy"] == 'null') ? "-" : data[i].data['2hy'];
			}

			$.allData.strTd = "<td>" + data[i].station_name + "</td>" +
				"<td>" + data_time + "</td>" +
				"<td>" + data[i].total_area + "</td>" +
				"<td>" + fm + "</td>" +
				"<td>" + gw1 + "</td>" +
				"<td>" + hw1 + "</td>" +
				"<td>" + gy1 + "</td>" +
				"<td>" + hy1 + "</td>" +
				"<td>" + sl1 + "</td>" +
				"<td>" + ll1 + "</td>" +
				"<td>" + lr1 + "</td>" +
				"<td>" + gw2 + "</td>" +
				"<td>" + hw2 + "</td>" +
				"<td>" + gy2 + "</td>" +
				"<td>" + hy2 + "</td>" ;
				$("#dtuList tbody").append("<tr>" + $.allData.strTd + "</tr>");
				
		}
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
	}
})
$.init()