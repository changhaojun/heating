var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay(); //今天本周的第几天 
var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //
var lastYear = nowYear - 1

var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
//			var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();

//下月日期
var nextMonthDate = new Date();
nextMonthDate.setDate(1);
nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
var nextMonth = nextMonthDate.getMonth();

//格式化日期：yyyy-MM-dd 
function formatDate(date, state) {
	var myyear = date.getFullYear();
	var mymonth = date.getMonth() + 1;
	var myweekday = date.getDate();

	if (mymonth < 10) {
		mymonth = "0" + mymonth;
	}
	if (myweekday < 10) {
		myweekday = "0" + myweekday;
	}
	if (state == 0) {
		return (myyear + "$" + mymonth + "$" + myweekday + "$" + "00:00:00");
	} else {
		return (myyear + "$" + mymonth + "$" + myweekday + "$" + "23:59:59");
	}
}

//获得某月的天数 
function getMonthDays(myMonth) {
	var monthStartDate = new Date(nowYear, myMonth, 1);
	var monthEndDate = new Date(nowYear, myMonth + 1, 1);
	var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
	return days;
}

//获得本月的开始日期 
function getMonthStartDate() {
	var monthStartDate = new Date(nowYear, nowMonth, 1);
	return formatDate(monthStartDate, 0);
}
//获得本月的结束日期 
function getMonthEndDate() {
	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
	return formatDate(monthEndDate, 1);
}

//获得上月开始时间
function getLastMonthStartDate() {
	var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
	return formatDate(lastMonthStartDate, 0);
}
//获得上月结束时间
function getLastMonthEndDate() {
	var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
	return formatDate(lastMonthEndDate, 1);
}

//获取下月开始时间
function getNextMonthStartDate() {
	var nextMonthStartDate = new Date(nowYear, nextMonth, 1);
	return formatDate(nextMonthStartDate, 0);
}
//	console.log(getNextMonthStartDate())

//获取去年下月开始时间
function getLastYearNextMonthStartDate() {
	var lastYearNextMonthStartDate = new Date(lastYear, nextMonth, 1);
	return formatDate(lastYearNextMonthStartDate, 0);
}
//	console.log(getLastYearNextMonthStartDate())

//获取去年本月开始日期
function getLastYearMonthStartDate() {
	var monthStartDate = new Date(lastYear, nowMonth, 1);
	return formatDate(monthStartDate, 0);
}
//获取去年本月结束日期
function getLastYearMonthEndDate() {
	var monthEndDate = new Date(lastYear, nowMonth, getMonthDays(nowMonth));
	return formatDate(monthEndDate, 1);
}

//获取去年上月开始日期
function getLastYearLastMonthStartDate() {
	var LastYearLastMonthStartDate = new Date(lastYear, lastMonth, 1);
	return formatDate(LastYearLastMonthStartDate, 0);
}
//获取去年上月结束日期
function getLastYearLastMonthEndDate() {
	var getLastYearLastMonthEndDate = new Date(lastYear, lastMonth, getMonthDays(lastMonth));
	return formatDate(getLastYearLastMonthEndDate, 1);
}