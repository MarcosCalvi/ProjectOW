"use strict"

if (b4w.module_check("game_options"))
    throw "Failed to register module: system";

b4w.register("game_options", function(exports, require) {
exports.char_cam_offsets = {
	CAM_OFFSET_HEAD: [0.0,-0.2,0.85], 
	CAM_OFFSET_3RD_PERSON: [0.0,5.0,3.0]
	}

});