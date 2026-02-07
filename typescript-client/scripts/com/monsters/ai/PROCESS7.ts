import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

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
 * PROCESS7 - AI attack strategy (Dreadnaut/Nerd tribe).
 * Balanced approach with looters and tanks based on damage assessment.
 */
export class PROCESS7 implements IPROCESS {
    public _solutions: Solution[] = [];
    private solsProcessed: number = 0;
    public _inProgress: boolean = false;
    public _intelligence: number = 1;
    private processStepResolution: number = 3;

    constructor() {}

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
        const allBuildings = getInstanceManager().getInstancesByClass(getBFOUNDATION()) as BFOUNDATION[];
        
        for (const building of allBuildings) {
            if (building.health > 0 && !(building as any)._looted && 
                (building instanceof getBRESOURCE() || building instanceof getBUILDING6() || building instanceof getBUILDING14())) {
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
        
        sortedSolutions.sort((a, b) => {
            if (b.damageTaken !== a.damageTaken) return b.damageTaken - a.damageTaken;
            return b.distanceToTarget - a.distanceToTarget;
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
        
        const allBuildings = getInstanceManager().getInstancesByClass(getBFOUNDATION()) as BFOUNDATION[];
        let volume = 0;
        
        for (const building of allBuildings) {
            const buildingClass = (building as any)._class;
            if (buildingClass === "special" || buildingClass === "tower" || 
                buildingClass === "trap" || buildingClass === "wall" || 
                buildingClass === "resource") {
                const multiplier = (buildingClass === "trap" || buildingClass === "wall") ? 0.15 : 1;
                volume += multiplier * getWMATTACK()._attackVolumeAmplifier;
            }
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        
        let looterCount: number;
        let tankCount: number;
        
        if (solution.damageTaken > 0) {
            let ratio = solution.resourcesGained / (solution.damageTaken + solution.resourcesGained);
            if (ratio < 0.5) ratio = 0.5;
            looterCount = ratio * volume;
            tankCount = volume - looterCount;
        } else {
            looterCount = volume;
            tankCount = 0;
        }
        
        let levelRatio = getBASE().BaseLevel().level / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const looterType = String(getWMATTACK()._looters[Math.floor((getWMATTACK()._looters.length - 2) * levelRatio) + 1]);
        const tankType = String(getWMATTACK()._tanks[Math.floor((getWMATTACK()._tanks.length - 1) * levelRatio)]);
        
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
        
        if (looterCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / getCREATURELOCKER()._creatures[looterType].props.speed[0];
            }
            distances[looterType] = travelTime * getCREATURELOCKER()._creatures[looterType].props.speed[0];
        }
        
        if (tankType === "C12") {
            tankCount = Math.ceil(tankCount / 2);
        }
        
        if (looterType === "C14") {
            looterCount = Math.ceil(looterCount / 2.5);
        }
        
        attack[looterType] = Math.floor(looterCount);
        attack[tankType] = Math.floor(tankCount);
        
        const tanks: { [key: string]: number } = {};
        tanks[tankType] = Math.floor(tankCount);
        
        const looters: { [key: string]: number } = {};
        looters[looterType] = Math.floor(looterCount);
        
        // Remove zero counts
        for (const key in attack) {
            if (attack[key] === 0) {
                delete attack[key];
            }
        }
        
        solution.attack = attack;
        solution.distances = distances;
    }
}
