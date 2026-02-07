/**
 * Module initialization order controller.
 * 
 * This module forces correct class initialization order to handle
 * circular dependencies in the codebase. The original ActionScript
 * code had implicit circular references that worked in Flash's
 * module system but fail in CommonJS/ESM.
 * 
 * Import this module FIRST before any game modules to ensure
 * base classes are initialized before their subclasses.
 */

// Phase 1: Core utilities (no game dependencies)
require('./com/cc/utils/SecNum');
require('./KEYS');
require('./com/monsters/configs/BYMConfig');
require('./com/monsters/configs/BYMDevConfig');

// Phase 2: Base rendering and display (no circular deps)
require('./com/monsters/rendering/RasterData');
require('./com/monsters/display/ImageCache');
require('./com/monsters/display/BuildingAssetContainer');

// Phase 3: Base game classes (foundation of the hierarchy)
require('./com/monsters/GameObject');
require('./BFOUNDATION');

// Phase 4: First-level subclasses of BFOUNDATION
require('./BRESOURCE');
require('./BSTORAGE');
require('./BTOWER');
require('./BTRAP');
require('./Bunker');
require('./BWALL');
require('./BDECORATION');
require('./BEXPIRABLE');
require('./BMUSHROOM');
require('./BTOTEM');
require('./CHAMPIONCAGE');
require('./CHAMPIONCHAMBER');
require('./MONSTERBUNKER');

// Phase 5: Siege weapons (SiegeWeapon base class first)
require('./com/monsters/siege/SiegeWeaponProperty');
require('./com/monsters/siege/weapons/SiegeWeapon');
require('./com/monsters/siege/weapons/Vacuum');
require('./com/monsters/siege/weapons/VacuumHose');
require('./com/monsters/siege/weapons/Decoy');
require('./com/monsters/siege/weapons/Jars');
require('./com/monsters/siege/SiegeWeapons');

// Phase 6: Second-level subclasses
require('./BHEAVYTRAP');
require('./BUILDING1');
require('./BUILDING2');
require('./BUILDING3');
require('./BUILDING4');
require('./BUILDING5');
require('./BUILDING6');
require('./BUILDING8');
require('./BUILDING9');
require('./BUILDING10');
require('./BUILDING11');
require('./BUILDING12');
require('./BUILDING14');
require('./BUILDING15');
require('./BUILDING16');
require('./BUILDING19');
require('./BUILDING20');
require('./BUILDING21');
require('./BUILDING22');
require('./BUILDING23');
require('./BUILDING24');
require('./BUILDING25');
require('./BUILDING26');
require('./BUILDING27');
require('./BUILDING51');
require('./BUILDING112');
require('./BUILDING113');
require('./BUILDING115');
require('./BUILDING118');
require('./GuardTower');
require('./INFERNOQUAKETOWER');

// Phase 7: Monster base classes
require('./com/monsters/monsters/MonsterBase');
require('./com/monsters/monsters/champions/ChampionBase');

// Phase 8: Global singletons
require('./GLOBAL');
require('./MAP');
require('./BASE');

console.log('[BYMR] Module initialization order established');
