	var accessToken = getToken();
	var userData = getUser();
	var companyId = userData.company_id;
	var companyCode = userData.company_code;
	var companyIdArr = []; //分公司id
	var branchId = []; //支线id
	var stationId = []; //换热站id
	var tagId = []; //标签的id
	var stationData = [];
	var hotName = [],
		idName = [],
		hotNum = -1; //需要传递的数据
	var size = 0;
	var tagLevel = -1;
	var x = -1;
	var furyNum = -1; //记录模糊查询时，支线，以及换热站所对应的上一级的数组的第几个；
	var Code;
	var maxSize = 0;
	var isSearch = false;
	var tagArr = "";
	var dynamicData = [];
	var branchCode = [];
	var initStatus = true;
	var initData = {};
	var clickNum = -1;
	var allData = []; //保存模糊查询的数据
	var scadaId = []; //组态id
	var recordId, recordCode, recordCompany; //模糊查询需要传递的数据
	var stationAbbore = [];
	var nextCode = []; //公司code 
	//$(".search").hide();
	//总公司信息
	//var code=user.company_code.split("");
	var code = companyCode.split("");
	var companyCode, companyId;
	if (code.length == 6) {
		quarterHead();
	} else {
		companyIdArr = [];
		companyIdArr.push(companyId);
		branch(0)
	}

	function quarterHead() {
		tagId = [2];
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/listAllDatas",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				_id: companyId,
				level: 0,
				tag_id: JSON.stringify(tagId)
			},
			success: function(data) {
				Code = data.company_code;
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
				labelCompany();
			}
		});
	}
	//数组去除括号
	function removePar(arr) {
		tagArr = '';
		for (var i in arr) {
			tagArr += arr[i] + ',';
		}
	}
	//获取分公司标签
	function labelCompany() {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/tags",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				level: 0
			},
			success: function(data) {
				tagLevel = 1;
				$("#dtuList").empty();
				tagId = [];
				var tableTitleStr = '<thead><tr><th>名称</th><th>换热站数量</th><th>供热面积</th><th class="handle no-sort">操作</th></tr></thead>';
				$("#dtuList").append(tableTitleStr);
				maxSize = data.length;
				for (var i in data) {
					var tagName = '<th data_tag="' + data[i].tag_id + '" abbre="' + data[i].abbre + '">' + data[i].tag_name + '</th>';
					$("#dtuList thead>tr .handle").before(tagName);
					tagId.push(data[i].tag_id);
				}
				dataFixed(companyId)
			}
		});
	}
	//获取分公司的数据
	function dataFixed(companyId) {
		removePar(tagId);
		layer.msg('正在努力的加载数据中，请耐心等待', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/list",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				level: 0,
				tag_id: tagArr,
				_id: companyId,
				company_code: Code
			},
			success: function(data) {
				layer.closeAll();
				var tbodyStr = '<tbody></tbody>';
				$("#dtuList").append(tbodyStr);
				idName = [];
				companyIdArr = [];
				hotName = [];
				var m = -1;
				for (var i in data) {
					if (data[i].total_area.toString().indexOf(".") != -1) {
						total_area = (data[i].total_area).toFixed(2);
					} else {
						total_area = data[i].total_area
					}
					var tableDataStr = '<tr><td class="name" onclick="branch(' + i + ')"><b>' + (parseInt(i) + 1) + '</b>' + data[i].company_name + '</td><td>' + data[i].sum + '</td><td>' + total_area + '</td>' + '<td class="handdle"><i class="fa fa-sign-in" data-toggle="tooltip" data-placement="top" title="进入" onclick="branch(' + i + ')"></i></td></tr>';
					$("#dtuList tbody").append(tableDataStr);
					var num = $('th').length;
					for (var j = 0; j < num - 4; j++) {
						var tdStr = '<td class="color">-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>';
						$("#dtuList tbody tr").eq(i).find('.handdle').before(tdStr);

					}
					for (var t = 0; t < num + 1; t++) {
						if ($('th').eq(t).attr('abbre')) {
							if (data[i][$('th').eq(t).attr('abbre')] != null) {
								var value;
								if (data[i][$('th').eq(t).attr('abbre')].toString().indexOf(".") != -1) {
									value = (data[i][$('th').eq(t).attr('abbre')]).toFixed(2);
								} else {
									value = data[i][$('th').eq(t).attr('abbre')]
								}
								//console.log(value+','+i+','+t)
								$("#dtuList tbody tr").eq(i).find("td").eq(t).html(value).append('<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i>');

							}
						}

					}
					nextCode.push(data[i].company_code);
					companyIdArr.push(data[i].company_id);
					idName = companyIdArr;
					hotName.push(data[i].company_name);
				}

				$("[data-toggle='tooltip']").tooltip();
				icon();
			}
		});
	}

	function icon() {
		//小图标展示以及到图表页面
		$("#dtuList>tbody tr").each(function(i, ele) {
			$('#dtuList>thead th').each(function(j, el) {
				if ($(el).attr('data_tag')) {
					if ($(ele).find("td").eq(j).html().substring(0, 1) != '-') {
						$(ele).find("td").eq(j).on({
							"mouseenter": function() {
								$(ele).find("td").eq(j).find("i.fa-laptop").removeClass("hidden");
								$(ele).find("td").eq(j).click(function() {
									var num = $(el).attr('data_tag')
									layerShow(i, num);
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

	}
	//点击分公司进入支线
	function branch(i) {
		//console.log(tagId)
		var tag = [2];
		furyNum = i;
		$(".location").empty();
		$(".total").empty();
		$("#dtuList").empty();
		if (code.length == 6) {
			var str = '当前位置:<i class="local locationCol" onclick="fn1(' + i + ')">分公司</i>><i class="localBranch  locationCol" onclick="fn2(' + i + ')">支线</i>';
		} else {
			var str = '当前位置:<i class="local locationCol">分公司</i>><i class="localBranch  locationCol" onclick="fn2(' + i + ')">支线</i>';
		}

		$(".location").append(str);
		$(".local").removeClass("locationCol");
		$(".total").empty();
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/listAllDatas",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				_id: companyIdArr[i],
				level: 1,
				tag_id: JSON.stringify(tag)
			},
			success: function(data) {
				$(".total").empty();
				$("#dtuList").empty();
				var totalStr = '<span class="totalName">' + data.name + '</span>' + '<span class="stationNum">换热站总数：<b>' + data.station_count + '</b> 个</span>' + '<span class="areaNum">总供热面积：<b>' + data.heating_area + '</b> 万平方米</span>';
				$(".total").append(totalStr);
				var textName = '';
				for (var j in data.value) {
					switch (j) {
						case "0":
							textName = '目标总能耗：';
							break;
						case "1":
							textName = '实际总能耗：';
							break;
					}
					var dataStr = '<span>' + textName + '<b>' + data.data_tag[j].data_value + '</b> GJ</span>'
					$(".total").append(dataStr);
				}
				recordCode = data.company_code;
				branchCode = data.company_code;
				labelBranch(i);

			}
		});
	}
	//获取支线的标签名
	function labelBranch(n) {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/tags",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				level: 1
			},
			success: function(data) {
				tagLevel = 2;
				tagId = [];
				$("#dtuList").empty();
				var tableTitleStr = '<thead><tr><th>名称</th><th>换热站数量</th><th>供热面积</th><th class="handle">操作</th></tr></thead>';
				$("#dtuList").append(tableTitleStr);
				for (var i in data) {
					var tagName = '<th  data_tag="' + data[i].tag_id + '" abbre="' + data[i].abbre + '">' + data[i].tag_name + '</th>';
					$("#dtuList thead>tr .handle").before(tagName);
					tagId.push(data[i].tag_id);

				}
				maxSize = data.length;
				dataBranch(n);
			}
		});
	}
	//获取支线数据
	function dataBranch(n) {
		recordId = companyIdArr[n];
		removePar(tagId);
		layer.msg('正在努力的加载数据中，请耐心等待', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		if (code.length == 6) {
			company_code = nextCode[n]
		}else{
			company_code = companyCode
		}
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/list",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				level: 1,
				company_code: company_code
			},
			success: function(data) {
				var tbodyStr = '<tbody></tbody>';
				layer.closeAll();
				$("#dtuList").append(tbodyStr);
				branchId = [];
				idName = [];
				hotName = [];
				//branchCode=[];
				//console.log(maxSize);

				for (var i in data) {
					if (data[i].total_area.toString().indexOf(".") != -1) {
						total_area = (data[i].total_area).toFixed(2);
					} else {
						total_area = data[i].total_area
					}
					var tableDataStr = '<tr><td class="name" onclick="station(' + i + ')"><b>' + (parseInt(i) + 1) + '</b>' + data[i].branch_name + '</td><td>' + data[i].sum + '</td><td>' + total_area + '</td>' + '<td class="handdle"><i class="fa fa-sign-in" data-toggle="tooltip" data-placement="top" title="进入" onclick="station(' + i + ')"></i></td></tr>';
					$("#dtuList tbody").append(tableDataStr);
					var num = $('th').length;
					for (var j = 0; j < num - 4; j++) {
						var tdStr = '<td class="color">-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>';
						$("#dtuList tbody tr").eq(i).find('.handdle').before(tdStr);

					}
					for (var t = 0; t < num + 1; t++) {
						if ($('th').eq(t).attr('abbre')) {
							if (data[i][$('th').eq(t).attr('abbre')] != null) {
								var value;
								if (data[i][$('th').eq(t).attr('abbre')].toString().indexOf(".") != -1) {
									value = (data[i][$('th').eq(t).attr('abbre')]).toFixed(2);
								} else {
									value = data[i][$('th').eq(t).attr('abbre')]
								}
								//console.log(value+','+i+','+t)
								$("#dtuList tbody tr").eq(i).find("td").eq(t).html(value).append('<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i>');

							}
						}

					}

					branchId.push(data[i].branch_id);
					idName = branchId;
					hotName.push(data[i].branch_name);
				}
				$("[data-toggle='tooltip']").tooltip();
				icon();
			}
		});
	}
	//点击支线进入换热站
	function station(n) {
		var tag = [2];
		$(".search").show();
		furyNum = n;
		var str = '><i class="localStation locationCol">换热站</i>'
		$(".localBranch").after(str);
		$(".localBranch").removeClass("locationCol");
		$(".total").empty();
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/listAllDatas",
			dataType: "json",
			crossDomain: true == !(document.all),
			async: false,
			data: {
				access_token: accessToken,
				_id: branchId[n],
				level: 2,
				tag_id: JSON.stringify(tag)
			},
			success: function(data) {
				$(".total").empty();
				$("#dtuList").empty();
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
					var dataStr = '<span>' + textName + '<b>' + data.data_tag[i].data_value + '</b> J</span>'
					$(".total").append(dataStr);
				}
				$("#column").removeClass("hidden");
				$("[data-toggle='tooltip']").tooltip();
				labelStation(n);
			}
		});
	}
	//换热站标签
	function labelStation(n) {
		$("#dtuList").empty();
		allData = [];
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/tags",
			dataType: "json",
			crossDomain: true == !(document.all),
			async: false,
			data: {
				access_token: accessToken,
				level: 2
			},
			success: function(data) {
				//console.log(data)
				tagLevel = 3;
				tagId = [];
				idName = [];
				var tableTitleStr = '<thead><tr class="table_head"><th class="no-sort">名称</th><th class="handle no-sort">操作</th></tr></thead>';
				$("#dtuList").append(tableTitleStr);
				maxSize = data.length;
				//console.log(data.station_tag.length)
				dynamicData = [];
				stationAbbore = [];
				$(".column ul").empty();
				for (var i in data) {
					$(".column ul").append('<li><label><input type="checkbox" data_tag="' + data[i].tag_id + '" status="0" abbre="' + data[i].abbre + '">' + data[i].tag_name + '</label></li>');
					dynamicData.push(data[i].tag_name);
					stationAbbore.push(data[i].abbre);
				}

				var num = 5;
				for (var j = 0; j < num; j++) {
					var tagName = '<th class="' + data[j].tag_id + '" data_tag="' + data[j].tag_id + '" abbre="' + data[j].abbre + '">' + data[j].tag_name + '</th>';
					$("#dtuList thead>tr .handle").before(tagName);
					tagId.push(data[j].tag_id);
					$(".column ul input").eq(j).prop('checked', true);
					if ($(".column ul input").prop('checked')) {
						$(".column ul input").eq(j).attr("status", "1");
					}
				}

				if ($('th').length < maxSize && initStatus == true) {
					removePar(tagId)
					initData = {
						access_token: accessToken,
						tag_id: tagArr,
						company_code: branchCode,
						_id: branchId[n]
					}
					dataStation(n);
				}
			}
		});

	}
	//获取换热站数据
	function dataStation(n) {
		layer.msg('正在努力的加载数据中，请耐心等待', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		removePar(tagId)
		stationNum = 1;

		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationAllDatas",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: initData,
			success: function(data) {
				//console.log(data)
				allData = data
				layer.closeAll();
				var q;
				if (initStatus == true) {
					stationData = [];
					idName = [];
					hotName = [];
					scadaId = [];
					var tbodyStr = '<tbody class="noSerch"></tbody>';
					$("#dtuList").append(tbodyStr);
					for (var i in data) {
						var tableDataStr = '<tr id="' + data[i].station_id + '"><td class="name" onclick="delivery(' + i + ')"><b>' + (parseInt(i) + 1) + '</b>' + data[i].station_name + '</td><td class="handdle">' + '<i class="fa fa-star-o" data-toggle="tooltip" data-placement="top" title="关注" fllow_status="0" onclick="fllow(' + i + ')"></i>' + '<i class="fa fa-sliders" data-toggle="tooltip" data-placement="top" title="控制策略" onclick="strategy(' + i + ')"></i>' + '<i class="fa fa-sitemap" data-toggle="tooltip" data-placement="top" title="组态" onclick="delivery(' + i + ')"></i>' + '<i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="top" title="告警" onclick="alarm(' + i + ')"></i></td></tr>';
						$("#dtuList tbody").append(tableDataStr);
						var num = $('th').length - 2;
						for (var j = 0; j < num; j++) {
							var tdStr = '<td class="color">-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>';
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

						if (data[i].scada_id) {
							scadaId.push(data[i].scada_id);
						} else {
							scadaId.push(0);
						}
						stationData.push(data[i].station_id);
						idName = stationData;
						hotName.push(data[i].station_name);
					}
					concern(n);
				}
				icon();
				$("[data-toggle='tooltip']").tooltip();
				dynamic();
				$('table').tablesorter({
					sortList: [
						[0, 0]
					],
					headers: {
						0: {
							sorter: false
						},
						maxSize: {
							sorter: false
						}
					}
				});
			}
		})
	}

	//换热站增加动态列
	function dynamic() {
		//console.log(344)
		$('.column ul li input').each(function(i, ele) {
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
						$("#dtuList thead>tr .handle").before('<th data_tag="' + $(".column ul input").eq(clickNum).attr("data_tag") + '" abbre="' + $(".column ul input").eq(clickNum).attr("abbre") + '">' + dynamicData[clickNum] + '</th>');
						//console.log(allData)
						for (var t in allData) {
							$("#dtuList tbody>tr").eq(t).find(".handdle").before('<td>-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>');

							if (allData[t].data != null) {
								var name = $(".column ul input").eq(clickNum).attr("abbre");
								//console.log(name)
								if (allData[t].data[name] != undefined && allData[t].data[name] != null) {
									var value;
									//console.log(allData[t].data[name].toString().indexOf("."))
									if (allData[t].data[name].toString().indexOf(".") != -1) {
										value = (allData[t].data[name]).toFixed(2);
									} else {
										value = allData[t].data[name]
									}
									//console.log(value+',***'+t)
									var len = $('th').length - 2;
									//console.log(len)
									$("#dtuList tbody tr").eq(t).find("td").eq(len).html(value).append('<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i>');
								}
							}
						}
						dynamic();

					}
				})
			}

		});
		icon();
	}
	//点击分公司回到最初始的页面
	function fn1(i) {
		$(".location").empty();
		//$(".search").hide();
		$("#column").addClass("hidden");
		var str1 = '当前位置:<i class="local locationCol" onclick="fn1(' + i + ')"> 分公司</i>';
		$(".location").append(str1);

		hotName = [];
		idName = [];
		hotNum = -1;
		tagLevel = -1;
		//	companyCode=userData.company_code
		companyCode = '000005'
		initStatus = true
		quarterHead();
	}
	//点击进入支线
	function fn2(i) {
		//	$(".search").hide();
		$("#column").addClass("hidden");
		$(".location").empty();
		var str1 = '当前位置:<i class="local locationCol onclick="fn1(' + i + ')"> 分公司</i>><i class="localBranch  locationCol" onclick="fn2(' + i + ')">支线</i>';
		$(".location").append(str1);
		hotName = [];
		idName = [];
		hotNum = -1;
		tagLevel = -1;
		initStatus = true
		branch(i);
	}

	//点击换热站弹框出现
	function layerShow(i, x) {
		hotNum = x
			/*if(tagLevel==3){
				hotNum=x-1;//记录点击了第几个第几列
			}else{
			}*/
		$("#dtuList tbody>tr").eq(i).addClass("borderColor").siblings().removeClass("borderColor");
		$('.dataChart').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
		//console.log(hotName)
		$(".chartHeader").find("a").eq(0).attr("href", "/list/chart?station_name=" + encodeURIComponent(hotName[i]) + "&station_id=" + idName[i] + "&num=" + hotNum + "&tagLevel=" + tagLevel);
		document.getElementById('dataChart').click();
	}
	$(" .pop-close").click(function() {
		$('.dataChart').addClass('hidden');
		$('.pop-mask').addClass('hidden');
	});
	//进入组态页面
	function delivery(i) {
		//		console.log(scadaId)
		if (scadaId[i]) {
			layer.open({
				type: 2,
				title: hotName[i],
				closeBtn: 1,
				shadeClose: true,
                maxmin:true,
				skin: 'layui-layer-lan',
				shade: 0.8,
				area: ['90%', '90%'],
				content: "/list/group?_id=" + scadaId[i] + "&station_id=" + idName[i] + "&station_name=" + encodeURIComponent(hotName[i]) //iframe的url
			});
		} else {
			layer.msg('暂无组态', {
				icon: 0,
				time: 1000
			})
		}

	}
	//点击查询

	//模糊查询

	function searchCollectot() {
		var inputVal = $(".search input").val();
		if (inputVal == "请输入关键字查找换热站") {
			inputVal = '';
		}
		//console.log(companyId)
		if ($("#searchId").val() == "") {
			layer.msg('输入内容不能为空', {
				icon: 0
			});
		} else {
			switch (tagLevel) {
				case 1:
					recordId = userData.company_id;
					recordCode = userData.company_code;
					self.location.href = "/list/companyList?level=" + tagLevel + "&inputVal=" + inputVal + "&companyCode=" + recordCode + "&companyId=" + recordId;
					break;
				case 2:
					self.location.href = "/list/companyList?level=" + tagLevel + "&inputVal=" + inputVal + "&companyCode=" + recordCode + "&companyId=" + recordId;
					break;
				case 3:
					initStatus = true;
					stationFuzzy(furyNum);
					break;
				default:
					break;

			}
		}

	}

	function stationFuzzy(n) {
		$("tbody").remove();
		removePar(tagId);
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationAllDatas",
			dataType: "json",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				level: 2,
				tag_id: tagArr,
				company_code: branchCode[n],
				_id: branchId[n],
				name: '{"station_name":"' + $(".search input").val() + '"}'
			},
			success: function(data) {
				//				console.log(data)
				if (data) {
					layer.closeAll();
					stationData = [];
					idName = [];
					hotName = [];
					var q;
					//console.log(initStatus)
					if (initStatus == true) {
						var tbodyStr = '<tbody></tbody>';
						$("#dtuList").append(tbodyStr);
						for (var i in data) {
							var tableDataStr = '<tr id="' + data[i].station_id + '"><td class="name" onclick="delivery(' + i + ')"><b>' + (parseInt(i) + 1) + '</b>' + data[i].station_name + '</td><td class="handdle">' + '<i class="fa fa-star-o" data-toggle="tooltip" data-placement="top" title="关注" fllow_status="0" onclick="fllow(' + i + ')"></i>' + '<i class="fa fa-sliders" data-toggle="tooltip" data-placement="top" title="控制策略" onclick="strategy(' + i + ')"></i>' + '<i class="fa fa-sitemap" data-toggle="tooltip" data-placement="top" title="组态" onclick="delivery(' + i + ')"></i>' + '<i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="top" title="告警" onclick="alarm(' + i + ')"></i></td></tr>';
							$("#dtuList tbody").append(tableDataStr);
							//							console.log(maxSize)
							var num = $('th').length - 2;
							for (var j = 0; j < num; j++) {
								var tdStr = '<td class="color">-<i class="fa fa-laptop hidden" data-toggle="tooltip" data-placement="top" title="查看" ></i></td>';
								$("#dtuList tbody tr").eq(i).find('.handdle').before(tdStr);

							}
							//							console.log(num)
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

							stationData.push(data[i].station_id);
							idName = stationData;
							hotName.push(data[i].station_name);
						}
						concern(n);
					}
					$("[data-toggle='tooltip']").tooltip();
					dynamic();
					icon();

				} else {
					layer.msg('暂无匹配的内容', {
						icon: 0,
						time: 2000
					})
				}
			}
		})
	}
	focusInput();

	function focusInput() {
		$(".search").on({
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
		$("#searchId").on({
			"focus": function() {
				if ($(this).val() == "请输入关键字查找换热站") {
					$(this).val("");
				}
			},
			"blur": function() {
				if ($(this).val() == "") {
					$(this).val("请输入关键字查找换热站");
				}

			},
			"keyup": function(ev) {
				if (ev.keyCode == 32) {
					$(this).val($(this).val().replace(/\s/g, ''));
				}
			}
		});

	}
	//点击进入控制策略
	function strategy(i) {
		//console.log(stationData[i])
		layer.open({
			type: 2,
			title: false,
			closeBtn: false,
			shadeClose: true,
			scrollbar: false,
			area: ['100%', '100%'],
			content: '/list/strategy?station_id=' + stationData[i] + '&name=' + encodeURIComponent(hotName[i]) //iframe的url
		});
	}
	//点击进入单个换热站告警
	function alarm(i) {
		//console.log(stationData[i])
		layer.open({
			type: 2,
			title: false,
			closeBtn: false,
			shadeClose: true,
			scrollbar: false,
			area: ['100%', '100%'],
			content: '/list/alarm?station_id=' + stationData[i] + '&name=' + encodeURIComponent(hotName[i]) + "&companyCode=" + recordCode //iframe的url
		});
	}
	//关注
	function concern(i) {
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/followStation",
			dataType: "json",
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: accessToken,
				branch_id: branchId[i]
			},
			success: function(data) {
				//				console.log(data)
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
	}

	function fllow(i) {
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
					access_token: accessToken,
					station_id: stationData[i],
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
					access_token: accessToken,
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

	}