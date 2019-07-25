
$.allData = {
	index: 0,
	accessToken: getToken(),
	companyCode: $("#companyCode").val(),
	companyId: $("#companyId").val(),
	liString: "",
	time: "",
	dateLength :'',
    dateTime:''
}
$.fn.extend({
    //初始化日历插件
    initDate :function (){
        //点击获取时间
        $(this).daterangepicker({
            singleDatePicker: true,
            startDate: moment()
        }, function(start, end, label) {
            //newTime = new Date(start).getFullYear() + "$" + fn(new Date(start).getMonth() + 1) + "$" + fn(new Date(start).getDate());


        });
    },
})

$.extend({
	init: function() {
		$.Carousel();
		$.dateAjax();

		$.selectDate();
	},
	//导航轮播图
	Carousel: function() {
		
		$(".left").on("click", function() {
			if ($(".dateList").css("right") != "0px") {
				$.allData.index++;
				if($.allData.index >= $.allData.dateLength-1 ){
					$.allData.index = $.allData.dateLength-1;
				}
				$(".dateList").animate({
					left: -$.allData.index * ($(".dateList li").width()) + 'px'
				});
			}
		})
		$(".right").on("click", function() {
			if ($(".dateList").css("left") != "0px") {
				$.allData.index--;
				if($.allData.index <= 0){
					$.allData.index = 0
				}
				$(".dateList").animate({
					left: -$.allData.index * ($(".dateList li").width()) + 'px'
				});
			}
		})
	},
	//日期导航的数据请求
	dateAjax: function() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: globalurl + '/v1_0_0/heatingSeason',
			async: false,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.accessToken,
				company_code: $.allData.companyCode,
				company_id: $.allData.companyId
			},
			success: function(data) {
				if (data.length != 0 || data.length != undefined) {
					$(".dateList").css("width", 207 * data.length);
					$.navLayout(data);
					$.allData.dateLength = data.length
				}
			}
		})
	},
	//导航布局
	navLayout: function(data) {
		for (var i = 0; i < data.length; i++) {
			$.allData.liString += "<li date='" + data[i] + "'>" + data[i] + "</li>"
		}
		$(".dateList").html($.allData.liString);
	},
	//选择供热时间
	selectDate: function() {
		$(".dateList li:last-child").addClass("active");
		$.allData.time = $(".dateList li:last-child").attr("date");
		$.nowYear();
		$(".dateList li").on("click", function() {
			$(".dateList li").removeClass("active");
			$(this).addClass("active");
			if ($(this).attr("date") == $(".dateList li:last-child").attr("date")) {
				$(".heatingSeasonLongTable").hide();
				$(".heatingSeasonNowTable").show();
				$.allData.time = $(".dateList li:last-child").attr("date")
				$('#nowYearTable').bootstrapTable("refresh", $.queryParams)
			} else {
				$(".heatingSeasonNowTable").hide();
				$(".heatingSeasonLongTable").show();
				$.allData.time = $(this).attr("date");
				$.longYear()
				$('#longYearTable').bootstrapTable("refresh", $.queryParams)
			}
		})
	},
	//根据供热时间对表格布局==>往年
	longYear: function() {
		//		console.log($.allData.time)
		$('#longYearTable').bootstrapTable({
			method: 'get',
			url: globalurl + "/v1_0_0/heatingSeason",
			sidePagination: 'server', //设置为服务器端分页
			pagination: true, //是否分页
			search: false, //显示搜索框
			pageSize: 10, //每页的行数
			pageNumber: 1,
			showRefresh: false,
			showToggle: false,
			showColumns: false,
			pageList: [5, 10, 15, 20],
			queryParams: $.queryParams,
			striped: true, //条纹
			onLoadSuccess: function(value) {
				if (value.code == 400005) {
					$('#heatingSeasonTable').bootstrapTable("refresh", $.queryParams)
				}
				$('[data-toggle="tooltip"]').tooltip();
			},
			columns: [{
				title: $.selectCompany(),
				field: "company_name",
				valign: "middle",
				align: "left",
			}, {
				title: "开始时间",
				field: "start_time",
				valign: "middle",
				align: "center",
			}, {
				title: "结束时间", //标题
				field: "end_time", //键名
				valign: "middle",
				align: "center",
			}, {
				title: "热计量单价",
				field: "heat_unit_price",
				valign: "middle",
				align: "center",
			}, {
				title: "面积计量单价",
				field: "area_unit_price",
				valign: "middle",
				align: "center",
			}],
		})
	},
	nowYear: function() {
		$('#nowYearTable').bootstrapTable({
			method: 'get',
			url: globalurl + "/v1_0_0/heatingSeason",
			sidePagination: 'server', //设置为服务器端分页
			pagination: true, //是否分页
			search: false, //显示搜索框
            editable:true,//开启编辑模式
			pageSize: 8, //每页的行数 
			pageNumber: 1,
			showRefresh: false,
			showToggle: false,
			showColumns: false,
			pageList: [5, 10, 15, 20],
			queryParams: $.queryParams,
			striped: true, //条纹
			onLoadSuccess: function(value) {
				if (value.code == 400005) {
					$('#heatingSeasonTable').bootstrapTable("refresh", $.queryParams)
				}
				$('[data-toggle="tooltip"]').tooltip();
			},
			columns: [{
				title: $.selectCompany(),
				field: "company_name",
				valign: "middle",
				align: "left",
                edit:false
			}, {
				title: "开始时间",
				field: "start_time",
				valign: "middle",
				align: "center",
                edit:{required:true ,type:'text'},
				formatter: $.startTime
			}, {
				title: "结束时间", //标题
				field: "end_time", //键名
				valign: "middle",
				align: "center",
				formatter: $.endTime
			}, {
				title: "热计量单价",
				field: "heat_unit_price",
				valign: "middle",
				align: "center",
				formatter: $.heatUnitPrice
			}, {
				title: "面积计量单价",
				field: "area_unit_price",
				valign: "middle",
				align: "center",
				formatter: $.areaUnitPrice
			},{
				title: "操作",
				field: "operation",
				valign: "middle",
				align: "center",
                formatter : $.editInfo,
				edit:false,
                events: {
					'click .using': function (e, value, row, index) {
						$(this).css("display", "none");
						for(var i=0;i<5;i++){
							$(this).parent().parent().find('td').eq(i).find('.textInput').css("display", "block")
							$(this).parent().parent().find('td').eq(i).find('span').css("display", "none")
							//console.log( $(this).parent().parent().find('.textInput').eq(i).val())
						}
						$(this).next().css("display", "block")
						$('.start-time,.end-time').initDate();

					},
					'click .save-data': function (e, value, row, index){
                        // console.log(index)
                        // console.log($('.start-time').eq(index).val())
						$('#nowYearTable').bootstrapTable('updateRow', {
							 index: index,
							 row: {
								 'start_time':$('.start-time').eq(index).val(),
								 'end_time':$('.end-time').eq(index).val(),
								 'heat_unit_price':$('.heat-price').eq(index).val(),
								 'area_unit_price':$('.area-price').eq(index).val()
							 }
						 })

                       // console.log(row)
                        for(var i=0;i<5;i++){
                            $(this).parent().parent().parent().find('td').eq(i).find('.textInput').css("display", "none")
                            $(this).parent().parent().parent().find('td').eq(i).find('span').css("display", "block")
                        }
                        $(this).parent().prev().css("display", "block");
                        $(this).parent().css("display", "none");
                        $.ajax({
                            type: 'put',
                            dataType: 'json',
                            url: globalurl + '/v1_0_0/heatingSeason',
                            async: false,
                            crossDomain: true == !(document.all),
                            data: {
                                access_token: $.allData.accessToken,
                                data: JSON.stringify(row)
                            },
							success:function (data){
                            	//console.log(data)
							}
                        })
					},
                    'click .cancle': function (e, value, row, index){
                        for(var i=0;i<5;i++){
                            $(this).parent().parent().parent().find('td').eq(i).find('.textInput').css("display", "none")
                            $(this).parent().parent().parent().find('td').eq(i).find('span').css("display", "block")
                        }
                        $(this).parent().prev().css("display", "block");
                        $(this).parent().css("display", "none");
                    }
                }
			}],
		})
	},
	startTime: function(value, row) {
        value = value === null ? '' : value;
        return "<input type='text' value='" + value + "' _id='" + row._id + "' data='start_time' class='textInput start-time' onkeyup='$.space($(this))'/>"+
            "<span>"+value+"</span>"
	},
	endTime: function(value, row) {
        value = value === null ? '' : value;
		return "<input type='text' value='" + value + "' _id='" + row._id + "'  data='end_time' class='textInput end-time' onkeyup='$.space($(this))'/>"+
            "<span>"+value+"</span>"
	},
	heatUnitPrice: function(value, row) {
        value = value === null ? '' : value;
        return "<input type='text' value='" + value + "' _id='" + row._id + "' data='heat_unit_price' class='textInput heat-price' onkeyup='$.space($(this))'/>"+
            "<span>"+value+"</span>"
	},
	areaUnitPrice: function(value, row) {
        value = value === null ? '' : value;
        return "<input type='text' value='" + value + "' _id='" + row._id + "' data='area_unit_price' class='textInput area-price' onkeyup='$.space($(this))'/>"+
            "<span>"+value+"</span>"
	},
	editInfo : function(value,row){
        return '<span class="using"><i class="fa fa-edit"></i></span>'+
            '<div class="edit_handle" style="display: none;"><span class="save-data"><i class="fa fa-check"></i></span>&nbsp;&nbsp;&nbsp;'+
            '<span class="cancle"><i class="fa fa-times"></i></span></div>'
    },
    //判断是分公司还是总公司
    selectCompany: function() {
        return $.allData.companyCode.length == 6 ? "分公司" : "公司名称"
    },
    queryParams: function(params) {
        return {
            pageNumber: params.offset, //第几页
            pageSize: params.limit, //每页的条数
            access_token: $.allData.accessToken,
            time: $.allData.time,
            company_code: $.allData.companyCode,
            company_id: $.allData.companyId
        };
    },
    //限制空格输入
    space: function(object) {
        object.val(object.val().replace('/\s/g', ''))
        object.val(object.val().replace(/[^0-9-]/g, ''));
    },
});
$.init();
