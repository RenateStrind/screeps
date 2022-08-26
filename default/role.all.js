var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

		//if empty harvest
	    if(creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.memory.filling = false;
			creep.memory.harvesting = true;
            creep.memory.upgrading = false;
			creep.say('🔄 harvest');
	    }

		//if full...
	    if(creep.store.getFreeCapacity() == 0) {
            var builds = creep.room.find(FIND_CONSTRUCTION_SITES);
            var upgrades = creep.room.find(FIND_CONSTRUCTION_SITES);
            var fills = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && 
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(fills.length > 0) {
                //look for buildings to fill with energy
                creep.say('👆 fill');
                creep.memory.building = false;
                creep.memory.harvesting = false;
                creep.memory.filling = true;
                creep.memory.upgrading = false;
            }else if(builds.length){
                //look for buildings to construct
                creep.say('🚧 build');
                creep.memory.building = true;
                creep.memory.harvesting = false;
                creep.memory.filling = false;
                creep.memory.upgrading = false;
            }else if(upgrades.length){
                //if nothing else upgrade the controller
                creep.say('⚡ upgrade');
                creep.memory.building = false;
                creep.memory.harvesting = false;
                creep.memory.filling = false;
                creep.memory.upgrading = true;
            }
        }

		//build
	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }

		//harvest
	    if(creep.memory.harvesting) {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }

		//fill
		if(creep.memory.filling){
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) && 
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}	
		}
	}
};

module.exports = roleBuilder;