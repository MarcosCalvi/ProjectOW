"use strict"

if (b4w.module_check("game_properties_defaults"))
    throw "Failed to register module: system";

b4w.register("game_properties_defaults", function(exports, require) {
exports.char_cam_offsets = {
	CAM_OFFSET_HEAD: [0.0,-0.2,0.85], 
	CAM_OFFSET_3RD_PERSON: [0.0,5.0,3.0]
	}
exports.char_common_stats = {
	id: 'character',
	life: 100, 
	stamina: 100,
	hunger: 0,
	calories_reserve: 2500,
	level: 1,
	level_points: 0
	}
});