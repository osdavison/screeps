var funcs = require('helperFunctions');

var roleFiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.carry.energy == 0) {
            creep.memory.filling = false
        } else if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.filling = true
        }
        
	    //IF FULLY RENEWED, RETURN TO WORKING
	    if(creep.ticksToLive > 1400) {
	        creep.memory.justRenewed = false;
	    }
	    //IF ALMOST DEAD, RENEW ITSELF
	    if(creep.ticksToLive < 100 || creep.memory.justRenewed == true) {
	        funcs.renewCreep(Game.spawns['Spawn1'], creep)
	   //IF BUILDING
	    } else if(!creep.memory.filling) {
            var container = funcs.getNearestNotEmptyContainer(creep)
            if(container){
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            } else {
                var dropped = creep.room.find(FIND_DROPPED_ENERGY)
                if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(dropped[0]);
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
            }
        }
	}
};

module.exports = roleFiller;