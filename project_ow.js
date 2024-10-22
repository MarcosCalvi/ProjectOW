"use strict"

// register the application module
b4w.register("project_ow_app", function(exports, require) {

// import modules used by the app
var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
//var m_fps		= require("fps");
//var m_lights 	= require("lights");
var m_ver       = require("version");
var m_npc_ai 	= require("npc_ai");
var m_scs 		= require("scenes");
var m_system	= require("system");
var m_char		= require("character");
var m_env		= require("environment");
var m_anim		= require("animation");
var m_obj_man 	= require("objects_manager");
var m_ui 		= require("ui");

// detect application mode
var DEBUG = (m_ver.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("project_ow");

/**
 * export the method to initialize the app (called at the bottom of this file)
 */
exports.init = function() {
    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
		gl_debug: true,
        autoresize: true,
		key_pause_enabled: true
    });
}

/**
 * callback executed when the app is initialized 
 */
function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    // m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

/**
 * load the scene data
 */
function load() {
	var preloader_cont = document.getElementById("preloader_cont");
    preloader_cont.style.visibility = "visible";
    m_data.load(APP_ASSETS_PATH + "project_ow.json", load_cb, preloader_cb);
}

/**
 * update the app's preloader
 */
// m_preloader.update_preloader(percentage);
function preloader_cb(percentage) {
	var prelod_dynamic_path = document.getElementById("prelod_dynamic_path");
	var percantage_num      = prelod_dynamic_path.nextElementSibling;

	prelod_dynamic_path.style.width = percentage + "%";
	percantage_num.innerHTML = percentage + "%";	   
	if (percentage == 100) {
		var preloader_cont = document.getElementById("preloader_cont");
	preloader_cont.style.visibility = "hidden";
		return;
	}
}

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }
	// m_cfg.set('physics_use_wasm', true);
	
	m_system.init_system();
	m_env.init_environment();
	m_char.init_character();
	m_obj_man.init_objects_system();
	m_ui.init_ui();
	// initTRex();
	// place your code here

}




});

// import the app module and start the app by calling the init method
b4w.require("project_ow_app").init();
