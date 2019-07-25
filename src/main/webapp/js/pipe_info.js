$.allData = {
    accessToken : getToken(),
    companyCode : getUser().company_code,
    companyId : getUser().company_id,
    map:'',
    code:[],
    mapDatas:[],
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
    editIndex:'',
    pointNear: true,//临近点
    //检查井参数信息
    pipeData: {
        back_pipe: "",
        company_code: "",
        create_date: "",
        lat: "", //纬度
        lng: "", //经度
        company_id: "",
        for_pipe: "",
        last_manhole: "",
        manhole_code: "",
        last_manhole_loc:"",
        last_manhole_code:"",
        manhole_depth: "",
        manhole_function: "",
        manhole_loc: "",
        manhole_size: "",
        road_name: "",
        remark: "请输入备注信息",
        _id: "",
    },
    newMarker :'',
    lastManhole:'',
    myIcon:'',
    selectCode:'',
    windowStatus:true,//当前是修改与新增的状态
    lastIndex:'',
    searchMap:'',
    myValue:'',
    local:''
}
$extend =$.fn.extend ({
    //聚焦失焦颜色变化
    borderColor: function() {
        $(this).focus(function() {
            $(this).css('borderColor', '#1ab394');
        });
        $(this).blur(function() {
            $(this).css('borderColor', '#e5e6e7');
        });
        return $(this);
    },
    //回车键响应
    enterKey: function(callBack) {
        $(this).keyup(function(ev) {
            if (ev.which === 13) {
                $(this).blur();
                callBack && callBack.call($(this));
            }
            return false;
        });
    },
    //空格限制输入
    limitSpacing: function() {
        $(this).keyup(function(ev) {
            if (ev.keyCode == 32) {
                $(this).val($(this).val().replace(/\s/g, ''));
                eval('$.allData.' + $(this).attr('datasrc') + '=$(this).val()');
            }

        });
    },
    //非数字限制输入
    numOnly: function() {
        $(this).keyup(function() {
            $(this).val($(this).val().replace(/[^0-9-]/g, ''));
            //eval('allData.' + $(this).attr('datasrc') + '=$(this).val()');
        });
    },
    //非时间限制输入
    timeOnly: function() {
        $(this).keyup(function() {
            $(this).val($(this).val().replace(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, ''));
            //eval('allData.' + $(this).attr('datasrc') + '=Number($(this).val())');
        });
    },
    //提交按钮状态相应
    changeTip: function(content) {
        $(this).html(content);
    },
    //修改数据
    editSubmit: function() {
        $(this).attr('isright', 'false');
        $.isEmpty($('.boxContent'), $(this));
        if ($(this).attr('isright') === 'false') {
            return;
        } else {
            $(this).attr('disabled', true);
        };
        $.editAjax();
    },
    //新增
    addAjax: function(){
        $.allData.pipeData.company_code = $.allData.selectCode
        $.ajax({
            type:'post',
            dataType:'json',
            url:globalurl + '/v1_0_0/pipeDiameter',
            crossDomain: true == !(document.all),
            data:{
                access_token :$.allData.accessToken,
                data:JSON.stringify($.allData.pipeData)
            },
            success:function (data){
                $.allData.windowStatus = true
                if(data.code ==200){
                    layer.msg(data.success, {
                        icon: 1,
                        shade: 0.01,
                        time: 1000,
                        end:function (){
                            layer.closeAll()
                        }
                    });
                    $.allData.status =false
                    $.allData.map.clearOverlays();
                    $.getMapData()

                }
            }
        })
    },
    remarks: function() {
        $(this).focus(function() {
            if ($(this).val() == "请输入备注信息") {
                $(this).val("");
            }
        });
        $(this).blur(function() {
            if ($(this).val() == "") {
                $(this).val("请输入备注信息")
            }
        });
        //return $(this);
    },
    //正则判断
    reg: function() {
        var regTime = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        $(this).blur(function() {
            if (!regTime.test($(this).val())) {
                $(this).val("");
            }
        })
        return $(this)
    },
    // 地图和弹窗的切换
    hideLayer : function (){
        $(this).focus (function (){
            layer.closeAll()
            $.allData.markerStatus = false;
            layer.msg('请选择该检查井的上一检查井', {
                icon: 0,
                shade: 0.01,
                time: 4000
            });
            //$('.layui-layer-shade').remove()
        })
    },
    //改变检查井的地理坐标
    changeLoc : function (){
        $(this).focus (function (){
            layer.closeAll()
            $.allData.locStatus = false;
            layer.msg('请选择该检查井的地理坐标', {
                icon: 0,
                shade: 0.01,
                time: 4000
            });
        })
    },
    //删除数据的ajax
    deleteAjax : function (){
        $.ajax({
            type:'delete',
            dataType:'json',
            url:globalurl + '/v1_0_0/pipeDiameter?access_token='+$.allData.accessToken+'&_id='+$.allData.deleteId,
            crossDomain: true == !(document.all),
            success:function (data){
                if(data.code ===200){
                    $.allData.map.clearOverlays()
                    $.allData.mapDatas.splice($.allData.markerindex,1)
                    layer.msg(data.success, {
                        icon: 1,
                        shade: 0.01,
                        time: 1000,
                        end:function (){
                            layer.closeAll()
                        }
                    });
                    $.allData.map.clearOverlays();
                    $.getMapData()
                }
            }
        })
    },
    //判断哪一个选中
    changeOp: function() {
        $(this).each(function(i, ele) {
            $(this).click(function() {
                layer.closeAll();
                $.allData.selectCode =$.allData.code[i]
                $.allData.companyCode = $.allData.selectCode
                $.getMapData()
            })

        })
    },
})


