/**
 * 2016.5.25 刘鹏飞
 * 将情境中的组件列表迁移出来了，所有的情境页面共同使用这一个组件列表，同时维护
 * 
 */
//组态数组
var components = {
	text: {
		type: "text",
		text: "DATA",
		'sw': 1,
		f: "#ffffff",
		b: 0
	},

	common_alarm1: {
		type: "image",
		src: "/scada/common_alarm1.gif",
		w: 50,
		h: 50,
		'sw': 0
	},
	common_alarm2: {
		type: "image",
		src: "/scada/common_alarm2.gif",
		w: 50,
		h: 50,
		'sw': 0
	},
	common_alarm3: {
		type: "image",
		src: "/scada/common_alarm3.gif",
		w: 50,
		h: 50,
		'sw': 0
	},
	common_arrow_green: {
		type: "image",
		src: "/scada/common_arrow_green.png",
		w: 24,
		h: 19,
		'sw': 0
	},
	common_arrow_red: {
		type: "image",
		src: "/scada/common_arrow_red.png",
		w: 24,
		h: 19,
		'sw': 0
	},
	common_arrow_yellow: {
		type: "image",
		src: "/scada/common_arrow_yellow.png",
		w: 24,
		h: 19,
		'sw': 0
	},
	common_elbow: {
		type: "image",
		src: "/scada/common_elbow.png",
		w: 32,
		h: 35,
		'sw': 0
	},
	common_pipe_gray: {
		type: "image",
		src: "/scada/common_pipe_gray.png",
		w: 133,
		h: 20,
		'sw': 0
	},
	common_pipe_gray_left: {
		type: "image",
		src: "/scada/common_pipe_gray_left.gif",
		w: 130,
		h: 20,
		'sw': 0
	},
	common_pipe_gray_right: {
		type: "image",
		src: "/scada/common_pipe_gray_right.gif",
		w: 130,
		h: 20,
		'sw': 0
	},
	common_pipe_green_left: {
		type: "image",
		src: "/scada/common_pipe_green_left.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_pipe_green_right: {
		type: "image",
		src: "/scada/common_pipe_green_right.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_pipe_red_left: {
		type: "image",
		src: "/scada/common_pipe_red_left.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_pipe_red_right: {
		type: "image",
		src: "/scada/common_pipe_red_right.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_pipe_yellow_left: {
		type: "image",
		src: "/scada/common_pipe_yellow_left.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_pipe_yellow_right: {
		type: "image",
		src: "/scada/common_pipe_yellow_right.gif",
		w: 133,
		h: 19,
		'sw': 0
	},
	common_seal: {
		type: "image",
		src: "/scada/common_seal.png",
		w: 5,
		h: 28,
		'sw': 0
	},
	common_triangle: {
		type: "image",
		src: "/scada/common_triangle.png",
		w: 37,
		h: 36,
		'sw': 0
	},
	common_valve: {
		type: "image",
		src: "/scada/common_valve.png",
		w: 26,
		h: 22,
		'sw': 0
	},
	common_valve_gray: {
		type: "image",
		src: "/scada/common_valve_gray.png",
		w: 24,
		h: 18,
		'sw': 0
	},
	common_valve_red: {
		type: "image",
		src: "/scada/common_valve_red.png",
		w: 24,
		h: 18,
		'sw': 0
	},
	common_valve_yello: {
		type: "image",
		src: "/scada/common_valve_yello.png",
		w: 24,
		h: 18,
		'sw': 0
	},

	common_brick: {
		type: "image",
		src: "/scada/common_brick.png",
		w: 253,
		h: 12,
		'sw': 0
	},

	common_arrow_blue: {
		type: "image",
		src: "/scada/common_arrow_blue.png",
		w: 24,
		h: 19,
		'sw': 0
	},
	common_arrow_black: {
		type: "image",
		src: "/scada/common_arrow_black.png",
		w: 24,
		h: 19,
		'sw': 0
	},
	common_pipe_blue_right: {
		type: "image",
		src: "/scada/common_pipe_blue_right.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	common_pipe_bule_left: {
		type: "image",
		src: "/scada/common_pipe_bule_left.gif",
		w: 133,
		h: 20,
		'sw': 0
	},

	common_btn_green: {
		type: "image",
		src: "/scada/common_btn_green.png",
		w: 33,
		h: 34,
		'sw': 0
	},
	common_btn_red: {
		type: "image",
		src: "/scada/common_btn_red.png",
		w: 33,
		h: 34,
		'sw': 0
	},
	common_light_gray: {
		type: "image",
		src: "/scada/common_light_gray.png",
		w: 24,
		h: 25,
		'sw': 0
	},
	common_light_green: {
		type: "image",
		src: "/scada/common_light_green.png",
		w: 24,
		h: 25,
		'sw': 0
	},
	common_light_red: {
		type: "image",
		src: "/scada/common_light_red.png",
		w: 24,
		h: 25,
		'sw': 0
	},
	common_light_yellow: {
		type: "image",
		src: "/scada/common_light_yellow.png",
		w: 24,
		h: 25,
		'sw': 0
	},

	heat_checkvalve: {
		type: "image",
		src: "/scada/heat_checkvalve.png",
		w: 77,
		h: 39,
		'sw': 0
	},
	heat_house4: {
		type: "image",
		src: "/scada/heat_house4.png",
		w: 139,
		h: 261,
		'sw': 0
	},
	heat_verticalpump: {
		type: "image",
		src: "/scada/heat_verticalpump.png",
		w: 55,
		h: 147,
		'sw': 0
	},
	heat_watertower: {
		type: "image",
		src: "/scada/heat_watertower.gif",
		w: 120,
		h: 258,
		'sw': 0
	},

	heat_blower: {
		type: "image",
		src: "/scada/heat_blower.gif",
		w: 38,
		h: 35,
		'sw': 0
	},
	heat_boiler: {
		type: "image",
		src: "/scada/heat_boiler.png",
		w: 99,
		h: 238,
		'sw': 0
	},
	heat_bunker: {
		type: "image",
		src: "/scada/heat_bunker.png",
		w: 288,
		h: 371,
		'sw': 0
	},
	heat_chimney: {
		type: "image",
		src: "/scada/heat_chimney.png",
		w: 66,
		h: 153,
		'sw': 0
	},
	heat_coalsaving: {
		type: "image",
		src: "/scada/heat_coalsaving.png",
		w: 101,
		h: 57,
		'sw': 0
	},
	heat_compressor: {
		type: "image",
		src: "/scada/heat_compressor.png",
		w: 161,
		h: 113,
		'sw': 0
	},
	heat_deaerators: {
		type: "image",
		src: "/scada/heat_deaerators.png",
		w: 104,
		h: 80,
		'sw': 0
	},
	heat_desmear: {
		type: "image",
		src: "/scada/heat_desmear.png",
		w: 95,
		h: 115,
		'sw': 0
	},
	heat_dryer: {
		type: "image",
		src: "/scada/heat_dryer.png",
		w: 101,
		h: 107,
		'sw': 0
	},
	heat_exchanger: {
		type: "image",
		src: "/scada/heat_exchanger.png",
		w: 111,
		h: 213,
		'sw': 0
	},
	heat_expand: {
		type: "image",
		src: "/scada/heat_expand.png",
		w: 95,
		h: 119,
		'sw': 0
	},
	heat_expansion: {
		type: "image",
		src: "/scada/heat_expansion.png",
		w: 95,
		h: 119,
		'sw': 0
	},
	heat_filter: {
		type: "image",
		src: "/scada/heat_filter.png",
		w: 78,
		h: 33,
		'sw': 0
	},
	heat_flame: {
		type: "image",
		src: "/scada/heat_flame.gif",
		w: 158,
		h: 172,
		'sw': 0
	},
	heat_gas: {
		type: "image",
		src: "/scada/heat_gas.png",
		w: 89,
		h: 160,
		'sw': 0
	},
	heat_heater: {
		type: "image",
		src: "/scada/heat_heater.png",
		w: 218,
		h: 96,
		'sw': 0
	},
	heat_heatmeter: {
		type: "image",
		src: "/scada/heat_heatmeter.png",
		w: 45,
		h: 35,
		'sw': 0
	},
	heat_house1: {
		type: "image",
		src: "/scada/heat_house1.png",
		w: 200,
		h: 400,
		'sw': 0
	},
	heat_house3: {
		type: "image",
		src: "/scada/heat_house3.png",
		w: 466,
		h: 330,
		'sw': 0
	},
	heat_ignition: {
		type: "image",
		src: "/scada/heat_ignition.png",
		w: 672,
		h: 472,
		'sw': 0
	},
	heat_ignitiongun: {
		type: "image",
		src: "/scada/heat_ignitiongun.png",
		w: 70,
		h: 50,
		'sw': 0
	},
	heat_inboiler: {
		type: "image",
		src: "/scada/heat_inboiler.png",
		w: 681,
		h: 591,
		'sw': 0
	},
	heat_meter1: {
		type: "image",
		src: "/scada/heat_meter1.png",
		w: 34,
		h: 41,
		'sw': 0
	},
	heat_meter2: {
		type: "image",
		src: "/scada/heat_meter2.png",
		w: 33,
		h: 44,
		'sw': 0
	},
	heat_oilfilter: {
		type: "image",
		src: "/scada/heat_oilfilter.png",
		w: 78,
		h: 33,
		'sw': 0
	},
	heat_oilseparator: {
		type: "image",
		src: "/scada/heat_oilseparator.png",
		w: 79,
		h: 38,
		'sw': 0
	},
	heat_pressurevalve: {
		type: "image",
		src: "/scada/heat_pressurevalve.png",
		w: 45,
		h: 42,
		'sw': 0
	},
	heat_pump: {
		type: "image",
		src: "/scada/heat_pump.png",
		w: 42,
		h: 39,
		'sw': 0
	},
	heat_pump_left: {
		type: "image",
		src: "/scada/heat_pump_left.gif",
		w: 46,
		h: 45,
		'sw': 0
	},
	heat_pump_right: {
		type: "image",
		src: "/scada/heat_pump_right.gif",
		w: 46,
		h: 45,
		'sw': 0
	},
	heat_reduce: {
		type: "image",
		src: "/scada/heat_reduce.png",
		w: 68,
		h: 153,
		'sw': 0
	},
	heat_softtank: {
		type: "image",
		src: "/scada/heat_softtank.png",
		w: 137,
		h: 101,
		'sw': 0
	},
	heat_splitcylinder: {
		type: "image",
		src: "/scada/heat_splitcylinder.png",
		w: 50,
		h: 70,
		'sw': 0
	},
	heat_superheater: {
		type: "image",
		src: "/scada/heat_superheater.png",
		w: 105,
		h: 103,
		'sw': 0
	},
	heat_tank: {
		type: "image",
		src: "/scada/heat_tank.gif",
		w: 129,
		h: 73,
		'sw': 0
	},
	heat_thermometer: {
		type: "image",
		src: "/scada/heat_thermometer.png",
		w: 33,
		h: 124,
		'sw': 0
	},
	heat_valve: {
		type: "image",
		src: "/scada/heat_valve.png",
		w: 77,
		h: 77,
		'sw': 0
	},
	heat_waterexchanger: {
		type: "image",
		src: "/scada/heat_waterexchanger.png",
		w: 119,
		h: 50,
		'sw': 0
	},
	heat_waterline: {
		type: "image",
		src: "/scada/heat_waterline.png",
		w: 29,
		h: 87,
		'sw': 0
	},

	heat_exhaust: {
		type: "image",
		src: "/scada/heat_exhaust.png",
		w: 98,
		h: 179,
		'sw': 0
	},
	heat_steamheader: {
		type: "image",
		src: "/scada/heat_steamheader.png",
		w: 230,
		h: 101,
		'sw': 0
	},
	heat_belt: {
		type: "image",
		src: "/scada/heat_belt.png",
		w: 105,
		h: 43,
		'sw': 0
	},
	heat_oilpipe: {
		type: "image",
		src: "/scada/heat_oilpipe.png",
		w: 145,
		h: 51,
		'sw': 0
	},
	heat_duster: {
		type: "image",
		src: "/scada/heat_duster.png",
		w: 62,
		h: 85,
		'sw': 0
	},
	heat_flowmeter: {
		type: "image",
		src: "/scada/heat_flowmeter.png",
		w: 79,
		h: 109,
		'sw': 0
	},
	heat_pitcher: {
		type: "image",
		src: "/scada/heat_pitcher.png",
		w: 92,
		h: 151,
		'sw': 0
	},
	heat_blender: {
		type: "image",
		src: "/scada/heat_blender.gif",
		w: 93,
		h: 205,
		'sw': 0
	},

	heat_addoxygen: {
		type: "image",
		src: "/scada/heat_addoxygen.png",
		w: 136,
		h: 86,
		'sw': 0
	},
	heat_watertank: {
		type: "image",
		src: "/scada/heat_watertank.gif",
		w: 178,
		h: 92,
		'sw': 0
	},

	line: {
		type: "image",
		src: "/scada/line.png",
		w: 133,
		h: 20,
		'sw': 0
	},
	lineh: {
		type: "image",
		src: "/scada/lineh.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehl: {
		type: "image",
		src: "/scada/linehl.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehu: {
		type: "image",
		src: "/scada/linehu.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehul: {
		type: "image",
		src: "/scada/linehul.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linel: {
		type: "image",
		src: "/scada/linel.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linell: {
		type: "image",
		src: "/scada/linell.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehz: {
		type: "image",
		src: "/scada/linehz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehlz: {
		type: "image",
		src: "/scada/linehlz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehuz: {
		type: "image",
		src: "/scada/linehuz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linehulz: {
		type: "image",
		src: "/scada/linehulz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linelz: {
		type: "image",
		src: "/scada/linelz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	linellz: {
		type: "image",
		src: "/scada/linellz.gif",
		w: 133,
		h: 20,
		'sw': 0
	},
	hotboard: {
		type: "image",
		src: "/scada/hotboard.png",
		w: 110,
		h: 210,
		'sw': 0
	},
	pmeta: {
		type: "image",
		src: "/scada/pmeta.png",
		w: 30,
		h: 40,
		'sw': 0
	},
	tmeta: {
		type: "image",
		src: "/scada/tmeta.png",
		w: 30,
		h: 40,
		'sw': 0
	},
	hotmeta: {
		type: "image",
		src: "/scada/hotmeta.png",
		w: 45,
		h: 35,
		'sw': 0
	},
	pump: {
		type: "image",
		src: "/scada/pump.gif",
		w: 45,
		h: 45,
		'sw': 0
	},
	pumps: {
		type: "image",
		src: "/scada/pumps.gif",
		w: 45,
		h: 45,
		'sw': 0
	},
	valve: {
		type: "image",
		src: "/scada/valve.png",
		w: 75,
		h: 75,
		'sw': 0
	},
	bend: {
		type: "image",
		src: "/scada/bendpipeline.png",
		w: 30,
		h: 30,
		'sw': 0
	},
	thr: {
		type: "image",
		src: "/scada/thrpipeline.png",
		w: 35,
		h: 35,
		'sw': 0
	},

	jth: {
		type: "image",
		src: "/scada/jth.png",
		w: 25,
		h: 20,
		sw: 0
	},
	jthu: {
		type: "image",
		src: "/scada/jthu.png",
		w: 25,
		h: 20,
		sw: 0
	},
	jtl: {
		type: "image",
		src: "/scada/jtl.png",
		w: 25,
		h: 20,
		sw: 0
	},
	fm: {
		type: "image",
		src: "/scada/fm.png",
		w: 25,
		h: 20,
		sw: 0
	},
	fmr: {
		type: "image",
		src: "/scada/fmr.png",
		w: 25,
		h: 20,
		sw: 0
	},
	fmh: {
		type: "image",
		src: "/scada/fmh.png",
		w: 25,
		h: 20,
		sw: 0
	},
	fml: {
		type: "image",
		src: "/scada/fml.png",
		w: 25,
		h: 20,
		sw: 0
	},
	fk: {
		type: "image",
		src: "/scada/fk.png",
		w: 5,
		h: 28,
		sw: 0
	},
	yc: {
		type: "image",
		src: "/scada/yc.png",
		w: 65,
		h: 150,
		sw: 0
	},
	sx: {
		type: "image",
		src: "/scada/sx.gif",
		w: 130,
		h: 75,
		sw: 0
	},
	gl: {
		type: "image",
		src: "/scada/gl.png",
		w: 100,
		h: 240,
		sw: 0
	},
	xyf: {
		type: "image",
		src: "/scada/xyf.png",
		w: 45,
		h: 40,
		sw: 0
	},
	cysg: {
		type: "image",
		src: "/scada/cysg.png",
		w: 100,
		h: 50,
		sw: 0
	},
	rshrq: {
		type: "image",
		src: "/scada/rshrq.png",
		w: 120,
		h: 50,
		sw: 0
	},
	cwq: {
		type: "image",
		src: "/scada/cwq.png",
		w: 95,
		h: 115,
		sw: 0
	},
	fqg: {
		type: "image",
		src: "/scada/fqg.png",
		w: 50,
		h: 70,
		sw: 0
	},
	rhsx: {
		type: "image",
		src: "/scada/rhsx.png",
		w: 135,
		h: 100,
		sw: 0
	},
	wdj: {
		type: "image",
		src: "/scada/wdj.png",
		w: 30,
		h: 120,
		sw: 0
	},
	dgl: {
		type: "image",
		src: "/scada/dgl.png",
		w: 680,
		h: 590,
		sw: 0
	},
	sw: {
		type: "image",
		src: "/scada/sw.png",
		w: 30,
		h: 88,
		sw: 0
	},
	hy: {
		type: "image",
		src: "/scada/hy.gif",
		w: 158,
		h: 172,
		sw: 0
	},
	house1: {
		type: "image",
		src: "/scada/house1.png",
		w: 200,
		h: 400,
		sw: 0
	},
	zkfxlmqpsqgreen: {
		type: "image",
		src: "/scada/zkfxlmqpsq-green.png",
		w: 330,
		h: 438,
		'sw': 0
	},
	zkfxlmqpsqred: {
		type: "image",
		src: "/scada/zkfxlmqpsq-red.png",
		w: 330,
		h: 438,
		'sw': 0
	}
};