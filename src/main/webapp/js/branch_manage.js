	$.allData = {
		index: 0,
		accessToken: getToken(),
		companyCode: $("#companyCode").val(),
		companyId: $("#companyId").val(),
		liString: "",
		companyname: "",
		branchId: "",
		branchName: "",
		branchData: ""
	};

	function init() {
		Carousel();
		dateAjax();
		selectDate();
		listNum()
		showTips();
		draging()
	};
	//导航轮播图
	 function Carousel() {
		$(".left").on("click", function() {
			if ($(".companyList").css("right") < "0px") {
				$.allData.index++;
				$(".companyList").animate({
					left: -$.allData.index * ($(".companyList li").width()) + 'px'
				});
			}
		})
		$(".right").on("click", function() {
			if ($(".companyList").css("left") != "0px") {
				$.allData.index--;
				$(".companyList").animate({
					left: -$.allData.index * ($(".companyList li").width()) + 'px'
				});
			}
		})
	};
	//分公司导航的数据请求
	 function dateAjax() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/allChildCompany',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accessToken,
				company_code: $.allData.companyCode,
				company_id: $.allData.companyId
			},
			success: function(data) {
				if (data.length != 0 || data.length != undefined) {
					$(".companyList").css("width", 207 * data.length);
					navLayout(data);
				}
			}
		})
	};
	//导航布局
	 function navLayout(data) {
		$.allData.companyId = data[0].company_id
		for (var i = 0; i < data.length; i++) {
			$.allData.liString += "<li _id='" + data[i].company_id + "' _code='"+ data[i].company_code +"'>" + data[i].company_name + "<span class='fa fa-plus' data-toggle='tooltip' data-placement='top' title='添加支线'></span></li>"
		}
		$(".companyList").html($.allData.liString);
		showTips();
	};
	//选择分公司==>点击事件
	 function selectDate() {
		$(".companyList li:first-child").addClass("active");
		$(".companyList li").on("click", function() {
			$(".companyList li").removeClass("active");
			$(this).addClass("active");
			$(".list").html("");
			$.allData.companyId = $(this).attr("_id")
			selectStation();
			showTips();
			draging()
		})
	};
	//layer==>top提示
	 function showTips() {
		$('[data-toggle="tooltip"]').tooltip();
		topColor($(".fa-plus"));
		topColor($(".fa-wrench"));
	};
	//layer==>改变top背景字体颜色及边框
	 function topColor(obj) {
		obj.on("mouseover", function() {
			$(".tooltip-inner").css({
				"background-color": "#fff",
				"color": "#1AB380",
				"border": "1px solid #ccc"
			});
			$(".tooltip.top .tooltip-arrow").css("border-top-color", "#ccc");
		})
	};
	//修改支线名称
	 function branchEditName() {
		$(".fa-wrench").click(function() {
			$(this).parents(".branchList .branchTitle").html("<input class='editName' maxlength='10' type='text' value='" + $(this).parent().children('.branchName').html() + "'/>")
			sureEdit()
			space();
		})
	};
	//限制空格输入
	 function space() {
		$(".editName").keyup(function() {
			$(this).val($(this).val().replace('/\s/g', ''))
		})
		$("input").focus()
	};
	//支线名修改完成==>失焦事件
	 function sureEdit() {
		$("input").blur(function() {
			$.allData.branchId = $(this).parent(".branchList .branchTitle").next().attr('_id');
			$(this).parent(".branchList .branchTitle").html('<span class="branchName">' + $(this).val() + '</span> <span class="fa fa-wrench" data-toggle="tooltip" data-placement="top" title="改名"></span>')
			showTips();
			$.allData.branchName = $(this).val();
			
			editBranch();
		})
	};
	//选择默认的分公司的换热站
	 function selectStation() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/branchManage',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accessToken,
				company_id: $.allData.companyId,
				name: $.allData.companyname
			},
			success: function(data) {
				branchLayout(data);
				$.allData.branchData = data;
			}
		})
