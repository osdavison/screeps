var funcs = require('helperFunctions');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('refueling');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    //IF FULLY RENEWED, RETURN TO WORKING
	    if(creep.ticksToLive > 1400) {
	        creep.memory.justRenewed = false;
	    }
	    //IF ALMOST DEAD, RENEW ITSELF
	    if(creep.ticksToLive < 100 || creep.memory.justRenewed == true) {
	        funcs.renewCreep(Game.spawns['Spawn1'], creep)
	   //IF BUILDING
	    } else if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var container = funcs.getNearestNotEmptyContainer(creep)
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container)
            }
        }
	}
};

module.exports = roleUpgrader;