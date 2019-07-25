var accesstoken = getToken();
var user = getUser();

//获取时间
function p(s) {
	return s < 10 ? '0' + s : s;
}
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
startTime = year + "$" + p(month) + "$" + (p(date - date + 1)) + "$" + (p(h - h)) + ":" + (p(m - m)) + ":" + (p(s - s));
endTime = year + "$" + p(month) + "$" + (p(date)) + "$" + (p(h - h)) + ":" + (p(m - m)) + ":" + (p(s - s));
initstartTime = year + '-' + p(month) + "-" + p(date - date + 1);
initendTime = year + '-' + p(month) + "-" + p(date);
$("#reservationtime").val(initstartTime + ' ' + ' - ' + ' ' + initendTime)

//获取自选时间报表
freeReport()

function freeReport() {
	layer.msg('数据加载中，请耐心等待...', {
		icon: 16,
		shade: 0.01,
		time: -1
	});
	var data = {};
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

//选择日期
$(document).ready(function() {
	$('#reservationtime').daterangepicker({
		timePicker: true,
		timePickerIncrement: 30,
		format: 'YYYY-MM-DD '
	}, function(start, end, label) {
		$('.freeList .listTop button').removeClass('btnColor');
		start = new Date(start).getFullYear() + "$" + p(new Date(start).getMonth() + 1) + "$" + p(new Date(start).getDate()) + "$" + p(new Date(start).getHours()) + ":" + p(new Date(start).getMinutes()) + ":" + p(new Date(start).getSeconds());
		end = new Date(end).getFullYear() + "$" + p(new Date(end).getMonth() + 1) + "$" + p(new Date(end).getDate()) + "$" + "00:00:00";
		//	   	    console.log(end)
		//12月做判断
		var yy = end.split('$')[0] * 1
		var mm = end.split('$')[1] * 1
		var dd = end.split('$')[2] * 1
		var mm1 = mm + 1
		var dd1 = dd + 1
		if (mm != 12) {
			if (mm == 02) {
				if (dd == 28) {
					end = yy + '$' + p(mm1) + '$' + '01' + '$' + '00:00:00';
				} else {
					end = yy + '$' + p(mm) + '$' + p(dd1) + '$' + '00:00:00';
				}
			} else if (mm == 04 || mm == 06 || mm == 09 || mm == 11) {
				if (dd == 30) {
					end = yy + '$' + p(mm1) + '$' + '01' + '$' + '00:00:00';
				} else {
					end = yy + '$' + p(mm) + '$' + p(dd1) + '$' + '00:00:00';
				}
			} else {
				if (dd == 31) {
					end = yy + '$' + p(mm1) + '$' + '01' + '$' + '00:00:00';
				} else {
					end = yy + '$' + p(mm) + '$' + dd1 + '$' + '00:00:00';
				}
			}

		} else {
			if (dd == 31) {
				end = yy + 1 + '$' + '01' + '$' + '01' + '$' + '00:00:00';
			} else {
				end = yy + '$' + mm + '$' + dd1 + '$' + '00:00:00';
			}
		}

		startTime = start;
		endTime = end;
		//刷新页面
		freeReport()
	})
})

//点击时间按钮样式
$('.freeList .listTop button').click(function() {
	$('.freeList .listTop button').removeClass('btnColor')
	$(this).addClass('btnColor')
})

//获取时间
function GetDateStr1(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	var h = dd.getHours();
	var mm = dd.getMinutes();
	var s = dd.getSeconds();

	return y + "$" + p(m) + "$" + p(d) + "$" + p(h - h) + ":" + p(mm - mm) + ":" + p(s - s);
}

function GetDateStr2(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	var h = dd.getHours();
	var mm = dd.getMinutes();
	var s = dd.getSeconds();

	return y + "-" + p(m) + "-" + p(d) + ' ' + ' - ' + ' ' + initendTime
}

//点击时间按钮事件
function changeList(i) {
	startTime = GetDateStr1(i)
	endTime = GetDateStr1(0)
		//刷新页面
	$("#reservationtime").val(GetDateStr2(i))
	startTimer = GetDateStr2(i).split(' ')[0]
	$('#reservationtime').daterangepicker('setStartDate', startTimer)
	freeReport()
}

//打印、导出	
printReport();
exportReport();

//导出
function exportReport() {
	$(".excel_o").click(function() {
		excel_o.href = tableToExcel('reportList')
		$("#excel_o").attr("download", "区间统计")
	});
}

//打印
function printReport() {
	$("#btn_print").click(function(event) {
		$("#reportList").printThis({
			debug: false,
			importCSS: true, //引入外部样式
			importStyle: true, //引入内部样式<style media="print"></style>
			printContainer: true,
			loadCSS: '',
			pageTitle: "区间统计",
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