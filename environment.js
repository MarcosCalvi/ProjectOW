"use strict"

if (b4w.module_check("environment"))
    throw "Failed to register module: environment";

b4w.register("environment", function(exports, require) {
	
var m_particles = require("particles");
var m_scenes 	= require("scenes");
var m_lights 	= require("lights");


exports.init_environment = function() {
	m_lights.set_day_time(9.0);
}

});