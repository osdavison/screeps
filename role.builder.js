var funcs = require('helperFunctions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //IF OUT OF ENERGY, SWITCH TO HARVESTING
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
        //IF FULL OF ENERGY, SWITCH TO BUILDING
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }
        //IF FULLY RENEWED, RETURN TO WORKING
	    if(creep.ticksToLive > 1400) {
	        creep.memory.justRenewed = false;
	    }
	    //IF ALMOST DEAD, RENEW ITSELF
	    if(creep.ticksToLive < 100 || creep.memory.justRenewed == true) {
	        funcs.renewCreep(Game.spawns['Spawn1'], creep)
	   //IF BUILDING
	    } else if(creep.memory.building) {
	        //BUILD CONSTRUCTION SITES
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        var target = funcs.getNearest(targets, creep.pos)
	        
	        if (target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(target) == ERR_NO_PATH) {
                        if(targets.length) {
                            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0]);
                            }
                        }
                    }
                }
	        } else { //REPAIR STRUCTURES THAT ARE LOW ON HP
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.hits < structure.hitsMax;
                    }
                })
                if(targets.length) {
                    var chosenTarget = targets[0]
                    //console.log(targets)
                    for(var index = 0; index < targets.length; index++) {
                        if (targets[index].hits < chosenTarget.hits) {
                            chosenTarget = targets[index]
                        }
                    }
                    if(creep.repair(chosenTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(chosenTarget);
                    }
                }
            }
	    } else { //IF NOT BUILDING
            var container = funcs.getNearestNotEmptyContainer(creep)
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(container)
            }
        }
	}
};

module.exports = roleBuilder;