var allData = {
	accessToken: getToken(),
	companyId: $("#companyId").val(),
	companyCode: $("#companyCode").val(),
	searchLike: '',
	level: $("#level").val(), //当前的级别
	tagId: [], //标签id
	stationId: [], //换热站id
	dynamicData: [], //动态列名称
	stationName: [], //换热站名称
	scadaId: [], //组态id
	initStatus: true, //初始状态
	clickNum: -1, //
	initData: {}, //列表传递的参数
	stationAbbore: [],
	stationData: ''
}
$.fn.extend({
	//回车键响应
	enterKey: function(callBack) {
		$(this).keyup(function(ev) {
			if (ev.which === 13) {
				$(this).blur();
				callBack && callBack.call($(this));
			}
			return false;
		});
	},
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function(ev) {
			if (ev.keyCode == 32) {
				$(this).val($(this).val().replace(/\s/g, ''));
				//eval('allData.' + $(this).attr('datasrc') + '=$(this).val()');
			}

		});
	},
	//input焦点判断
	focusInput: function() {
		$(this).on({
			"focus": function() {
				if ($(this).val() == "请输入关键字查找换热站") {
					$(this).val("");
				} else {
					$(this).val($(this).val())
				}
			},
			"blur": function() {
				if ($(this).val() == "") {
					$(this).val("请输入关键字查找换热站");
				}

			}
		})
	},
	//搜索范围焦点判断
	searchInput: function() {
		$(this).on({
			"focus": function() {
				if ($(this).find('input').val() == "请输入关键字查找换热站") {
					$(this).find('input').val("");
				}
			},
			"blur": function() {
				if ($(this).find('input').val() == "") {
					$(this).find('input').val("请输入关键字查找换热站");
				}

			}
		});
	},
	//点击分公司回到原来的列表
	backList: function() {
		$(this).click(function() {
			self.location.href = "/list";
		})
	},
	//图表小图标
	iconChart: function() {
		$("#dtuList>tbody tr").each(function(i, ele) {
			$('#dtuList>thead th').each(function(j, el) {
				if ($(el).attr('data_tag')) {
					if ($(ele).find("td").eq(j).html().substring(0, 1) != '-') {
						$(ele).find("td").eq(j).on({
							"mouseenter": function() {
								$(ele).find("td").eq(j).find("i.fa-laptop").removeClass("hidden");
								$(ele).find("td").eq(j).click(function() {
									//console.log($(el).attr('data_tag'))
									var num = $(el).attr('data_tag')
									$.layerShow(i, num);
								});
							},
							"mouseleave": function() {
								$(ele).find("td").eq(j).find("i.fa-laptop").addClass("hidden");
							}
						})
					}

				}
			});
		});

	},
	//换热站增加动态列
	dynamic: function() {
		$(this).each(function(i, ele) {
			if ($(this).attr("status") == 1) {
				var m;
				$(this).click(function() { //改变状态
					for (var j = 0; j < $('th').length; j++) {
						if ($('th').eq(j).attr("data_tag") == $(this).attr("data_tag")) {
							m = j;
						}
					}
					if ($(this).prop('checked')) {
						$(".table_head th").eq(parseInt(m)).show();
						$(".table tbody tr").each(function() {
							$(this).find('td').eq(parseInt(m)).show();
						})
					} else {

						$(".table_head th").eq(parseInt(m)).hide();
						$(".table tbody tr").each(function() {
							$(this).find('td').eq(parseInt(m)).hide();
						})
					}
				})

			} else {
				$(this).click(function() { //改变状态
					if ($(this).prop('checked') && $(this).attr("status") == 0) {
						$(this).attr("status", "1");
						//console.log(dynamicData)
						clickNum = i;
						//console.log(clickNum)
						$("#dtuList thead>tr .handle").before('<th data_tag="' + $(".column ul input").eq(clickNum).attr("data_tag") + '" abbre="' + $(".column ul input").eq(clickNum).attr("abbre") + '">' + allData.dynamicData[clickNum] + '</th>');
						//console.log(allData)
						for (var t in allData.stationData) {
							$("#dtuList tbody>tr").eq(t).find(".handdle").before('<td>-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>');

							if (allData.stationData[t].data != null) {
								var name = $(".column ul input").eq(clickNum).attr("abbre");
								//console.log(name)
								if (allData.stationData[t].data[name] != undefined && allData.stationData[t].data[name] != null) {
									var value;
									if (allData.stationData[t].data[name].toString().indexOf(".") != -1) {
										value = (allData.stationData[t].data[name]).toFixed(2);
									} else {
										value = allData.stationData[t].data[name]
									}

									//	console.log(value+',***'+t)
									var len = $('th').length - 2;
									//console.log(len)
									$("#dtuList tbody tr").eq(t).find("td").eq(len).html(value).append('<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i>');
								}
							}
						}
						$('.column ul li input').dynamic();
					}
				})
			}

		});
		$("#dtuList>tbody tr").iconChart();
	}
});

