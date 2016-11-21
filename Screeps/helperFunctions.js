var helperFunctions = {
    
    spawnCreep: function(spawn, creepParts, creepRole) {
        var newName = spawn.createCreep(creepParts, undefined, {role: creepRole});
        console.log('Spawning new ' + creepRole + ': ' + newName);
	},
	
	renewCreep: function(spawn, creep) {
	    if(spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(spawn)
	    } else {
	        creep.memory.justRenewed = true
	    }
	},
	
	getNearest: function(targets, source) {
	    if(targets.length){
            
            var closest = targets[0]
            var closestRange = source.getRangeTo(targets[0])
        
            for (var index = 1; index < targets.length; index++){
                var tempRange = source.getRangeTo(targets[index])
                if(tempRange < closestRange) {
                    closest = targets[index]
                    closestRange = tempRange
                }
            }
            return closest;
        }
	},
	
	getNearestNotFullContainer: function(creep) {
	    var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity;
                }
        });
        
        return helperFunctions.getNearest(containers, creep.pos)
	},
	
	getNearestNotEmptyContainer: function(creep) {
	    var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 50;
                }
        });
        
        return helperFunctions.getNearest(containers, creep.pos)
	},
	
	getEnergyStructures: function(room) {
	    var structs = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || 
                            ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
                }
        });
        return structs;
	},
	
	getSources: function(room) {
	    var sources = room.find(FIND_SOURCES, {
                filter: (source) => {
                    return (source.energy > 0);
                }
        });
        return sources;
	},
	
	harvestSource: function(creep, source) {
	    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
	       return creep.moveTo(source);
	    }
	}
	
};

module.exports = helperFunctions;