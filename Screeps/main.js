var roleHarvester = require('role.harvester');
var roleFiller = require('role.filler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var funcs = require('helperFunctions');

module.exports.loop = function () {

    var tower = Game.getObjectById('FIXME');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 3) {
        funcs.spawnCreep(Game.spawns['Spawn1'], [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], 'harvester')
    }

    var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');
    console.log('Fillers: ' + fillers.length);

    if(fillers.length < 2) {
        funcs.spawnCreep(Game.spawns['Spawn1'], [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 'filler')
    }

    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

    if(builders.length < 8) {
        funcs.spawnCreep(Game.spawns['Spawn1'], [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'builder')
    }

    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

    if(upgraders.length < 4) {
        funcs.spawnCreep(Game.spawns['Spawn1'], [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], 'upgrader')
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'filler') {
            roleFiller.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}