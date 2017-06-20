"use strict"

if (b4w.module_check("system"))
    throw "Failed to register module: system";

b4w.register("system", function(exports, require) {
	
var m_cfg 				= require("config");
var m_game_prprts 		= require("game_properties");
var m_game_defaults 	= require("game_properties_defaults");
 
exports.init_system = function() {
	m_cfg.set('max_fps', 45);
	m_cfg.set('max_fps_physics', 500);
	
}

exports.get_char_common_stats = function() {
	var char_common_stats = m_game_prprts.char_common_stats;
	return char_common_stats;
}
	
});