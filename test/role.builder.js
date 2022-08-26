var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

		//if empty harvest
	    if(creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
			creep.memory.filling = false;
			creep.memory.harvesting = true;
			creep.say('🔄 harvest');
	    }

		//if full...
	    if(creep.store.getFreeCapacity() == 0) {
			//look for buildings to build
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
				creep.say('🚧 build');
				creep.memory.building = true;
				creep.memory.harvesting = false;
				creep.memory.filling = false;
            }else{
				//if no buildings to build fill buildings with energy
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN ||
								structure.structureType == STRUCTURE_TOWER) && 
								structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				if(targets.length > 0) {
					creep.say('👆 fill');
					creep.memory.building = false;
					creep.memory.harvesting = false;
					creep.memory.filling = true;
				}
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
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
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