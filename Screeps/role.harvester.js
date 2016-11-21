var funcs = require('helperFunctions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    //IF FULLY RENEWED, RETURN TO WORKING
	    if(creep.ticksToLive > 1400) {
	        creep.memory.justRenewed = false;
	    }
	    //IF ALMOST DEAD, RENEW ITSELF
	    if(creep.ticksToLive < 100 || creep.memory.justRenewed == true) {
	        funcs.renewCreep(Game.spawns['Spawn1'], creep)
	   //IF BUILDING
	    } else if(creep.carry.energy < creep.carryCapacity) {
            var source = funcs.getNearest(funcs.getSources(creep.room), creep.pos)
            funcs.harvestSource(creep, source)
        }
        else {
            var target = funcs.getNearestNotFullContainer(creep)
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
	}
};

module.exports = roleHarvester;