"use strict"

if (b4w.module_check("character"))
    throw "Failed to register module: character";

b4w.register("character", function(exports, require) {

var m_fps 		= require("fps");
var m_ctl		= require("controls");
var m_input		= require("input");
var m_cont 		= require("container");
var m_mouse		= require("mouse");
var m_scs 		= require("scenes");
var m_main		= require("main");
var m_scrn 		= require("screenshooter");
var m_gm_opt	= require("game_options");
var m_obj_man	= require("objects_manager");
var m_cons  	= require("constraints");
var m_trans 	= require("transform");
var m_phy 		= require("physics");
var m_anim		= require("animation");
var m_vec3		= require("vec3");

var _char_wrapper;

var _move_keys_array;

var _vec3_tmp = new Float32Array(3);
var _vec3_tmp_2 = new Float32Array(3);
var _quat = new Float32Array(4);

exports.char_wrapper = _char_wrapper; 
	
exports.init_character = function() {
	_char_wrapper = {
		phys_body: m_scs.get_object_by_dupli_name("GroupCharacterJim", "Character"),
        rig:    m_scs.get_object_by_dupli_name("GroupCharacterJim", 'metarig'),
        model:   m_scs.get_object_by_dupli_name("GroupCharacterJim", "CharModel"),
		cam:	m_scs.get_active_camera(),
		current_cam: 0,
		cam_empties: [
			m_scs.get_object_by_dupli_name("GroupCharacterJim", "EmptyHeadCam"), 
			m_scs.get_object_by_dupli_name("GroupCharacterJim", "Empty3rdPersonCam")
			],
		type: 'character'
	}
	
	setup_char_cam_empties();
	// setup_camera_start_position();
	setup_mouselook();
	setup_movement();
	setup_controls();
	// spawn_character("EmptySpawner1");
	m_obj_man.spawn_game_object(_char_wrapper.phys_body, "EmptySpawner1");
	m_anim.apply(_char_wrapper.rig, 'GroupCharacterJim_proxyAction_B4W_BAKED');
    m_anim.set_behavior(_char_wrapper.rig, m_anim.AB_CYCLIC);
    m_anim.play(_char_wrapper.rig);

}

var setup_char_cam_empties = function() {
	_vec3_tmp = m_gm_opt.char_cam_offsets.CAM_OFFSET_HEAD;
	m_cons.remove(_char_wrapper.cam_empties[0]);
	m_cons.append_stiff(_char_wrapper.cam_empties[0], _char_wrapper.phys_body, _vec3_tmp);
	_vec3_tmp = m_gm_opt.char_cam_offsets.CAM_OFFSET_3RD_PERSON;
	m_cons.remove(_char_wrapper.cam_empties[1]);
	m_cons.append_stiff(_char_wrapper.cam_empties[1], _char_wrapper.phys_body, _vec3_tmp);

}
// Obsolete
var setup_camera_start_position = function() {

	for (var i = 0; i < _char_wrapper.cam_empties.length; i++) {
		if (_char_wrapper.current_cam == 0) {
			m_trans.get_translation(_char_wrapper.cam_empties[0], _vec3_tmp);
			m_trans.set_translation_v(_char_wrapper.cam, _vec3_tmp);
			m_trans.get_rotation(_char_wrapper.cam_empties[0], _quat);
			m_trans.set_rotation_v(_char_wrapper.cam, _quat);
		} else if (_char_wrapper.current_cam == 1) {
			m_trans.get_translation(_char_wrapper.cam_empties[1], _vec3_tmp);
			m_trans.set_translation_v(_char_wrapper.cam, _vec3_tmp);
			m_trans.get_rotation(_char_wrapper.cam_empties[1], _quat);
			m_trans.set_rotation_v(_char_wrapper.cam, _quat);
		}
	}
}

var setup_movement = function() {

	var key_a = m_ctl.create_keyboard_sensor(m_ctl.KEY_A);
	var key_s = m_ctl.create_keyboard_sensor(m_ctl.KEY_S);
	var key_d = m_ctl.create_keyboard_sensor(m_ctl.KEY_D);
	var key_w = m_ctl.create_keyboard_sensor(m_ctl.KEY_W);
	var key_space = m_ctl.create_keyboard_sensor(m_ctl.KEY_SPACE);
	var key_shift = m_ctl.create_keyboard_sensor(m_ctl.KEY_SHIFT);

	var move_state = {
		left_right: 0,
		forw_back: 0
	}

	var move_array = [key_w, key_s, key_a, key_d, key_shift];
	
	_move_keys_array = move_array;
	
	var move_cb = function(obj, id, pulse) {
    if (pulse == 1) {
        switch (id) {
        case "FORWARD":
            move_state.forw_back = 1;
            break;
        case "BACKWARD":
            move_state.forw_back = -1;
            break;
        case "LEFT":
            move_state.left_right = 1;
            break;
        case "RIGHT":
            move_state.left_right = -1;
            break;
        case "RUNNING":
            m_phy.set_character_move_type(obj, m_phy.CM_RUN);
            break;
        }
    } else {
        switch (id) {
        case "FORWARD":
        case "BACKWARD":
            move_state.forw_back = 0;
            break;
        case "LEFT":
        case "RIGHT":
            move_state.left_right = 0;
            break;
        case "RUNNING":
            m_phy.set_character_move_type(obj, m_phy.CM_WALK);
            break;
        }
    }

    m_phy.set_character_move_dir(obj, move_state.forw_back,
                                      move_state.left_right);
	};
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "FORWARD", m_ctl.CT_TRIGGER,
    move_array, function(s) {return s[0]}, move_cb);
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "BACKWARD", m_ctl.CT_TRIGGER,
		 move_array, function(s) {return s[1]}, move_cb);
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "LEFT", m_ctl.CT_TRIGGER,
		move_array, function(s) {return s[2]}, move_cb);
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "RIGHT", m_ctl.CT_TRIGGER,
		move_array, function(s) {return s[3]}, move_cb);

	var running_logic = function(s) {
	   return (s[0] || s[1] || s[2] || s[3]) && s[4];
	}
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "RUNNING", m_ctl.CT_TRIGGER,
		move_array, running_logic, move_cb);
		
	var jump_cb = function(obj, id, pulse) {
    m_phy.character_jump(obj);
	}
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "JUMP", m_ctl.CT_SHOT,
			[key_space], null, jump_cb);
		
}

