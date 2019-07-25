$.alarmData = {
    accessToken: getToken(),
    downStatus: false,//下拉的状态
    stationId: $('#stationId').val(),
    noConfigData: [],
    ConfigData: {},
    oneNetCoL: [],//一网采集
    twoNetCoL: [],//二网采集
    oneNetDel: [],//一网下发
    twoNetDel: [],//二网下发
    tagData: [],//标签数据
    dataId: '',
    vm: '',
    max: '',
    min: '',
    noConfigStr: '<div class="addAlarmData" ><div class="dataLeft">添加警告</div>' +
    '<div class="dataRight"><i class="fa fa-plus-circle" data-toggle="tooltip" data-placement="top" title=""  data-original-title="添加"></i>' +
    '</div></div>',
    iconStr: '<i class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title=""  data-original-title="编辑"></i>' +
    '<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title=""  data-original-title="清空"></i>',
    downStr:'<span class="dropDown"><i class="fa fa-angle-down fa-lg"></i></span>',
    deleIndex:'',
    deleId:'',
    configStatus:false,
    status:-1
};
$extend = $.fn.extend({
    //空格限制输入
    limitSpacing: function () {
        $(this).keyup(function (ev) {
            if (ev.keyCode == 32) {
                $(this).val($(this).val().replace(/\s/g, ''));
                //eval('$.allData.' + $(this).attr('datasrc') + '=$(this).val()');
            }

        });
    },
    //非数字限制输入
    numOnly: function () {
        $(this).keyup(function () {
            $(this).val($(this).val().replace(/[^0-9-]/g, ''));
            //eval('allData.' + $(this).attr('datasrc') + '=$(this).val()');
        });
    },
    //标签配置
    confoigLabel: function (index) {
        //console.log(index)
        $.alarmData.configStatus=false
        $('#searchData').val('')
        $.getLAbelList($.alarmData.noConfigData[index].port_type)
        $.alarmData.dataId = $.alarmData.noConfigData[index].data_id
        
        $.labelLayer()
    },
    //点击下拉
    toggleDown: function (i, that) {
        if (!$.alarmData.downStatus) {
        	that.parent().parent().css({
        		'z-index':' 10'
        	})
            let heightTr = that.parent().parent().find('tbody tr').length * 30 + 30;
            if(heightTr>30){
                that.removeClass('transout')
                that.addClass('transin')
                that.parent().parent().find('.toggleDown').animate({
                    height: heightTr + 'px'
                })
                $.alarmData.downStatus = true;
            }


        } else {
        	that.parent().parent().css({
        		'z-index':'0'
        	})
            that.removeClass('transin')
            that.addClass('transout')
            that.parent().parent().find('.toggleDown').animate({
                height: '60px'
            })
            $.alarmData.downStatus = false;
        }
    },
    //标签的模糊查询
    searchData:function (){
    	//查找数据标签
    	$('.selectedUl').empty()
		for (let i = 0; i < $.alarmData.tagData.length; i++) {
			if ($.alarmData.tagData[i].tag_name.search($(this).val()) != -1) {
				str = '<li class="tag" id="' + $.alarmData.tagData[i].tag_id + '" data-index="'+i+'">' +
					'<span>' + $.alarmData.tagData[i].tag_name + '</span>' +
					'</li>'
				$('.selectedUl').append(str)
			}
		}
	},
    //添加,修改告警
    addAlarm: function (i,j,that,title,configdata) {
        layer.alert($('.alarmSet').html(), {
            title: title,
            btn: ['保存', '取消'],
            area: ['400px', '170px'],
            skin: 'layui-layer-molv'
        }, function () {
            if ($(".layui-layer #dataMin").val() == "" && $(".layui-layer #dataMax").val() == "") {
                layer.tips('最大值或者最小值不能同时为空', $(".layui-layer #dataMax"), {
                    tips: [1, '#ff787c'],
                    time: 2000
                });
            } else if (Number($(".layui-layer #dataMax").val()) <= Number($(".layui-layer #dataMin").val())) {
                layer.tips('最大值不能比最小值小', $(".layui-layer #dataMax"), {
                    tips: [1, '#ff787c'],
                    time: 2000
                });
            } else {
                let tagId = configdata[i].data_tag;
                let dataId =configdata[i].data_id
                let thresholdData;
                if(j==0){
                    if (configdata[i].threshold ==null){
                        lowValue = JSON.stringify('');
                        upValue = JSON.stringify('')
                    }else{
                        lowValue = configdata[i].threshold[1].lower_value
                        upValue = configdata[i].threshold[1].upper_value
                    }
                    if(!lowValue){
                        lowValue =JSON.stringify('')
                    }
                    if(!upValue){
                        upValue =JSON.stringify('')
                    }
                    thresholdData="[" +
                        "{" +
                        "lower_value: " + $(".layui-layer #dataMin").val() + "," +
                        "upper_value: " + $(".layui-layer #dataMax").val() +
                        "}," +
                        "{" +
                        "lower_value: " +lowValue + "," +
                        "upper_value: " +upValue +
                        "}" +
                        "]"
                }else{
                    if (configdata[i].threshold ==null){
                        lowValue = JSON.stringify('');
                        upValue = JSON.stringify('')
                    }else{
                        lowValue = configdata[i].threshold[0].lower_value
                        upValue = configdata[i].threshold[0].upper_value
                    }
                    if(!lowValue){
                        lowValue =JSON.stringify('')
                    }
                    if(!upValue){
                        upValue =JSON.stringify('')
                    }
                    thresholdData="[" +
                        "{" +
                        "lower_value: " +lowValue + "," +
                        "upper_value: " +upValue +
                        "}," +
                        "{" +
                        "lower_value: " + $(".layui-layer #dataMin").val() + "," +
                        "upper_value: " + $(".layui-layer #dataMax").val() +
                        "}" +
                        "]"
                }
                let data = {
                    station_id: $.alarmData.stationId,
                    data_id: dataId,
                    tag_id: Number(tagId),
                    threshold:thresholdData
                }
                $.bindTag(data)
                that.find('li').eq(i).find('.threshold li').eq(j).empty()
                let str = '<div class="dataLeft"><span><em>最小值</em>'+
                    '<b style="margin-right: 5px;font-weight: 700;">'+$(".layui-layer #dataMin").val()+'</b></span>/ '+
                    '<span><em>最大值</em> <b style="margin-right: 5px;font-weight: 700;">'+$(".layui-layer #dataMax").val()+'</b></span>'+
                    '</div><div class="dataRight">'+$.alarmData.iconStr+'</div></div>'
                that.find('li').eq(i).find('.threshold li').eq(j).append(str)
            }
        }, function () {
           // console.log(747747)
        })
    },
    clearAlarm:function(i,j,configdata){
        let tagId = configdata[i].data_tag;
        let dataId =configdata[i].data_id
        let thresholdData
        if(configdata[i].threshold[j].lower_value =='-'){
            configdata[i].threshold[j].lower_value= JSON.stringify("")
        }
        if(configdata[i].threshold[j].upper_value =='-'){
            configdata[i].threshold[j].upper_value=JSON.stringify("")
        }
        if(j==0){
            thresholdData="[" +
                "{" +
                "lower_value:'' ," +
                "upper_value:'' " +
                "}," +
                "{" +
                "lower_value: " +configdata[i].threshold[1].lower_value + "," +
                "upper_value: " +configdata[i].threshold[1].upper_value +
                "}" +
                "]"
        }else{
            thresholdData="[" +
                "{" +
                "lower_value: " +configdata[i].threshold[0].lower_value + "," +
                "upper_value: " +configdata[i].threshold[0].upper_value +
                "}," +
                "{" +
                "lower_value:'' ," +
                "upper_value:'' " +
                "}" +
                "]"
        }
        let data = {
            station_id: $.alarmData.stationId,
            data_id: dataId,
            tag_id: Number(tagId),
            threshold:thresholdData,
            _id:configdata[i]._id
        }
        $.bindTag(data)
    },
    deleAlarm:function(Id){
        $.ajax({
            url: globalurl + '/v1_0_0/dataConfig?access_token='+$.alarmData.accessToken+'&_id='+Id,
            dataType: 'JSON',
            type: 'delete',
            async: false,
            crossDomain: true == !(document.all),
            success: function(data) {
                //layer.close(resultBox)
                if (data.code == 200) {
                    layer.msg('取消成功', {
                        icon: 1,
                        time: 1500
                    }, function() {
                        layer.closeAll()
                        $('.collectorData ol').empty()
                        //$('.deliveryData').find('h5').next().remove()
                        $.getConfigData()
                    })
                } else {
                    layer.msg(data.error, {
                        icon: 2,
                        time: 1500
                    }, function() {
                        $.getConfigData()
                    })
                }
            }
        })
    },
    //修改下发数据
    editDelivery:function (i,j,that,deliveryData,parent) {
        that.removeClass('fa-pencil').addClass('fa-check').css({
            'padding-right': '10px',
            'color': '#52a3ed'
        })
        that.parent().find('input').attr('readonly',false)
        that.prev().css('border','1px solid #1bb294')
        $('i.fa-check').click(function(){
            let tagId = deliveryData.data_tag;
            let dataId =deliveryData.data_id
            let option=[];
            for(let m in deliveryData.tag_option){
                let dataValue =parent.find('ol').eq(i).find('tbody').eq(j).find('tr').eq(m).find('input').val()
                let optionJson= {
                    data_value:dataValue ,
                    name: deliveryData.tag_option[m].name,
                    option_id:deliveryData.tag_option[m].option_id
                }
                option.push(optionJson)
            }
            let data = {
                station_id: $.alarmData.stationId,
                data_id: dataId,
                tag_id: Number(tagId),
                tag_option:option,
                _id:deliveryData._id
            }
            that.prev().css('border','none')
            $.bindTag(data)
        })
    },
    //清空下发数据
   clearDelivery:function (i,j,that,deliveryData,parent) {
       let tagId = deliveryData.data_tag;
       let dataId =deliveryData.data_id
       let option=[];
       that.parent().find('input').val('');
       for(let m in deliveryData.tag_option){
           let dataValue =parent.find('ol').eq(i).find('tbody').eq(j).find('tr').eq(m).find('input').val()
           let optionJson= {
               data_value:dataValue ,
               name: deliveryData.tag_option[m].name,
               option_id:deliveryData.tag_option[m].option_id
           }
           option.push(optionJson)
       }
       let data = {
           station_id: $.alarmData.stationId,
           data_id: dataId,
           tag_id: Number(tagId),
           tag_option:option,
           _id:deliveryData._id
       }
       $.bindTag(data)
   }
});
$.extend({
    init:function () {
        $.alarmData.vm=new Vue({
            el: '#alarmConfig',
            data: $.alarmData,
            methods: $extend,
            beforeDestroy:function(){
                $('[data-toggle="tooltip"]').tooltip()
            }
        })
        
        $.getConfigData()
        //点击标签配置
        $('.selectedUl').delegate('.tag', 'click', function() {
            let tagId = $(this).attr('id');
            let data;
            if($.alarmData.tagData[$(this).attr('data-index')].option){
                data ={
                    station_id:$.alarmData.stationId,
                    data_id:$.alarmData.dataId ,
                    tag_id:Number(tagId),
                    tag_option:$.alarmData.tagData[$(this).attr('data-index')].option
                }
            }else{
                data ={
                    station_id:$.alarmData.stationId,
                    data_id:$.alarmData.dataId ,
                    tag_id:Number(tagId),
                }
            }
            $.bindTag(data)
        })
        $('#searchData').limitSpacing();
        $("#searchData").on("keyup", function(ev) {
			if (ev.keyCode == 13) {
				$(this).searchData();
			}
		})
		$(".fa-search").on("click", function() {
			$(this).searchData();
		})
    },
    //获取某个换热站数据项的配置信息
    getConfigData:function(){
        $.ajax({
            type: "get",
            url: globalurl + "/v1_0_0/station/"+$.alarmData.stationId+"/dataConfig",
            dataType: "json",
            async:false,
            crossDomain: true == !(document.all),
            data: {
                access_token: $.alarmData.accessToken,
            },
            success:function (data){
                //console.log(data)
                if(data){
                    $.alarmData.noConfigData = data.noConfigList
                    $.alarmData.ConfigData = data.alreadyConfigMap
                    $.renderConfigData($.alarmData.ConfigData.yiwangcaiji,$(".collectorData .oneNetData ol"))
                    $.renderConfigData($.alarmData.ConfigData.erwangcaiji, $(".collectorData .towNetData ol"));
                    $.renderDelivery($.alarmData.ConfigData.yiwangxiafa, $(".deliveryData .oneNetData"));
                    $.renderDelivery($.alarmData.ConfigData.erwangxiafa, $(".deliveryData .towNetData"));
                    $('[data-toggle="tooltip"]').tooltip()
                }
            }
        })
    },
    //获取标签列表
    getLAbelList :function(portType){
        $.ajax({
            type: "get",
            url: globalurl + '/v1_0_0/tags?level=2',
            dataType: "json",
            crossDomain: true == !(document.all),
            data: {
                access_token: $.alarmData.accessToken,
                station_id:$.alarmData.stationId,
                port_type:portType
            },
            success: function (data) {
                $.alarmData.tagData = [];
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].state = 0
                        $.alarmData.tagData.push(data[i])
                        $('.selectedUl').empty();
                        let str = ''
                        for (let i = 0; i < $.alarmData.tagData.length; i++) {
                            if ($.alarmData.tagData[i].state == 0) {
                                str = '<li class="tag" id="' + $.alarmData.tagData[i].tag_id + '" data-index="'+i+'">' +
                                    '<span>' + $.alarmData.tagData[i].tag_name + '</span>' +
                                    '</li>'
                                $('.selectedUl').append(str)
                            }
                        }
                    }
                }
            }
        });
    },
    labelLayer : function (){
        layer.open({
            type: 1,
            title: '选择数据标签',
            skin: 'layui-layer-molv',
            shadeClose: false,
            shade: 0.5,
            move:false,
            area:  ['300px', '336px'],
            content: $('.confirmInfo')
        })
        $('#deleConfig').click(function(){
        	if($.alarmData.configStatus==false){
        		layer.closeAll()
        	}else{
        		$(this).deleAlarm($.alarmData.deleId)
        	}
            
        })
    },
    //渲染配置数据
    renderConfigData:function (oneNetCoL,target){
        if(oneNetCoL.length>0){
            for(let i in oneNetCoL){
                if(oneNetCoL[i].data_name ==''){
                    oneNetCoL[i].data_name ='-'
                }
                if(oneNetCoL[i].data_value ==''){
                    oneNetCoL[i].data_value ='-'
                }
                if(oneNetCoL[i].data_unit =='' ||oneNetCoL[i].data_unit==null){
                    oneNetCoL[i].data_unit =''
                }
                if(oneNetCoL[i].tag_name ==''){
                    oneNetCoL[i].tag_name ='未配置'
                }
                let str = '<li data_id="'+oneNetCoL[i]._id+'" port_type="'+oneNetCoL[i].port_type+'"><dl><dt>'+oneNetCoL[i].data_name+'</dt>'+
                    '<dd> <span>'+oneNetCoL[i].data_value+'</span>'+oneNetCoL[i].data_unit+
                    '</dd> <dd> <em>'+oneNetCoL[i].tag_name+'</em>'+
                    ' <i class="fa fa-tags" data-toggle="tooltip" data-placement="top" title=""  data-original-title="标签"></i>'+
                    '</dd><dd><ul class="threshold"></ul></dd></dl></li>';
                target.append(str);
                $.renderList(oneNetCoL[i],i,target)
            }
            
            target.find('i.fa-plus-circle').click(function(){
	            let index =$(this).parent().parent().parent().attr('index')
	        	let LiIndex =$(this).parent().parent().parent().attr('data-index')
	            $(this).addAlarm(LiIndex,index,target,'添加警告',oneNetCoL)
	            //
	        })
	    	target.find('i.fa-pencil').click(function(){
	           let index =$(this).parent().parent().parent().attr('index')
	           let LiIndex =$(this).parent().parent().parent().attr('data-index')
	           $(this).addAlarm(LiIndex,index,target,'修改警告',oneNetCoL)
	           //
	        })
	        target.find('i.fa-trash').click(function(){
                let index =$(this).parent().parent().parent().attr('index')
	        	let LiIndex =$(this).parent().parent().parent().attr('data-index')
	           $(this).clearAlarm(LiIndex,index,oneNetCoL)
	           //
	        })
            target.find('i.fa-tags').click(function(){
            	$.alarmData.status =false
            	$.alarmData.configStatus=true
                $.alarmData.deleId =$(this).parent().parent().parent().attr('data_id')
                $.getLAbelList($(this).parent().parent().parent().attr('port_type'))
               
                $.labelLayer()
            })
            
        }
    },
    //渲染配置数据列表
    renderList:function (data,i,target){
       // console.log(data.threshold)
        if(data.threshold){
            for (let j = 0; j < 2; j++) {
                if(data.threshold[j] =='null'){
                    target.find('.threshold').eq(i).append('<li index="'+j+'" data-index="'+i+'">'+$.alarmData.noConfigStr+'</li>' );
                    //target.find('.threshold').eq(i).find('li').eq(j).attr('index',j)
                    //target.find('.threshold').eq(i).find('li').eq(j).attr('data-index',i)
                }else{
                    let liStr=''
                    if(data.threshold[j].lower_value =='null' ||data.threshold[j].lower_value==''){
                        liStr ='<li index="'+j+'" data-index="'+i+'">'+$.alarmData.noConfigStr+'</li>'
                    }else{
                        liStr='<li index="'+j+'" data-index="'+i+'"><div class="alarmdata">'+
                            '<div class="dataLeft"><span><em>最小值</em>'+
                            '<b style="margin-right: 5px;">'+data.threshold[j].lower_value+'</b></span>/'+
                            '<span><em>最大值</em> <b style="margin-right: 5px;">'+data.threshold[j].upper_value+'</b></span>'+
                            '</div><div class="dataRight">'+$.alarmData.iconStr+'</div></div></li>'
                    }

                    target.find('.threshold').eq(i).append(liStr)
                }
            }

        }else{
            for (let j = 0; j < 2; j++) {
                target.find('.threshold').eq(i).append('<li index="'+j+'" data-index="'+i+'">'+$.alarmData.noConfigStr+'</li>' )
                //target.find('.threshold').eq(i).find('li').eq(j).attr('index',j)
                //target.find('.threshold').eq(i).find('li').eq(j).attr('data-index',i)
            }
        }


    },
    //渲染下发数据列表
    renderDelivery:function(data,target){
        if(data.length>0){
        	let num =Math.floor(target.width()/290);
        	let result = [];
			for (let i = 0, len = data.length; i < len; i += num) {
				if(data[i].data_name ==''){
                    data[i].data_name ='-'
                }
                if(data[i].data_value ==''){
                    data[i].data_value ='-'
                }
                if(data[i].tag_name ==''){
                    data[i].tag_name ='未配置'
                }
				result.push(data.slice(i, i + num));
			}
			target.find('ol').remove()
			for(let i=0;i<result.length;i++){
				target.append('<ol></ol>')
				for(let j in result[i]){
					let str = '<li data_id="'+result[i][j]._id+'" port_type="'+result[i][j].port_type+'"><dl><dt>' + result[i][j].data_name + '</dt>' +
                    '<dd><em>' + result[i][j].tag_name + '</em><i data_id="'+result[i][j].data_id+'" class="fa fa-tags" data-toggle="tooltip" data-placement="top" title=""  data-original-title="标签"></i>' +
                    '</dd><dd class="toggleDown"><table><thead><tr><th>下发值</th><th>名称</th>' +
                    '</tr></thead><tbody index="'+i+'" li-index="'+j+'"></tbody></table></dd></dl>'+$.alarmData.downStr+'</li>';
                	target.find('ol').eq(i).append(str);
                	target.find('ol').eq(i).find('li').eq(j).css('left',290*j)
                	$.renderDeliveryData(result[i][j],i,j,target)
				}
			}
            target.find('i.fa-angle-down').click(function(){
                let index =$(this).parent().parent().attr('index')
                $(this).toggleDown(index,$(this))
                //
            })
            target.find('i.fa-pencil').click(function(){
                let olIndex =$(this).parent().parent().parent().attr('index')
                let liIndex =$(this).parent().parent().parent().attr('li-index')
                $(this).editDelivery(olIndex,liIndex,$(this),result[olIndex][liIndex],target)
            })
            target.find('i.fa-trash').click(function(){
                let olIndex =$(this).parent().parent().parent().attr('index')
                let liIndex =$(this).parent().parent().parent().attr('li-index')
                $(this).clearDelivery(olIndex,liIndex,$(this),result[olIndex][liIndex],target)
                //
            })
            target.find('i.fa-tags').click(function(){
            	$.alarmData.configStatus=true
                $.alarmData.deleId =$(this).parent().parent().parent().attr('data_id')
                $.alarmData.dataId=$(this).attr('data_id')
                $.getLAbelList($(this).parent().parent().parent().attr('port_type'))
                $.labelLayer()
            })
        }
    },
    //渲染下发数据表
    renderDeliveryData:function(data,i,m,target){
        if(data.tag_option){
        	console.log(i)
            for(let j in data.tag_option){
                if(data.tag_option[j]){
                    if(!data.tag_option[j].data_value){
                        data.tag_option[j].data_value='-'
                    }
                    let str ='<tr><td><input type="text" readonly="readonly" value="'+data.tag_option[j].data_value+'">'+
                            '<i data-index="'+j+'" class="fa fa-pencil" data-toggle="tooltip" data-placement="top" title=""  data-original-title="编辑"></i>'+
                            '<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title=""  data-original-title="清空"></i>'+
                            '</td><td>'+data.tag_option[j].name+'</td></tr>'
                    target.find('ol').eq(i).find('tbody').eq(m).append(str)
                     
                }
            }
        }else{
        	target.find('ol').eq(i).find('.toggleDown').css('height','0')
        	target.find('ol').eq(i).find('dl').eq(m).find('dd').eq(0).css({
        		'margin-top': '50px',
    			'margin-bottom': '50px'
        	})
        	target.find('ol').eq(i).find('.dropDown').remove()
        }
    },
    //绑定标签
    bindTag :function (data){
        $.ajax({
            type:'put',
            url: globalurl + '/v1_0_0/dataConfig',
            dataType: "json",
            crossDomain: true == !(document.all),
            data: {
                access_token: $.alarmData.accessToken,
                data:JSON.stringify(data)
            },
            success:function (data){
                if (data.code == 200) {
                    layer.msg(data.error, {
                        icon: 1,
                        time: 1500
                    }, function() {
                        layer.closeAll()
                        $('.oneNetData ol,.towNetData ol').empty()

                        $.getConfigData()
                        /*setTimeout(function() {
                            window.location.reload()
                        }, 200);*/
                    })
                } else {
                    layer.msg(data.error, {
                        icon: 2,
                        time: 1000
                    }, function() {
                    })
                }
            },
            error: function(data) {
                //			console.log(data)
                layer.msg("添加失败", {
                    icon: 2,
                    time: 1000
                }, function() {
                    //alarmList();
                })
            }
        })
    },
    

})



$.init()
