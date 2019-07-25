var Vue = new Vue({
	el:'#wrapperFactory',
	data:{
		index:0,
		firstCompanyId:'',
		accesstoken:getToken(),
		companyData:[],
		heatFactoryData:[],
		stationData:{},
		stationPopUpShow:false,
		map:'',
		myIcon:'',
		editFactory:'',
		currentClick:0,
		isright:false,
		currentCompanyId:'',
		currentPage:'',
		
	},
	mounted:function(){
		this.getFactoryData()		
	},
	methods:{
		//layer==>top提示
		 showTips:function () {
			$('[data-toggle="tooltip"]').tooltip();
			this.topColor($(".fa-sign-in"));
			this.topColor($(".addBtn"));
		},
		//layer==>改变top背景字体颜色及边框
		 topColor:function (obj) {
			obj.on("mouseover", function() {
				$(".tooltip-inner").css({
					"background-color": "#fff",
					"color": "#1AB380",
					"border": "1px solid #ccc"
				});
				$(".tooltip.top .tooltip-arrow").css("border-top-color", "#ccc");
			})
		},
		//获取分公司信息
		getFactoryData:function(){
			layer.msg('正在努力的加载数据中，请耐心等待', {
				icon: 16,
				shade: 0.01,
				time: -1
			});
			var that = this;
			axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded';
        	
        	axios.get(globalurl+'/v1_0_0/allChildCompany',{
        		params:{
        		  access_token:this.accesstoken,	           
				  company_code: getUser().company_code,
				  company_id: getUser().company_id,
        		}			  	 
			})
			.then(function(res){				 	
			 	if (res.data.length != 0 || res.data.length != undefined){
			 		$(".companyList").css("width",res.data.length*207);
			 		that.companyData = res.data;
				 	that.firstCompanyId = res.data[0].company_id;
				 	that.currentCompanyId = res.data[0].company_id;

				 	that.getHeatFactoryData(that.firstCompanyId);
				 	layer.closeAll();
			 	}			 					
			})
			.catch(function(err){
			  console.log(err);
			});


		},
		leftBtn:function(){
			if ($(".companyList").css("right") < "0px") {
				this.index++;
				$(".companyList").animate({
					left: -this.index * ($(".companyList li").width()) + 'px'
				});
			}
		},
		rightBtn:function(){
			if ($(".companyList").css("left") != "0px") {
				this.index--;
				$(".companyList").animate({
					left: -this.index * ($(".companyList li").width()) + 'px'
				});
			}
		},
		//选择分公司
		selectCompany:function(companyId,index){
			
			this.currentCompanyId = companyId;
			this.getHeatFactoryData(companyId);
			this.currentClick = index;
		},
		//获取热源厂信息
		getHeatFactoryData:function(companyId){
			var that = this;
			axios.defaults.headers.post['content-Type'] = 'appliction/x-www-form-urlencoded';
        	
        	axios.get(globalurl+'/v1_0_0/heatInfos',{
        		params:{
        		  access_token:this.accesstoken,	           
				  company_id: companyId,
        		}			  	 
			})
			.then(function(res){				
			 	that.heatFactoryData = res.data.rows;			 	
			})
			.catch(function(err){
			  console.log(err);
			});
		},
		//设置燃料类型
		fuel:function(type){
			var type = type.toString()
			let fuelType = '';
			switch(type){
				case '1':
				fuelType = '燃煤';
				break;
				case '2':
				fuelType = '燃气';
				break;
				case '3':
				fuelType = '燃油';
				break;
				case '4':
				fuelType = '电';
				break;
				case '5':
				fuelType = '其他';
				break;
			}
			return fuelType;
		},
		//设置燃气类型
		medium:function(type){			
			var type = type.toString();
			let mediumType = '';
			switch(type){
				case '1':
				mediumType = '蒸汽';
				break;
				case '2':
				mediumType = '高温水';
				break;
				case '3':
				mediumType = '低温水';
				break;				
			}
			return mediumType;
		},
		//编辑热源厂信息
		editStation:function(data){
			this.currentPage = '编辑热源厂信息'
			this.editFactory = true;
			this.stationData = data;
			this.stationPopUpShow = true;
		},
		//添加热源厂
		addFactory:function(factory){
			this.currentPage = '添加热源厂信息';
			this.editFactory = false;
			this.stationData={
				company_code:factory.company_code,
				company_id:factory.company_id,
				belong_to:'',
				contact_person:'',
				contact_phone:'',
				create_date:'',
				data_source:'',
				fuel_type:'',
				heat_addr:'',
				heat_area:'',			
				heat_code:'',
				heat_load:'',
				heat_loc:'',
				heat_mode:'',
				heat_name:'',
				hourse_area:'',
				input_time:moment().format('YYYY-MM-DD'),
				market_area:'',
				medium_param:'',
				medium_type:'',
				office_area:'',
				other_area:'',
				remark:'',	
			};
			this.stationPopUpShow = true;
			
		},
		//工具类->layer提示
		layerTip: function(focusElem, message) {
			layer.tips(message, focusElem, {
				tips: [1, '#ff787b'],
				time: 3000,
				tipsMore: true
			});
		},
		//判断是否有未填写项目
		isEmpty: function(parent, target) {			
			$.each(parent.find('input'), function(i) {			
				if ($(this).val() == '') {									
					if ($(this).attr('type') == 'text' || $(this).attr('type') == 'number') {
						$(this).focus();
						$(this).css('borderColor', '#ff787b');
						Vue.layerTip($(this), $(this).attr('warning'));
					} else {
						$(this).focus();
						$(this).next().css('borderColor', '#ff787b');
						Vue.layerTip($(this).next(), $(this).attr('warning'));						
					}
					Vue.isright=false;
					return false;
	
				} else {					
					Vue.isright=true;			
				}
			});
			
		},
		//保存配置按钮
		saveConfig:function(){
			
			let stationDataObj = {
				belong_to:this.stationData.belong_to,				//产权单位
				contact_person:this.stationData.contact_person,		//联系人
				contact_phone:this.stationData.contact_phone,		//联系电话
				create_date:this.stationData.create_date,			//投运时间
				data_source:this.stationData.data_source,			//数据源:  1人工 , 2自动
				fuel_type:this.stationData.fuel_type,				//燃料类型    1.燃煤 2:燃气 3:燃油 4:电 5:其他
				heat_addr:this.stationData.heat_addr,				//地址
				heat_area:this.stationData.heat_area,				//热源供热面积				
				heat_code:this.stationData.heat_code,				//热源厂编码
				heat_load:this.stationData.heat_load,				//供暖负荷
				heat_loc:this.stationData.heat_loc,					//地理坐标
				heat_mode:this.stationData.heat_mode,				//供热模式 1:直供式 2:间供式
				heat_name:this.stationData.heat_name,				//热源厂名称
				hourse_area:this.stationData.hourse_area,			//住宅区供热面积
				input_time:this.stationData.input_time,				//录入时间
				market_area:this.stationData.market_area,			//商业供热面积
				medium_param:this.stationData.medium_param,			//热媒设计参数
				medium_type:this.stationData.medium_type,			//热媒类型 1:蒸汽 2:高热水 3:低温水
				office_area:this.stationData.office_area,			//办公建筑供热面积
				other_area:this.stationData.other_area,				//其他建筑供热面积
				remark:this.stationData.remark,						//备注				
			};
			this.isright=false;
			this.isEmpty($('.dataInfo'), $(this));
			
			if(this.editFactory == true){//编辑热源厂
				if (this.isright == true) {
					var that = this
					$.ajax({
						type: 'put',
						dataType: 'json',
						url: globalurl+'/v1_0_0/heatInfos/'+this.stationData._id,
						async: false,
						crossDomain: true == !(document.all),
						data: {
							data:JSON.stringify(stationDataObj),
			     			access_token:this.accesstoken			
						},
						success: function(data) {
							if(data.code == 200){
								layer.msg('编辑成功', {
								icon: 1,
								time: 2000
								});
								that.stationPopUpShow = false;	
								that.getHeatFactoryData(that.currentCompanyId)
							}
						}
					})
				}
			}else{//添加热源厂	
				
				
//				if(!(/^1[34578]\d{9}$/.test($('#contact_phone').val()))){
//					$('#contact_phone').focus();
//					$('#contact_phone').css('borderColor', '#ff787b');
//					this.layerTip($('#contact_phone'), '手机号码有误，请重填');
//						return;
//				}
				if (this.isright == true) {
					var that = this;
					$.ajax({
						type: 'post',
						dataType: 'json',
						url: globalurl+'/v1_0_0/heatInfos',
						async: false,
						crossDomain: true == !(document.all),
						data: {
							data:JSON.stringify(stationDataObj),
			     			access_token:this.accesstoken,
			     			company_code:this.stationData.company_code,
			     			company_id:this.stationData.company_id
						},
						success: function(data) {
							if(data.code == 200){
								layer.msg('添加成功', {
								icon: 1,
								time: 2000
								});
								that.stationPopUpShow = false;		
								that.getHeatFactoryData(that.currentCompanyId)
							}
						}
					})
				} 
				
			}
			
		},
		//选择地理坐标
		showMap:function(){
			var str = '<div id="allmap"></div>';
		layer.open({
			type: 1,
			title: '选择地理坐标',
			skin: 'layui-layer-lan', //样式类名
			closeBtn: 1, //不显示关闭按钮
			anim: 2,
			shadeClose: true, //开启遮罩关闭
			area: ['70%', '60%'],
			move: false,
			content: str,
			end: function() {

			}
		});
		this.selectLocation();
		},
		//地图的初始化
		selectLocation: function() {			
			let lng = this.stationData.heat_loc.split(',')[0];
			let lat = this.stationData.heat_loc.split(',')[1];
			
			this.map = new BMap.Map("allmap"); // 创建Map实例
			this.map.centerAndZoom('西安', 12)
			this.map.disableDoubleClickZoom(true); //双击放大
			this.map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
			this.map.enableAutoResize(); //启用自动适应容器尺寸变化，默认启用
			var styleJson = [{
				"featureType": "building",
				"elementType": "alls",
				"stylers": {
					"hue": "#f3f3f3",
					"visibility": "on",
				}
			}, {
				"featureType": "poi",
				"elementType": "labels",
				"stylers": {
					"visibility": "off",
				}
			}, {
				"featureType": "road", //公路
				"elementType": "all",
				"stylers": {
					"visibility": "off",
				}
			}, {
				"featureType": "highway", //地铁
				"elementType": "all",
				"stylers": {
					"visibility": "off",
				}
			}]
			this.map.setMapStyle({
				styleJson: styleJson
			});
			this.myIcon = new BMap.Icon("../img/marker_icon.png", new BMap.Size(30, 40));
			var marker;

			point = new BMap.Point(lng, lat)
			marker = new BMap.Marker(point, {
				icon: this.myIcon
			})
			this.map.addOverlay(marker);			
			this.map.addEventListener("click", this.showInfo);

		},
		showInfo: function(ev) {
			this.map.clearOverlays();
			point = new BMap.Point(ev.point.lng, ev.point.lat);
			marker = new BMap.Marker(point, {
				icon: this.myIcon
			});
			this.map.addOverlay(marker);
			this.stationData.lng = ev.point.lng;
			this.stationData.lat = ev.point.lat;
			this.stationData.heat_loc = ev.point.lng + ',' + ev.point.lat;
		},		
		back:function(){
			this.stationPopUpShow = false;
		}
	}
})
function addZero(s) {
		return s < 10 ? '0' + s : s;
};
$("input ,select,textarea").on('focus',function(){
	$(this).css('borderColor', '#1ab394');
});
$("input ,select,textarea").on('blur',function(){
	$(this).css('borderColor', '#e5e6e7');
});
$('input,textarea').on('keyup',function(ev) {
	if (ev.keyCode == 32) {
		$(this).val($(this).val().replace(/\s/g, ''));
	}	
});
$('#create_date').daterangepicker({
	singleDatePicker: true,
	startDate: moment()
}, function(start, end) {	
	Vue.stationData.create_date = new Date(start).getFullYear() + "-" + addZero(new Date(start).getMonth() + 1) + "-" + addZero(new Date(start).getDate());		
});
