"use strict"

if (b4w.module_check("character"))
    throw "Failed to register module: character";

b4w.register("character", function(exports, require) {

var m_fps 	= require("fps");
var m_scs 	= require("scenes");
var m_cons  = require("constraints");

var _vec3_tmp = new Float32Array(3);

var _char_phys_body;
var _char_model;
	
var move_cb = function(forw_back, right_left) {
    //console.log(forw_back, right_left);
	console.log("Model_position: " + _char_model.physics.curr_tsr);
	console.log("Phys_body_position: " + _char_phys_body.physics.curr_tsr);
	
}	
exports.init_character = function() {
	_char_phys_body = m_scs.get_object_by_name("Character");
	_char_model = m_scs.get_object_by_name("CharModel");
	m_fps.enable_fps_controls(_char_phys_body, null, move_cb);
	_vec3_tmp = [0.0, 6.0, 0.0];
	m_cons.append_semi_stiff(_char_model, _char_phys_body, _vec3_tmp);
}


});