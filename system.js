"use strict"

if (b4w.module_check("system"))
    throw "Failed to register module: system";

b4w.register("system", function(exports, require) {
	
var m_cfg = require("config");
 
exports.init_system = function() {
	m_cfg.set('max_fps', 45);
	m_cfg.set('max_fps_physics', 500);
	
}
	
});