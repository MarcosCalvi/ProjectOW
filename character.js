"use strict"

if (b4w.module_check("character"))
    throw "Failed to register module: character";

b4w.register("character", function(exports, require) {

var m_fps 	= require("fps");
var m_scs 	= require("scenes");
var m_cons  = require("constraints");
var m_trans = require("transform");
var m_phy 	= require("physics");

var _vec3_tmp = new Float32Array(3);

var _char_phys_body;
var _char_model;

var _quat = new Float32Array(4); 
	
var move_cb = function(forw_back, right_left) {
    //console.log(forw_back, right_left);
	console.log("Model_position: " + _char_model.physics.curr_tsr);
	console.log("Phys_body_position: " + _char_phys_body.physics.curr_tsr);
	
}
	
exports.init_character = function() {
	var spawner = m_scs.get_object_by_name("EmptySpawner1");
	var pos = m_trans.get_translation(spawner);
	m_trans.get_rotation(spawner, _quat);
	_char_phys_body = m_scs.get_object_by_dupli_name("GroupCharacterJim", "Character");
	_char_model = m_scs.get_object_by_dupli_name("GroupCharacterJim", "CharModel");	
	_vec3_tmp = [0.0, -3.0, -0.85];
	m_cons.append_stiff(_char_model, _char_phys_body, _vec3_tmp);
	m_phy.set_transform(_char_phys_body, [pos[0], pos[1], pos[2]], _quat);
	m_fps.enable_fps_controls(_char_phys_body, null, move_cb);
}


});