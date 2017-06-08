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
	_char_phys_body = m_scs.get_object_by_dupli_name("GroupCharacterJim", "Character");
	_char_model = m_scs.get_object_by_dupli_name("GroupCharacterJim", "CharModel");	
	var char_offset = [0.0, -3.0, -0.85];//[0.0, 0.0, 0.0]
	m_cons.append_stiff(_char_model, _char_phys_body, char_offset);	
	m_fps.enable_fps_controls(_char_phys_body, null, move_cb);
	spawn_character("EmptySpawner1");
}

var spawn_character = function(spawner_name) {
	var spawner = m_scs.get_object_by_name(spawner_name);
	var pos = m_trans.get_translation(spawner);
	m_trans.get_rotation(spawner, _quat);
	console.log("Spawner rotation: " + _quat);
	m_phy.set_transform(_char_phys_body, [pos[0], pos[1], pos[2]], _quat);
}


});