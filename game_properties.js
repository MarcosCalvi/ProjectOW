"use strict"

if (b4w.module_check("game_properties"))
    throw "Failed to register module: system";

b4w.register("game_properties", function(exports, require) {
	
var m_opts 	= require("game_options");
	
exports.char_cam_offsets = m_opts.char_cam_offsets;

exports.char_common_stats = {
	id: 'character',
	life: 100, 
	stamina: 100,
	hunger: 0,
	calories_reserve: 2500,
	level: 1,
	level_points: 0
	
	}
	
exports.char_inventory = {
	resources: [],
	weapons: [],
	tools: []
}
	
});