$.extend({
	init: function() {
		$("#searchId").focusInput();
		$(".search").searchInput();
		$("#searchId").limitSpacing();
		$("#backList").backList();
		$.getAllData();
		$.getLabelStation();
		$(" .pop-close").click(function() {
			$('.dataChart').addClass('hidden');
			$('.pop-mask').addClass('hidden');
		});
		$.likeStation()
	},
	//获取总数据
	getAllData: function() {

		var tagId = [2];
		if (allData.level == 1) {
			allData.level = 0
		} else {
			allData.level = 1
		}
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/listAllDatas",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: allData.accessToken,
				_id: allData.companyId,
				level: allData.level,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				$(".total").empty();
				var totalStr = '<span class="totalName">' + data.name + '</span>' + '<span class="stationNum">换热站总数：<b>' + data.station_count + '</b> 个</span>' + '<span class="areaNum">总供热面积：<b>' + data.heating_area + '</b> 万平方米</span>';
				$(".total").append(totalStr);
				var textName = '';
				for (var i in data.data_tag) {
					switch (i) {
						case "0":
							textName = '目标总能耗：';
							break;
						case "1":
							textName = '实际总能耗：';
							break;
					}
					var dataStr = '<span>' + textName + '<b>' + data.data_tag[i].data_value + '</b> GJ</span>'
					$(".total").append(dataStr);
				}
			}
		});
	},
	//获取标签
	getLabelStation: function(callback) {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/tags",
			dataType: "json",
			crossDomain: true == !(document.all),
			//async:false,
			data: {
				access_token: allData.accessToken,
				level: 2
			},
			success: function(data) {
				$("#dtuList").empty();
				allData.tagId = [];
				var tableTitleStr = '<thead><tr class="table_head"><th class="no-sort">名称</th><th class="handle no-sort">操作</th></tr></thead>';
				$("#dtuList").append(tableTitleStr);
				maxSize = data.length;
				//console.log(data.station_tag.length)
				allData.dynamicData = [];
				$(".column ul").empty();
				for (var i in data) {
					$(".column ul").append('<li><label><input type="checkbox" data_tag="' + data[i].tag_id + '" status="0" abbre="' + data[i].abbre + '">' + data[i].tag_name + '</label></li>');
					allData.stationAbbore.push(data[i].abbre)
					allData.dynamicData.push(data[i].tag_name);
				}
				var num = 5;
				for (var j = 0; j < num; j++) {
					var tagName = '<th class="' + data[j].tag_id + '" data_tag="' + data[j].tag_id + '" abbre="' + data[j].abbre + '">' + data[j].tag_name + '</th>';
					$("#dtuList thead>tr .handle").before(tagName);
					allData.tagId.push(data[j]._id);
					$(".column ul input").eq(j).prop('checked', true);
					if ($(".column ul input").prop('checked')) {
						$(".column ul input").eq(j).attr("status", "1");
					}
				}

				$.removePar(allData.tagId);
				allData.searchLike = $("#inputVal").val();
				allData.initData = {
					access_token: allData.accessToken,
					tag_id: tagArr,
					company_code: allData.companyCode,
					name: '{"station_name":"' + allData.searchLike + '"}'
				}
				$.getList();
			}

		});
	},
	//获取列表信息
	getList: function() {
		layer.msg('正在努力的加载数据中，请耐心等待', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationAllDatas",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: allData.initData,
			success: function(data) {
				//console.log(data)
				allData.stationData = data;
				layer.closeAll();
				//	console.log(allData.initStatus)
				if (allData.initStatus == true) {
					//console.log(111)
					allData.stationName = [];
					allData.scadaId = [];
					$("#dtuList>tbody").remove();
					var tbodyStr = '<tbody class="noSerch"></tbody>';
					$("#dtuList").append(tbodyStr);
					for (var i in data) {
						var tableDataStr = '<tr id="' + data[i].station_id + '"><td class="name" onclick="$.delivery(' + i + ')"><b>' + (parseInt(i) + 1) + '</b>' + data[i].station_name + '</td><td class="handdle">' + '<i class="fa fa-star-o" data-toggle="tooltip" data-placement="top" title="关注" fllow_status="0" onclick="$.fllow(' + i + ')"></i>' + '<i class="fa fa-sliders" data-toggle="tooltip" data-placement="top" title="控制策略" onclick="$.strategy(' + i + ')"></i>' + '<i class="fa fa-sitemap" data-toggle="tooltip" data-placement="top" title="组态" onclick="$.delivery(' + i + ')"></i>' + '<i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="top" title="告警" onclick="$.alarm(' + i + ')"></i></td></tr>';
						$("#dtuList tbody").append(tableDataStr);
						var num = $('th').length - 2;
						for (var j = 0; j < num; j++) {
							var tdStr = '<td class="color">-</td>';
							$("#dtuList tbody tr").eq(i).find('.handdle').before(tdStr);

						}

						if (data[i].data != null) {
							for (var t = 0; t < num + 1; t++) {
								if (data[i].data[$('th').eq(t).attr('abbre')] != undefined && data[i].data[$('th').eq(t).attr('abbre')] != null) {
									var value;
									if (data[i].data[$('th').eq(t).attr('abbre')].toString().indexOf(".") != -1) {
										value = (data[i].data[$('th').eq(t).attr('abbre')]).toFixed(2);
									} else {
										value = data[i].data[$('th').eq(t).attr('abbre')]
									}
									//console.log(value+','+i+','+t)
									$("#dtuList tbody tr").eq(i).find("td").eq(t).html(value).append('<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i>');

								}
							}
						}
						allData.stationId.push(data[i].station_id);
						allData.stationName.push(data[i].station_name);
						if (data[i].scada_id) {
							allData.scadaId.push(data[i].scada_id);
						} else {
							allData.scadaId.push(0);
						}

					}
					$.concern()
				}
				$("#dtuList>tbody tr").iconChart();
				$("[data-toggle='tooltip']").tooltip();
				$('.column ul li input').dynamic();
				//$('table').tablesorter({sortList: [[0,0]], headers: { 0:{sorter: false}, maxSize:{sorter: false}}});
			}
		})
	},
	//数组去除括号
	removePar: function(arr) {
		tagArr = '';
		for (var i in arr) {
			tagArr += arr[i] + ',';
		}
	},
	//关注信息
	concern: function() {
		//allData.searchLike=$("#inputVal").val();
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/followStation",
			dataType: "json",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: allData.accessToken,
				name: '{"station_name":"' + allData.searchLike + '"}'
			},
			success: function(data) {
				//console.log(data)
				for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < $("tbody tr").length; j++) {
						if (data[i].station_id == $("tbody tr").eq(j).attr("id")) {
							$("#dtuList tbody tr .handdle").eq(j).find("i.fa").eq(0).removeClass("fa-star-o").addClass("fa-star").attr("fllow_status", "1");
							$("tbody tr").eq(j).attr("key_id", data[i]._id);
						}
					}
				}
			}
		});
	},
	//关注与取消关注
	fllow: function(i) {
		var data = {};
		var msg = '';
		if ($("#dtuList tbody tr .handdle").eq(i).find("i.fa").eq(0).attr("fllow_status") == 0) {
			msg = '关注成功';
			$.ajax({
				type: "put",
				url: globalurl + "/v1_0_0/followStation",
				dataType: "json",
				async: false,
				crossDomain: true == !(document.all),
				data: {
					access_token: allData.accessToken,
					station_id: allData.stationId[i],
					user_id: getUser().user_id
				},
				success: function(data) {
					//console.log(data)
					if (data.status == 1) {
						$("#dtuList tbody tr .handdle").eq(i).find("i.fa").eq(0).removeClass("fa-star-o").addClass("fa-star").attr("fllow_status", "1");
						$("tbody tr").eq(i).attr("key_id", data._id);
						layer.msg(msg, {
							icon: 6
						});
					} else {
						layer.msg('关注失败', {
							icon: 5
						});
						$("#dtuList tbody tr .handdle").eq(i).find("i.fa").eq(0).removeClass("fa-star").addClass("fa-star-o").attr("fllow_status", "0");
					}

				}
			});
		} else {
			msg = '取消关注成功';
			$.ajax({
				type: "put",
				url: globalurl + "/v1_0_0/followStation",
				dataType: "json",
				async: false,
				crossDomain: true == !(document.all),
				data: {
					access_token: allData.accessToken,
					_id: $("tbody tr").eq(i).attr("key_id")
				},
				success: function(data) {
					//console.log(data)
					if (data.status == 1) {
						$("#dtuList tbody tr .handdle").eq(i).find("i.fa").eq(0).removeClass("fa-star").addClass("fa-star-o").attr("fllow_status", "0");
						layer.msg(msg, {
							icon: 6
						});
					} else {
						layer.msg('关注失败', {
							icon: 5
						});
						$("#dtuList tbody tr .handdle").eq(i).find("i.fa").eq(0).removeClass("fa-star").addClass("fa-star-o").attr("fllow_status", "0");
					}

				}
			});
		}
	},
	//图表弹窗
	layerShow: function(i, x) {

		$("#dtuList tbody>tr").eq(i).addClass("borderColor").siblings().removeClass("borderColor");
		$('.dataChart').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
		//console.log(idName)
		//console.log(hotName)
		$(".chartHeader").find("a").eq(0).attr("href", "/list/chart?station_name=" + encodeURIComponent(allData.stationName[i]) + "&station_id=" + allData.stationId[i] + "&num=" + x + "&tagLevel=3");
		document.getElementById('dataChart').click();
	},
	//进入组态
	delivery: function(i) {
		if (allData.scadaId[i]) {
			layer.open({
				type: 2,
				title: allData.stationName[i],
				closeBtn: 1,
				shadeClose: true,
				skin: 'layui-layer-lan',
				maxmin:true,
				shade: 0.8,
				area: ['90%', '90%'],
				content: "/list/group?_id=" + allData.scadaId[i] + "&station_id=" + allData.stationId[i] + "&station_name=" + encodeURIComponent(allData.stationName[i]) //iframe的url
			});
		} else {
			layer.msg('暂无组态', {
				icon: 0,
				time: 1000
			})
		}
	},
	//进入控制策略
	strategy: function(i) {
		layer.open({
			type: 2,
			title: false,
			closeBtn: false,
			shadeClose: true,
			scrollbar: false,
			area: ['100%', '100%'],
			content: '/list/strategy?station_id=' + allData.stationId[i] + '&name=' + encodeURIComponent(allData.stationName[i]) //iframe的url
		});
	},
	//模糊查询换热站
	likeStation: function() {
		$("#searchId").on("keyup", function(ev) {
			if (ev.keyCode == 13) {
				$.searchInfo();
			}
		})
		$(".fa-search").on("click", function() {
			$.searchInfo();
		})
	},
	//模糊查询的条件
	searchInfo: function() {
		if ($("#searchId").val() == "") {
			layer.msg('输入内容不能为空', {
				icon: 0
			});
		} else {
			allData.initStatus = true
			allData.searchLike = $("#searchId").val();
			$.removePar(allData.tagId);
			allData.initData = {
				access_token: allData.accessToken,
				tag_id: tagArr,
				company_code: allData.companyCode,
				name: '{"station_name":"' + allData.searchLike + '"}'
			}
			$.getList()
		}
	},
	//点击进入单个换热站告警
	alarm: function(i) {
		//console.log(stationData[i])
		layer.open({
			type: 2,
			title: false,
			closeBtn: false,
			shadeClose: true,
			scrollbar: false,
			area: ['100%', '100%'],
			content: '/list/alarm?station_id=' + allData.stationId[i] + '&name=' + encodeURIComponent(allData.stationName[i]) + "&companyCode=" + allData.companyCode //iframe的url
		});
	}
})

$.init();