//		draging();
	};
	//对获取的支线进行布局
	 function branchLayout(data) {
		var TITLE = "";
		var UL = "";
		var index = -1;
		for (var i = 0; i < data.length; i++) {
			if(data[i].data != null){
				for (var j = 0; j < data[i].data.length; j++) {
				UL += "<li _id=" + data[i].data[j].station_id + "><div><span class='index'>" + (j+1) + "</span>" + data[i].data[j].station_name + "</div></li>"
				}
			}else{
				UL = ''
			}
			
			TITLE += "<div class='branchList' _id='" + data[i].branch_id + "'><div class='branchTitle'><span class='branchName'>" + data[i].branch_name + "</span><span class='fa fa-wrench' data-toggle='tooltip'data-placement='top'data-original-title='改名'></span></div><ul class='dragsort' id = 'list"+ i +"'_id = "+ data[i].branch_id +">" + UL + "</ul></div>"
			UL = "";
			index++;
			if (index < 6) {
				$(".list").eq(i).append(TITLE);
			} else {
				$(".list").eq(waterFull()).append(TITLE);
			}
			TITLE = ""
		}
		branchEditName();
	};
	
	//根据屏幕宽度计算可以放几个list
	 function listNum() {
		var list = "";
		for (var i = 0; i < 6; i++) {
			list += "<div class='list'></div>"
		}
		$(".branchListBox").html(list)
		selectStation();
	};
	//瀑布流布局
	 function waterFull() {
		var _index = 0;
		var shortH = $(".list").eq(_index).outerHeight();
		$(".list").each(function(i, ele) {
			if (shortH > $(ele).outerHeight()) {
				shortH = $(ele).outerHeight();
				_index = i;
			}
		});
		
		return _index;
	};
	//修改支线名称
	 function editBranch() {
		$.ajax({
			type: 'put',
			dataType: 'json',
			url: globalurl + '/v1_0_0/branchManage',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accessToken,
				branch_name: $.allData.branchName,
				branch_id: $.allData.branchId
			},
			success: function(data) {
				if(data.code == 200){
					layer.msg('修改成功', {
					icon: 1,
					time: 1000

					})
				}
			}
		})
	}

	init();
	//	拖拽触发
	function draging(){
			$(".dragsort").dragsort({
			dragSelector: "div", 
			dragBetween: true, 
			dragEnd: saveOrder, 
			scrollSpeed: 5
		});
		}
	//	拖拽回调
	function saveOrder() {
			let endBranchId = $(this).parent().attr('_id'),     	//拖动后的支线   id
				currentStationId = $(this).attr('_id'),				//拖来的某一项   station_id
				startStationArr = [],								//拖动后   第一个数组(已经删除拖走的那一项)
				endStationArr = [],									//拖动后   第二个数组(已经添加拖来的那一项)
				startBranchId = '',									//从这个支线拖的
				currentIndex = 0,									//拖动项在之前数组的index
				allBranch = $.allData.branchData,
				currentItem = {};
			    endElement = $(this).parent().children(),
			    insertIndex=0;
			endElement.each(function(i,e){
				endStationArr.push(e.getAttribute('_id'))
				if(e.getAttribute('_id') == currentStationId){
					insertIndex = i
				}
			});	
			for(var i = 0;i<allBranch.length;i++){
				if(allBranch[i].data != null){
					for(var j = 0;j<allBranch[i].data.length;j++){
					if(currentStationId == allBranch[i].data[j].station_id){  //就是从这个支线开始拖的
						currentItem = allBranch[i].data[j];
						startBranchId = allBranch[i].branch_id;
						currentIndex = j;
						for(var k = 0;k<allBranch[i].data.length;k++){
							startStationArr.push(allBranch[i].data[k].station_id);							
						}//删除拖走的热站
						startStationArr.splice(currentIndex,1);
						allBranch[i].data.splice(currentIndex,1);
						}
					}
				}
				//把拖过来的热站添加到当前支线
				if(allBranch[i].branch_id == endBranchId){
					if(allBranch[i].data!=null){
						allBranch[i].data.splice(insertIndex,0,currentItem);
					}else{
						allBranch[i].data=[];
						allBranch[i].data.push(currentItem)
					}					
				}
			}			
			let startObj = {
					branch_id:startBranchId,
					stations:startStationArr
			};
			let endObj = {
				branch_id:endBranchId,
				stations:endStationArr
			}
			if(startBranchId == endBranchId){
				startObj = {}
			}
			$.ajax({		
			type: 'delete',
			dataType: 'json',
			url: globalurl + '/v1_0_0/branchManage?access_token='+$.allData.accessToken+ "&start="+JSON.stringify(startObj) +"&end="+JSON.stringify(endObj),
			async: false,
			crossDomain: true == !(document.all),
			traditional: true,
			success: function(data) {
				if(data.code==200){
					$("ul[_id="+startBranchId+"]").children().each(function(i,e){
						e.getElementsByTagName('span')[0].innerHTML = i+1
					})
					$("ul[_id="+endBranchId+"]").children().each(function(i,e){
						e.getElementsByTagName('span')[0].innerHTML = i+1
					})
					layer.msg('更新成功', {
					icon: 1,
					time: 2000
					})
				}
			}
		})
	};
	//	新增支线
	$('.fa-plus').on('click',function(e){
		e.stopPropagation();
		let cmpmanyId = $(this).parent().attr('_id'),
			cmpmanyCode = $(this).parent().attr('_code'),
			data = {
					branch_name:'新增支线',
					company_id:cmpmanyId,
					company_code:cmpmanyCode
			};
		$.ajax({		
			type: 'post',
			dataType: 'json',
			url: globalurl + '/v1_0_0/branchManage',
			async: false,
			crossDomain: true == !(document.all),
			data:{
				access_token: $.allData.accessToken,
				data:JSON.stringify(data)
			},
			success: function(data) {
				if(data.code==200){
					$('.list').children().remove();
					selectStation();
					draging();
					layer.msg('新增支线成功', {
					icon: 1,
					time: 2000
					})
				}
			}		
		})	 	
	})
	// 搜索热站
	let thisSiteId = '';

	function searchStation(){

		let hotSiteName = $(".searchInput").val(),
		    allSiteData = $.allData.branchData;
		for(var i=0;i<allSiteData.length;i++){
			if(allSiteData[i].data!=null){
				for(var j=0;j<allSiteData[i].data.length;j++){
				if(hotSiteName == allSiteData[i].data[j].station_name){
					thisSiteId = allSiteData[i].data[j].station_id;
				}
			}
			}
		}
		//选中项高亮显示
		$("li[_id="+thisSiteId+"]").addClass('selectedItem');
		//滚动页面到选中项
		$('html, body').animate({  
                    scrollTop: $("li[_id="+thisSiteId+"]").offset().top  
        }, 1500);  

	}
	$('.searchBtn').on('click',function (){
		searchStation();
	});
	$('.searchInput').on('keydown',function(e){
		if (e.keyCode == 13) {  
			searchStation();  			
		}
	});
	
	$("li").on('mouseenter',function(){
		$(this).removeClass('selectedItem')
	})
	