$.extend({
    init : function (){
        new Vue({
            el: '#demo',
            data: $.allData,
            methods: $extend
        });
        $("input ,select,textarea").borderColor();

        $('input').limitSpacing();$('input').filter('[num-limit=limit]').numOnly();
        $('input').filter('[time-limit=limit]').reg();
        $.initMap()
        if (user.company_code.split("").length == 6) {
            $.selectCompany()
        }else{
            $.getMapData()
        }
        $.getmMapZoom();
        $('#last_manhole_code').hideLayer();
        //$("#manhole_loc").changeLoc();
        $('#create_date').daterangepicker({
            singleDatePicker: true,
            setStartDate: $.allData.initDate
        }, function(start, end) {
            $.allData.pipeData.create_date = new Date(start).getFullYear() + "-" + $.addZero(new Date(start).getMonth() + 1) + "-" + $.addZero(new Date(start).getDate());
        });

        //修改
        $("#savePipe").click(function (){
            if($.allData.windowStatus ===true){
                $(this).editSubmit()
            }else{
                $(this).addAjax()
            }

        })
        //删除
        $('#delePipe').click(function () {
            $(this).deleteAjax()
        })
        $.searchMap()


    },
    //初始化地图
    initMap : function (){
        $.allData.map = new BMap.Map('allMap',{enableMapClick: false})

        $.allData.map.disableDoubleClickZoom(true);
        $.allData.map.enableScrollWheelZoom();
        $.allData.map.enableAutoResize();
        $.allData.searchMap = new BMap.Autocomplete({//建立一个自动完成的对象
            "input" : "searchId",
            "location" :$.allData.map
        });
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
            url:globalurl + '/v1_0_0/pipeDiameter',
            async:false,
            crossDomain: true == !(document.all),
            data:{
                access_token :$.allData.accessToken,
                company_code :$.allData.companyCode,
                company_id:$.allData.companyId
            },
            success:function (data){
                layer.closeAll()
                if(data.length){
                    $.allData.mapDatas = data
                    $.allData.initDatas = data
                    $.addPipeMarker($.allData.mapDatas )
                    $.addLine($.allData.mapDatas )
                    $.initArea(data)
                    $.addNewMarker()
                }else{
                    $.allData.windowStatus =false
                    //$.allData.mapDatas=$.allData.pipeData
                    layer.msg('暂无数据');
                }

            }
        })

    },
    //视野范围
    initArea :function (allData) {
        let minLat = allData[0].lat;
        let maxLat = allData[0].lat;
        let minLng = allData[0].lng;
        let maxLng = allData[0].lng;
        for (let i = 0; i < allData.length; i++) {
            minLat = allData[i].lat < minLat ? allData[i].lat : minLat;
            maxLat = allData[i].lat > maxLat ? allData[i].lat : maxLat;
            minLng = allData[i].lng < minLng ? allData[i].lng : minLng;
            maxLng = allData[i].lng > maxLng ? allData[i].lng : maxLng;
        }
        try {
            $.allData.map.setViewport([new BMap.Point(minLng, minLat), new BMap.Point(maxLng, maxLat)]);
        } catch (e) {
            alert(e);
        }
    },
    //添加检查井marker
    addPipeMarker :function (data){
        //$.allData.map.clearOverlays()
        let marker;
        $.allData.marker=[]
        for(let i in data){
            $.allData.myIcon =  new BMap.Icon("../img/pipe_marker.png", new BMap.Size(25, 32));
            marker =new BMap.Marker(new BMap.Point(data[i].lng, data[i].lat),{
                icon:$.allData.myIcon
            })
            marker.i =i
            //给point添加labe(点的名称)
            let label = new BMap.Label(data[i].manhole_code, {offset: new window.BMap.Size(-25, -30)})
            label.setStyle({
                display: "none",
                borderColor: "#ccc",
                padding: "5px"
            })
            marker.setLabel(label)
            $.allData.marker.push(marker) ;
            $.allData.map.addOverlay( marker)
            if( $.allData.markerToggle === true){
                $.markerShowOrHide().hideMarker(marker)
            }else{
                $.markerShowOrHide().showMarker(marker)
            }

            //鼠标经过marker
            marker.addEventListener('mouseover', function() {
                label.setStyle({
                    display: "block"
                })
                marker.setTop(true, 27000000)
            })
            //鼠标离开marker
            marker.addEventListener('mouseout', function() {
                label.setStyle({
                    display: "none"
                })
                marker.setTop(false)
            })

            //鼠标点击事件
            marker.addEventListener('click', $.mapinfo)
        }
    },
    addZero: function(s) {
        return s < 10 ? '0' + s : s;
    },
    //添加折线
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

    mapinfo:function (ev){
        let i = ev.target.i;

        if($.allData.windowStatus === false){
            $.allData.lastIndex = i
        }
        if($.allData.status){
            $.allData.pipeData.last_manhole_code=$.allData.mapDatas[i].manhole_code
            $.allData.pipeData.last_manhole=$.allData.mapDatas[i]._id
            $.allData.pipeData.last_manhole_loc=$.allData.mapDatas[i].manhole_loc
            $.newLayer()
        }else{
            $.allData.marker[i].enableDragging()
            let icon = new BMap.Icon("../img/pipe_edit.png", new BMap.Size(25, 32))
            $.allData.marker[i].setIcon(icon)
            // marker.enableDragging()
            let index;
            $.allData.markerindex =i
            $.allData.initDate =$.allData.mapDatas[i].create_date;
            if ($.allData.markerStatus === true) {
                $.allData.pipeData = $.allData.mapDatas[i]
                $.allData.layerTitle = $.allData.mapDatas[i].road_name + '-' + $.allData.mapDatas[i].manhole_code
                index = i
                $.pipeLayer($.allData.mapDatas[i].road_name + '-' + $.allData.mapDatas[i].manhole_code)
            } else {
                if(i){
                    $.allData.pipeData  = $.allData.mapDatas[i]
                }
                if (index == i) {
                    layer.msg('请选择该检查井的上一检查井', {
                        icon: 0,
                        shade: 0.01,
                        time: 2000
                    });
                } else {
                    $.allData.lastManhole = $.allData.mapDatas[i]._id;
                    $.allData.pipeData.last_manhole = $.allData.mapDatas[i]._id;
                    $.allData.pipeData.last_manhole_code = $.allData.mapDatas[$.allData.lastIndex].manhole_code
                    $.pipeLayer($.allData.layerTitle)
                    $.allData.markerStatus = true
                }

            }
            //获取拖动后的位置
            $.allData.pipeData.lat = ev.point.lat;
            $.allData.pipeData.lng = ev.point.lng;
            $.allData.pipeData.manhole_loc = ev.point.lng+','+ev.point.lat
            $.allData.mapDatas[i] =  $.allData.pipeData;
            $.allData.deleteId =$.allData.mapDatas[i]._id
        }

    },
    //地图的点击事件
    addNewMarker:function(){
        $.allData.map.addEventListener("click", $.showInfo);

    },
    showInfo: function (ev){
        $("div.layui-layer-shade").remove();
        if(ev.overlay === null){
            let  pointNear = false,pointNum= 0;
            for(let i in $.allData.mapDatas){
                if(Math.abs($.allData.mapDatas[i].lng-ev.point.lng)< 0.001 && Math.abs($.allData.mapDatas[i].lat-ev.point.lat)< 0.001){
                    //点击的附近有marker
                    pointNear = true

                }else{
                    pointNum ++
                    //点击的附近没有marker
                    if(pointNum == $.allData.mapDatas.length){
                        pointNear = false
                    }
                }
            }
            if(pointNear === false){
                $.allData.pointNear =false
                let point = new BMap.Point(ev.point.lng, ev.point.lat);
                let icon = new BMap.Icon("../img/pipe_edit.png", new BMap.Size(25, 32))
                $.allData.newMarker = new BMap.Marker(point, {
                    icon:icon
                });
                $.allData.pipeData = $.initAddData()
                $.allData.newMarker.i = $.allData.mapDatas.length+1;
                $.allData.map.addOverlay($.allData.newMarker);
                $.allData.newMarker.enableDragging()
                $.allData.pipeData.lng = ev.point.lng,
                    $.allData.pipeData.lat = ev.point.lat,
                    $.allData.pipeData.manhole_loc = ev.point.lng+','+ev.point.lat
                $.allData.status =true;
                $.allData.mapDatas.push( $.allData.pipeData)
                $.allData.windowStatus =false
            }else{
                $.allData.pipeData = $.initAddData()
            }
        }else{
            let num = $.allData.mapDatas.length-1;
            if($.allData.windowStatus ==false){

                $.allData.pipeData = $.allData.mapDatas[num]

            }

            if($.allData.status){
                $.newLayer()
            }

        }
    },
    newLayer :function (){
        layer.open({
            type: 1,
            title: '新增',
            skin: 'layui-layer-molv',
            shadeClose: false,
            shade: 0.5,
            area: ['90%', '90%'],
            content: $('.dataInfo')
        })

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
    //获取分公司
    selectCompany: function() {
        $.ajax({
            type: "get",
            url: globalurl + "/v1_0_0/allChildCompany",
            async: false,
            data: {
                access_token :$.allData.accessToken,
                company_code :user.company_code,
            },
            success: function (data) {
                $('.selectedUl').empty()
                for (var i in data) {
                    $('.selectedUl').append('<li>' + data[i].company_name + '</li>');
                    $.allData.code.push(data[i].company_code);
                }
                layer.open({
                    type: 1,
                    title: "选择分公司",
                    skin: 'layui-layer-molv',
                    shadeClose: false,
                    shade: 0.5,
                    area: ['300px', '336px'],
                    content: $('.confirmInfo')
                })
                $(".selectedUl li").changeOp()

            }
        })
    },
    //layer弹窗
    pipeLayer : function (name){
        layer.open({
            type: 1,
            title: name,
            skin: 'layui-layer-molv',
            shadeClose: false,
            shade: 0.5,
            area: ['90%', '90%'],
            content: $('.dataInfo')
        })
        /*$('.layui-layer-close').click(function(){
         $.allData.status =true
         })*/
    },
    //修改数据的ajax
    editAjax : function (){
        $.ajax({
            type:'put',
            dataType:'json',
            url:globalurl + '/v1_0_0/pipeDiameter',
            crossDomain: true == !(document.all),
            data:{
                access_token :$.allData.accessToken,
                data:JSON.stringify($.allData.pipeData)
            },
            success:function (data){
                layer.msg(data.success, {
                    icon: 1,
                    shade: 0.01,
                    time: 1000,
                    end:function (){
                        layer.closeAll()
                    }
                });
                if(data.code ===200){
                    $.allData.map.clearOverlays();
                    $.getMapData()
//                  $.addLine($.allData.mapDatas)
//                  $.addPipeMarker($.allData.mapDatas)
                }else{
                    $.getMapData()
//                  $.addLine($.allData.initDatas)
//                  $.addPipeMarker($.allData.initDatas)
                }

            }
        })
    },
    //判断是否有未填写项目
    isEmpty: function(parent, target) {
        $.each(parent.find('input'), function () {
            if ($(this).attr('empty')) {
                $(this).focus();
                $(this).css('borderColor', '#ff787b');
                $.layerTip($(this), $(this).attr('warning'));
                target.attr('isright', 'false');
                return false;
            } else {
                target.attr('isright', 'true');
            }
        });
    },
    //工具类->layer提示
    layerTip: function(focusElem, message) {
        layer.tips(message, focusElem, {
            tips: [1, '#ff787b'],
            time: 3000,
            tipsMore: true
        });
    },
    initAddData:function (){
        return $.allData.pipeData={
            back_pipe: "",
            create_date: "",
            lat: "", //纬度
            lng: "", //经度
            for_pipe: "",
            last_manhole: "",
            manhole_code: "",
            last_manhole_code:"",
            last_manhole_loc:"",
            manhole_depth: "",
            manhole_function: "",
            manhole_loc: "",
            manhole_size: "",
            road_name: "",
            remark: "请输入备注信息",
            _id: "",
        }
    },
    //地图搜索
    searchMap:function (){
        $.allData.searchMap.addEventListener("onhighlight",$.mouseList)
        $.allData.searchMap.addEventListener("onconfirm",$.confirmList)
    },
    mouseList:function (ev){
        let str = "";
        let _value = ev.fromitem.value;
        let value = "";
        if (ev.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str = "FromItem<br />index = " + ev.fromitem.index + "<br />value = " + value;

        value = "";
        if (ev.toitem.index > -1) {
            _value = ev.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str += "<br />ToItem<br />index = " + ev.toitem.index + "<br />value = " + value;
        $("#searchResultPanel").html(str)
    },
    confirmList:function (ev){
        let _value = ev.item.value;
        $.allData.myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        $("#searchResultPanel").html("onconfirm<br />index = " + ev.item.index + "<br />$.allData.myValue = " + $.allData.myValue)
        $.setPlace();
    },
    setPlace:function (){
        $.allData.local = new BMap.LocalSearch($.allData.map, { //智能搜索
            onSearchComplete: $.smartSearch
        });
        $.allData.local.search($.allData.myValue);
    },
    smartSearch:function (){
        let point = $.allData.local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
        $.allData.map.centerAndZoom(point, 17);
        let icon = new BMap.Icon("../img/pipe_edit.png", new BMap.Size(25, 32))
        $.allData.newMarker = new BMap.Marker(point, {
            icon:icon
        });
        $.allData.map.addOverlay($.allData.newMarker);    //添加标注
        $.allData.pipeData.lng = point.lng,
            $.allData.pipeData.lat = point.lat,
            $.allData.pipeData.manhole_loc = point.lng+','+point.lat
        $.allData.status =true;
        $.allData.mapDatas.push( $.allData.pipeData)
        $.allData.windowStatus =false
        $.addNewMarker()
    }
});

$.init();
