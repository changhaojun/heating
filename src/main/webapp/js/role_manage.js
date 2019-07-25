$.allData = {
	accesstoken: getToken(),
	tradeId: 2,
	globalurl: "http://114.215.46.56:18825",
	customerId: $("#customerId").val()
}
$.fn.extend({
	//出现遮罩层
	inMask: function() {
		$(this).on("click", function() {
			if ($(this).attr("class") == "btn btn-primary") {
				$(".roleTop").find("span").eq(0).html("添加角色")
			} else if ($(this).attr("class") == "fa fa-wrench") {
				$(".roleTop").find("span").eq(0).html("修改角色")
			}
			$(".Mask").fadeIn(200);
		})
	},
	//关闭遮罩层
	closeMask: function() {
		$(this).on("click", function() {
			$(".Mask").fadeOut(200);
			$(".Resource ul li").find(".ochild").hide();
			$(".Resource ul li").find(".icon").hide();
			$(".Resource ul li span").removeClass("cheacked").addClass("disabled");
			$("#addText").val("");
			$(".Resource ul li .ochild span").removeClass("cheacked").addClass("disabled");
		})
	},
	//点击出现权限
	inResource: function() {
		$(this).on("click", function() {
			$(this).parent("li").find(".ochild").css("left", ($(this).parent("li").index() % 4) * parseInt(-($(this).parent("li").width() + 25)) + "px")
			if ($(this).parent("li").find(".ochild").css("display") == "none") {
				$(".Resource ul li").find(".ochild").hide();
				$(".Resource ul li").find(".icon").hide();
				$(this).parent("li").find(".ochild").show();
				$(this).parent("li").find(".icon").show();
				$(this).removeClass("disabled").addClass("cheacked");

			} else {
				$(".Resource ul li").find(".ochild").hide();
				$(".Resource ul li").find(".icon").hide();
				if ($(this).parent("li").find(".ochild").find(".cheacked").length == 0) {
					$(this).removeClass("cheacked").addClass("disabled");
				}
			}
		})
	},
	//点击子权限被选中
	clickChild: function() {
		$(this).on("click", function() {
			if ($(this).attr("class") == "disabled") {
				$(this).removeClass("disabled").addClass("cheacked");
			} else {
				$(this).removeClass("cheacked").addClass("disabled");
			}
			if ($(this).parent(".ochild").find(".cheacked").length > 0) {
				$(this).parent(".ochild").parent("li").find("span").eq(0).removeClass("disabled").addClass("cheacked");
			} else {
				$(this).parent(".ochild").parent("li").find("span").eq(0).removeClass("cheacked").addClass("disabled");
			}
		})
	},
	space: function() {
		$(this).on("keyup", function(event) {
			if (event.keyCode == 32) {
				$(this).val($(this).val().replace(/\s/g, ''))
			}
		})
	},
	//获取焦点
	getfocus: function() {
		$(this).on("focus", function() {
			$(this).val("");
		})
	}
})
$.extend({
	init: function() {
		searchFilter = '{"customer_id":"' + $.allData.customerId + '"}';
		$.tips();
		$.getRoles();
		$.getResource();
		$.ocloseMask();
		$.Mask();
		$.sureSave();
		$.getChild();
		$.enterSearch();
		$.iconSearch();
		$.disabledSpace();
	},
	showTips: function() {
		$('[data-toggle="tooltip"]').tooltip();
		$.topColor($(".fa-wrench"), "#1ab394");
		$.topColor($(".iclose"), "#1ab394");

	},
	topColor: function(obj, color) {
		obj.on("mouseover", function() {
			$(".tooltip-inner").css("background-color", color);
			$(".tooltip.top .tooltip-arrow").css("border-top-color", color);
		})
	},
	//关闭遮罩层
	ocloseMask: function() {
		$(".closeAdd").closeMask();
	},
	//获取角色列表
	getRoles: function(callBack) {
		$.ajax({
			url: $.allData.globalurl + "/v1/roles",
			type: 'get',
			dataType: 'json',
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accesstoken,
				filter: searchFilter
			},
			success: function(data) {
				if (data.total == 0) {
					$(".authorizationContent").html("<span class='noRole'>暂无角色...</span>")
				} else {
					var roles = "";
					if (data.code == 400005) {
						getNewToken();
						$.getRoles();
					} else {
						for (i = 0; i < data.rows.length; i++) {
							roles += '<div class="authorizationList" id="' + data.rows[i]._id + '">' +
								'<span class="username">' + data.rows[i].role_name + '</span>' +
								'<span class="fa fa-wrench" data-toggle="tooltip" data-placement="top" title="修改"></span>' +
								'<span class="iclose" id="' + data.rows[i]._id + '" data-toggle="tooltip" data-placement="top" title="删除">×</span>' +
								'</div>'
						}
						$(".authorizationContent").html(roles)
						$.showTips();
						$(".authorizationList").find(".iclose").click(function() {
							$.deleteRole($(this));
						});
						$(".authorizationList").find(".fa-wrench").inMask();
						$(".authorizationList").find(".fa-wrench").click(function() {
							$.modifyRole($(this).parent(".authorizationList"));
						});
					}
				}
			}
		});
	},
	//获得资源列表
	getResource: function() {
		oChild = [];
		$.ajax({
			url: $.allData.globalurl + "/v1/resources",
			type: 'get',
			dataType: 'json',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accesstoken,
				filter: '{"trade_id":' + $.allData.tradeId + '}'
			},
			success: function(data) {
				var resource = "";
				var childResource = [];
				if (data.code == 400005) {
					getNewToken();
					$.getResource();
				} else {
					for (i = 0; i < data.rows.length; i++) {
						if (data.rows[i].parent_id == null) {
							resource = '<li><span class="oresource disabled"  id="' + data.rows[i]._id + '">' + data.rows[i].resource_name +
								'</span><div class="icon"><i class="fa fa-caret-up"></i></div>' +
								'<div class="ochild">' +
								'</div></li>';
							$(".Resource ul").append(resource)
						} else {
							oChild.push(data.rows[i]);
						}
					}
				}
			}
		});
	},
	//获得子权限
	getChild: function() {
		for (var i = 0; i < oChild.length; i++) {
			for (j = 0; j < $(".Resource ul li").length; j++) {
				if ($(".Resource ul li").eq(j).find("span").eq(0).attr("id") == oChild[i].parent_id) {
					$(".Resource ul li").eq(j).find(".ochild").append(
						'<span class="disabled" id="' + oChild[i]._id + '">' + oChild[i].resource_name + '</span>'
					)
				}
			}
		}
		$(".Resource ul li .oresource").inResource();
		$(".Resource ul li .ochild span ").clickChild();
	},
	//出现遮罩层
	Mask: function() {
		$(".btn-primary").inMask();
		$(".Resource ul li .oresource").parent("li").find(".ochild").find("span").removeClass("disabled").addClass("cheacked");
	},
	//保存角色
	doAjax: function() {
		var roleList = [];
		for (var i = 0; i < $(".Resource ul .cheacked").length; i++) {
			roleList.push($(".Resource ul .cheacked").eq(i).attr("id"))
		}
		roleList += "";
		var data = "{'role_name':'" + $("#addText").val() + "','customer_id':'" + $.allData.customerId + "'}"
		$.ajax({
			url: $.allData.globalurl + "/v1/roles",
			type: 'post',
			dataType: 'json',
			crossDomain: true == !(document.all),
			data: {
				data: data,
				resources: roleList,
				access_token: $.allData.accesstoken
			},
			success: function(data) {
				if (data.code == 200) {
					layer.msg(data.success, {
						icon: 1
					})
					setTimeout("self.location.reload()", 2000)
				} else if (data.code == 400005) {
					window.getNewToken()
					$.doAjax()
				} else if (data.code == 400007) {
					layer.msg(data.error, {
						icon: 2
					})
				} else if (data.code == 40018) {
					layer.msg(data.error, {
						icon: 2
					})
				} else {
					layer.msg("保存失败", {
						icon: 2
					})
				}
			}
		});
	},
	//确定保存
	sureSave: function() {
		$(".oBtn").on("click", function() {
			if ($(".roleTop").find("span").eq(0).html() == "添加角色") {
				if ($("#addText").val() == "") {
					layer.tips('角色名不能为空', '#addText', {
						tips: [1, '#ff787b'] //还可配置颜色
					});
				} else if ($(".Resource ul").find(".cheacked").length == 0) {
					layer.msg('亲，还没选择资源', {
						icon: 7
					});
				} else {
					$.doAjax();
				}
			}
		})
	},
	//删除角色
	deleteRole: function(el) {
		var editId = el.attr("id");
		layer.confirm("<font size='2'>是否将此角色删除？</font>", {
			icon: 7
		}, function(index) {
			layer.close(index);
			$.ajax({
				type: 'delete',
				dataType: 'json',
				crossDomain: true == !(document.all),
				url: $.allData.globalurl + "/v1/roles/" + editId + "?access_token=" + $.allData.accesstoken + "&customer_id=" + $.allData.customerId,
				success: function(data) {
					if (data.code == 200) {
						layer.msg(data.success, {
							icon: 1
						})
						setTimeout("self.location.reload()", 2000)
					} else if (data.code == 400005) {
						window.getNewToken()
						$.deleteRole()
					} else if (data.code == 400007) {
						layer.msg(data.error, {
							icon: 2
						})
					} else if (data.code == 40018) {
						layer.msg(data.error, {
							icon: 2
						});
					}
				}
			});
		})
	},
	//修改角色
	modifyRole: function(el) {
		var editId = el.attr("id");
		$.ajax({
			url: $.allData.globalurl + "/v1/roles/",
			type: 'get',
			dataType: 'json',
			crossDomain: true == !(document.all),
			data: {
				role_id: editId,
				access_token: $.allData.accesstoken,
				filter: '{"trade_id":' + $.allData.tradeId + ',"customer_id":"' + $.allData.customerId + '"}'
			},
			success: function(data) {
				var resource = "";
				var childResource = [];
				if (data.code == 400005) {
					getNewToken();
					$.getResource();
				} else {
					$("#addText").val(data.role_name)
					for (var i = 0; i < $(".Resource ul").find("span").length; i++) {
						for (var j = 0; j < data.resources.length; j++) {
							if ($(".Resource ul").find("span").eq(i).html() == data.resources[j].resource_name) {
								$(".Resource ul").find("span").eq(i).removeClass("disabled").addClass("cheacked");
							}
						}
					}
				}
			}
		});
		$(".oBtn").on("click", function() {
			if ($(".roleTop").find("span").eq(0).html() == "修改角色") {
				if ($("#addText").val() == "") {
					layer.tips('角色名不能为空', '#addText', {
						tips: [1, '#ff787b'] //还可配置颜色
					});
				} else if ($(".Resource ul").find(".cheacked").length == 0) {
					layer.msg('亲，还没选择资源', {
						icon: 7
					});
				} else {
					$.sureModify(editId);
				}
			}
		})
	},
	//提交修改
	sureModify: function(editId) {
		var roleList = [];
		for (var i = 0; i < $(".Resource ul .cheacked").length; i++) {
			roleList.push($(".Resource ul .cheacked").eq(i).attr("id"))
		}
		roleList += "";
		var data = "{'role_name':'" + $("#addText").val() + "','customer_id':'" + $.allData.customerId + "'}"
		$.ajax({
			type: 'put',
			url: $.allData.globalurl + "/v1/roles/" + editId,
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				data: data,
				access_token: $.allData.accesstoken,
				resources: roleList
			},
			success: function(data) {
				if (data.code == 400005) {
					getNewToken();
					sureModify();
				} else if (data.code == 400014) {
					layer.msg(data.error, {
						icon: 2,
					});
				} else if (data.code == 400017) {
					layer.msg(data.error, {
						icon: 2,
					});
				} else if (data.code == 40018) {
					layer.msg(data.error, {
						icon: 2,
					});
				} else if (data.code == 200) {
					layer.msg(data.success, {
						icon: 1,
						end: function() {
							setTimeout("self.location.reload()", 2000)
						}
					})
				}
			}
		})
	},
	//模糊查询
	likeSearch: function() {
		var okey = "{'role_name':'" + $("#searchId").val() + "'}";
		$.ajax({
			type: 'get',
			url: $.allData.globalurl + "/v1/roles",
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				like: okey,
				access_token: $.allData.accesstoken,
				filter: searchFilter
			},
			success: function(data) {
				var roles = "";
				if (data.code == 400005) {
					getNewToken();
					$.likeSearch();
				} else {
					for (i = 0; i < data.rows.length; i++) {
						roles += '<div class="authorizationList" id="' + data.rows[i]._id + '">' +
							'<span class="username">' + data.rows[i].role_name + '</span>' +
							'<span class="fa fa-wrench" data-toggle="tooltip" data-placement="top" title="修改"></span>' +
							'<span class="iclose" id="' + data.rows[i]._id + '" data-toggle="tooltip" data-placement="top" title="删除">×</span>' +
							'</div>'
					}
					$(".authorizationContent").html(roles);
					$(".authorizationList").find(".iclose").click(function() {
						$.deleteRole($(this));
					});
					$(".authorizationList").find(".fa-wrench").inMask();
					$(".authorizationList").find(".fa-wrench").click(function() {
						$.modifyRole($(this).parent(".authorizationList"));
					});
				}
			}
		})
	},
	//按回车进行查询
	enterSearch: function() {
		$("#searchId").on("keyup", function(event) {
			if (event.keyCode == 13) {
				$.likeSearch();
			}
		})
	},
	//按搜索图标进行查询
	iconSearch: function() {
		$(".fa-search").on("click", function() {
			$.likeSearch();
		})
	},
	//去掉空格
	disabledSpace: function() {
		$("#searchId").space();
		$("#addText").space();
		$("#searchId").getfocus();
	},
	//提示层
	tips: function() {
		$('[data-toggle="tooltip"]').tooltip()
	}

})
$.init();