var setup_controls = function() {
	var key_v = m_ctl.create_keyboard_sensor(m_ctl.KEY_V);
	var key_p = m_ctl.create_keyboard_sensor(m_ctl.KEY_P);
	var key_backspace = m_ctl.create_keyboard_sensor(m_ctl.KEY_BACKSPACE);
	
	var el_sens = m_ctl.create_elapsed_sensor();
	
	var change_camera_cb = function(obj, id, pulse) {
		if (pulse == 1) {
			var old_cam = _char_wrapper.current_cam;
			var new_cam = old_cam + 1;		
			if (new_cam > 1) {new_cam = 0;} 
			_char_wrapper.current_cam = new_cam;
			m_trans.get_rotation(_char_wrapper.phys_body, _quat);
			m_cons.remove(_char_wrapper.cam);
			var curr_cam_empty = _char_wrapper.cam_empties[new_cam];
			m_cons.append_copy_trans(_char_wrapper.cam, curr_cam_empty , [0,0,0]);			
			
		}
				
	}
	
	var pause_game_cb = function(obj, id, pulse) {
		if (pulse == 1) {
			m_main.pause();
		}
	}
	
	var take_screen_shot_cb = function(obj, id, pulse) {
		if (pulse == 1) {
			m_scrn.shot();
			console.log("Patata");
		}
	}
	
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "CHANGE_CAMERA",
        m_ctl.CT_SHOT, [key_v, m_input.GMPD_BUTTON_15],
        function(s){return s[0] || s[1]}, change_camera_cb);
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "PAUSE",
        m_ctl.CT_SHOT, [key_p, m_input.GMPD_BUTTON_16],
        function(s){return s[0] || s[1]}, pause_game_cb);
	m_ctl.create_sensor_manifold(_char_wrapper.phys_body, "PAUSE",
        m_ctl.CT_SHOT, [key_backspace, m_input.GMPD_BUTTON_17, _move_keys_array[4]],
        function(s){return (s[0] || s[1]) && s[2]}, take_screen_shot_cb);
}

var setup_mouselook = function() {
	var canvas_elem = m_cont.get_canvas();
    canvas_elem.addEventListener("mouseup", function(e) {
        m_mouse.request_pointerlock(canvas_elem);
    }, false);
	m_cons.append_copy_trans(_char_wrapper.cam, _char_wrapper.cam_empties[_char_wrapper.current_cam], [0.0, 0.0, 0.0]);
}

var spawn_character = function(spawner_name) {
	var spawner = m_scs.get_object_by_name(spawner_name);
	var pos = m_trans.get_translation(spawner);
	m_trans.get_rotation(spawner, _quat);
	console.log("Spawner rotation: " + _quat);
	m_phy.set_transform(_char_wrapper.phys_body, pos, _quat);
	
}

var shitty_character_debug = function () {
	console.log("================ Shitty character debugger ================");
	console.log("Phys_body_position: " + _char_wrapper.phys_body.physics.curr_tsr);
	m_trans.get_translation(_char_wrapper.cam, _vec3_tmp);
	console.log("Cam_position: " + _vec3_tmp);
	m_trans.get_translation(_char_wrapper.cam_empties[0], _vec3_tmp);
	console.log("Empty_head_position: " + _vec3_tmp);
	m_trans.get_translation(_char_wrapper.cam_empties[1], _vec3_tmp);
	console.log("Empty_3rd_person_position: " + _vec3_tmp);
	m_trans.get_rotation(_char_wrapper.cam, _quat);
	console.log("Cam_rotation: " + _quat);
	m_trans.get_rotation(_char_wrapper.cam_empties[0], _quat);
	console.log("Empty_head_rotation: " + _quat);
	m_trans.get_rotation(_char_wrapper.cam_empties[1], _quat);
	console.log("Empty_3rd_person_rotation: " + _quat);	
}


});