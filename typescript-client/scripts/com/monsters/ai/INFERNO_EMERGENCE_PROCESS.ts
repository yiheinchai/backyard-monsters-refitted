import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

import { INFERNO_EMERGENCE_EVENT } from "../../../INFERNO_EMERGENCE_EVENT";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../managers/InstanceManager").InstanceManager; }
function getPATHING(): any { return require("../pathing/PATHING").PATHING; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }
function getBRESOURCE(): any { return require("../../../BRESOURCE").BRESOURCE; }
function getBUILDING6(): any { return require("../../../BUILDING6").BUILDING6; }
function getBUILDING14(): any { return require("../../../BUILDING14").BUILDING14; }
function getCREATURELOCKER(): any { return require("../../../CREATURELOCKER").CREATURELOCKER; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getGRID(): any { return require("../../../GRID").GRID; }
function getWMATTACK(): any { return require("../../../WMATTACK").WMATTACK; }


/**
 * INFERNO_EMERGENCE_PROCESS - AI attack strategy for Inferno Emergence events.
 * Uses Inferno-specific creatures to target resource buildings.
 */
export class INFERNO_EMERGENCE_PROCESS implements IPROCESS {
    public static readonly TYPE: number = 5;
    
    public _solutions: Solution[] = [];
    private solsProcessed: number = 0;
    public _inProgress: boolean = false;
    public _intelligence: number = 1;
    private processStepResolution: number = 3;

    constructor() {}

    public PROCESS1(): void {
        // Empty as in original
    }

    public Trigger(intelligence: number = 1): void {
        this._intelligence = intelligence;
        this._inProgress = true;
        this._solutions = [];
        const mapWidth = getGLOBAL()._mapWidth;
        const mapHeight = getGLOBAL()._mapHeight;
        
        for (let i = 0; i < getWMATTACK()._attackResolution; i++) {
            this._solutions.push(new Solution(360 / getWMATTACK()._attackResolution * i, mapWidth, mapHeight));
        }
        
        this.solsProcessed = 0;
        this.Process(this._solutions[0], this.onProcess.bind(this));
    }

    public Process(solution: Solution, callback: Function): void {
        const buildings: { building: BFOUNDATION; distance: number }[] = [];
        const allBuildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of allBuildings) {
            if ((building instanceof getBRESOURCE() || building instanceof getBUILDING6() || building instanceof getBUILDING14()) &&
                building.health > 0 && !(building as any)._looted) {
                const pos = getGRID().FromISO(building.x, building.y);
                const distance = Point.distance(solution.entryPoint, pos);
                buildings.push({
                    building: building,
                    distance: distance
                });
            }
        }
        
        if (buildings.length > 0) {
            buildings.sort((a, b) => a.distance - b.distance);
            solution.targetBuilding = buildings[0].building;
            
            if (solution.targetBuilding._type === 6 || solution.targetBuilding._type === 14) {
                solution.resourcesGained = 0.04 * getBASE()._resources.r1.Get();
            } else {
                solution.resourcesGained = 0.1 * solution.targetBuilding._stored.Get();
            }
            
            if (solution.resourcesGained > 10000) {
                solution.resourcesGained = 10000;
            }
            
            solution.wayPoints = getPATHING().GetPath(
                getGRID().ToISO(solution.entryPoint.x, solution.entryPoint.y, 0),
                new Rectangle(
                    solution.targetBuilding.x,
                    solution.targetBuilding.y,
                    solution.targetBuilding._footprint[0].width,
                    solution.targetBuilding._footprint[0].height
                ),
                callback
            );
        }
    }

    public onProcess(wayPoints: any[], targetBuilding: BFOUNDATION | null = null, value: number = 0, flag: boolean = false, secondaryBuilding: BFOUNDATION | null = null): void {
        this._solutions[this.solsProcessed].wayPoints = wayPoints;
        this._solutions[this.solsProcessed].distanceToTarget = wayPoints.length;
        this.solsProcessed++;
        
        if (this.solsProcessed < getWMATTACK()._attackResolution) {
            this.Process(this._solutions[this.solsProcessed], this.onProcess.bind(this));
        } else {
            this.beginProcessB();
        }
    }

    public beginProcessB(): void {
        const sortedSolutions: Solution[] = [];
        
        for (const solution of this._solutions) {
            this.ProcessB(solution);
            sortedSolutions.push(solution);
        }
        
        // Sort by damageTaken (desc), distanceToTarget (desc), resourcesGained (asc)
        sortedSolutions.sort((a, b) => {
            if (b.damageTaken !== a.damageTaken) return b.damageTaken - a.damageTaken;
            if (b.distanceToTarget !== a.distanceToTarget) return b.distanceToTarget - a.distanceToTarget;
            return a.resourcesGained - b.resourcesGained;
        });
        
        const chosenIndex = Math.floor((sortedSolutions.length - 1) * this._intelligence);
        this.ProcessC(sortedSolutions[chosenIndex]);
        this._inProgress = false;
        getWMATTACK().Queue(sortedSolutions[chosenIndex]);
    }

    public ProcessB(solution: Solution): void {
        for (let i = 0; i < solution.wayPoints.length; i += this.processStepResolution) {
            solution.damageTaken += getWMATTACK()._damageBias * this.processStepResolution * getWMATTACK().dpsAtPoint(solution, solution.wayPoints[i]);
        }
    }

    public ProcessC(solution: Solution): void {
        const attack: { [key: string]: number } = {};
        
        for (let i = 0; i < getWMATTACK()._monsterKeys.length; i++) {
            attack[getWMATTACK()._monsterKeys[i]] = 0;
        }
        
        let volume = 0;
        const allBuildings = getInstanceManager().getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of allBuildings) {
            const buildingClass = (building as any)._class;
            if (buildingClass !== "trap" && buildingClass !== "wall") {
                volume += 1 * getWMATTACK()._attackVolumeAmplifier;
            } else {
                volume += 0.15 * getWMATTACK()._attackVolumeAmplifier;
            }
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        
        const ratio = 2;
        const looterRatio = 0.4;
        const looterCount = looterRatio * volume;
        const tankCount = (volume - looterCount) / (ratio + 1);
        const dpsCount = tankCount / ratio;
        
        let levelRatio = getBASE().BaseLevel().level * 0.2 * INFERNO_EMERGENCE_EVENT.Lvl / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const looterType = String(getWMATTACK()._infernoLooters[Math.floor((getWMATTACK()._infernoLooters.length - 1) * levelRatio)]);
        const tankType = String(getWMATTACK()._infernoTanks[Math.floor((getWMATTACK()._infernoTanks.length - 1) * levelRatio)]);
        const dpsType = String(getWMATTACK()._infernoDps[Math.floor((getWMATTACK()._infernoDps.length - 1) * levelRatio)]);
        
        let travelTime = 0;
        const distances: { [key: string]: number } = {};
        const baseDistance = getGLOBAL()._mapWidth * 0.25;
        const minDistance = 100;
        const targetDistance = Point.distance(solution.entryPoint, new Point(solution.targetBuilding.x, solution.targetBuilding.y));
        const adjustedDistance = targetDistance < minDistance ? baseDistance + (minDistance - targetDistance) : baseDistance;
        
        if (tankCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[tankType].props.speed[0];
            }
            distances[tankType] = travelTime * getCREATURELOCKER()._creatures[tankType].props.speed[0];
        }
        
        if (dpsCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[dpsType].props.speed[0];
            }
            distances[dpsType] = travelTime * getCREATURELOCKER()._creatures[dpsType].props.speed[0];
        }
        
        if (looterCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[looterType].props.speed[0];
            }
            distances[looterType] = travelTime * getCREATURELOCKER()._creatures[looterType].props.speed[0];
        }
        
        let finalTankCount = tankCount;
        let finalLooterCount = looterCount;
        
        if (tankType === "C12" || tankType === "IC8") {
            finalTankCount = Math.ceil(tankCount / 2);
        }
        
        if (looterType === "IC6") {
            finalLooterCount = Math.ceil(looterCount / 2);
        }
        
        attack[looterType] = Math.floor(finalLooterCount);
        attack[tankType] = Math.floor(finalTankCount);
        attack[dpsType] = Math.floor(dpsCount);
        
        const tanks: { [key: string]: number } = {};
        tanks[tankType] = Math.floor(finalTankCount);
        
        const dps: { [key: string]: number } = {};
        dps[dpsType] = Math.floor(dpsCount);
        
        const looters: { [key: string]: number } = {};
        looters[looterType] = Math.floor(finalLooterCount);
        
        // Remove zero counts
        for (const key in attack) {
            if (attack[key] === 0) {
                delete attack[key];
            }
        }
        
        solution.attack = attack;
        solution.looters = looters;
        solution.tanks = tanks;
        solution.dps = dps;
        solution.distances = distances;
    }
}
