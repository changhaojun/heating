$.allData = {
    accessToken : getToken(),
    companyCode : getUser().company_code,
    companyId : getUser().company_id,
    map:'',
    code:[],
    mapDatas:'',
    marker:[],
    markerToggle:true,
    layerTitle:'',
    markerindex:'',
    initDatas:'',//初始数据
    deleteId:'',
    initDate:moment(),
    markerStatus:true,//当前点击marker的状态
    locStatus:true,//当前地理位置状态\
    status:false,
    pointNear: true,//临近点
    //检查井参数信息
    newMarker :'',
    lastManhole:'',
    myIcon:'',
    selectCode:'',
    windowStatus:true//当前是修改与新增的状态
}
$.extend({
    init : function (){
        $.initMap()
        $.getmMapZoom();
        $.getMapData()

    },
    //初始化地图
    initMap : function (){
        $.allData.map = new BMap.Map('allMap',{enableMapClick: false})
        $.allData.map.disableDoubleClickZoom(true);
        $.allData.map.enableScrollWheelZoom();
        $.allData.map.enableAutoResize();
        let styleJson = [{
            "featureType": "building",
            "elementType": "alls",
            "stylers": {
                "hue": "#f3f3f3",
                "visibility": "off"
            }
        }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "road",
            "elementType": "all",
            //				"elementType": "geometry.stroke",
            "stylers": {
                //			   			"color":"#ff0000",
                "visibility": "on"
            }
        }, {
            "featureType": "highway",
            "elementType": "all",
            "stylers": {
                "visibility": "off",
            }
        },

        ]
        $.allData.map.setMapStyle({
            styleJson: styleJson
        })
    },
    //获取地图数据
    getMapData : function (){
        layer.msg('数据加载中', {
            icon: 16,
            shade: 0.01,
            time: -1
        });
        $.ajax({
            type:'get',
            dataType:'json',
            url:globalurl + '/v1_0_0/pipeHeat',
            async:false,
            crossDomain: true == !(document.all),
            data:{
                access_token :$.allData.accessToken,
                company_code :$.allData.companyCode,
                company_id:$.allData.companyId
            },
            success:function (data){
            	$.allData.marker=[]
            	if(data.heat.length){
            		layer.closeAll()
            		$.addHeatMarker(data.heat)
            	}else{
            		 layer.msg('暂无热源厂数据');
            	}
            	if(data.pipe.length){
            		layer.closeAll()
            		$.addPipeMarker(data.pipe)
            		$.addLine(data.pipe)

            	}else{
            		 layer.msg('暂无检查井数据');
            	}
            	if(data.company_loc){
            		let point = new BMap.Point(data.company_loc.split(',')[0], data.company_loc.split(',')[1])
            		$.allData.map.centerAndZoom(point, 14)
            	}
            }
        })
        
    },
    //视野范围
    initArea :function (data) {
        let minLat = data[0].split(',')[1];
        let maxLat = data[0].split(',')[1];
        let minLng = data[0].split(',')[0];
        let maxLng = data[0].split(',')[0];
        for (let i = 0; i < data.length; i++) {
            minLat = data[i].split(',')[1] < minLat ? data[i].split(',')[1] : minLat;
            maxLat = data[i].split(',')[1] > maxLat ? data[i].split(',')[1] : maxLat;
            minLng = data[i].split(',')[0] < minLng ? data[i].split(',')[0] : minLng;
            maxLng = data[i].split(',')[0] > maxLng ? data[i].split(',')[0] : maxLng;
        }
        
        try {
            $.allData.map.setViewport([new BMap.Point(minLng, minLat), new BMap.Point(maxLng, maxLat)]);
        } catch (e) {
            //alert(e);
        }
    },
    //添加检查井marker
    addPipeMarker :function (data){
        let marker;
         
        for(let i in data){
            $.allData.myIcon =  new BMap.Icon("../img/pipe_marker.png", new BMap.Size(25, 32));
            marker =new BMap.Marker(new BMap.Point(data[i].manhole_loc.split(',')[0], data[i].manhole_loc.split(',')[1]),{
                icon:$.allData.myIcon
            })
            $.allData.marker.push(marker) 
            $.allData.map.addOverlay( marker)
            if( $.allData.markerToggle === true){
                  $.markerShowOrHide().hideMarker(marker)
            }else{
                  $.markerShowOrHide().showMarker(marker)
            }
        }
    },    
    //添加折线
   /* addLine :function (data) {
        let polyData = [],polyAllData=[];
        for(let i = 0;i<data.length;i++){
           //
            if(data[i].last_manhole_loc){
                polyData.push(new BMap.Point(data[i].last_manhole_loc.split(',')[0], data[i].last_manhole_loc.split(',')[1]));
            }
            polyData.push(new BMap.Point(data[i].lng,data[i].lat))
        }
        let polyline = new BMap.Polyline(polyData, {strokeColor:"#f55010", strokeWeight:5, strokeOpacity:1});   //创建折线
        $.allData.map.addOverlay(polyline);   //增加折线
        polyline.disableEditing();
    },*/
    addLine :function (data) {
        for(let i = 0;i<data.length;i++){
            let polyData = [];
            if(data[i].last_manhole_loc){
            	for(let j=0;j<data.length;j++){
        			if(data[j].manhole_loc.split(',')[0] ===data[i].last_manhole_loc.split(',')[0] && data[j].manhole_loc.split(',')[1]===data[i].last_manhole_loc.split(',')[1]){
        				polyData.push(new BMap.Point(data[i].manhole_loc.split(',')[0],data[i].manhole_loc.split(',')[1]))
        				polyData.push(new BMap.Point(data[i].last_manhole_loc.split(',')[0], data[i].last_manhole_loc.split(',')[1]));
        				let polyline = new BMap.Polyline(polyData, {strokeColor:"#f55010", strokeWeight:5, strokeOpacity:1});   //创建折线
				        $.allData.map.addOverlay(polyline);   //增加折线
				        polyline.disableEditing();
        			}
        			//
        		}
        	}
        }
    },
    //添加热源厂marker
    addHeatMarker :function (data){
        //$.allData.map.clearOverlays()
        let marker;
        for(let i in data){
            $.allData.myIcon =  new BMap.Icon("../img/heat_marker.png", new BMap.Size(25, 32));
            marker =new BMap.Marker(new BMap.Point(data[i].heat_loc.split(',')[0], data[i].heat_loc.split(',')[1]),{
                icon:$.allData.myIcon
            })
            $.allData.marker.push(marker) 
            $.allData.map.addOverlay( marker)
            if( $.allData.markerToggle === true){
                  $.markerShowOrHide().hideMarker(marker)
            }else{
                  $.markerShowOrHide().showMarker(marker)
            }
        }
    },    
    //marker的显示隐藏
    markerShowOrHide :function () {
        return {
            showMarker :function (marker){
                 marker.show()
            },
            hideMarker:function (marker){
                if (!marker) return;
                marker.hide()
            }
        }
    },
    //根据地图级别显示marker
    getmMapZoom :function (){
        $.allData.map.addEventListener('zoomend',function(){
            let mapZoom = $.allData.map.getZoom()
            if(mapZoom < 16){
                $.allData.markerToggle = true
                for(let i in $.allData.marker){
                    $.markerShowOrHide().hideMarker($.allData.marker[i])
                }
            }else{
                $.allData.markerToggle = false
                for(let i in $.allData.marker){
                    $.markerShowOrHide().showMarker($.allData.marker[i])
                }
            }
        })

    },
});

$.init();
