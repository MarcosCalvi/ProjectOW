"use strict"

if (b4w.module_check("npc_characters"))
    throw "Failed to register module: system";

b4w.register("npc_characters", function(exports, require) {
	
var m_cfg 		= require("config");
var m_scs 		= require("scenes");
var m_npc_ai 	= require("npc_ai");
var m_obj_man 	= require("objects_manager");
var m_anim		= require("animation");
var m_sys 		= require("system");
var m_trans 	= require("transform");

var _npc_wrapper;

exports.npc_wrapper = _npc_wrapper;
 
exports.init_npc_character = function(obj_core) {
	
	switch(obj_core.type) {
		case "npc":
		if (obj_core.subtype == 'dino') {
			if (obj_core.species == 'TRex') {
				initTRex(obj_core);
			}
			
		} 
			
	}		
	
}

var initTRex = function (object) {
	_npc_wrapper = {
		phys_body: m_scs.get_object_by_dupli_name("GroupTRex", "TRexPhysicsBody"),
        rig:    m_scs.get_object_by_dupli_name("GroupTRex", "ArmatureTRex"),
        model:   m_scs.get_object_by_dupli_name("GroupTRex", "TRex"),
		obj_core: object,
		char_common_stats: m_sys.get_char_common_stats(),
	}
	var empty_1_pos = m_trans.get_translation(m_scs.get_object_by_name("EmptySpawner2"));
	var empty_2_pos = m_trans.get_translation(m_scs.get_object_by_name("EmptySpawner3"));
	m_anim.apply(m_scs.get_object_by_dupli_name("GroupTRex", "ArmatureTRex"), 'ArmatureTRex_proxyAction_B4W_BAKED');
	var graph = {
		// path:[[0,0,0], [0,100,0]],
		// path:[[-2265,-1140,88], [-2265,-1200,88]],
		path: [empty_1_pos, empty_2_pos],
		delay: 1,
		actions: {move: ["ArmatureTRex_proxyAction_B4W_BAKED"]},
		obj: m_scs.get_object_by_dupli_name("GroupTRex", "TRex"),
		rig: m_scs.get_object_by_dupli_name("GroupTRex", "ArmatureTRex"),
		collider: m_scs.get_object_by_dupli_name("GroupTRex", "TRexPhysicsBody"),
		speed: 1,
		rot_speed: 1,
		random: true,
		type: m_npc_ai.NT_WALKING
	};
	m_obj_man.spawn_game_object(m_scs.get_object_by_dupli_name("GroupTRex", "TRexPhysicsBody"), "EmptySpawner2");
	m_npc_ai.new_event_track(graph);
	m_npc_ai.enable_animation();
	// 
    // m_anim.set_behavior(m_scs.get_object_by_dupli_name("GroupTRex", "ArmatureTRex"), m_anim.AB_CYCLIC);
    // m_anim.play(m_scs.get_object_by_dupli_name("GroupTRex", "ArmatureTRex"));
}
	
});