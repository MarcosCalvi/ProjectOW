"use strict"

if (b4w.module_check("objects_manager"))
    throw "Failed to register module: vehicles";

b4w.register("objects_manager", function(exports, require) {

var m_scs 		= require("scenes");
var m_main		= require("main");
var m_scrn 		= require("screenshooter");
// var m_gm_opt	= require("game_options");
var m_cons  	= require("constraints");
var m_trans 	= require("transform");
var m_phy 		= require("physics");
var m_anim		= require("animation");
var m_vec3		= require("vec3");
var m_npc_c 	= require("npc_characters");

var _vec3_tmp = new Float32Array(3);
var _vec3_tmp_2 = new Float32Array(3);
var _quat = new Float32Array(4);

var _game_objects;

var _animals;
var _dinos;
var _items;
var _weapons;
var _resources;

exports.animals = _animals;
exports.dinos = _dinos;
exports.items = _items;
exports.weapons = _weapons;
exports.resources = _resources;

exports.init_objects_system = function() {
	// To be filled from savegame. The object core comes in the object argument 
	var obj_core = {
		id: [1, 0],
		type: 'npc',
		subtype: 'dino',
		species: 'TRex'
	} 
	_animals = [];
	_dinos = [obj_core];
	_items = [];
	_weapons = [];
	_resources = [];
	
	_game_objects = [_animals, _dinos, _items, _weapons, _resources];
	
	create_objects_ids();
	
}

var create_objects_ids = function() {
	// TODO: Here there must be the code to load objects_cores saved from previous state to recover object
	// position and type
	for (var i = 0; i < _game_objects.length; i++) {
		var object_group = _game_objects[i];
		for (var j = 0; j < object_group.length; j++) {
			var object_core = object_group[j];
			recover_object(object_core, i, j);
		}
	}
} 

var recover_object = function(object_core, i, j) {	
	switch (object_core.type) {
		case 'npc':
			m_npc_c.init_npc_character(object_core);
	}
}

 

exports.spawn_game_object = function(game_object, spawner_name) {
	if (m_phy.has_physics(game_object)) {
		var spawner = m_scs.get_object_by_name(spawner_name);
		var pos = m_trans.get_translation(spawner);
		m_trans.get_rotation(spawner, _quat);
		console.log("Spawner rotation: " + _quat);
		m_phy.set_transform(game_object, pos, _quat);
	}
	
}

});
