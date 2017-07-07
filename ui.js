"use strict"

if (b4w.module_check("ui"))
    throw "Failed to register module: environment";

b4w.register("ui", function(exports, require) {

var _ui_wrapper; 

exports.init_ui = function() {
	_ui_wrapper = {
		hud: document.getElementById("hud"),
		info: document.getElementById("info")
	}
	_ui_wrapper.hud.style.visibility = "visible";
	_ui_wrapper.info.innerHTML = "Iniciado";
}

exports.update_info = function(msg) {
	_ui_wrapper.info.innerHTML = msg;
}

});