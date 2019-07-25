//var globalurl="http://121.42.253.149:18801";
/*var globalurl="http://192.168.1.117";
var accessToken="5962d3fc92b5570007b0a2c6";
var stationId="593a0c47a4e3cd13ec97111b";*/

var Vue = new Vue({
	el: '#demo',
	data: {
		accessToken : getToken(),
		stationId : $("#stationId").val(),
		name: $('#stationName').val(),
		allData:[],		
		setpumpValveNavArr:[],
		pumpValveData:{data_value:0,data_tag:-1},//气候补偿数据
		valveSelectedType:-1,//一网泵阀active
		circulatingPumpData:{data_value:0,data_tag:-1},//循环泵数据
		circulatingPumpArr:[],
		circulatingPumpSelectedType:-1,
		circulatingValue1:0,
		circulatingValue2:0,
		circulatingValue3:0,
		feedWaterPumpData:{data_value:0,data_tag:-1},//补水泵数据
		feedWaterPumpArr:[],
		feedWaterPumpSelectedType:-1,
		feedWaterValue1:0,
		feedWaterValue2:0,
		deadZoneData:{data_value:0,data_tag:-1},//控制死区数据
		deadZoneShow:false,
		openPressureData:{data_value:0,data_tag:-1},//开启压力数据
		openPressureShow:false,
		closePressureData:{data_value:0,data_tag:-1},//关闭压力数据
		closePressureShow:false,
		experienceCurveData:[],//经验曲线数据
		valveOpening:50,
		xAxisData:[],//x轴数据		
		yAxisData:[],//y轴数据
		timeSlotData:[],//时间段数据
		correctTemperatureData:[],//修正温度数据
		frequencyData:[],//一网泵n频率设定数据
		firstFrequecyData:{data_value:0,data_tag:-1},//一网泵频率设定数据
		pumpNumberSelection:{data_value:0,data_tag:-1},//一网泵号选择数据		
		numberSelectionShow:false,//显示泵号
		pumpNumberSelectedType:-1,//手动调泵
		openDegreeData:{data_value:0,data_tag:-1},//阀门开度
		setTemperatureData:{data_value:0,data_tag:-1},//恒定温度
		setFlowData:{data_value:0,data_tag:-1},//恒定流量
		setHeatData:{data_value:0,data_tag:-1},//热量设定
		circulatingPumpFrequency:{data_value:0,data_tag:-1},//循环泵频率
		pressureSupplyData:{data_value:0,data_tag:-1},//供压
		differentialPressureData:{data_value:0,data_tag:-1},//压差
		feedWaterHzData:{data_value:0,data_tag:-1},//补水泵频率控制
		feedWaterMpaData:{data_value:0,data_tag:-1},//补水泵回压控制
		firstBtnDsiabled:true,
		circulatingPumpBtnDsiabled:true,
		feedWaterPumpBtnDsiabled:true,
		atmosphericValveBtnDsiabled:true,
		errorInputNum:-1,
		
	},
	mounted:function(){
		this.getDataInfo(),
		this.btnDisabled()
	},
	methods: {
      formatTooltip(val) {
        return val+'%';
      },
      mpaTooltip(val){
      	return val+'MPa';
      },
      temperatureTooltip(val){
      	return val+'℃';
      },
      flowTooltip(val){
      	return val+'T/H';
      },
      heatTooltip(val){
      	return val+'GJ';
      },
      frequencyTooltip(val){
      	return val+'Hz';
      },
      
      getDataInfo:function(){     	
      	this.$http.get(globalurl+'/v1_0_0/stationControlStrategy?access_token='+this.accessToken+'&station_id='+this.stationId).then(
	            function (res) {
	                this.allData = res.data;
	                for(var i=0;i<this.allData.length;i++){
	                	if(this.allData[i].data_tag == 100){//一网泵阀控制
	                		this.pumpValveData = this.allData[i]
	                		this.pumpValveData.option_id = 1
	                	}
	                	if(this.allData[i].data_tag == 130){//一网泵号选择数据
	                		this.pumpNumberSelection.option_id = 1
	                		this.pumpNumberSelection = this.allData[i]
	                		this.numberSelectionShow = true
	                		this.pumpNumberSelectedType = (this.pumpNumberSelection.tag_option[0].option_id)-1
	                	}
	                	if(this.allData[i].data_tag == 150){//循环泵控制
	                		this.circulatingPumpData.option_id = 1
	                		this.circulatingPumpData = this.allData[i]
	                		this.circulatingPumpSelectedType = (this.circulatingPumpData.tag_option[0].option_id)-1
	                	}
	                	if(this.allData[i].data_tag == 151){//循环泵频率
	                		this.circulatingPumpFrequency = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 152){//二次供压
	                		this.pressureSupplyData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 153){//二次压差
	                		this.differentialPressureData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 135){//阀门开度
	                		this.openDegreeData = this.allData[i]
	                		
	                	}
	                	if(this.allData[i].data_tag == 136){//恒定温度
	                		this.setTemperatureData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 137){//恒定流量
	                		this.setFlowData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 138){//热量流量
	                		this.setHeatData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 160){//补水泵控制
	                		this.feedWaterPumpData.option_id = 1
	                		this.feedWaterPumpData = this.allData[i]
	                		this.feedWaterPumpSelectedType = (this.feedWaterPumpData.tag_option[0].option_id)-1
	                	}
	                	if(this.allData[i].data_tag == 163){//补水泵频率控制
	                		this.feedWaterHzData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 164){//补水泵回压控制
	                		this.feedWaterMpaData = this.allData[i]
	                	}
	                	if(this.allData[i].data_tag == 171){//控制死区
	                		this.deadZoneData = this.allData[i];
	                		this.deadZoneShow = true
	                	}
	                	if(this.allData[i].data_tag == 172){//开启压力
	                		this.openPressureData = this.allData[i];
	                		this.openPressureShow = true
	                	}
	                	if(this.allData[i].data_tag == 173){//关闭压力
	                		this.closePressureData = this.allData[i];
	                		this.closePressureShow = true
	                	}
	                	
	                	if(101<=this.allData[i].data_tag&&this.allData[i].data_tag<=114){//经验曲线
	                		this.experienceCurveData.push(this.allData[i])
	                	}
	                	if(120<=this.allData[i].data_tag&&this.allData[i].data_tag<=124){//时间段
	                		this.timeSlotData.push(this.allData[i])
	                	}
	                	if(125<=this.allData[i].data_tag&&this.allData[i].data_tag<=129){//补偿温度
	                		this.correctTemperatureData.push(this.allData[i])
	                	}
	                	if(131<=this.allData[i].data_tag&&this.allData[i].data_tag<=134){//一网泵n频率设定
	                		this.frequencyData.push(this.allData[i])
	                		this.firstFrequecyData = this.frequencyData[0]
	                		
	                	}
	                	
	                }
	                //判断显示一网泵阀标签页
	                if(this.pumpValveData.tag_option!=undefined){
	                	//设置x轴data
		                this.setxAxisData(this.pumpValveData.range.initialTemp,this.pumpValveData.range.intervalTemp)
		                //设置y轴data
		                this.setyAxisData(this.experienceCurveData);
	                	this.setpumpValveNav(this.pumpValveData.tag_option);
	                }
	                //判断显示循环泵标签页
	                if(this.circulatingPumpData.tag_option!=undefined){
	                	this.setCirculatingPumpNav(this.circulatingPumpData.tag_option)
	                }
	                
	                
	                
	                //判断补水泵标签页
	                if(this.feedWaterPumpData.tag_option!=undefined){
	                	this.setFeedWaterPumpNav(this.feedWaterPumpData.tag_option)
	                }
	                
	                
	                
	                
	                	         		        		
	            },function (res) {}
        	);
      },
      //判断显示一网泵阀标签页
      setpumpValveNav:function(option){
      	for(var i=0;i<option.length;i++){
      		this.setpumpValveNavArr.push(option[i].option_id)
      	}
      
      	this.valveSelectedType = this.setpumpValveNavArr[0];
//    	
      	if(this.valveSelectedType==1){
        	this.drowLine(this.xAxisData,this.yAxisData)
			
        }
      },
      //判断显示循环泵标签页
      setCirculatingPumpNav:function(option){
      	for(var i=0;i<option.length;i++){
      		this.circulatingPumpArr.push(option[i].option_id);
     	
      	}     	
      	
      	
      },
      //判断显示补水泵标签页
      setFeedWaterPumpNav:function(option){
      	for(var i=0;i<option.length;i++){
      		this.feedWaterPumpArr.push(option[i].option_id);    		
      	}     	
      	
      },
      //一网泵阀标签页
      valveControlType:function(type){
      	this.firstBtnDsiabled = true;
      	this.valveSelectedType = type;
      	this.pumpValveData.option_id=type;
      	if(this.valveSelectedType == '1'){
        	this.drowLine(this.xAxisData,this.yAxisData)
        }
      },
      //循环泵标签页
      circulatingPumpType:function(type){
      	this.circulatingPumpBtnDsiabled = true
      	this.circulatingPumpSelectedType = type
      	this.circulatingPumpData.option_id = type
      	
      },
      //补水泵标签页
      feedWaterPumpType:function(type){
      	this.feedWaterPumpBtnDsiabled = true
      	this.feedWaterPumpSelectedType = type
      	this.feedWaterPumpData.option_id = type
      },
      //手动调泵标签页
      pumpNumberType:function(type){
      	this.pumpNumberSelectedType = type
      	this.pumpNumberSelection.option_id = type
      },
      //设置x轴data
      setxAxisData:function(initial,interval){     	
      	var idata = initial-interval  
      	var xAxisArr = [];
      	for(var i=idata;i<5;i++){      		
      		xAxisArr.push(idata+=interval)
      	}   
      	this.xAxisData = xAxisArr.slice(0,this.experienceCurveData.length)
      },
      //设置y轴data
      setyAxisData:function(data){
      	for(var i=0;i<data.length;i++){      		
      		this.yAxisData.push(data[i].data_value);     		
      	} 
      	
      },
      //修改供水温度
      updataLine:function(index,updata){
      	 var data = updata;    	
      	if(updata == ''||updata<0){ 
      		data=0;
      		this.yAxisData[index]=0     		
      	}
  		this.firstBtnDsiabled = false; 
  		var numData = parseInt(data);      		
      	this.yAxisData.splice(index,1,numData);
      	this.drowLine(this.xAxisData,this.yAxisData);	      	
      	this.experienceCurveData[index].data_value = numData;	      	      	      	
      },
      //修改时时间段
      updataTime:function(index,updata){
      	
      	if(updata.data_value == ''|| updata.data_value<0){     		
      		this.timeSlotData[index].data_value =1
      	}      	
  		this.firstBtnDsiabled = false;
  		this.timeSlotData.splice(index,1,updata)      	      	      	      	          	     	
      },     
      //修改补偿温度
      updataTemperature:function(index,updata){
      	if(updata.data_value == ''|| updata.data_value<0){     		
      		this.correctTemperatureData[index].data_value =1
      	}
      	this.firstBtnDsiabled = false;      	
      	this.correctTemperatureData.splice(index,1,updata) 
      },
      //一网泵改变
      firstPumpChanged:function(val){
      	this.firstBtnDsiabled = false;    	
      },
      //循环泵改变
      circulatingPumpChanged:function(val){
      	this.circulatingPumpBtnDsiabled = false;    	
      },
      //补水泵改变
      feedWaterPumpChanged:function(val){
      	this.feedWaterPumpBtnDsiabled = false;    	
      },
      //泄压阀改变
      atmosphericValveChanged:function(val){
      	this.atmosphericValveBtnDsiabled = false;    	
      },
      btnDisabled:function(){
      	setTimeout(function(){
      		Vue.firstBtnDsiabled = true;     		
      		Vue.circulatingPumpBtnDsiabled = true;     		
      		Vue.feedWaterPumpBtnDsiabled = true;     		
      		Vue.atmosphericValveBtnDsiabled = true;     		
      	},2000)
      },
      //取消修改
      cancelModify:function(){      	
      	this.experienceCurveData=[];
		this.timeSlotData=[];
		this.correctTemperatureData=[];
		this.frequencyData=[];
		this.yAxisData=[];
      	this.getDataInfo();
      	this.btnDisabled()
      },
      //保存修改
      saveModify:function(index){            	
      	var datas=[];     	
        if(index ==1 ){
        	if(this.valveSelectedType == 1){       		
        		datas=this.experienceCurveData;//经验曲线5
        		datas=datas.concat(this.timeSlotData)//时间段
        		datas=datas.concat(this.correctTemperatureData)//补偿温度
        		datas.push(this.pumpValveData);//一网泵阀       		
        	}
        	if(this.valveSelectedType == 2){
        		this.openDegreeData.data_unit="Sign"
        		datas.push(this.openDegreeData);
        		datas.push(this.pumpValveData);       		
        	}
        	if(this.valveSelectedType == 3){
        		datas=this.timeSlotData//时间段
        		datas=datas.concat(this.correctTemperatureData)//补偿温度
        		datas.push(this.setTemperatureData);
        		datas.push(this.pumpValveData);        		
        	}
        	if(this.valveSelectedType == 4){       		
        		datas.push(this.setFlowData);
        		datas.push(this.pumpValveData);       		
        	}
        	if(this.valveSelectedType == 5){       		
        		datas.push(this.setHeatData);
        		datas.push(this.pumpValveData);       		
        	}
        	if(this.valveSelectedType == 6){
        		if(this.numberSelectionShow){
        			datas=this.frequencyData;
        			datas.push(this.pumpNumberSelection);
        		}else{
        			datas.push(this.firstFrequecyData);
        		}
        	}	 	
        }
	    if(index ==2) {
	    	if(this.circulatingPumpSelectedType == 0){
	    		datas.push(this.circulatingPumpFrequency);
        		datas.push(this.circulatingPumpData);
	    	}
	    	if(this.circulatingPumpSelectedType == 1){
	    		datas.push(this.pressureSupplyData);
        		datas.push(this.circulatingPumpData);       
	    	}
	    	if(this.circulatingPumpSelectedType == 2){
	    		datas.push(this.differentialPressureData);
        		datas.push(this.circulatingPumpData);       		
	    	}
	    }
	    if(index ==3) {
	    	if(this.feedWaterPumpSelectedType == 0){
	    		datas.push(this.feedWaterHzData);
        		datas.push(this.feedWaterPumpData);       		
	    	}
	    	if(this.feedWaterPumpSelectedType == 1){
	    		datas.push(this.feedWaterMpaData);
        		datas.push(this.feedWaterPumpData);
	    	}
	    }
	    if(index ==4) {
	    	if(this.deadZoneData.data_tag!= -1){
	    		datas.push(this.deadZoneData);
	    	}
	    	if(this.openPressureData.data_tag!= -1){
	    		datas.push(this.openPressureData);
	    	}
	    	if(this.closePressureData.data_tag!= -1){
	    		datas.push(this.closePressureData);
	    	}
	    }
	     
	     
	    var token = this.accessToken
    	var issuePassword = sessionStorage.getItem("issuePassword");
		var noPassword = '';
		var errorPassword = '';
		if(errorPassword == true || issuePassword == null){
			noPassword = true;
		}
		
		var noPassWordStr = "<div class='noPassword'><span class='issuedPasswordTitle'>下发密码:</span><input class='issuedPassword' placeholder = '请输入下发密码'/></div><div class='savePwd'><span class='issuedPasswordTitle'>保存密码:</span><input id='checkbox' type='checkbox'></div>";
		var hasPasswordStr = "<div clsss='hasPassword'>确认下发?</div>"
		
		layer.confirm(noPassword==false?hasPasswordStr:noPassWordStr, {
			skin: 'title-class',
			shade: [0.7, '#000']
		}, function() {	
			if($('.issuedPassword').val()==''){
				layer.msg('密码不能为空', {
					icon: 0,
					time: 2000
				})
			}else{
				var isChecked = $('#checkbox').is(':checked');
				var inputIssuePassword = $('.issuedPassword').val();						
				issuePassword = noPassword == false?issuePassword:inputIssuePassword;			
				$.ajax({		
					type: 'post',
					dataType: 'json',
					url: globalurl + '/v1_0_0/stationIssued',
					async: false,
					crossDomain: true == !(document.all),
					traditional: true,
					data:{
						access_token: token,					
						issue_password:issuePassword,
						data:JSON.stringify(datas)
					},
					
					success: function(data) {
											
						if(data.result == 1){
							Vue.firstBtnDsiabled = true;     		
	      					Vue.circulatingPumpBtnDsiabled = true;     		
	      					Vue.feedWaterPumpBtnDsiabled = true;     		
	      					Vue.atmosphericValveBtnDsiabled = true;  
	      					layer.close(index);
							layer.msg('下发成功', {
								icon: 1,
								time: 2000
							})
							//储存密码											
							if(isChecked) {
							    sessionStorage.setItem("issuePassword", issuePassword);
							}
							
						}else{
							layer.msg('下发失败', {
								icon: 0,
								time: 2000
							})
						}										
					}		
				})
			}
			    
		});       	
      },
      //绘制折线图
      drowLine:function(xData,yData){
      	var myChart = echarts.init(document.getElementById('climate'));
      	myChart.setOption({
      		tooltip: {
        		trigger: "axis"
		    },
		   
		    xAxis: [
		        {
		            type: "category",
		            boundaryGap: false,
		            data: xData,
		            name: "室外温度",
		            nameLocation: "end",
		            nameTextStyle: {
		                color: "rgb(0, 0, 0)"
		            }
		        }
		    ],
		    yAxis: [
		        {
		            min: 0,
		            max: 100,
		            type: 'value',
		            axisLine: {onZero: false},
		            name: "供水温度",
		            nameLocation: "end",
		            nameTextStyle: {
		                color: "rgb(0, 0, 0)"
		            }
		        }
		    ],
		    series: [
		        {
		            name: "供水温度",
		            type: "line",
		            itemStyle: {
		                normal: {
		                    areaStyle: {
		                        type: "default",
		                        color: "rgb(13, 225, 162)"
		                    },
		                    borderColor: "rgb(13, 225, 162)",
		                    lineStyle: {
		                        color: "rgb(196, 234, 252)"
		                    }
		                }
		            },
		            data: yData
		        }
		    ],
		    grid: {
		      	y2: 50,
		      	 y: 50
		  	}
	    })
      }
    }
});
