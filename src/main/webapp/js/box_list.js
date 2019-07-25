//var globalurl="http://192.168.1.109";
//		var globalurl="http://121.42.253.149:18816";
//		var accessToken="5947317f685a49000677705c";
var accessToken = getToken();
var userData = getUser();
var isSearch = false;
var companyCode = user.company_code.split("");
var code = [];
var companyId = [];

function showFormatter(index, value, rows) {
	return "<span id=" + value.station_id + ">" + value.station_name + "</span>"
}
//操作列的格式化
function editFormatter(value, row, index) {
	//			console.log(row)
	if (row.scada_id) {
		return "<span data-toggle='tooltip' data-placement='top' title='绑定' style='color:#18b393;cursor: pointer;' class='fa fa-chain' onclick=$.bindData('" + row.station_id + "','" + row.station_name + "')>" + "</span><span data-toggle='tooltip' data-placement='top' title='数据' style='color:#5da2d2;margin-left:15px;cursor: pointer;' class='fa fa-database' onclick=$.alarm('" + row.station_id + "','" + row.station_name + "')>" + "</span><span data-toggle='tooltip' data-placement='top' title='信息' style='color:#7cc1c8;margin-left:15px;cursor: pointer;' class='fa fa-book' onclick=$.info('" + row.station_id + "')></span>" + "</span><span data-toggle='tooltip' data-placement='top' title='参数' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cogs' onclick=$.modify('" + row.station_id + "','" + row.station_name + "')></span>" + "</span><span data-toggle='tooltip' data-placement='top' title='组态' style='color:#6b9dc7;margin-left:15px;cursor: pointer;' class='fa fa-microchip' onclick=$.editor('" + row.station_id + "','" + row.scada_id + "')></span>";
	} else {
		return "<span data-toggle='tooltip' data-placement='top' title='绑定' style='color:#18b393;cursor: pointer;' class='fa fa-chain' onclick=$.bindData('" + row.station_id + "','" + row.station_name + "')>" + "</span><span data-toggle='tooltip' data-placement='top' title='数据' style='color:#5da2d2;margin-left:15px;cursor: pointer;' class='fa fa-database' onclick=$.alarm('" + row.station_id + "','" + row.station_name + "')>" + "</span><span data-toggle='tooltip' data-placement='top' title='信息' style='color:#7cc1c8;margin-left:15px;cursor: pointer;' class='fa fa-book' onclick=$.info('" + row.station_id + "')></span>" + "</span><span data-toggle='tooltip' data-placement='top' title='参数' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cogs' onclick=$.modify('" + row.station_id + "','" + row.station_name + "')></span>" + "</span><span data-toggle='tooltip' data-placement='top' title='组态' style='color:#6b9dc7;margin-left:15px;cursor: pointer;' class='fa fa-microchip' onclick=$.add('" + row.station_id + "')></span>";
	}
}

function companyFormatter(index, value, rows) {
	return "<span >" + value.company_name + "</span>"
}
$.fn.extend({
	//获取设备列表
	getList: function() {
		//console.log($.queryParams())
		$(this).bootstrapTable({
			method: 'get',
			url: globalurl + "/v1_0_0/stations",
			sidePagination: 'server', //设置为服务器端分页
			pagination: true, //是否分页
			search: false, //显示搜索框
			pageSize: 10, //每页的行数 
			pageNumber: 1, //初始化第一页
			showRefresh: false,
			showToggle: false,
			showColumns: false,
			pageList: [10, 15, 20, 25], //是否显示分页
			queryParams: $.queryParams,
			striped: true, //条纹
			onLoadSuccess: function(res) {
				//console.log(res)
				$.toolTip();
				$("#dtuList tbody>tr").each(function(i, ele) {
					$(this).mouseover(function() {
						$(this).addClass("borderColor").siblings().removeClass("borderColor");
					});
					$(this).mouseout(function() {
						$(this).removeClass("borderColor");
					});
				})
			},
			columns: [{
				title: "名称",
				field: "station_name",
				formatter: showFormatter //对本列数据做格式化
			}, {
				title: "所属分公司",
				field: "company_name",
				valign: "middle",
				align: "left",
				formatter: companyFormatter //对本列数据做格式化
			}, {
				title: "操作",
				field: "_id",
				valign: "middle",
				align: "left",
				formatter: editFormatter //对本列数据做格式化
			}]
		});
	},
	smartInput: function(callback) {
		//模拟placeholder
		$(this).attr('tips', $(this).attr('data-info'));
		$(this).focus(function() {
			$(this).css('borderColor', '#1ab394');
			if ($(this).val() === $(this).attr('data-info')) {
				$(this).val('');
			}
		});
		$(this).blur(function() {
			if ($(this).val() === '' && $(this).next('i').attr('isSearch') == 'true') {
				$(this).css('borderColor', '#ccc');
				$(this).val($(this).attr('data-info'));
			} else {
				callback && callback();
			}
		});
		//限制空格
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/\s/g, ''));
		});
	},
	searchStatus: function(callback) {
		$(this).click(function() {
			if ($(this).attr('isSearch') == 'false') {
				$(this).attr('isSearch', 'true');
			}

			callback && callback();
		});
	},
	//回车获取焦点
	enterFocus: function(callBack) {
		$(this).keyup(function(ev) {
			if (ev.which == 13) {
				//$(this).blur();
				if ($(this).next().attr('isSearch') == 'false') {
					$(this).next().attr('isSearch', 'true');
				}
				callBack && callBack.call($(this));
			}
			return false;
		});
	},
	addStation: function() {
		$(this).click(function() {
			if (companyCode.length == 6) {
				$.ajax({
					type: "get",
					url: globalurl + "/v1_0_0/allChildCompany",
					async: false,
					data: {
						access_token: accessToken,
						company_code: user.company_code
					},
					success: function(data) {
						//console.log(data);
						var str; //onchange="$.changeOp()" 
						str = '<ul class="optionList" ></ul>';

						layer.open({
							type: 1,
							title: '选择分公司',
							skin: 'layui-layer-lan', //样式类名
							closeBtn: 1, //不显示关闭按钮
							anim: 2,
							shadeClose: true, //开启遮罩关闭
							area: ['350px', '300px'],
							content: str,
							end: function() {

							}
						});
						code = [];
						for (var i in data) {
							$('.optionList').append('<li optionIndex=' + i + ' value=' + data[i].company_name + '>' + data[i].company_name + '</li>');
							code.push(data[i].company_code);
							companyId.push(data[i].company_id)
						}

						$(".optionList li").changeOp()
					}
				});
			} else {
				self.location.href = "/boxlist/transferInfo";
			}
		})
	},
	//判断哪一个选中
	changeOp: function() {
		$(this).each(function(i, ele) {
			$(this).click(function() {
				layer.closeAll();
				//console.log("/boxlist/transferInfo?company_code="+code[i])
				self.location.href = "/boxlist/transferInfo?company_code=" + code[i] + "&company_id=" + companyId[i];
			})

		})
	}
});

