"use strict"

if (b4w.module_check("character"))
    throw "Failed to register module: character";

b4w.register("character", function(exports, require) {

var m_fps 	= require("fps");
var m_scs 	= require("scenes");
var m_cons  = require("constraints");
var m_trans = require("transform");
var m_phy 	= require("physics");
var m_anim	= require("animation");

var _vec3_tmp = new Float32Array(3);

var _char_wrapper;


var _quat = new Float32Array(4); 
	
var move_cb = function(forw_back, right_left) {
    //console.log(forw_back, right_left);
	//console.log("Model_position: " + _char_wrapper.model.physics.curr_tsr);
	console.log("Phys_body_position: " + _char_wrapper.phys_body.physics.curr_tsr);
	
}
	
exports.init_character = function() {
	_char_wrapper = {
		/**char_phys_body: m_scs.get_object_by_dupli_name("GroupCharacterJim", "Character"),
		char_model: m_scs.get_object_by_dupli_name("GroupCharacterJim", "CharModel"),*/
		char_offset: [0.0, -3.0, -0.85], //[0.0, 0.0, 0.0]
		phys_body: m_scs.get_first_character(),
        rig:    m_scs.get_object_by_dupli_name('petigor', 'petigor_armature'),
        model:   m_scs.get_object_by_dupli_name('petigor', 'petigor_model'),
	}	
	// m_cons.append_stiff(_char_wrapper.body, _char_wrapper.phys_body, _char_wrapper.char_offset);	
	m_fps.enable_fps_controls(_char_wrapper.phys_body, null, move_cb);
	
	m_anim.apply(_char_wrapper.rig, 'petigor_run');
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
    m_anim.play(_char_wrapper.rig);
	spawn_character("EmptySpawner1");
}

var spawn_character = function(spawner_name) {
	var spawner = m_scs.get_object_by_name(spawner_name);
	var pos = m_trans.get_translation(spawner);
	m_trans.get_rotation(spawner, _quat);
	console.log("Spawner rotation: " + _quat);
	m_phy.set_transform(_char_wrapper.phys_body, pos, _quat);
	// m_trans.set_rotation_v(_char_wrapper.phys_body, _quat);
}


});