	var accesstoken = getToken();
	var user = getUser();

	//获取时间
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var date = myDate.getDate();
	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();
	var flag = "";
	if (h >= 12) {
		flag = "PM";
	} else {
		flag = "AM";
	}

	function p(s) {
		return s < 10 ? '0' + s : s;
	}

	yearMonth = year + '-' + p(month)
	startTime = getMonthStartDate();
	endTime = getNextMonthStartDate();
	initstartTime = year + '-' + p(month)
	$("#reservationtime").val(initstartTime)

	//获取月报表列表
	monthReport()

	function monthReport() {
		layer.msg('数据加载中，请耐心等待...', {
			icon: 16,
			shade: 0.01,
			time: -1
		});
		var data = {};
		data.month = '1';
		data.company_code = user.company_code,
			data.start_time = startTime;
		data.end_time = endTime;
		//		console.log(data)
		$.ajax({
			type: "get",
			url: globalurl + "/v1_0_0/stationsDatas",
			dataType: "json",
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				data: JSON.stringify(data)
			},
			success: function(data) {
				layer.closeAll();
				$('#reportList tbody').empty()
				datas = data
					//				console.log(datas)
				getRows()
			}
		})
	}

	//动态获取dom
	function getRows() {
		//		console.log(datas)
		var str = ''
		for (var i = 0; i < datas.length; i++) {
			for (var j = 0; j < datas[i].value.length; j++) {
				if (datas[i].value[j].toString().indexOf(".") != -1) {
					datas[i].value[j] = datas[i].value[j].toFixed(2)
				}
			}
			str = '<tr>' +
				'<td>' + datas[i].station_name + '</td>' +
				'<td>' + datas[i].station_area + '</td>' +
				'<td>' + datas[i].value[0] + '</td>' +
				'<td>' + datas[i].value[1] + '</td>' +
				'<td>' + datas[i].value[2] + '</td>' +
				'<td>' + datas[i].value[3] + '</td>' +
				'<td>' + datas[i].value[4] + '</td>' +
				'<td>' + datas[i].value[5] + '</td>' +
				'<td>' + datas[i].value[6] + '</td>' +
				'<td>' + datas[i].value[7] + '</td>' +
				'</tr>'
			$('#reportList tbody').append(str)
		}
	}

	//点击时间获取报表
	$('#reservationtime').datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 3, //这里就设置了默认视图为年视图
		minView: 3, //设置最小视图为年视图
		forceParse: 0,
		singleDatePicker: true,
		startDate: '2017-09'
	}).on('changeDate', function(startDate) {
		$('.monthList .listTop button').removeClass('btnColor');
		var years = $('.switch').html().split(' ')[2];
		var num = startDate.date;
		startDatas1 = new Date(num).getFullYear() + "$" + p(new Date(num).getMonth() + 1) + "$" + p(new Date(num).getDate()) + "$" + p(new Date(num).getHours()) + ":" + p(new Date(num).getMinutes()) + ":" + p(new Date(num).getSeconds());
		startDatas = startDatas1.split('$')[0] + '$' + startDatas1.split('$')[1] + '$' + startDatas1.split('$')[2] + '$' + '00:00:00';

		//12月做判断
		var yy = startDatas.split('$')[0] * 1
		var mm = startDatas.split('$')[1] * 1
		var mm1 = mm + 1
		if (mm == 12) {
			endTime = yy + 1 + '$' + '01' + '$' + '01' + '$' + '00:00:00';
		} else {
			endTime = yy + '$' + p(mm1) + '$' + '01' + '$' + '00:00:00';
		}
		startTime = startDatas
			//刷新页面
		monthReport()
	})

	//点击时间按钮样式
	$('.monthList .listTop button').click(function() {
		$('.monthList .listTop button').removeClass('btnColor')
		$(this).addClass('btnColor')
	})

	//点击时间按钮事件
	function changeList1() { //本月数据
		startTime = getMonthStartDate()
		endTime = getNextMonthStartDate()
			//刷新页面
		dateTime = startTime.split('$')[0] + '-' + startTime.split('$')[1]
		$("#reservationtime").val(dateTime)
		$('#reservationtime').datetimepicker('update')
		monthReport()
	}

	function changeList2() { //上月数据
		startTime = getLastMonthStartDate()
		endTime = getMonthStartDate()
			//刷新页面
		dateTime = startTime.split('$')[0] + '-' + startTime.split('$')[1]
		$("#reservationtime").val(dateTime)
		$('#reservationtime').datetimepicker('update')
		monthReport()
	}

	function changeList3() { //去年本月
		startTime = getLastYearMonthStartDate()
		endTime = getLastYearNextMonthStartDate()
			//刷新页面
		dateTime = startTime.split('$')[0] + '-' + startTime.split('$')[1]
		$("#reservationtime").val(dateTime)
		$('#reservationtime').datetimepicker('update')
		monthReport()
	}

	function changeList4() { //去年上月
		startTime = getLastYearLastMonthStartDate()
		endTime = getLastYearMonthStartDate()
			//刷新页面
		dateTime = startTime.split('$')[0] + '-' + startTime.split('$')[1]
		$("#reservationtime").val(dateTime)
		$('#reservationtime').datetimepicker('update')
		monthReport()
	}

	//导出
	exportReport()

	function exportReport() {
		$(".excel_o").click(function() {
			excel_o.href = tableToExcel('reportList')
			$("#excel_o").attr("download", "月度统计")
		});
	}

	//打印
	printReport()

	function printReport() {
		$("#btn_print").click(function(event) {
			$("#reportList").printThis({
				debug: false,
				importCSS: true, //引入外部样式
				importStyle: true, //引入内部样式<style media="print"></style>
				printContainer: true,
				loadCSS: '',
				pageTitle: "月度统计",
				removeInline: true,
				printDelay: 333,
				header: null,
				formValues: false
			})
		})
	}

	//返回顶部
	renturnTop()

	function renturnTop() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > 100) {
				$(".returnTop").fadeIn(1000);
			} else {
				$(".returnTop").fadeOut(1000);
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