$.extend({
	init: function() {
		$.renderList();
		//$.search();
		$.inputDom();
		//$('input').smartInput();
		/*$("body").click(function(e){
			if(!$(e.target).is('#searchId') && !$(e.target).is('.fa-search') ){
				$('input').val('请输入关键字查找');
			}
		});*/
		//搜索功能
		window.searchCollectot = function() {
			isSearch = true;
			$('#dtuList').bootstrapTable("removeAll");
			$('#dtuList').bootstrapTable("refresh", $.queryParams);
			isSearch = false;
		}
		$(".btn-primary").addStation();
	},
	//渲染列表
	renderList: function() {
		$('#dtuList').getList();
	},
	//点击按钮模糊查询
	search: function() {
		$('i.fa-search').searchStatus(function() {
			$('input').smartInput();
		});
	},
	//回车模糊查询
	inputDom: function() {
		$('input').enterFocus(function() {
			//$.submitBtn();
			//$('input').smartInput();
		});
	},
	//提示信息颜色的改变
	toolTip: function() {
		$('[data-toggle="tooltip"]').tooltip();
		$.tipColor($(".fa-chain"), "#1ab394");
		$.tipColor($(".fa-database"), "#5da2d2aa");
		$.tipColor($(".fa-book"), "#7cc1c8");
		$.tipColor($(".fa-cogs"), "#fcc433");
		$.tipColor($(".fa-microchip"), "#6b9dc7");
	},
	tipColor: function(obj, color) {
		obj.on("mouseover", function() {
				$(".tooltip-inner").css("background-color", color);
				$(".tooltip.top .tooltip-arrow").css("border-top-color", color);
			})
			//callBack && callBack();
	},
	//绑定实体事件
	bindData: function(id, name) {
		self.location.href = "/boxlist/bindDatas?stationId=" + id + "&stationName=" + name;
	},
	//警告实体事件
	alarm: function(id, name) {
		self.location.href = "/boxlist/alarmDatas?stationId=" + id + "&stationName=" + name;
	},
	//修改
	modify: function(id, name) {
		self.location.href = "/boxlist/transferDatas?stationId=" + id + "&stationName=" + name;
	},
	//查看
	info: function(id) {
		self.location.href = "/boxlist/transferInfo?stationId=" + id;
	},
	//编辑
	editor: function(id, _id) {
		self.location.href = "/boxlist/editor?stationId=" + id + "&_id=" + _id;
	},
	//添加
	add: function(id) {
		self.location.href = "/boxlist/add?stationId=" + id;
	},
	//ajax请求携带参数
	queryParams: function(params) {
		if (isSearch == false) { //是否为搜索的状态
			return {
				company_code: getUser().company_code,
				access_token: accessToken,
				company_id: getUser().company_id,
				like: '{"station_name":"' + $('#searchId').val() + '"}', //模糊查询的设备名
				pageNumber: params.offset, //第几页
				pageSize: params.limit //每页的条数

			};
		} else {
			return {
				pageNumber: 0,
				pageSize: params.limit,
				access_token: accessToken,
				company_id: getUser().company_id,
				company_code: getUser().company_code,
				like: '{"station_name":"' + $('#searchId').val() + '"}'
			};
		}
	},

});

$.init();